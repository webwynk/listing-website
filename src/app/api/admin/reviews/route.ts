import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";

export const dynamic = "force-dynamic";

interface RawReviewListItem {
  id: string;
  rating: number;
  comment: string | null;
  photos: any;
  isApproved: boolean;
  artistReply: string | null;
  artistReplyAt?: Date | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  artist: {
    id: string;
    businessName: string | null;
    user: {
      name: string;
    };
  };
}

/**
 * GET /api/admin/reviews
 * Paginated reviews moderation listing with status counts and rating filter
 */
export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(searchParams, 10);
    const statusParam = searchParams.get("status")?.toUpperCase();
    const ratingParam = searchParams.get("rating");
    const search = searchParams.get("search")?.trim();

    const where: any = {};

    if (statusParam === "PENDING") {
      where.isApproved = false;
    } else if (statusParam === "APPROVED") {
      where.isApproved = true;
    }

    if (ratingParam && !isNaN(Number(ratingParam))) {
      where.rating = Number(ratingParam);
    }

    if (search) {
      where.OR = [
        { comment: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        {
          artist: {
            OR: [
              { businessName: { contains: search, mode: "insensitive" } },
              { user: { name: { contains: search, mode: "insensitive" } } },
            ],
          },
        },
      ];
    }

    // Parallel data query and total count
    const [totalCount, reviews] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
          artist: {
            select: {
              id: true,
              businessName: true,
              user: {
                select: { name: true },
              },
            },
          },
        },
      }),
    ]);

    // Status tab counts & rating statistics in parallel
    const [countAll, countPending, countApproved, ratingStats] =
      await Promise.all([
        prisma.review.count(),
        prisma.review.count({ where: { isApproved: false } }),
        prisma.review.count({ where: { isApproved: true } }),
        prisma.review.aggregate({
          _avg: { rating: true },
        }),
      ]);

    const formattedReviews = (reviews as unknown as RawReviewListItem[]).map(
      (r: RawReviewListItem) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment || "",
        photos: Array.isArray(r.photos) ? r.photos : [],
        isApproved: r.isApproved,
        artistReply: r.artistReply,
        artistReplyAt: r.artistReplyAt ? r.artistReplyAt.toISOString() : null,
        createdAt: r.createdAt.toISOString(),
        clientName: r.user.name,
        clientEmail: r.user.email,
        clientAvatar: r.user.avatarUrl,
        artistId: r.artist.id,
        artistName: r.artist.businessName || r.artist.user.name,
      })
    );

    return apiSuccess({
      reviews: formattedReviews,
      counts: {
        all: countAll,
        pending: countPending,
        approved: countApproved,
        averageRating: ratingStats._avg.rating
          ? Math.round(ratingStats._avg.rating * 10) / 10
          : 5.0,
      },
      pagination: getPaginationMeta(totalCount, page, limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
