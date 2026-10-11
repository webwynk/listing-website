import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { artistServiceSchema } from "@/lib/validations/artist";

export const dynamic = "force-dynamic";

/**
 * PUT /api/artist/services/[id]
 * Updates an existing service owned by the authenticated artist
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const existing = await prisma.artistService.findUnique({
      where: { id },
      select: { id: true, artistId: true },
    });

    if (!existing) {
      return apiError("Service not found.", 404);
    }

    if (existing.artistId !== artistProfile.id) {
      return apiError("Forbidden: You do not own this service.", 403);
    }

    const body = await req.json();
    const validatedData = artistServiceSchema.parse(body);

    const updatedService = await prisma.artistService.update({
      where: { id },
      data: {
        categoryId: validatedData.categoryId,
        subCategoryId: validatedData.subCategoryId || null,
        priceType: validatedData.priceType,
        priceFrom: validatedData.priceFrom,
        priceTo: validatedData.priceTo || null,
        durationMinutes: validatedData.durationMinutes || null,
        description: validatedData.description || null,
        isActive: validatedData.isActive,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        subCategory: { select: { id: true, name: true, slug: true } },
      },
    });

    return apiSuccess(updatedService, "Service updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/artist/services/[id]
 * Deletes a service owned by the authenticated artist
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const existing = await prisma.artistService.findUnique({
      where: { id },
      select: { id: true, artistId: true },
    });

    if (!existing) {
      return apiError("Service not found.", 404);
    }

    if (existing.artistId !== artistProfile.id) {
      return apiError("Forbidden: You do not own this service.", 403);
    }

    await prisma.artistService.delete({
      where: { id },
    });

    return apiSuccess(null, "Service deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/artist/services/[id]
 * Quickly toggles active status of a service
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
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const existing = await prisma.artistService.findUnique({
      where: { id },
      select: { id: true, artistId: true },
    });

    if (!existing || existing.artistId !== artistProfile.id) {
      return apiError("Service not found or unauthorized.", 404);
    }

    const body = await req.json();
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      return apiError("Invalid isActive boolean value.", 400);
    }

    await prisma.artistService.update({
      where: { id },
      data: { isActive },
    });

    return apiSuccess(null, `Service is now ${isActive ? "active" : "inactive"}.`);
  } catch (error) {
    return handleApiError(error);
  }
}
