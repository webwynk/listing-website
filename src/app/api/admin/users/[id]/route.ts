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
 * GET /api/admin/users/[id]
 * Returns full user dossier including booking history, submitted reviews, and favorites
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    const userRecord = await prisma.user.findUnique({
      where: { id },
      include: {
        bookings: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            artist: {
              select: {
                id: true,
                businessName: true,
                user: { select: { name: true } },
              },
            },
            service: {
              select: {
                priceFrom: true,
                category: { select: { name: true } },
                subCategory: { select: { name: true } },
              },
            },
          },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            artist: {
              select: {
                id: true,
                businessName: true,
                user: { select: { name: true } },
              },
            },
          },
        },
        favorites: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            artist: {
              select: {
                id: true,
                businessName: true,
                user: { select: { name: true, avatarUrl: true, locationCity: true } },
              },
            },
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
            favorites: true,
          },
        },
      },
    });

    if (!userRecord) {
      return apiError("User account not found.", 404);
    }

    return apiSuccess(userRecord);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Deletes user account with self-deletion protection
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { user: currentAdmin, errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    // Self-deletion security check
    if (currentAdmin.id === id) {
      return apiError("Security Violation: You cannot delete your own administrator account.", 400);
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return apiError("User account not found.", 404);
    }

    // Delete user account (cascades to related records per Prisma schema)
    await prisma.user.delete({
      where: { id },
    });

    return apiSuccess({ deletedId: id }, `User '${targetUser.name}' was successfully deleted.`);
  } catch (error) {
    return handleApiError(error);
  }
}
