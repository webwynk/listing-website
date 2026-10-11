import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("\n========================================================");
console.log("🕵️‍♂️  GLAMBOOK AUTOMATED CODE REVIEW & SECURITY AUDITOR");
console.log("========================================================\n");

let errorsFound = 0;
let warningsFound = 0;

// 1. TypeScript Strict Type Check
console.log("1. Running TypeScript Static Analysis...");
try {
  execSync("npx tsc --noEmit", { stdio: "pipe" });
  console.log("   ✅ TypeScript compilation: 0 errors");
} catch (error) {
  errorsFound++;
  console.error("   ❌ TypeScript errors detected:\n", error.stdout ? error.stdout.toString() : error.message);
}

// 2. Scan Directory Recursively
function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== ".git") {
        getFiles(filePath, fileList);
      }
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const srcFiles = getFiles("src");

// 3. Security Check: Lead Privacy
console.log("\n2. Auditing Lead Privacy Guard (Zero Client Contact to Artists)...");
let privacyViolation = false;
for (const file of srcFiles) {
  // If file is inside an artist route or artist API endpoint
  if (file.includes("artist") && (file.includes("api") || file.includes("route"))) {
    const content = fs.readFileSync(file, "utf8");
    if (content.includes("userPhone: true") || content.includes("userEmail: true")) {
      console.error(`   ❌ PRIVACY VIOLATION in ${file}: Artist route queries userPhone/userEmail!`);
      privacyViolation = true;
      errorsFound++;
    }
  }
}
if (!privacyViolation) {
  console.log("   ✅ Lead Privacy Guard: 0 contact leaks detected");
}

// 4. Cleanliness: Check for stray console.logs in production routes
console.log("\n3. Scanning for stray console.log statements...");
let logsCount = 0;
for (const file of srcFiles) {
  const content = fs.readFileSync(file, "utf8");
  const matches = content.match(/console\.log\(/g);
  if (matches) {
    logsCount += matches.length;
    console.warn(`   ⚠️ Warning: ${matches.length} console.log found in ${file}`);
    warningsFound += matches.length;
  }
}
if (logsCount === 0) {
  console.log("   ✅ Cleanliness: 0 stray console.log statements");
}

// Summary
console.log("\n========================================================");
if (errorsFound === 0) {
  console.log(`🎉 AUDIT PASSED: 0 Errors, ${warningsFound} Warnings`);
} else {
  console.log(`❌ AUDIT FAILED: ${errorsFound} Critical Errors found!`);
  process.exit(1);
}
console.log("========================================================\n");
