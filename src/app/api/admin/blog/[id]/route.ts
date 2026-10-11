import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { blogPostSchema } from "@/lib/validations/blog";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/blog/[id]
 * Fetch single blog post by ID
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!post) {
      return apiError("Blog post not found.", 404);
    }

    return apiSuccess(post);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/admin/blog/[id]
 * Updates blog post
 */
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiError("Blog post not found.", 404);
    }

    const body = await req.json();
    const validatedData = blogPostSchema.parse(body);

    // Check slug collision if slug changed
    if (validatedData.slug !== existing.slug) {
      const collision = await prisma.blogPost.findUnique({
        where: { slug: validatedData.slug },
      });
      if (collision) {
        return apiError(
          "Another blog post with this slug already exists.",
          409
        );
      }
    }

    // Determine publishedAt timestamp
    let publishedAt = existing.publishedAt;
    if (validatedData.status === "PUBLISHED" && !existing.publishedAt) {
      publishedAt = new Date();
    } else if (validatedData.status === "DRAFT") {
      // keep or reset publishedAt based on business logic, keeping previous date or null
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt || null,
        content: validatedData.content,
        coverImageUrl: validatedData.coverImageUrl || null,
        category: validatedData.category || null,
        tags: validatedData.tags ? (validatedData.tags as any) : null,
        status: validatedData.status,
        metaTitle: validatedData.metaTitle || null,
        metaDescription: validatedData.metaDescription || null,
        publishedAt,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return apiSuccess(updated, "Blog post updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/blog/[id]
 * Permanently delete blog post
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiError("Blog post not found.", 404);
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return apiSuccess(null, "Blog post deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
