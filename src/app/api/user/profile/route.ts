import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { userProfileUpdateSchema } from "@/lib/validations/user";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/profile
 * Returns profile details, stats, upcoming booking, and recent activity for the authenticated user
 */
export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        phone: true,
        avatarUrl: true,
        locationCity: true,
        locationState: true,
        locationCountry: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    if (!dbUser) {
      return apiError("User profile not found.", 404);
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Parallel metrics fetching
    const [
      totalBookings,
      activeBookings,
      completedBookings,
      favoritesCount,
      reviewsCount,
      nextBooking,
      recentBookings,
    ] = await Promise.all([
      prisma.booking.count({ where: { userId: user.id } }),
      prisma.booking.count({
        where: {
          userId: user.id,
          status: { in: ["PENDING", "ACCEPTED"] },
        },
      }),
      prisma.booking.count({
        where: {
          userId: user.id,
          status: "COMPLETED",
        },
      }),
      prisma.favorite.count({ where: { userId: user.id } }),
      prisma.review.count({ where: { userId: user.id } }),
      prisma.booking.findFirst({
        where: {
          userId: user.id,
          status: { in: ["PENDING", "ACCEPTED"] },
          bookingDate: { gte: todayStart },
        },
        orderBy: { bookingDate: "asc" },
        include: {
          artist: {
            include: {
              user: {
                select: {
                  name: true,
                  avatarUrl: true,
                  locationCity: true,
                },
              },
            },
          },
          service: {
            include: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.booking.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: {
          artist: {
            include: {
              user: {
                select: {
                  name: true,
                  avatarUrl: true,
                  locationCity: true,
                },
              },
            },
          },
          service: {
            include: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return apiSuccess({
      user: dbUser,
      stats: {
        totalBookings,
        activeBookings,
        completedBookings,
        favoritesCount,
        reviewsCount,
      },
      nextBooking,
      recentBookings,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/user/profile
 * Updates the authenticated user's personal details
 */
export async function PUT(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validatedData = userProfileUpdateSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(validatedData.name && { name: validatedData.name.trim() }),
        ...(validatedData.phone !== undefined && {
          phone: validatedData.phone ? validatedData.phone.trim() : null,
        }),
        ...(validatedData.locationCity !== undefined && {
          locationCity: validatedData.locationCity
            ? validatedData.locationCity.trim()
            : null,
        }),
        ...(validatedData.locationState !== undefined && {
          locationState: validatedData.locationState
            ? validatedData.locationState.trim()
            : null,
        }),
        ...(validatedData.avatarUrl !== undefined && {
          avatarUrl: validatedData.avatarUrl
            ? validatedData.avatarUrl.trim()
            : null,
        }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        phone: true,
        avatarUrl: true,
        locationCity: true,
        locationState: true,
        role: true,
        isEmailVerified: true,
      },
    });

    return apiSuccess(
      { user: updatedUser },
      "Profile updated successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/user/profile
 * Soft-deactivates the authenticated user's account
 */
export async function DELETE(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: false },
    });

    return apiSuccess(
      null,
      "Your account has been deactivated. You will now be signed out."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
