import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const notesSchema = z.object({
  notes: z.string().max(2000, "Notes cannot exceed 2000 characters"),
});

/**
 * PATCH /api/admin/bookings/[id]/notes
 * Saves internal administrator notes on a booking lead
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();
    const { notes } = notesSchema.parse(body);

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return apiError("Booking record not found.", 404);
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { adminNotes: notes },
      select: {
        id: true,
        bookingNumber: true,
        adminNotes: true,
      },
    });

    return apiSuccess(updated, "Admin notes saved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
