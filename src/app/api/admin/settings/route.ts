import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS = [
  // General Group
  { key: "site_name", value: "GlamBook", group: "general" },
  {
    key: "site_tagline",
    value: "Find and book top makeup artists & photographers",
    group: "general",
  },
  { key: "contact_email", value: "support@glambook.com", group: "general" },
  { key: "contact_phone", value: "+91 98765 43210", group: "general" },
  { key: "office_address", value: "Bandra West, Mumbai, Maharashtra 400050", group: "general" },
  { key: "logo_url", value: "", group: "general" },

  // Security & Privacy Group
  { key: "lead_privacy_mode", value: "true", group: "security" },
  { key: "require_email_verification", value: "true", group: "security" },
  { key: "booking_lead_retention_days", value: "365", group: "security" },

  // SEO & Social Group
  {
    key: "default_meta_title",
    value: "GlamBook — Curated Makeup Artists & Photographers",
    group: "social_seo",
  },
  {
    key: "default_meta_description",
    value: "Discover and book verified bridal makeup artists, hair stylists, and wedding photographers across India.",
    group: "social_seo",
  },
  { key: "instagram_url", value: "https://instagram.com/glambook", group: "social_seo" },
  { key: "facebook_url", value: "https://facebook.com/glambook", group: "social_seo" },
  { key: "youtube_url", value: "https://youtube.com/@glambook", group: "social_seo" },
  { key: "pinterest_url", value: "https://pinterest.com/glambook", group: "social_seo" },
];

/**
 * GET /api/admin/settings
 * Fetches all platform settings grouped cleanly by category
 */
export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const existingSettings = await prisma.siteSetting.findMany({
      where: {
        group: { in: ["general", "security", "social_seo"] },
      },
    });

    const settingsMap = new Map<string, string>();
    for (const s of existingSettings) {
      settingsMap.set(s.key, s.value);
    }

    // Seed any missing defaults
    for (const def of DEFAULT_SETTINGS) {
      if (!settingsMap.has(def.key)) {
        await prisma.siteSetting.upsert({
          where: { key: def.key },
          update: {},
          create: {
            key: def.key,
            value: def.value,
            group: def.group,
            type: "TEXT",
          },
        });
        settingsMap.set(def.key, def.value);
      }
    }

    const settingsObject: Record<string, string> = {};
    settingsMap.forEach((val, key) => {
      settingsObject[key] = val;
    });

    return apiSuccess({
      settings: settingsObject,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/admin/settings
 * Bulk updates platform key-value settings
 */
export async function PUT(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const entries = Object.entries(body);

    for (const [key, value] of entries) {
      if (typeof key === "string" && value !== undefined) {
        const matchingDefault = DEFAULT_SETTINGS.find((d) => d.key === key);
        const group = matchingDefault?.group || "general";

        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: {
            key,
            value: String(value),
            group,
            type: "TEXT",
          },
        });
      }
    }

    return apiSuccess(null, "Settings updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
