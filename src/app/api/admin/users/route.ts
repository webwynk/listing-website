import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users
 * Returns paginated user accounts with role filtering, search, and activity metrics
 */
export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(searchParams, 10);
    const roleParam = searchParams.get("role")?.toUpperCase();
    const search = searchParams.get("search")?.trim();

    const where: any = {};

    if (roleParam && ["USER", "ARTIST", "ADMIN"].includes(roleParam)) {
      where.role = roleParam;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { locationCity: { contains: search, mode: "insensitive" } },
      ];
    }

    // Execute queries in parallel
    const [
      totalCount,
      users,
      countAll,
      countUsers,
      countArtists,
      countAdmins,
    ] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          avatarUrl: true,
          locationCity: true,
          locationState: true,
          isEmailVerified: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              bookings: true,
              reviews: true,
              favorites: true,
            },
          },
        },
      }),
      prisma.user.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({ where: { role: "ARTIST" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
    ]);

    const formattedUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      avatarUrl: u.avatarUrl,
      city: u.locationCity,
      state: u.locationState,
      isEmailVerified: u.isEmailVerified,
      isActive: u.isActive,
      bookingsCount: u._count.bookings,
      reviewsCount: u._count.reviews,
      favoritesCount: u._count.favorites,
      createdAt: u.createdAt.toISOString(),
    }));

    return apiSuccess({
      users: formattedUsers,
      counts: {
        all: countAll,
        user: countUsers,
        artist: countArtists,
        admin: countAdmins,
      },
      pagination: getPaginationMeta(totalCount, page, limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
