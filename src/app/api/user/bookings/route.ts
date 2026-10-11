import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/bookings
 * Returns paginated bookings and live status counters for the authenticated client
 */
export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const { page, limit, skip, take } = getPaginationParams(searchParams, 10, 50);

    const statusParam = searchParams.get("status") || "ALL";
    const searchParam = searchParams.get("search")?.trim() || "";

    const where: any = {
      userId: user.id,
    };

    if (statusParam !== "ALL") {
      where.status = statusParam;
    }

    if (searchParam) {
      where.OR = [
        { bookingNumber: { contains: searchParam, mode: "insensitive" } },
        { eventType: { contains: searchParam, mode: "insensitive" } },
        { eventLocation: { contains: searchParam, mode: "insensitive" } },
        {
          artist: {
            user: {
              name: { contains: searchParam, mode: "insensitive" },
            },
          },
        },
      ];
    }

    // Parallel execution for status counters and paginated list
    const [
      totalCount,
      pendingCount,
      acceptedCount,
      completedCount,
      cancelledCount,
      rejectedCount,
      filteredTotal,
      bookings,
    ] = await Promise.all([
      prisma.booking.count({ where: { userId: user.id } }),
      prisma.booking.count({ where: { userId: user.id, status: "PENDING" } }),
      prisma.booking.count({ where: { userId: user.id, status: "ACCEPTED" } }),
      prisma.booking.count({ where: { userId: user.id, status: "COMPLETED" } }),
      prisma.booking.count({ where: { userId: user.id, status: "CANCELLED" } }),
      prisma.booking.count({ where: { userId: user.id, status: "REJECTED" } }),
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          artist: {
            include: {
              user: {
                select: {
                  name: true,
                  avatarUrl: true,
                  locationCity: true,
                  phone: true,
                  email: true,
                },
              },
            },
          },
          service: {
            include: {
              category: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
          review: {
            select: {
              id: true,
              rating: true,
              comment: true,
              photos: true,
              artistReply: true,
              artistReplyAt: true,
              createdAt: true,
            },
          },
        },
      }),
    ]);

    const pagination = getPaginationMeta(filteredTotal, page, limit);

    return apiSuccess(
      {
        bookings,
        counts: {
          ALL: totalCount,
          PENDING: pendingCount,
          ACCEPTED: acceptedCount,
          COMPLETED: completedCount,
          CANCELLED: cancelledCount,
          REJECTED: rejectedCount,
        },
      },
      undefined,
      200,
      pagination
    );
  } catch (error) {
    return handleApiError(error);
  }
}
