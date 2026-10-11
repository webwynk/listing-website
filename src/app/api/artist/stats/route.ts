import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

/**
 * GET /api/artist/stats
 * Returns dashboard metrics, completion progress, and recent inquiries with strict Lead Privacy
 */
export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      include: {
        services: { select: { id: true } },
        portfolioItems: { select: { id: true } },
        workingHours: { select: { isWorking: true } },
      },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    // 1. Aggregated booking counts
    const [totalBookings, pendingBookings, completedBookings] = await Promise.all([
      prisma.booking.count({ where: { artistId: artistProfile.id } }),
      prisma.booking.count({ where: { artistId: artistProfile.id, status: "PENDING" } }),
      prisma.booking.count({ where: { artistId: artistProfile.id, status: "COMPLETED" } }),
    ]);

    // 2. Calculate Profile Completion Percentage
    let completionScore = 0;
    const completionBreakdown = {
      bio: Boolean(artistProfile.bio && artistProfile.bio.trim().length >= 20),
      avatar: Boolean(user.avatarUrl),
      services: artistProfile.services.length > 0,
      portfolio: artistProfile.portfolioItems.length >= 3,
      workingHours: artistProfile.workingHours.some((h) => h.isWorking),
    };

    if (completionBreakdown.bio) completionScore += 20;
    if (completionBreakdown.avatar) completionScore += 15;
    if (completionBreakdown.services) completionScore += 25;
    if (completionBreakdown.portfolio) completionScore += 25;
    if (completionBreakdown.workingHours) completionScore += 15;

    // 3. Fetch Recent Bookings — LEAD PRIVACY GUARANTEE:
    // Strictly NO client contact info (phone/email) queried or exposed
    const recentBookings = await prisma.booking.findMany({
      where: { artistId: artistProfile.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        bookingNumber: true,
        userName: true,
        bookingDate: true,
        bookingTime: true,
        eventType: true,
        eventLocation: true,
        requirements: true,
        numberOfPeople: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            avatarUrl: true,
          },
        },
        service: {
          select: {
            priceType: true,
            priceFrom: true,
            priceTo: true,
            category: { select: { name: true } },
            subCategory: { select: { name: true } },
          },
        },
      },
    });

    return apiSuccess({
      stats: {
        totalBookings,
        pendingBookings,
        completedBookings,
        profileViews: artistProfile.profileViews,
        avgRating: artistProfile.avgRating,
        totalReviews: artistProfile.totalReviews,
        status: artistProfile.status,
        rejectionReason: artistProfile.rejectionReason,
        isFeatured: artistProfile.isFeatured,
      },
      completion: {
        percentage: completionScore,
        breakdown: completionBreakdown,
      },
      recentBookings,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
