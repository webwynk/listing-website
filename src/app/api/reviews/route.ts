import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { createReviewSchema } from "@/lib/validations/review";

export const dynamic = "force-dynamic";

/**
 * POST /api/reviews
 * Allows an authenticated client to submit a verified review for a completed booking
 */
export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validatedData = createReviewSchema.parse(body);

    const { bookingId, rating, comment, photos } = validatedData;

    // 1. Fetch booking and check ownership & status
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        review: true,
        artist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return apiError("Booking not found.", 404);
    }

    if (booking.userId !== user.id) {
      return apiError("Unauthorized to review this booking.", 403);
    }

    if (booking.status !== "COMPLETED") {
      return apiError(
        "You can only submit reviews for completed appointments.",
        400
      );
    }

    if (booking.review) {
      return apiError(
        "You have already submitted a review for this booking.",
        400
      );
    }

    // 2. Create the review
    const review = await prisma.review.create({
      data: {
        bookingId: booking.id,
        userId: user.id,
        artistId: booking.artistId,
        rating,
        comment: comment?.trim() || null,
        photos: photos && photos.length > 0 ? photos : undefined,
        isApproved: true, // Default to true per schema
      },
    });

    // 3. Recalculate artist's avgRating & totalReviews in DB
    const allArtistReviews = await prisma.review.findMany({
      where: {
        artistId: booking.artistId,
        isApproved: true,
      },
      select: { rating: true },
    });

    const totalReviews = allArtistReviews.length;
    const sumRatings = allArtistReviews.reduce(
      (sum: number, r: { rating: number }) => sum + r.rating,
      0
    );
    const avgRating = totalReviews > 0 ? parseFloat((sumRatings / totalReviews).toFixed(1)) : 0;

    await prisma.artistProfile.update({
      where: { id: booking.artistId },
      data: {
        totalReviews,
        avgRating,
      },
    });

    // 4. Notify Artist
    await prisma.notification.create({
      data: {
        userId: booking.artist.userId,
        type: "REVIEW_RECEIVED",
        title: "New Client Review Received",
        message: `${user.name} rated your service ${rating} stars for booking ${booking.bookingNumber}.`,
        link: "/artist/reviews",
      },
    });

    return apiSuccess(
      { review },
      "Your review has been submitted successfully.",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
