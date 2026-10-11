import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category")?.trim();
    const search = searchParams.get("search")?.trim();

    const { page, limit, skip, take } = getPaginationParams(searchParams, 9, 30);

    const where: any = {
      status: "PUBLISHED",
    };

    if (category) {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take,
      }),
    ]);

    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImageUrl: post.coverImageUrl,
      category: post.category || "Bridal Editorial",
      tags: post.tags,
      viewsCount: post.viewsCount,
      publishedAt: post.publishedAt || post.createdAt,
      author: {
        name: post.author.name,
        avatarUrl: post.author.avatarUrl,
      },
    }));

    const pagination = getPaginationMeta(total, page, limit);

    return apiSuccess({ posts: formattedPosts }, "Blog posts retrieved.", 200, pagination);
  } catch (error) {
    return handleApiError(error);
  }
}
