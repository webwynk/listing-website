import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { packageSchema } from "@/lib/validations/artist";

export const dynamic = "force-dynamic";

/**
 * PUT /api/artist/packages/[id]
 * Updates an existing package owned by the authenticated artist
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const existingPackage = await prisma.package.findUnique({
      where: { id },
      select: { id: true, artistId: true },
    });

    if (!existingPackage) {
      return apiError("Package not found.", 404);
    }

    if (existingPackage.artistId !== artistProfile.id) {
      return apiError("Unauthorized to modify this package.", 403);
    }

    const body = await req.json();
    const validatedData = packageSchema.parse(body);

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        durationHours: validatedData.durationHours ?? null,
        includedServices: validatedData.includedServices,
        imageUrl: validatedData.imageUrl || null,
        isActive: validatedData.isActive ?? true,
        sortOrder: validatedData.sortOrder,
      },
    });

    return apiSuccess({
      package: updatedPackage,
      message: "Package updated successfully.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/artist/packages/[id]
 * Quick toggle active status for an existing package
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const existingPackage = await prisma.package.findUnique({
      where: { id },
      select: { id: true, artistId: true, isActive: true },
    });

    if (!existingPackage) {
      return apiError("Package not found.", 404);
    }

    if (existingPackage.artistId !== artistProfile.id) {
      return apiError("Unauthorized to modify this package.", 403);
    }

    const body = await req.json();
    const newStatus = typeof body.isActive === "boolean" ? body.isActive : !existingPackage.isActive;

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: { isActive: newStatus },
    });

    return apiSuccess({
      package: updatedPackage,
      message: `Package ${newStatus ? "activated" : "deactivated"} successfully.`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/artist/packages/[id]
 * Deletes a package owned by the authenticated artist
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    const existingPackage = await prisma.package.findUnique({
      where: { id },
      select: { id: true, artistId: true },
    });

    if (!existingPackage) {
      return apiError("Package not found.", 404);
    }

    if (existingPackage.artistId !== artistProfile.id) {
      return apiError("Unauthorized to delete this package.", 403);
    }

    await prisma.package.delete({
      where: { id },
    });

    return apiSuccess({
      message: "Package deleted successfully.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
