import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { testimonialSchema } from "@/lib/validations/content";
import { StoredTestimonial } from "../route";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/admin/testimonials/[id]
 * Updates testimonial in site_settings
 */
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const key = `testimonial_${id}`;

    const existing = await prisma.siteSetting.findUnique({
      where: { key },
    });

    if (!existing) {
      return apiError("Testimonial not found.", 404);
    }

    const body = await req.json();
    const validatedData = testimonialSchema.parse(body);

    let prevData: Partial<StoredTestimonial> = {};
    try {
      prevData = JSON.parse(existing.value);
    } catch {
      // ignore
    }

    const updatedData: StoredTestimonial = {
      id,
      ...validatedData,
      createdAt: prevData.createdAt || new Date().toISOString(),
    };

    await prisma.siteSetting.update({
      where: { key },
      data: {
        value: JSON.stringify(updatedData),
      },
    });

    return apiSuccess(updatedData, "Testimonial updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/testimonials/[id]
 * Deletes testimonial from site_settings
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const key = `testimonial_${id}`;

    const existing = await prisma.siteSetting.findUnique({
      where: { key },
    });

    if (!existing) {
      return apiError("Testimonial not found.", 404);
    }

    await prisma.siteSetting.delete({
      where: { key },
    });

    return apiSuccess(null, "Testimonial deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
