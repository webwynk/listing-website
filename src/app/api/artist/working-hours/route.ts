import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

const workingHoursSchema = z.object({
  workingHours: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        isWorking: z.boolean(),
        startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
        endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
      })
    )
    .length(7, "Must provide schedule for all 7 days of the week"),
});

const DEFAULT_SCHEDULE = [
  { dayOfWeek: 0, isWorking: false, startTime: "09:00", endTime: "19:00" }, // Sunday
  { dayOfWeek: 1, isWorking: true, startTime: "09:00", endTime: "19:00" },  // Monday
  { dayOfWeek: 2, isWorking: true, startTime: "09:00", endTime: "19:00" },  // Tuesday
  { dayOfWeek: 3, isWorking: true, startTime: "09:00", endTime: "19:00" },  // Wednesday
  { dayOfWeek: 4, isWorking: true, startTime: "09:00", endTime: "19:00" },  // Thursday
  { dayOfWeek: 5, isWorking: true, startTime: "09:00", endTime: "19:00" },  // Friday
  { dayOfWeek: 6, isWorking: true, startTime: "09:00", endTime: "19:00" },  // Saturday
];

/**
 * GET /api/artist/working-hours
 * Returns regular 7-day schedule for the authenticated artist
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

    const hours = await prisma.artistWorkingHours.findMany({
      where: { artistId: artistProfile.id },
      orderBy: { dayOfWeek: "asc" },
    });

    return apiSuccess({
      workingHours: hours.length === 7 ? hours : DEFAULT_SCHEDULE,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/artist/working-hours
 * Bulk upserts 7-day schedule for the authenticated artist
 */
export async function PUT(req: Request) {
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
    const validatedData = workingHoursSchema.parse(body);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const item of validatedData.workingHours) {
        await tx.artistWorkingHours.upsert({
          where: {
            artistId_dayOfWeek: {
              artistId: artistProfile.id,
              dayOfWeek: item.dayOfWeek,
            },
          },
          update: {
            isWorking: item.isWorking,
            startTime: item.startTime,
            endTime: item.endTime,
          },
          create: {
            artistId: artistProfile.id,
            dayOfWeek: item.dayOfWeek,
            isWorking: item.isWorking,
            startTime: item.startTime,
            endTime: item.endTime,
          },
        });
      }
    });

    return apiSuccess(null, "Weekly operating schedule updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
