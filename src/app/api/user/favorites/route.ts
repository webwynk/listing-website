import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/favorites
 * Returns all favorited artists for the authenticated client
 */
export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        artist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                locationCity: true,
                locationState: true,
              },
            },
            services: {
              where: { isActive: true },
              include: {
                category: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return apiSuccess({
      favorites,
      totalCount: favorites.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/user/favorites
 * Adds an artist to the client's favorites wishlist
 */
export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const artistId = body?.artistId;

    if (!artistId || typeof artistId !== "string") {
      return apiError("Valid artist ID is required.", 400);
    }

    const artist = await prisma.artistProfile.findUnique({
      where: { id: artistId },
    });

    if (!artist) {
      return apiError("Artist not found.", 404);
    }

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_artistId: {
          userId: user.id,
          artistId,
        },
      },
      create: {
        userId: user.id,
        artistId,
      },
      update: {},
    });

    return apiSuccess(
      { favorite },
      "Artist saved to favorites.",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/user/favorites
 * Removes an artist from the client's favorites wishlist
 */
export async function DELETE(req: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    let artistId = searchParams.get("artistId");

    if (!artistId) {
      const body = await req.json().catch(() => ({}));
      artistId = body?.artistId;
    }

    if (!artistId || typeof artistId !== "string") {
      return apiError("Valid artist ID is required.", 400);
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: user.id,
        artistId,
      },
    });

    return apiSuccess(null, "Artist removed from favorites.");
  } catch (error) {
    return handleApiError(error);
  }
}
