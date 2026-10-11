import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

export interface StoredStaticPage {
  slug: string;
  title: string;
  content: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  updatedAt: string;
}

const DEFAULT_PAGES: StoredStaticPage[] = [
  {
    slug: "about-us",
    title: "About GlamBook",
    content: `# Welcome to GlamBook

GlamBook is India's premier curated marketplace connecting clients with verified makeup artists, hair stylists, and wedding photographers. 

### Our Mission
Our mission is to empower beauty professionals to grow their client base while giving clients complete transparency, verified portfolios, and seamless direct booking coordination without hidden commissions.

### Why Choose Us
- **100% Verified Profiles**: Every artist undergoes quality review before approval.
- **Direct Coordination**: Real-time communication and personalized lead assistance.
- **Curated Portfolios**: High-resolution authentic galleries and verified client reviews.`,
    metaTitle: "About Us | GlamBook",
    metaDescription: "Learn about GlamBook, India's leading platform connecting top makeup artists, hair stylists, and photographers with clients.",
    updatedAt: new Date().toISOString(),
  },
  {
    slug: "how-it-works",
    title: "How It Works",
    content: `# How GlamBook Works

Booking your perfect beauty artist is simple, transparent, and direct.

### Step 1: Discover & Filter
Search through hundreds of verified makeup artists and photographers by city, service type, and budget.

### Step 2: Explore Portfolios & Verified Reviews
Review real client work, authentic ratings, pricing tiers, and service inclusions.

### Step 3: Send a Direct Booking Request
Fill in your event details (date, location, number of guests) and submit your booking inquiry.

### Step 4: Confirmation & Glam Up
The artist and our coordination team confirm your date, finalize timing, and prepare to make your day unforgettable!`,
    metaTitle: "How It Works | GlamBook",
    metaDescription: "Learn how easy it is to find, review, and book makeup artists and photographers on GlamBook.",
    updatedAt: new Date().toISOString(),
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `# Privacy Policy

**Last Updated:** September 2026

GlamBook ("we", "our", or "us") respects your privacy and is committed to protecting your personal data.

### 1. Information We Collect
- **Account Information**: Name, email address, password, and location when you register.
- **Booking Inquiries**: Event dates, venue locations, and styling requirements.
- **Artist Verification**: Professional credentials, portfolios, and contact details.

### 2. Privacy Guarantee (Zero Contact Leaks)
We do not sell your personal data. Client contact information (phone number, email address) is protected by our administrative lead privacy system to prevent unsolicited spam.

### 3. Contact Us
For any privacy-related questions, please contact us at privacy@glambook.com.`,
    metaTitle: "Privacy Policy | GlamBook",
    metaDescription: "Read the GlamBook Privacy Policy to understand how we safeguard your personal data and lead privacy.",
    updatedAt: new Date().toISOString(),
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    content: `# Terms of Service

**Last Updated:** September 2026

By accessing or using GlamBook, you agree to comply with and be bound by these Terms of Service.

### 1. Platform Nature
GlamBook is a discovery and booking coordination platform. We connect independent beauty professionals and photographers with clients seeking beauty and event services.

### 2. User & Artist Obligations
- Users agree to provide accurate event information during booking inquiries.
- Artists agree to represent their authentic portfolios and deliver professional services.

### 3. Liability
GlamBook does not employ artists directly and is not liable for on-site disputes, cancellations, or personal property damages.`,
    metaTitle: "Terms of Service | GlamBook",
    metaDescription: "Read the terms and conditions governing the use of the GlamBook platform.",
    updatedAt: new Date().toISOString(),
  },
];

/**
 * GET /api/admin/pages
 * Lists all core static pages stored in site_settings (group: pages)
 */
export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const settings = await prisma.siteSetting.findMany({
      where: { group: "pages" },
    });

    const pagesMap = new Map<string, StoredStaticPage>();

    // Load stored pages
    for (const item of settings) {
      try {
        const parsed = JSON.parse(item.value);
        if (parsed.slug) {
          pagesMap.set(parsed.slug, parsed);
        }
      } catch {
        // ignore malformed
      }
    }

    // Ensure all default pages exist
    const result: StoredStaticPage[] = [];
    for (const defaultPage of DEFAULT_PAGES) {
      if (pagesMap.has(defaultPage.slug)) {
        result.push(pagesMap.get(defaultPage.slug)!);
      } else {
        // Seed missing default page into database
        await prisma.siteSetting.upsert({
          where: { key: `page_${defaultPage.slug}` },
          update: {},
          create: {
            key: `page_${defaultPage.slug}`,
            value: JSON.stringify(defaultPage),
            type: "JSON",
            group: "pages",
          },
        });
        result.push(defaultPage);
      }
    }

    return apiSuccess({
      pages: result,
      total: result.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
