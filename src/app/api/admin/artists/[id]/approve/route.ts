import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { sendArtistApprovalEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/admin/artists/[id]/approve
 * Approves an artist profile, marks approvedAt, sends email notification
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    const artist = await prisma.artistProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!artist) {
      return apiError("Artist profile not found", 404);
    }

    const updated = await prisma.artistProfile.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        rejectionReason: null,
      },
      include: { user: true },
    });

    // In-app notification
    await prisma.notification.create({
      data: {
        userId: artist.userId,
        type: "ARTIST_APPROVED",
        title: "Profile Approved!",
        message: "Congratulations! Your artist profile has been approved and is now live on GlamBook.",
      },
    });

    // Email dispatch (async)
    sendArtistApprovalEmail(
      artist.user.email,
      artist.user.name,
      artist.businessName
    ).catch((err) => console.error("Email send error:", err));

    return apiSuccess(updated, "Artist approved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
