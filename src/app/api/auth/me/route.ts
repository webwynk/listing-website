import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return apiError("Unauthorized. Please log in.", 401);
    }

    // If user is an artist, fetch their artist profile status
    let artistProfile = null;
    if (user.role === "ARTIST") {
      artistProfile = await prisma.artistProfile.findUnique({
        where: { userId: user.id },
        select: {
          id: true,
          businessName: true,
          status: true,
          isFeatured: true,
          avgRating: true,
          totalReviews: true,
          totalBookings: true,
          profileViews: true,
        },
      });
    }

    return apiSuccess(
      {
        user,
        artistProfile,
      },
      "Current user profile retrieved."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
