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
 * PATCH /api/admin/banners/[id]/toggle
 * Toggles active state of a banner
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return apiError("Banner not found.", 404);
    }

    const updated = await prisma.banner.update({
      where: { id },
      data: {
        isActive: !banner.isActive,
      },
    });

    return apiSuccess(
      updated,
      `Banner marked as ${updated.isActive ? "active" : "inactive"}.`
    );
  } catch (error) {
    return handleApiError(error);
  }
}
