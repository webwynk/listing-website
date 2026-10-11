import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { artistServiceSchema } from "@/lib/validations/artist";

export const dynamic = "force-dynamic";

/**
 * GET /api/artist/services
 * Returns all services configured by the authenticated artist along with active categories and sub-categories
 */
export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const [services, categories] = await Promise.all([
      prisma.artistService.findMany({
        where: { artistId: artistProfile.id },
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          subCategory: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          subCategories: {
            where: { isActive: true },
            select: { id: true, name: true, slug: true },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    return apiSuccess({
      services,
      categories,
      totalCount: services.length,
      activeCount: services.filter((s: { isActive: boolean }) => s.isActive).length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/artist/services
 * Creates a new service offering for the authenticated artist
 */
export async function POST(req: Request) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const body = await req.json();
    const validatedData = artistServiceSchema.parse(body);

    const newService = await prisma.artistService.create({
      data: {
        artistId: artistProfile.id,
        categoryId: validatedData.categoryId,
        subCategoryId: validatedData.subCategoryId || null,
        priceType: validatedData.priceType,
        priceFrom: validatedData.priceFrom,
        priceTo: validatedData.priceTo || null,
        durationMinutes: validatedData.durationMinutes || null,
        description: validatedData.description || null,
        isActive: validatedData.isActive,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        subCategory: { select: { id: true, name: true, slug: true } },
      },
    });

    return apiSuccess(newService, "Service created successfully.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
