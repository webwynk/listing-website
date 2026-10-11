import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { portfolioItemSchema } from "@/lib/validations/onboarding";

export const dynamic = "force-dynamic";

/**
 * GET /api/artist/portfolio
 * Returns all portfolio items for the authenticated artist + active categories
 */
export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true, status: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const [items, categories] = await Promise.all([
      prisma.portfolioItem.findMany({
        where: { artistId: artistProfile.id },
        orderBy: { sortOrder: "asc" },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    return apiSuccess({
      items,
      categories,
      totalCount: items.length,
      artistStatus: artistProfile.status,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/artist/portfolio
 * Creates a new portfolio item for the authenticated artist
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
    const validatedData = portfolioItemSchema.parse(body);

    // Determine next sort order sequence
    const lastItem = await prisma.portfolioItem.findFirst({
      where: { artistId: artistProfile.id },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const nextSortOrder = (lastItem?.sortOrder ?? -1) + 1;

    const newItem = await prisma.portfolioItem.create({
      data: {
        artistId: artistProfile.id,
        mediaUrl: validatedData.mediaUrl,
        thumbnailUrl: validatedData.thumbnailUrl || null,
        mediaType: validatedData.mediaType || "IMAGE",
        title: validatedData.title || null,
        categoryId: validatedData.categoryId || null,
        sortOrder: nextSortOrder,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return apiSuccess(newItem, "Portfolio photo added successfully.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
