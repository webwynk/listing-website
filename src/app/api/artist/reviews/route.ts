import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

/**
 * GET /api/artist/reviews
 * Returns all approved client reviews and performance metrics for the authenticated artist
 * STRICT LEAD PRIVACY GUARANTEE: Never query or expose client phone or email
 */
export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true, avgRating: true, totalReviews: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const { searchParams } = new URL(req.url);
    const filterRating = searchParams.get("rating");
    const replyStatus = searchParams.get("replyStatus"); // "ALL" | "REPLIED" | "PENDING"

    const where: any = {
      artistId: artistProfile.id,
      isApproved: true,
    };

    if (filterRating && ["1", "2", "3", "4", "5"].includes(filterRating)) {
      where.rating = parseInt(filterRating, 10);
    }

    if (replyStatus === "REPLIED") {
      where.artistReply = { not: null };
    } else if (replyStatus === "PENDING") {
      where.artistReply = null;
    }

    // Retrieve filtered reviews (Strict Lead Privacy: NO client phone or email queried)
    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        comment: true,
        photos: true,
        isApproved: true,
        artistReply: true,
        artistReplyAt: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            eventType: true,
            bookingDate: true,
            service: {
              select: {
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Compute aggregate metrics across all approved reviews for this artist
    const allApprovedReviews = await prisma.review.findMany({
      where: { artistId: artistProfile.id, isApproved: true },
      select: { rating: true, artistReply: true },
    });

    const totalCount = allApprovedReviews.length;
    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sumRating = 0;
    let repliedCount = 0;

    for (const r of allApprovedReviews) {
      if (r.rating >= 1 && r.rating <= 5) {
        ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
        sumRating += r.rating;
      }
      if (r.artistReply && r.artistReply.trim().length > 0) {
        repliedCount++;
      }
    }

    const avgRating = totalCount > 0 ? parseFloat((sumRating / totalCount).toFixed(1)) : 0;
    const responseRate = totalCount > 0 ? Math.round((repliedCount / totalCount) * 100) : 100;

    return apiSuccess({
      reviews,
      stats: {
        totalReviews: totalCount,
        avgRating,
        ratingDistribution,
        repliedCount,
        pendingReplyCount: totalCount - repliedCount,
        responseRate,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
