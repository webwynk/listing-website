import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { createBookingSchema } from "@/lib/validations/booking";
import { generateBookingNumber } from "@/lib/booking";
import { sendBookingNotificationEmail } from "@/lib/email";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";

export const dynamic = "force-dynamic";

/**
 * GET /api/bookings
 * Returns all bookings for the authenticated client user
 */
export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const { page, limit, skip, take } = getPaginationParams(searchParams, 10, 50);
    const statusParam = searchParams.get("status") || "ALL";

    const where: any = {
      userId: user.id,
    };

    if (statusParam !== "ALL") {
      where.status = statusParam;
    }

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          artist: {
            include: {
              user: {
                select: {
                  name: true,
                  avatarUrl: true,
                  locationCity: true,
                },
              },
            },
          },
          service: {
            include: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
          review: {
            select: {
              id: true,
              rating: true,
              comment: true,
            },
          },
        },
      }),
    ]);

    const pagination = getPaginationMeta(total, page, limit);

    return apiSuccess(
      {
        bookings,
        totalCount: total,
      },
      undefined,
      200,
      pagination
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/bookings
 * Submits a new booking inquiry to an artist
 */
export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validatedData = createBookingSchema.parse(body);

    const {
      artistId,
      serviceId,
      bookingDate,
      bookingTime,
      eventType,
      eventLocation,
      requirements,
      numberOfPeople,
      userName,
      userPhone,
      userEmail,
    } = validatedData;

    // 1. Verify artist exists and is approved
    const artist = await prisma.artistProfile.findUnique({
      where: { id: artistId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!artist) {
      return apiError("Artist not found.", 404);
    }

    if (artist.status !== "APPROVED") {
      return apiError("This artist is currently not accepting new bookings.", 400);
    }

    // 2. Validate booking date is not in the past
    const requestedDate = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
      return apiError("Booking date cannot be in the past.", 400);
    }

    // 3. Check artist availability for that date
    const checkDateStart = new Date(requestedDate);
    checkDateStart.setHours(0, 0, 0, 0);

    const blockedEntry = await prisma.artistAvailability.findFirst({
      where: {
        artistId: artist.id,
        date: checkDateStart,
        status: "BLOCKED",
      },
    });

    if (blockedEntry) {
      return apiError(
        "The artist is unavailable on this date. Please choose another date.",
        400
      );
    }

    // 4. Generate unique standard booking number (GB-YYYYMMDD-XXX)
    const bookingNumber = await generateBookingNumber();

    // 5. Create booking record in database
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        userId: user.id,
        artistId: artist.id,
        serviceId: serviceId || null,
        bookingDate: requestedDate,
        bookingTime: bookingTime || null,
        eventType,
        eventLocation,
        requirements: requirements || null,
        numberOfPeople,
        status: "PENDING",
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        userEmail: userEmail.trim().toLowerCase(),
      },
      include: {
        artist: {
          include: {
            user: {
              select: {
                name: true,
                avatarUrl: true,
                locationCity: true,
              },
            },
          },
        },
        service: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // 6. Create in-app notifications
    // Notification for Artist
    await prisma.notification.create({
      data: {
        userId: artist.userId,
        type: "BOOKING_NEW",
        title: "New Booking Request",
        message: `${userName} sent a booking request for ${eventType} on ${requestedDate.toLocaleDateString()}.`,
        link: "/artist/bookings",
      },
    });

    // Notification for Client
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "BOOKING_NEW",
        title: "Booking Request Sent",
        message: `Your inquiry (${bookingNumber}) with ${artist.user.name} has been sent successfully.`,
        link: "/user/bookings",
      },
    });

    // 7. Dispatch transactional emails (non-blocking)
    const formattedDate = requestedDate.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    try {
      // Email to Client
      await sendBookingNotificationEmail(
        userEmail,
        userName,
        bookingNumber,
        {
          eventType,
          bookingDate: formattedDate,
          bookingTime,
          serviceName: booking.service?.category?.name || "Custom Makeup & Styling",
        }
      );

      // Email to Artist
      if (artist.user.email) {
        await sendBookingNotificationEmail(
          artist.user.email,
          artist.user.name,
          bookingNumber,
          {
            eventType,
            bookingDate: formattedDate,
            bookingTime,
            serviceName: booking.service?.category?.name || "New Booking Inquiry",
          }
        );
      }
    } catch {
      // Non-fatal if email dispatch fails in development
    }

    return apiSuccess(
      { booking },
      "Your booking request has been submitted successfully.",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
