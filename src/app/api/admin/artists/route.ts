import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/artists
 * Returns paginated artists with status filter, search, category filter, and tab counters
 */
export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(searchParams, 10);
    const statusParam = searchParams.get("status")?.toUpperCase();
    const search = searchParams.get("search")?.trim();
    const categoryId = searchParams.get("categoryId")?.trim();

    // Base filter conditions
    const where: any = {};

    if (statusParam && ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"].includes(statusParam)) {
      where.status = statusParam;
    }

    if (categoryId) {
      where.services = {
        some: { categoryId },
      };
    }

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { locationCity: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Execute queries in parallel
    const [
      totalCount,
      artists,
      countPending,
      countApproved,
      countRejected,
      countSuspended,
      countAll,
    ] = await Promise.all([
      prisma.artistProfile.count({ where }),
      prisma.artistProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              avatarUrl: true,
              locationCity: true,
              isEmailVerified: true,
            },
          },
          services: {
            take: 1,
            include: {
              category: { select: { name: true } },
            },
          },
          _count: {
            select: {
              services: true,
              portfolioItems: true,
              bookings: true,
            },
          },
        },
      }),
      prisma.artistProfile.count({ where: { status: "PENDING" } }),
      prisma.artistProfile.count({ where: { status: "APPROVED" } }),
      prisma.artistProfile.count({ where: { status: "REJECTED" } }),
      prisma.artistProfile.count({ where: { status: "SUSPENDED" } }),
      prisma.artistProfile.count(),
    ]);

    const formattedArtists = artists.map((a) => ({
      id: a.id,
      userId: a.userId,
      businessName: a.businessName || a.user.name,
      ownerName: a.user.name,
      email: a.user.email,
      phone: a.user.phone,
      city: a.user.locationCity,
      emailVerified: a.user.isEmailVerified,
      avatarUrl: a.user.avatarUrl,
      status: a.status,
      isFeatured: a.isFeatured,
      avgRating: a.avgRating,
      totalReviews: a.totalReviews,
      totalBookings: a.totalBookings,
      experienceYears: a.experienceYears,
      primaryCategory: a.services[0]?.category.name || "Uncategorized",
      servicesCount: a._count.services,
      portfolioCount: a._count.portfolioItems,
      createdAt: a.createdAt.toISOString(),
      approvedAt: a.approvedAt ? a.approvedAt.toISOString() : null,
    }));

    return apiSuccess({
      artists: formattedArtists,
      counts: {
        all: countAll,
        pending: countPending,
        approved: countApproved,
        rejected: countRejected,
        suspended: countSuspended,
      },
      pagination: getPaginationMeta(totalCount, page, limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
