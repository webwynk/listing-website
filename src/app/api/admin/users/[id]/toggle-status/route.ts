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
 * PATCH /api/admin/users/[id]/toggle-status
 * Toggles a user account's isActive status with self-protection guard
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { user: currentAdmin, errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    // Self-modification protection
    if (currentAdmin.id === id) {
      return apiError("Security Violation: You cannot deactivate your own administrator account.", 400);
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return apiError("User account not found.", 404);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !targetUser.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return apiSuccess(
      updated,
      updated.isActive
        ? `User '${updated.name}' account reactivated.`
        : `User '${updated.name}' account deactivated.`
    );
  } catch (error) {
    return handleApiError(error);
  }
}
