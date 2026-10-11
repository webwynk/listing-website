import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { sendBookingNotificationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/user/bookings/[id]/cancel
 * Allows a client to cancel a pending or accepted booking inquiry
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const reason = body?.reason?.trim() || "Cancelled by client";

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        artist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return apiError("Booking not found.", 404);
    }

    if (booking.userId !== user.id) {
      return apiError("Unauthorized to cancel this booking.", 403);
    }

    if (booking.status !== "PENDING" && booking.status !== "ACCEPTED") {
      return apiError(
        `Cannot cancel a booking with status "${booking.status}".`,
        400
      );
    }

    // Update status to CANCELLED
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
        rejectionReason: reason,
      },
    });

    // Notify Artist
    await prisma.notification.create({
      data: {
        userId: booking.artist.userId,
        type: "BOOKING_REJECTED",
        title: "Booking Cancelled by Client",
        message: `${booking.userName} cancelled booking inquiry ${booking.bookingNumber}. Reason: ${reason}`,
        link: "/artist/bookings",
      },
    });

    // Send email notification to artist
    if (booking.artist.user.email) {
      try {
        await sendBookingNotificationEmail(
          booking.artist.user.email,
          booking.artist.user.name,
          booking.bookingNumber,
          {
            eventType: `${booking.eventType} (Cancelled by Client)`,
            bookingDate: booking.bookingDate.toLocaleDateString(),
          }
        );
      } catch {
        // Non-fatal
      }
    }

    return apiSuccess(
      { booking: updatedBooking },
      "Booking cancelled successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
