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
 * PATCH /api/admin/reviews/[id]/approve
 * Toggles review approval status and updates artist aggregate rating metrics
 */
export async function PATCH(req: Request, { params }: RouteParams) {
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

    const nextApprovedStatus = !review.isApproved;

    const updated = await prisma.review.update({
      where: { id },
      data: {
        isApproved: nextApprovedStatus,
      },
    });

    // Recalculate artist's public rating metrics
    await recalculateArtistRating(review.artistId);

    return apiSuccess(
      updated,
      `Review ${nextApprovedStatus ? "approved and made public" : "rejected and hidden"}.`
    );
  } catch (error) {
    return handleApiError(error);
  }
}
