import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { reviewReplySchema } from "@/lib/validations/artist";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/artist/reviews/[id]/reply
 * Posts or updates the artist's public reply to a client review
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const review = await prisma.review.findUnique({
      where: { id },
      select: { id: true, artistId: true },
    });

    if (!review) {
      return apiError("Review not found.", 404);
    }

    if (review.artistId !== artistProfile.id) {
      return apiError("Unauthorized to reply to this review.", 403);
    }

    const body = await req.json();
    const validatedData = reviewReplySchema.parse(body);

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        artistReply: validatedData.reply.trim(),
        artistReplyAt: new Date(),
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        artistReply: true,
        artistReplyAt: true,
      },
    });

    return apiSuccess({
      review: updatedReview,
      message: "Reply saved successfully.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
