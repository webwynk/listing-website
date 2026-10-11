import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { updateSubCategorySchema } from "@/lib/validations/category";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/admin/sub-categories/[id]
 * Updates a sub-category's attributes
 */
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();
    const validatedData = updateSubCategorySchema.parse(body);

    const existing = await prisma.subCategory.findUnique({
      where: { id },
    });
    if (!existing) {
      return apiError("Sub-category not found", 404);
    }

    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const slugClash = await prisma.subCategory.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugClash) {
        return apiError(`A sub-category with slug '${validatedData.slug}' already exists.`, 409);
      }
    }

    const updated = await prisma.subCategory.update({
      where: { id },
      data: {
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.slug !== undefined && { slug: validatedData.slug }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.sortOrder !== undefined && { sortOrder: validatedData.sortOrder }),
        ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
      },
    });

    return apiSuccess(updated, "Sub-category updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/sub-categories/[id]
 * Deletion is blocked if any active artist services use this sub-category
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    const existing = await prisma.subCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { artistServices: true },
        },
      },
    });

    if (!existing) {
      return apiError("Sub-category not found", 404);
    }

    if (existing._count.artistServices > 0) {
      return apiError(
        `Cannot delete sub-category '${existing.name}': It is linked to ${existing._count.artistServices} active artist services. Please reassign or remove these services first.`,
        400
      );
    }

    await prisma.subCategory.delete({
      where: { id },
    });

    return apiSuccess({ deletedId: id }, "Sub-category deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
