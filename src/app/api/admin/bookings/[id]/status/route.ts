import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { updateBookingStatusSchema } from "@/lib/validations/booking";
import { sendBookingNotificationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/admin/bookings/[id]/status
 * Updates status of a booking, creates notifications, and sends email update
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();
    const validatedData = updateBookingStatusSchema.parse(body);

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        artist: { include: { user: true } },
        service: {
          include: { category: true, subCategory: true },
        },
      },
    });

    if (!booking) {
      return apiError("Booking record not found.", 404);
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: validatedData.status,
        ...(validatedData.rejectionReason !== undefined && {
          rejectionReason: validatedData.rejectionReason,
        }),
        ...(validatedData.adminNotes !== undefined && {
          adminNotes: validatedData.adminNotes,
        }),
      },
      include: {
        artist: { select: { businessName: true, user: { select: { name: true } } } },
        service: { select: { category: { select: { name: true } } } },
      },
    });

    // Notify client in-app
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        type: `BOOKING_${validatedData.status}` as any,
        title: `Booking Update: ${validatedData.status}`,
        message: `Your booking #${booking.bookingNumber} status was updated to ${validatedData.status}.`,
      },
    });

    // Notify artist in-app
    await prisma.notification.create({
      data: {
        userId: booking.artist.userId,
        type: `BOOKING_${validatedData.status}` as any,
        title: `Booking Update: ${validatedData.status}`,
        message: `Booking #${booking.bookingNumber} for ${booking.userName} is marked as ${validatedData.status}.`,
      },
    });

    // Dispatch email to client (async)
    if (booking.userEmail) {
      sendBookingNotificationEmail(
        booking.userEmail,
        booking.userName,
        booking.bookingNumber,
        {
          eventType: booking.eventType,
          bookingDate: booking.bookingDate.toISOString().split("T")[0],
          bookingTime: booking.bookingTime,
          serviceName:
            booking.service?.subCategory?.name ||
            booking.service?.category.name ||
            "Beauty Service",
        }
      ).catch((err) => console.error("Email send error:", err));
    }

    return apiSuccess(updated, `Booking status changed to ${validatedData.status}`);
  } catch (error) {
    return handleApiError(error);
  }
}
