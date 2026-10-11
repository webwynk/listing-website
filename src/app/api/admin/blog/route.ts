import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";
import { blogPostSchema } from "@/lib/validations/blog";

export const dynamic = "force-dynamic";

interface RawBlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  category: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  viewsCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

/**
 * GET /api/admin/blog
 * Paginated blog posts listing with search and status tab counters
 */
export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(searchParams, 10);
    const statusParam = searchParams.get("status")?.toUpperCase();
    const search = searchParams.get("search")?.trim();

    const where: any = {};

    if (
      statusParam &&
      ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(statusParam)
    ) {
      where.status = statusParam as any;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    // Execute data query and count concurrently
    const [totalCount, posts] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImageUrl: true,
          category: true,
          status: true,
          viewsCount: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      }),
    ]);

    // Status tab counts in parallel
    const [countAll, countPublished, countDraft, countArchived] =
      await Promise.all([
        prisma.blogPost.count(),
        prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
        prisma.blogPost.count({ where: { status: "DRAFT" } }),
        prisma.blogPost.count({ where: { status: "ARCHIVED" } }),
      ]);

    const formattedPosts = (posts as RawBlogPostListItem[]).map(
      (p: RawBlogPostListItem) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        coverImageUrl: p.coverImageUrl,
        category: p.category,
        status: p.status,
        viewsCount: p.viewsCount,
        publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        author: p.author,
      })
    );

    return apiSuccess({
      posts: formattedPosts,
      counts: {
        all: countAll,
        published: countPublished,
        draft: countDraft,
        archived: countArchived,
      },
      pagination: getPaginationMeta(totalCount, page, limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/blog
 * Create a new blog post
 */
export async function POST(req: Request) {
  try {
    const { user, errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validatedData = blogPostSchema.parse(body);

    // Verify slug uniqueness
    const existing = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return apiError(
        "A blog post with this slug already exists. Please choose a different slug.",
        409
      );
    }

    const isPublished = validatedData.status === "PUBLISHED";

    const post = await prisma.blogPost.create({
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
        authorId: user.id,
        publishedAt: isPublished ? new Date() : null,
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

    return apiSuccess(post, "Blog post created successfully.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
