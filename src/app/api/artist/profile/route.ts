import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { artistProfileUpdateSchema } from "@/lib/validations/artist";

export const dynamic = "force-dynamic";

/**
 * GET /api/artist/profile
 * Returns the current authenticated artist's full profile details
 */
export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
            locationCity: true,
            locationState: true,
            locationCountry: true,
            createdAt: true,
          },
        },
        services: {
          select: { id: true },
        },
        portfolioItems: {
          select: { id: true },
        },
        workingHours: {
          orderBy: { dayOfWeek: "asc" },
        },
      },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    return apiSuccess({
      profile: {
        id: artistProfile.id,
        userId: artistProfile.userId,
        businessName: artistProfile.businessName,
        bio: artistProfile.bio,
        experienceYears: artistProfile.experienceYears,
        serviceRadiusKm: artistProfile.serviceRadiusKm,
        status: artistProfile.status,
        rejectionReason: artistProfile.rejectionReason,
        avgRating: artistProfile.avgRating,
        totalReviews: artistProfile.totalReviews,
        totalBookings: artistProfile.totalBookings,
        profileViews: artistProfile.profileViews,
        isFeatured: artistProfile.isFeatured,
        servicesCount: artistProfile.services.length,
        portfolioCount: artistProfile.portfolioItems.length,
        workingHours: artistProfile.workingHours,
        user: artistProfile.user,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/artist/profile
 * Updates the current authenticated artist's profile information
 * If currently REJECTED, automatically resets status to PENDING for administrative re-review
 */
export async function PUT(req: Request) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validatedData = artistProfileUpdateSchema.parse(body);

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    // Determine if status should reset from REJECTED to PENDING
    const shouldResetStatus = artistProfile.status === "REJECTED";

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Update User Record
      const userUpdateData: any = {};
      if (validatedData.name !== undefined) userUpdateData.name = validatedData.name;
      if (validatedData.phone !== undefined) userUpdateData.phone = validatedData.phone;
      if (validatedData.avatarUrl !== undefined) userUpdateData.avatarUrl = validatedData.avatarUrl;
      if (validatedData.locationCity !== undefined) userUpdateData.locationCity = validatedData.locationCity;
      if (validatedData.locationState !== undefined) userUpdateData.locationState = validatedData.locationState;

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: user.id },
          data: userUpdateData,
        });
      }

      // 2. Update Artist Profile Record
      const profileUpdateData: any = {
        businessName: validatedData.businessName,
        bio: validatedData.bio,
        experienceYears: validatedData.experienceYears,
        serviceRadiusKm: validatedData.serviceRadiusKm,
      };

      if (shouldResetStatus) {
        profileUpdateData.status = "PENDING";
        profileUpdateData.rejectionReason = null;
      }

      await tx.artistProfile.update({
        where: { id: artistProfile.id },
        data: profileUpdateData,
      });

      // 3. If re-submitting after rejection, create notification
      if (shouldResetStatus) {
        await tx.notification.create({
          data: {
            userId: user.id,
            type: "SYSTEM",
            title: "Profile Resubmitted for Review",
            message:
              "Your updated profile has been submitted to the administrative team for re-verification. We will review it shortly.",
            link: "/artist/dashboard",
          },
        });
      }
    });

    return apiSuccess(
      null,
      shouldResetStatus
        ? "Profile updated and resubmitted for administrative review."
        : "Profile updated successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
