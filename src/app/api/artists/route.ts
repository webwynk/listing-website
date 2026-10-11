import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim() || "";
    const city = searchParams.get("city")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const subCategory = searchParams.get("subCategory")?.trim() || "";
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const minRating = searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : undefined;
    const experience = searchParams.get("experience")?.trim() || "";
    const dateStr = searchParams.get("date")?.trim() || "";
    const sortBy = searchParams.get("sortBy")?.trim() || "relevance";

    const { page, limit, skip, take } = getPaginationParams(searchParams, 12, 50);

    // Build Prisma query filter
    const where: any = {
      status: "APPROVED",
    };

    // Keyword search: artist name, business name, or bio
    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    // City / Location filter
    if (city) {
      where.user = {
        ...(where.user || {}),
        locationCity: { contains: city, mode: "insensitive" },
      };
    }

    // Minimum rating filter
    if (minRating && !isNaN(minRating)) {
      where.avgRating = { gte: minRating };
    }

    // Experience years filter
    if (experience) {
      if (experience === "1-3") {
        where.experienceYears = { gte: 1, lte: 3 };
      } else if (experience === "3-5") {
        where.experienceYears = { gte: 3, lte: 5 };
      } else if (experience === "5-10") {
        where.experienceYears = { gte: 5, lte: 10 };
      } else if (experience === "10+") {
        where.experienceYears = { gte: 10 };
      }
    }

    // Service, category, and price range filters
    const serviceFilter: any = {
      isActive: true,
    };

    if (category) {
      serviceFilter.category = {
        OR: [
          { slug: { equals: category, mode: "insensitive" } },
          { name: { contains: category, mode: "insensitive" } },
        ],
      };
    }

    if (subCategory) {
      serviceFilter.subCategory = {
        OR: [
          { slug: { equals: subCategory, mode: "insensitive" } },
          { name: { contains: subCategory, mode: "insensitive" } },
        ],
      };
    }

    if (minPrice !== undefined && !isNaN(minPrice)) {
      serviceFilter.priceFrom = { ...(serviceFilter.priceFrom || {}), gte: minPrice };
    }

    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      serviceFilter.priceFrom = { ...(serviceFilter.priceFrom || {}), lte: maxPrice };
    }

    // Attach service filter if any service criterion is specified
    if (category || subCategory || minPrice !== undefined || maxPrice !== undefined) {
      where.services = {
        some: serviceFilter,
      };
    }

    // Date availability check: artist must not have a BLOCKED or BOOKED entry on this date
    if (dateStr) {
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        const startOfDay = new Date(parsedDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(parsedDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        where.availability = {
          none: {
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
            status: {
              in: ["BLOCKED", "BOOKED"],
            },
          },
        };
      }
    }

    // Build orderBy
    let orderBy: any[] = [];
    switch (sortBy) {
      case "rating_desc":
        orderBy = [{ avgRating: "desc" }, { totalReviews: "desc" }];
        break;
      case "experience_desc":
        orderBy = [{ experienceYears: "desc" }];
        break;
      case "newest":
        orderBy = [{ createdAt: "desc" }];
        break;
      case "price_asc":
      case "price_desc":
        // Secondary sort on rating, price ordering happens during aggregation
        orderBy = [{ avgRating: "desc" }];
        break;
      case "relevance":
      default:
        orderBy = [{ isFeatured: "desc" }, { avgRating: "desc" }, { totalReviews: "desc" }];
        break;
    }

    const [total, artists] = await Promise.all([
      prisma.artistProfile.count({ where }),
      prisma.artistProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
              locationCity: true,
              locationState: true,
            },
          },
          services: {
            where: { isActive: true },
            include: {
              category: { select: { id: true, name: true, slug: true } },
              subCategory: { select: { id: true, name: true, slug: true } },
            },
            take: 5,
          },
          portfolioItems: {
            select: {
              id: true,
              mediaUrl: true,
              thumbnailUrl: true,
              title: true,
              sortOrder: true,
            },
            orderBy: { sortOrder: "asc" },
            take: 4,
          },
        },
        orderBy,
        skip,
        take,
      }),
    ]);

    interface PublicArtistListItem {
      id: string;
      userId: string;
      slug: string;
      name: string;
      businessName: string;
      avatarUrl: string | null;
      coverImage: string | null;
      categoryName: string;
      city: string;
      state: string;
      startingPrice: number;
      avgRating: number;
      totalReviews: number;
      isFeatured: boolean;
      yearsOfExperience: number;
      portfolioCount: number;
      services: Array<{
        id: string;
        categoryName?: string;
        priceFrom: number;
        priceTo?: number | null;
        priceType: string;
      }>;
    }

    // Transform artists to consistent public format
    const items: PublicArtistListItem[] = artists.map((a: any): PublicArtistListItem => {
      const lowestPrice =
        a.services && a.services.length > 0
          ? a.services.reduce((min: number, s: { priceFrom: number }) => {
              return s.priceFrom < min ? s.priceFrom : min;
            }, a.services[0].priceFrom)
          : 0;

      const primaryCategory = a.services[0]?.category?.name || "Bridal Artist";

      return {
        id: a.id,
        userId: a.userId,
        slug: a.user.username || a.id,
        name: a.user.name,
        businessName: a.businessName || a.user.name,
        avatarUrl: a.user.avatarUrl,
        coverImage: a.portfolioItems[0]?.mediaUrl || a.user.avatarUrl,
        categoryName: primaryCategory,
        city: a.user.locationCity || "Mumbai",
        state: a.user.locationState || "Maharashtra",
        startingPrice: lowestPrice,
        avgRating: a.avgRating || 5.0,
        totalReviews: a.totalReviews || 0,
        isFeatured: a.isFeatured,
        yearsOfExperience: a.experienceYears,
        portfolioCount: a.portfolioItems.length,
        services: a.services.map((s: any) => ({
          id: s.id,
          categoryName: s.category?.name,
          priceFrom: s.priceFrom,
          priceTo: s.priceTo,
          priceType: s.priceType,
        })),
      };
    });

    // In-memory sort for price if requested
    if (sortBy === "price_asc") {
      items.sort((x: PublicArtistListItem, y: PublicArtistListItem) => (x.startingPrice || 0) - (y.startingPrice || 0));
    } else if (sortBy === "price_desc") {
      items.sort((x: PublicArtistListItem, y: PublicArtistListItem) => (y.startingPrice || 0) - (x.startingPrice || 0));
    }

    const pagination = getPaginationMeta(total, page, limit);

    return apiSuccess(
      {
        artists: items,
      },
      "Artists retrieved successfully.",
      200,
      pagination
    );
  } catch (error) {
    return handleApiError(error);
  }
}
