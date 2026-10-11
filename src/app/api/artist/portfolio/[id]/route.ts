import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/artist/portfolio/[id]
 * Deletes a portfolio item owned by the authenticated artist
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const item = await prisma.portfolioItem.findUnique({
      where: { id },
      select: { id: true, artistId: true },
    });

    if (!item) {
      return apiError("Portfolio item not found.", 404);
    }

    if (item.artistId !== artistProfile.id) {
      return apiError("Forbidden: You do not have permission to delete this item.", 403);
    }

    await prisma.portfolioItem.delete({
      where: { id },
    });

    return apiSuccess(null, "Portfolio photo deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
