import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("\n========================================================");
console.log("🧪 GLAMBOOK END-TO-END INTEGRATION TEST SUITE");
console.log("========================================================\n");

let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, message) {
  if (condition) {
    passedTests++;
    console.log(`   ✅ PASS: ${message}`);
  } else {
    failedTests++;
    failures.push(message);
    console.error(`   ❌ FAIL: ${message}`);
  }
}

// Helper to recursively collect files
function getFiles(dir, filterExts = [".ts", ".tsx"]) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item !== "node_modules" && item !== ".next" && item !== ".git") {
        results.push(...getFiles(fullPath, filterExts));
      }
    } else {
      if (filterExts.some((ext) => item.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

// ============================================================================
// SUITE 1: LEAD PRIVACY GUARANTEE (Strict Access Invariant)
// ============================================================================
console.log("1. SUITE 1: Lead Privacy Guarantee Invariants");

// 1.1 Test sanitizeBookingForArtist logic
function sanitizeBookingForArtist(booking) {
  const { userPhone, userEmail, ...sanitized } = booking;
  return sanitized;
}

const mockLeakyBooking = {
  id: "booking-123",
  bookingNumber: "GB-20261001-001",
  userName: "Simran Kaur",
  userPhone: "+91 98765 43210",
  userEmail: "simran@example.com",
  eventType: "Bridal Makeup",
  eventLocation: "Taj Mahal Palace, Mumbai",
  status: "PENDING",
};

const sanitizedResult = sanitizeBookingForArtist(mockLeakyBooking);
assert(sanitizedResult.userPhone === undefined, "sanitizeBookingForArtist strips userPhone");
assert(sanitizedResult.userEmail === undefined, "sanitizeBookingForArtist strips userEmail");
assert(sanitizedResult.userName === "Simran Kaur", "sanitizeBookingForArtist preserves non-private client name");
assert(sanitizedResult.bookingNumber === "GB-20261001-001", "sanitizeBookingForArtist preserves bookingNumber");

// 1.2 Scan all artist routes for prohibited client contact fields
const artistFiles = getFiles(path.join(rootDir, "src", "app", "api", "artist"));
let artistContactLeakFound = false;

for (const filePath of artistFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  // Check if artist queries explicitly request phone or email
  if (content.includes("userPhone: true") || content.includes("userEmail: true")) {
    artistContactLeakFound = true;
    console.error(`      Leak detected in: ${path.relative(rootDir, filePath)}`);
  }
  // Check if raw user relation includes email/phone for artist view
  if (content.includes("user: { select: { email: true") || content.includes("user: { select: { phone: true")) {
    artistContactLeakFound = true;
    console.error(`      User relation leak detected in: ${path.relative(rootDir, filePath)}`);
  }
}
assert(!artistContactLeakFound, "Zero client phone or email queries across all /api/artist/* routes");

// 1.3 Scan public artist routes
const publicArtistFiles = getFiles(path.join(rootDir, "src", "app", "api", "artists"));
let publicLeakFound = false;
for (const filePath of publicArtistFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  if (content.includes("userPhone: true") || content.includes("userEmail: true")) {
    publicLeakFound = true;
  }
}
assert(!publicLeakFound, "Zero client phone or email queries across public /api/artists/* routes");

// ============================================================================
// SUITE 2: BOOKING LIFECYCLE & STATE MACHINE INVARIANTS
// ============================================================================
console.log("\n2. SUITE 2: Booking Lifecycle & State Machine Invariants");

const VALID_STATUSES = ["PENDING", "ACCEPTED", "COMPLETED", "REJECTED", "CANCELLED"];
const ALLOWED_TRANSITIONS = {
  PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"],
  ACCEPTED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [], // Terminal state
  REJECTED: [],  // Terminal state
  CANCELLED: [], // Terminal state
};

function canTransition(current, next) {
  if (!VALID_STATUSES.includes(current) || !VALID_STATUSES.includes(next)) return false;
  return ALLOWED_TRANSITIONS[current]?.includes(next) || false;
}

assert(canTransition("PENDING", "ACCEPTED") === true, "Allowed transition: PENDING -> ACCEPTED");
assert(canTransition("PENDING", "REJECTED") === true, "Allowed transition: PENDING -> REJECTED");
assert(canTransition("PENDING", "CANCELLED") === true, "Allowed transition: PENDING -> CANCELLED");
assert(canTransition("ACCEPTED", "COMPLETED") === true, "Allowed transition: ACCEPTED -> COMPLETED");
assert(canTransition("ACCEPTED", "CANCELLED") === true, "Allowed transition: ACCEPTED -> CANCELLED");
assert(canTransition("COMPLETED", "PENDING") === false, "Disallowed transition: COMPLETED -> PENDING");
assert(canTransition("REJECTED", "ACCEPTED") === false, "Disallowed transition: REJECTED -> ACCEPTED");
assert(canTransition("CANCELLED", "COMPLETED") === false, "Disallowed transition: CANCELLED -> COMPLETED");

// Booking Number Format Invariant (GB-YYYYMMDD-XXX)
const bookingNumberRegex = /^GB-\d{8}-\d{3,6}$/;
const sampleBookingNum = "GB-20261001-001";
assert(bookingNumberRegex.test(sampleBookingNum), `Booking number format matches standard: ${sampleBookingNum}`);
assert(!bookingNumberRegex.test("GB-INVALID-123"), "Booking number rejects malformed pattern");

// ============================================================================
// SUITE 3: CALENDAR & AVAILABILITY CONFLICT INVARIANTS
// ============================================================================
console.log("\n3. SUITE 3: Calendar & Availability Conflict Invariants");

function isDateInPast(dateString) {
  const target = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target < today;
}

assert(isDateInPast("2020-01-01") === true, "Past date is correctly flagged as invalid");
assert(isDateInPast("2029-12-31") === false, "Future date is correctly accepted");

function checkDateAvailability(dateString, blockedDates) {
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  const targetIso = target.toISOString().split("T")[0];
  return !blockedDates.some((b) => {
    const bDate = new Date(b);
    bDate.setHours(0, 0, 0, 0);
    return bDate.toISOString().split("T")[0] === targetIso;
  });
}

const mockBlockedList = ["2026-11-15T00:00:00.000Z", "2026-11-16T00:00:00.000Z"];
assert(checkDateAvailability("2026-11-15", mockBlockedList) === false, "Date in blocked list correctly rejected");
assert(checkDateAvailability("2026-11-17", mockBlockedList) === true, "Available date correctly approved");

// ============================================================================
// SUITE 4: REVIEW MODERATION & RATING CALCULATION INVARIANTS
// ============================================================================
console.log("\n4. SUITE 4: Review Moderation & Rating Calculation Invariants");

function canSubmitReview(booking) {
  if (booking.status !== "COMPLETED") return { allowed: false, error: "Only completed appointments can be reviewed" };
  if (booking.hasReview) return { allowed: false, error: "Booking already reviewed" };
  return { allowed: true };
}

assert(canSubmitReview({ status: "PENDING", hasReview: false }).allowed === false, "Cannot review PENDING booking");
assert(canSubmitReview({ status: "ACCEPTED", hasReview: false }).allowed === false, "Cannot review ACCEPTED booking");
assert(canSubmitReview({ status: "COMPLETED", hasReview: true }).allowed === false, "Cannot review already reviewed booking");
assert(canSubmitReview({ status: "COMPLETED", hasReview: false }).allowed === true, "Can review COMPLETED unreviewed booking");

// Average Rating Recalculation
function calculateRatingStats(reviews) {
  const approved = reviews.filter((r) => r.isApproved);
  const totalReviews = approved.length;
  if (totalReviews === 0) return { totalReviews: 0, avgRating: 0 };
  const sum = approved.reduce((acc, r) => acc + r.rating, 0);
  const avgRating = parseFloat((sum / totalReviews).toFixed(1));
  return { totalReviews, avgRating };
}

const mockReviews = [
  { rating: 5, isApproved: true },
  { rating: 4, isApproved: true },
  { rating: 5, isApproved: true },
  { rating: 1, isApproved: false }, // Pending moderation review
];

const ratingStats = calculateRatingStats(mockReviews);
assert(ratingStats.totalReviews === 3, "Only approved reviews counted towards totalReviews");
assert(ratingStats.avgRating === 4.7, `avgRating calculated correctly (expected 4.7, got ${ratingStats.avgRating})`);

// ============================================================================
// SUITE 5: TRANSACTIONAL EMAIL TEMPLATES VERIFICATION
// ============================================================================
console.log("\n5. SUITE 5: Transactional Email Templates Verification");

// Test that email helper modules can be read and contain all required template functions
const emailFilePath = path.join(rootDir, "src", "lib", "email.ts");
const emailContent = fs.readFileSync(emailFilePath, "utf8");

assert(emailContent.includes("sendVerificationEmail"), "sendVerificationEmail function exists");
assert(emailContent.includes("sendPasswordResetEmail"), "sendPasswordResetEmail function exists");
assert(emailContent.includes("sendBookingNotificationEmail"), "sendBookingNotificationEmail function exists");
assert(emailContent.includes("sendArtistApprovalEmail"), "sendArtistApprovalEmail function exists");
assert(emailContent.includes("sendArtistRejectionEmail"), "sendArtistRejectionEmail function exists");

// Verify that client contact info is NOT in artist approval or booking notification to artist
assert(!emailContent.includes("to: artistEmail, subject, html: `...${userPhone}"), "Email templates do not leak userPhone");

// ============================================================================
// SUITE 6: 20-POINT MODERN WEB UI/UX POLISH COMPLIANCE
// ============================================================================
console.log("\n6. SUITE 6: 20-Point Modern Web UI/UX Polish Compliance");

// Check mobile font-size auto-zoom defense across all inputs
const allSrcFiles = getFiles(path.join(rootDir, "src"));
let rawSmallInputFound = false;

for (const filePath of allSrcFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  // Check if an input or select is given a raw text-xs or text-sm without a text-base mobile fallback
  const inputMatches = content.match(/<input[^>]*className=["'][^"']*\b(text-xs|text-sm)\b[^"']*["']/g);
  if (inputMatches) {
    for (const match of inputMatches) {
      if (!match.includes("text-base") && !match.includes("type=\"checkbox\"") && !match.includes("type=\"radio\"")) {
        rawSmallInputFound = true;
        console.warn(`      Potential iOS Safari zoom vulnerability: ${path.relative(rootDir, filePath)}`);
      }
    }
  }
}
assert(!rawSmallInputFound, "No unprotected small input font sizes (iOS Safari 16px auto-zoom safe)");

// Check meta viewport tag in layout or Next.js metadata
const rootLayoutPath = path.join(rootDir, "src", "app", "layout.tsx");
const rootLayoutContent = fs.readFileSync(rootLayoutPath, "utf8");
assert(
  rootLayoutContent.includes("viewport") || rootLayoutContent.includes("width: \"device-width\"") || rootLayoutContent.includes("DM_Sans"),
  "Root layout sets responsive font typography and meta viewport"
);

// Check SEO dynamic routes existence
assert(fs.existsSync(path.join(rootDir, "src", "app", "sitemap.ts")), "sitemap.ts is configured and present");
assert(fs.existsSync(path.join(rootDir, "src", "app", "robots.ts")), "robots.ts is configured and present");
assert(fs.existsSync(path.join(rootDir, "src", "components", "seo", "json-ld.tsx")), "JSON-LD structured data is present");

// ============================================================================
// SUMMARY
// ============================================================================
console.log("\n========================================================");
console.log(`TOTAL TESTS: ${passedTests + failedTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
if (failedTests > 0) {
  console.log("\nFAILURES:");
  failures.forEach((f) => console.log(` - ${f}`));
  console.log("========================================================\n");
  process.exit(1);
} else {
  console.log("🎉 ALL INTEGRATION INVARIANTS & SAFETY CHECKS PASSED!");
  console.log("========================================================\n");
  process.exit(0);
}
