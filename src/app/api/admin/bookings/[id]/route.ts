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
 * GET /api/admin/bookings/[id]
 * Returns full booking and lead dossier for administrator coordination
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
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
            isEmailVerified: true,
          },
        },
        artist: {
          select: {
            id: true,
            businessName: true,
            bio: true,
            avgRating: true,
            totalReviews: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatarUrl: true,
              },
            },
          },
        },
        service: {
          include: {
            category: { select: { id: true, name: true } },
            subCategory: { select: { id: true, name: true } },
          },
        },
        review: true,
      },
    });

    if (!booking) {
      return apiError("Booking record not found.", 404);
    }

    return apiSuccess(booking);
  } catch (error) {
    return handleApiError(error);
  }
}
