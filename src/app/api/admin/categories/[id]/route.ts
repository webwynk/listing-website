import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { updateCategorySchema } from "@/lib/validations/category";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/categories/[id]
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: {
          orderBy: { sortOrder: "asc" },
          include: {
            _count: {
              select: { artistServices: true },
            },
          },
        },
        _count: {
          select: {
            artistServices: true,
            portfolioItems: true,
          },
        },
      },
    });

    if (!category) {
      return apiError("Category not found", 404);
    }

    return apiSuccess(category);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/admin/categories/[id]
 */
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();
    const validatedData = updateCategorySchema.parse(body);

    // Verify existence
    const existing = await prisma.category.findUnique({
      where: { id },
    });
    if (!existing) {
      return apiError("Category not found", 404);
    }

    // Check slug collision if slug changed
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const slugClash = await prisma.category.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugClash) {
        return apiError(`A category with slug '${validatedData.slug}' already exists.`, 409);
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.slug !== undefined && { slug: validatedData.slug }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.iconUrl !== undefined && { iconUrl: validatedData.iconUrl }),
        ...(validatedData.imageUrl !== undefined && { imageUrl: validatedData.imageUrl }),
        ...(validatedData.sortOrder !== undefined && { sortOrder: validatedData.sortOrder }),
        ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
      },
    });

    return apiSuccess(updated, "Category updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/categories/[id]
 * Guard: Deletion is blocked if any active artist services belong to this category
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    const existing = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            artistServices: true,
            portfolioItems: true,
          },
        },
      },
    });

    if (!existing) {
      return apiError("Category not found", 404);
    }

    // Foreign key safety guard
    if (existing._count.artistServices > 0) {
      return apiError(
        `Cannot delete category '${existing.name}': It is linked to ${existing._count.artistServices} active artist services. Please reassign or delete these services first.`,
        400
      );
    }

    // Delete category (cascades to sub-categories per Prisma schema)
    await prisma.category.delete({
      where: { id },
    });

    return apiSuccess({ deletedId: id }, "Category deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
