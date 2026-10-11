import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { createCategorySchema } from "@/lib/validations/category";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/categories
 * Returns all categories with subcategory and artist counts
 */
export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            subCategories: true,
            artistServices: true,
          },
        },
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return apiSuccess(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/categories
 * Creates a new category with unique slug verification
 */
export async function POST(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validatedData = createCategorySchema.parse(body);

    // Check slug collision
    const existingSlug = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingSlug) {
      return apiError(`A category with slug '${validatedData.slug}' already exists.`, 409);
    }

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description || null,
        iconUrl: validatedData.iconUrl || null,
        imageUrl: validatedData.imageUrl || null,
        sortOrder: validatedData.sortOrder,
        isActive: validatedData.isActive,
      },
    });

    return apiSuccess(category, "Category created successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
