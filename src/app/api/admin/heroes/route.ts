import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { z } from "zod";
import { PageHeroConfig, DEFAULT_PAGE_HEROES } from "@/lib/heroes-types";
export const dynamic = "force-dynamic";

const heroSlideSchema = z.object({
  id: z.string(),
  category: z.string(),
  categoryLabel: z.string(),
  eyebrow: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  subheading: z.string().min(1).max(500),
  imageUrl: z.string().min(1),
});

const updateHeroSchema = z.object({
  page: z.enum([
    "home",
    "artists",
    "packages",
    "how-it-works",
    "about",
    "contact",
    "blog",
  ]),
  eyebrow: z.string().min(1, "Eyebrow is required").max(100),
  title: z.string().min(1, "Title is required").max(200),
  subheading: z.string().min(1, "Subheading is required").max(500),
  imageUrl: z.string().min(1, "Must be a valid image path or URL"),
  mobileImageUrl: z.string().optional(),
  buttonText: z.string().max(50).optional(),
  slides: z.array(heroSlideSchema).optional(),
});

/**
 * GET /api/admin/heroes
 * Retrieves all page hero configurations merged with default fallbacks
 */
export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const settings = await prisma.siteSetting.findMany({
      where: { group: "heroes" },
    });

    const heroesMap: Record<string, PageHeroConfig> = { ...DEFAULT_PAGE_HEROES };

    for (const setting of settings) {
      try {
        const pageKey = setting.key.replace("hero_", "");
        const parsed = JSON.parse(setting.value);
        if (heroesMap[pageKey]) {
          heroesMap[pageKey] = { ...heroesMap[pageKey], ...parsed };
        } else {
          heroesMap[pageKey] = parsed;
        }
      } catch {
        // Skip malformed JSON
      }
    }

    return apiSuccess(heroesMap);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/admin/heroes
 * Updates or creates hero configuration for a specific page
 */
export async function PUT(req: NextRequest) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validatedData = updateHeroSchema.parse(body);

    const settingKey = `hero_${validatedData.page}`;
    const valueString = JSON.stringify(validatedData);

    const updated = await prisma.siteSetting.upsert({
      where: { key: settingKey },
      update: {
        value: valueString,
        group: "heroes",
        type: "JSON",
      },
      create: {
        key: settingKey,
        value: valueString,
        group: "heroes",
        type: "JSON",
      },
    });

    return apiSuccess(
      JSON.parse(updated.value),
      `Hero configuration for ${validatedData.page} updated successfully.`
    );
  } catch (error) {
    return handleApiError(error);
  }
}
