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
 * PATCH /api/admin/artists/[id]/feature
 * Toggles an artist profile's isFeatured badge
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

    const updated = await prisma.artistProfile.update({
      where: { id },
      data: { isFeatured: !artist.isFeatured },
      include: { user: true },
    });

    return apiSuccess(
      updated,
      updated.isFeatured
        ? "Artist featured on homepage spotlight"
        : "Artist removed from featured spotlight"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
