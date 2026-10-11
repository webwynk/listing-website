import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

const blockDateSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional().nullable(),
  note: z.string().max(200).optional().nullable(),
});

/**
 * GET /api/artist/availability
 * Returns blocked dates and confirmed bookings for the authenticated artist
 * STRICT LEAD PRIVACY GUARANTEE: Zero client phone/email queried
 */
export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    let startDate: Date;
    let endDate: Date;

    if (yearParam && monthParam) {
      const year = parseInt(yearParam, 10);
      const month = parseInt(monthParam, 10) - 1; // 0-indexed
      startDate = new Date(Date.UTC(year, month - 1, 1));
      endDate = new Date(Date.UTC(year, month + 2, 0, 23, 59, 59, 999));
    } else {
      const now = new Date();
      startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, 1));
      endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 3, 0, 23, 59, 59, 999));
    }

    const [blockedDates, bookings, workingHours] = await Promise.all([
      // 1. Manually blocked dates
      prisma.artistAvailability.findMany({
        where: {
          artistId: artistProfile.id,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: "asc" },
      }),

      // 2. Confirmed bookings — STRICT PRIVACY: Zero contact details
      prisma.booking.findMany({
        where: {
          artistId: artistProfile.id,
          status: { in: ["ACCEPTED", "COMPLETED"] },
          bookingDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          id: true,
          bookingNumber: true,
          bookingDate: true,
          bookingTime: true,
          eventType: true,
          status: true,
          userName: true,
          numberOfPeople: true,
          service: {
            select: {
              category: { select: { name: true } },
              subCategory: { select: { name: true } },
            },
          },
        },
        orderBy: { bookingDate: "asc" },
      }),

      // 3. Weekly schedule
      prisma.artistWorkingHours.findMany({
        where: { artistId: artistProfile.id },
        orderBy: { dayOfWeek: "asc" },
      }),
    ]);

    return apiSuccess({
      blockedDates,
      bookings,
      workingHours,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/artist/availability
 * Blocks a specific date or date range for the authenticated artist
 */
export async function POST(req: Request) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const body = await req.json();
    const validatedData = blockDateSchema.parse(body);

    const start = new Date(`${validatedData.startDate}T00:00:00.000Z`);
    const end = validatedData.endDate
      ? new Date(`${validatedData.endDate}T00:00:00.000Z`)
      : new Date(`${validatedData.startDate}T00:00:00.000Z`);

    if (end < start) {
      return apiError("End date cannot be earlier than start date.", 400);
    }

    // Generate array of dates to block
    const datesToBlock: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      datesToBlock.push(new Date(current));
      current.setUTCDate(current.getUTCDate() + 1);
    }

    if (datesToBlock.length > 90) {
      return apiError("Cannot block more than 90 days in a single action.", 400);
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const d of datesToBlock) {
        await tx.artistAvailability.upsert({
          where: {
            artistId_date: {
              artistId: artistProfile.id,
              date: d,
            },
          },
          update: {
            status: "BLOCKED",
            note: validatedData.note || null,
          },
          create: {
            artistId: artistProfile.id,
            date: d,
            status: "BLOCKED",
            note: validatedData.note || null,
          },
        });
      }
    });

    return apiSuccess(
      null,
      datesToBlock.length === 1
        ? "Date successfully blocked."
        : `${datesToBlock.length} dates successfully blocked.`,
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/artist/availability
 * Unblocks a specific date
 */
export async function DELETE(req: Request) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const idParam = searchParams.get("id");

    if (idParam) {
      const existing = await prisma.artistAvailability.findUnique({
        where: { id: idParam },
        select: { id: true, artistId: true },
      });

      if (!existing || existing.artistId !== artistProfile.id) {
        return apiError("Availability record not found or unauthorized.", 404);
      }

      await prisma.artistAvailability.delete({
        where: { id: idParam },
      });
      return apiSuccess(null, "Date unblocked successfully.");
    }

    if (dateParam) {
      const targetDate = new Date(`${dateParam}T00:00:00.000Z`);
      await prisma.artistAvailability.deleteMany({
        where: {
          artistId: artistProfile.id,
          date: targetDate,
        },
      });
      return apiSuccess(null, "Date unblocked successfully.");
    }

    return apiError("Date or ID parameter required to unblock.", 400);
  } catch (error) {
    return handleApiError(error);
  }
}
