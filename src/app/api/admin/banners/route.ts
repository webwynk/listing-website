import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { bannerSchema } from "@/lib/validations/content";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/banners
 * Returns list of promotional banners filtered by position with counts
 */
export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const position = searchParams.get("position")?.toUpperCase();

    const where: Prisma.BannerWhereInput = {};
    if (position && ["HOME_HERO", "HOME_MIDDLE", "FIND_ARTIST_TOP"].includes(position)) {
      where.position = position as any;
    }

    const [banners, heroCount, middleCount, findArtistCount, totalCount] =
      await Promise.all([
        prisma.banner.findMany({
          where,
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        }),
        prisma.banner.count({ where: { position: "HOME_HERO" } }),
        prisma.banner.count({ where: { position: "HOME_MIDDLE" } }),
        prisma.banner.count({ where: { position: "FIND_ARTIST_TOP" } }),
        prisma.banner.count(),
      ]);

    return apiSuccess({
      banners,
      counts: {
        all: totalCount,
        homeHero: heroCount,
        homeMiddle: middleCount,
        findArtistTop: findArtistCount,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/banners
 * Creates a new promotional banner
 */
export async function POST(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validatedData = bannerSchema.parse(body);

    const banner = await prisma.banner.create({
      data: {
        title: validatedData.title || null,
        subtitle: validatedData.subtitle || null,
        imageUrl: validatedData.imageUrl,
        linkUrl: validatedData.linkUrl || null,
        position: validatedData.position,
        sortOrder: validatedData.sortOrder,
        isActive: validatedData.isActive,
        startsAt: validatedData.startsAt ? new Date(validatedData.startsAt) : null,
        endsAt: validatedData.endsAt ? new Date(validatedData.endsAt) : null,
      },
    });

    return apiSuccess(banner, "Banner created successfully.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
