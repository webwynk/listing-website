import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { createSubCategorySchema } from "@/lib/validations/category";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/admin/categories/[id]/sub-categories
 * Adds a new sub-category to the designated parent category
 */
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id: categoryId } = await params;

    // Verify parent category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return apiError("Parent category not found", 404);
    }

    const body = await req.json();
    const validatedData = createSubCategorySchema.parse(body);

    // Check slug collision
    const existingSlug = await prisma.subCategory.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingSlug) {
      return apiError(`A sub-category with slug '${validatedData.slug}' already exists.`, 409);
    }

    const subCategory = await prisma.subCategory.create({
      data: {
        categoryId,
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description || null,
        sortOrder: validatedData.sortOrder,
        isActive: validatedData.isActive,
      },
    });

    return apiSuccess(subCategory, "Sub-category created successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
