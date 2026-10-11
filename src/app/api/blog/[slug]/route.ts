import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    if (!slug) {
      return apiError("Article identifier is required.", 400);
    }

    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!post) {
      return apiError("Blog post not found.", 404);
    }

    // Increment views count non-blockingly
    prisma.blogPost
      .update({
        where: { id: post.id },
        data: { viewsCount: { increment: 1 } },
      })
      .catch((err) => console.error("Failed to increment views:", err));

    // Fetch 3 related posts
    const relatedPostsRaw = await prisma.blogPost.findMany({
      where: {
        id: { not: post.id },
        status: "PUBLISHED",
        ...(post.category ? { category: post.category } : {}),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        category: true,
        publishedAt: true,
      },
      take: 3,
    });

    return apiSuccess({
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImageUrl: post.coverImageUrl,
        category: post.category || "Bridal Editorial",
        tags: post.tags,
        viewsCount: post.viewsCount,
        publishedAt: post.publishedAt || post.createdAt,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        author: {
          id: post.author.id,
          name: post.author.name,
          avatarUrl: post.author.avatarUrl,
        },
      },
      relatedPosts: relatedPostsRaw,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
