import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/bookings/[id]
 * Returns full dossier for a specific booking owned by the authenticated client
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        artist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                phone: true,
                email: true,
                locationCity: true,
                locationState: true,
              },
            },
          },
        },
        service: {
          include: {
            category: {
              select: {
                id: true,
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
    });

    if (!booking) {
      return apiError("Booking not found.", 404);
    }

    if (booking.userId !== user.id) {
      return apiError("Unauthorized to view this booking.", 403);
    }

    return apiSuccess({ booking });
  } catch (error) {
    return handleApiError(error);
  }
}
