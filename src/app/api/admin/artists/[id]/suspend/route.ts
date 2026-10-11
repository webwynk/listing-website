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
 * PATCH /api/admin/artists/[id]/suspend
 * Toggles an artist profile between SUSPENDED and APPROVED
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    const artist = await prisma.artistProfile.findUnique({
      where: { id },
    });

    if (!artist) {
      return apiError("Artist profile not found", 404);
    }

    const nextStatus = artist.status === "SUSPENDED" ? "APPROVED" : "SUSPENDED";

    const updated = await prisma.artistProfile.update({
      where: { id },
      data: { status: nextStatus },
      include: { user: true },
    });

    return apiSuccess(
      updated,
      nextStatus === "SUSPENDED"
        ? "Artist suspended from public listings"
        : "Artist profile reinstated to active status"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
