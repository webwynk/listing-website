import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/admin/blog/[id]/publish
 * Quick toggle status between DRAFT and PUBLISHED
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return apiError("Blog post not found.", 404);
    }

    const nextStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const publishedAt =
      nextStatus === "PUBLISHED" ? post.publishedAt || new Date() : post.publishedAt;

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        status: nextStatus,
        publishedAt,
      },
    });

    return apiSuccess(
      updated,
      `Post successfully marked as ${nextStatus.toLowerCase()}.`
    );
  } catch (error) {
    return handleApiError(error);
  }
}
