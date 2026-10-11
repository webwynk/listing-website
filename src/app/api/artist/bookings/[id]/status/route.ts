import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { sendBookingNotificationEmail } from "@/lib/email";
import { formatDate } from "@/lib/utils";
import { sanitizeBookingForArtist } from "@/lib/booking";

export const dynamic = "force-dynamic";

const statusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "COMPLETED"]),
  rejectionReason: z.string().max(500).optional().nullable(),
});

/**
 * PATCH /api/artist/bookings/[id]/status
 * Updates the lifecycle status of a booking inquiry owned by the authenticated artist
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true, businessName: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        service: {
          select: {
            category: { select: { name: true } },
            subCategory: { select: { name: true } },
          },
        },
      },
    });

    if (!booking) {
      return apiError("Booking inquiry not found.", 404);
    }

    if (booking.artistId !== artistProfile.id) {
      return apiError("Forbidden: You do not have permission to manage this booking.", 403);
    }

    const body = await req.json();
    const validatedData = statusSchema.parse(body);

    // Update booking
    const updateData: any = {
      status: validatedData.status,
    };

    if (validatedData.status === "REJECTED") {
      updateData.rejectionReason = validatedData.rejectionReason || "Unavailable for the requested schedule";
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    // If marked completed, increment artist total bookings
    if (validatedData.status === "COMPLETED" && booking.status !== "COMPLETED") {
      await prisma.artistProfile.update({
        where: { id: artistProfile.id },
        data: { totalBookings: { increment: 1 } },
      });
    }

    // 1. Dispatch In-App Notification to Client
    let notificationTitle = "Booking Update";
    let notificationMessage = `Your booking #${booking.bookingNumber} has been updated.`;

    if (validatedData.status === "ACCEPTED") {
      notificationTitle = "Booking Inquiry Accepted! 🎉";
      notificationMessage = `Your booking #${booking.bookingNumber} with ${artistProfile.businessName || "the artist"} has been accepted!`;
    } else if (validatedData.status === "REJECTED") {
      notificationTitle = "Booking Inquiry Declined";
      notificationMessage = `Your booking #${booking.bookingNumber} could not be accepted${validatedData.rejectionReason ? `: "${validatedData.rejectionReason}"` : "."}`;
    } else if (validatedData.status === "COMPLETED") {
      notificationTitle = "Service Completed — Leave a Review!";
      notificationMessage = `Your appointment #${booking.bookingNumber} has been marked completed. We'd love to hear your feedback!`;
    }

    await prisma.notification.create({
      data: {
        userId: booking.userId,
        type: validatedData.status === "ACCEPTED" ? "BOOKING_ACCEPTED" : validatedData.status === "REJECTED" ? "BOOKING_REJECTED" : "SYSTEM",
        title: notificationTitle,
        message: notificationMessage,
        link: `/bookings/${booking.id}`,
      },
    });

    // 2. Dispatch Email Alert to Client (Server-side notification without exposing to artist)
    if (booking.user?.email) {
      const serviceName = booking.service?.subCategory?.name || booking.service?.category?.name || "Beauty Service";
      await sendBookingNotificationEmail(
        booking.user.email,
        booking.user.name,
        booking.bookingNumber,
        {
          eventType: booking.eventType,
          bookingDate: formatDate(booking.bookingDate),
          bookingTime: booking.bookingTime,
          serviceName,
        }
      ).catch((err) => console.error("Client email notification failed:", err));
    }

    const safeBooking = sanitizeBookingForArtist(updatedBooking);

    return apiSuccess(
      safeBooking,
      `Booking successfully marked as ${validatedData.status.toLowerCase()}.`
    );
  } catch (error) {
    return handleApiError(error);
  }
}
