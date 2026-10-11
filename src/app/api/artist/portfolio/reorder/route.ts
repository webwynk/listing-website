import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      sortOrder: z.number().int().min(0),
    })
  ).min(1, "At least one item required for reordering"),
});

/**
 * PUT /api/artist/portfolio/reorder
 * Reorders portfolio items for the authenticated artist
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
    const validatedData = reorderSchema.parse(body);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const item of validatedData.items) {
        await tx.portfolioItem.updateMany({
          where: {
            id: item.id,
            artistId: artistProfile.id,
          },
          data: {
            sortOrder: item.sortOrder,
          },
        });
      }
    });

    return apiSuccess(null, "Portfolio sequence updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
