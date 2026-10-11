import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { sendArtistRejectionEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const rejectSchema = z.object({
  reason: z
    .string()
    .min(5, "Please provide a clear rejection reason (minimum 5 characters)")
    .max(1000, "Reason must not exceed 1000 characters"),
});

/**
 * PATCH /api/admin/artists/[id]/reject
 * Rejects an artist application with required explanatory feedback
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();
    const { reason } = rejectSchema.parse(body);

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
        status: "REJECTED",
        rejectionReason: reason,
      },
      include: { user: true },
    });

    // In-app notification
    await prisma.notification.create({
      data: {
        userId: artist.userId,
        type: "ARTIST_REJECTED",
        title: "Application Status Update",
        message: `Your artist application was not approved: ${reason}`,
      },
    });

    // Email dispatch (async)
    sendArtistRejectionEmail(
      artist.user.email,
      artist.user.name,
      artist.businessName,
      reason
    ).catch((err) => console.error("Email send error:", err));

    return apiSuccess(updated, "Artist application rejected with feedback sent");
  } catch (error) {
    return handleApiError(error);
  }
}
