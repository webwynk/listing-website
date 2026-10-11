import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";

export const dynamic = "force-dynamic";

/**
 * GET /api/artist/bookings
 * Returns paginated booking inquiries for the authenticated artist
 * STRICT LEAD PRIVACY GUARANTEE: Never query or expose client phone or email
 */
export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const { searchParams } = new URL(req.url);
    const { page, limit, skip, take } = getPaginationParams(searchParams, 10, 50);

    const statusParam = searchParams.get("status") || "ALL";
    const searchParam = searchParams.get("search")?.trim() || "";

    // Base filter scoped to current artist
    const where: any = {
      artistId: artistProfile.id,
    };

    if (statusParam !== "ALL") {
      where.status = statusParam;
    }

    if (searchParam) {
      where.OR = [
        { userName: { contains: searchParam, mode: "insensitive" } },
        { bookingNumber: { contains: searchParam, mode: "insensitive" } },
        { eventLocation: { contains: searchParam, mode: "insensitive" } },
      ];
    }

    // Parallel execution for status counts and paginated items
    const [
      totalCount,
      pendingCount,
      acceptedCount,
      completedCount,
      rejectedCount,
      cancelledCount,
      filteredTotal,
      bookings,
    ] = await Promise.all([
      prisma.booking.count({ where: { artistId: artistProfile.id } }),
      prisma.booking.count({ where: { artistId: artistProfile.id, status: "PENDING" } }),
      prisma.booking.count({ where: { artistId: artistProfile.id, status: "ACCEPTED" } }),
      prisma.booking.count({ where: { artistId: artistProfile.id, status: "COMPLETED" } }),
      prisma.booking.count({ where: { artistId: artistProfile.id, status: "REJECTED" } }),
      prisma.booking.count({ where: { artistId: artistProfile.id, status: "CANCELLED" } }),
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
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
          rejectionReason: true,
          createdAt: true,
          user: {
            select: {
              avatarUrl: true,
            },
          },
          service: {
            select: {
              id: true,
              priceType: true,
              priceFrom: true,
              priceTo: true,
              category: { select: { id: true, name: true } },
              subCategory: { select: { id: true, name: true } },
            },
          },
          review: {
            select: {
              id: true,
              rating: true,
              comment: true,
            },
          },
        },
      }),
    ]);

    const pagination = getPaginationMeta(filteredTotal, page, limit);

    return apiSuccess({
      bookings,
      pagination,
      counts: {
        all: totalCount,
        pending: pendingCount,
        accepted: acceptedCount,
        completed: completedCount,
        rejected: rejectedCount,
        cancelled: cancelledCount,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
