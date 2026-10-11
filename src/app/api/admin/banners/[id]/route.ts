import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { bannerSchema } from "@/lib/validations/content";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/banners/[id]
 * Fetch single banner details
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return apiError("Banner not found.", 404);
    }

    return apiSuccess(banner);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/admin/banners/[id]
 * Updates promotional banner details
 */
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const existing = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiError("Banner not found.", 404);
    }

    const body = await req.json();
    const validatedData = bannerSchema.parse(body);

    const updated = await prisma.banner.update({
      where: { id },
      data: {
        title: validatedData.title || null,
        subtitle: validatedData.subtitle || null,
        imageUrl: validatedData.imageUrl,
        linkUrl: validatedData.linkUrl || null,
        position: validatedData.position,
        sortOrder: validatedData.sortOrder,
        isActive: validatedData.isActive,
        startsAt: validatedData.startsAt ? new Date(validatedData.startsAt) : null,
        endsAt: validatedData.endsAt ? new Date(validatedData.endsAt) : null,
      },
    });

    return apiSuccess(updated, "Banner updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/banners/[id]
 * Removes banner permanently
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const existing = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiError("Banner not found.", 404);
    }

    await prisma.banner.delete({
      where: { id },
    });

    return apiSuccess(null, "Banner deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
