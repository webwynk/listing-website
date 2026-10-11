import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/artists/[id]
 * Returns exhaustive artist dossier for admin inspection
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    const artist = await prisma.artistProfile.findUnique({
      where: { id },
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
            isEmailVerified: true,
            createdAt: true,
          },
        },
        services: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
            subCategory: { select: { id: true, name: true, slug: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        portfolioItems: {
          orderBy: { sortOrder: "asc" },
        },
        workingHours: {
          orderBy: { dayOfWeek: "asc" },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
            portfolioItems: true,
            packages: true,
          },
        },
      },
    });

    if (!artist) {
      return apiError("Artist profile not found.", 404);
    }

    return apiSuccess(artist);
  } catch (error) {
    return handleApiError(error);
  }
}
