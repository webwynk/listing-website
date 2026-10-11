import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function recalculateArtistRating(artistId: string) {
  const approvedReviews = await prisma.review.findMany({
    where: { artistId, isApproved: true },
    select: { rating: true },
  });

  const totalReviews = approvedReviews.length;
  const avgRating =
    totalReviews > 0
      ? Math.round(
          (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10
        ) / 10
      : 0;

  await prisma.artistProfile.update({
    where: { id: artistId },
    data: {
      avgRating,
      totalReviews,
    },
  });
}

/**
 * DELETE /api/admin/reviews/[id]
 * Deletes a review permanently and recalculates artist's rating metrics
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return apiError("Review not found.", 404);
    }

    const artistId = review.artistId;

    await prisma.review.delete({
      where: { id },
    });

    // Recalculate artist metrics after deletion
    await recalculateArtistRating(artistId);

    return apiSuccess(null, "Review deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
