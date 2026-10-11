import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";

export const dynamic = "force-dynamic";

interface RawBookingListItem {
  id: string;
  bookingNumber: string;
  userName: string;
  userEmail: string | null;
  userPhone: string | null;
  bookingDate: Date;
  bookingTime: string | null;
  eventType: string | null;
  eventLocation: string | null;
  numberOfPeople: number;
  status: any;
  adminNotes: string | null;
  createdAt: Date;
  artist: {
    id: string;
    businessName: string | null;
    user: {
      name: string;
    };
  };
  service: {
    priceFrom: any;
    category: { name: string };
    subCategory: { name: string } | null;
  } | null;
}

/**
 * GET /api/admin/bookings
 * Returns paginated bookings with full privileged client contact details for Super Admin
 */
export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(searchParams, 10);
    const statusParam = searchParams.get("status")?.toUpperCase();
    const search = searchParams.get("search")?.trim();

    const where: any = {};

    if (
      statusParam &&
      ["PENDING", "ACCEPTED", "COMPLETED", "CANCELLED", "REJECTED"].includes(statusParam)
    ) {
      where.status = statusParam;
    }

    if (search) {
      where.OR = [
        { bookingNumber: { contains: search, mode: "insensitive" } },
        { userName: { contains: search, mode: "insensitive" } },
        { userEmail: { contains: search, mode: "insensitive" } },
        { userPhone: { contains: search, mode: "insensitive" } },
        { eventLocation: { contains: search, mode: "insensitive" } },
        {
          artist: {
            OR: [
              { businessName: { contains: search, mode: "insensitive" } },
              { user: { name: { contains: search, mode: "insensitive" } } },
            ],
          },
        },
      ];
    }

    // Execute data query and total count in parallel with clean tuple typing
    const [totalCount, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          artist: {
            select: {
              id: true,
              businessName: true,
              user: { select: { name: true } },
            },
          },
          service: {
            select: {
              priceFrom: true,
              category: { select: { name: true } },
              subCategory: { select: { name: true } },
            },
          },
        },
      }),
    ]);

    // Status tab counts in parallel
    const [
      countAll,
      countPending,
      countAccepted,
      countCompleted,
      countCancelled,
      countRejected,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "ACCEPTED" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
      prisma.booking.count({ where: { status: "REJECTED" } }),
    ]);

    const formattedBookings = (bookings as RawBookingListItem[]).map((b: RawBookingListItem) => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      customerName: b.userName,
      customerEmail: b.userEmail || "No email",
      customerPhone: b.userPhone || "No phone",
      eventDate: b.bookingDate.toISOString().split("T")[0],
      eventTime: b.bookingTime,
      eventType: b.eventType,
      eventLocation: b.eventLocation,
      numberOfPeople: b.numberOfPeople,
      status: b.status,
      adminNotes: b.adminNotes,
      totalAmount: b.service?.priceFrom ?? null,
      artistId: b.artist.id,
      artistName: b.artist.businessName || b.artist.user.name,
      serviceName:
        b.service?.subCategory?.name ||
        b.service?.category.name ||
        b.eventType ||
        "Standard Service",
      createdAt: b.createdAt.toISOString(),
    }));

    return apiSuccess({
      bookings: formattedBookings,
      counts: {
        all: countAll,
        pending: countPending,
        accepted: countAccepted,
        completed: countCompleted,
        cancelled: countCancelled,
        rejected: countRejected,
      },
      pagination: getPaginationMeta(totalCount, page, limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
