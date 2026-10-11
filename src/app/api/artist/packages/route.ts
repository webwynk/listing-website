import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { packageSchema } from "@/lib/validations/artist";

export const dynamic = "force-dynamic";

/**
 * GET /api/artist/packages
 * Returns all bundled packages configured by the authenticated artist
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

    const packages = await prisma.package.findMany({
      where: { artistId: artistProfile.id },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return apiSuccess({
      packages,
      totalCount: packages.length,
      activeCount: packages.filter((p) => p.isActive).length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/artist/packages
 * Creates a new bundled package for the authenticated artist
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
    const validatedData = packageSchema.parse(body);

    // If sortOrder is 0 or default, determine next order index
    let sortOrder = validatedData.sortOrder;
    if (!sortOrder) {
      const existingCount = await prisma.package.count({
        where: { artistId: artistProfile.id },
      });
      sortOrder = existingCount;
    }

    const createdPackage = await prisma.package.create({
      data: {
        artistId: artistProfile.id,
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        durationHours: validatedData.durationHours ?? null,
        includedServices: validatedData.includedServices,
        imageUrl: validatedData.imageUrl || null,
        isActive: validatedData.isActive ?? true,
        sortOrder,
      },
    });

    return apiSuccess(
      { package: createdPackage },
      "Package created successfully.",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
