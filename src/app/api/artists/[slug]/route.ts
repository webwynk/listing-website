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
      return apiError("Artist identifier is required.", 400);
    }

    // Find artist profile by username or artistProfile id
    const artist = await prisma.artistProfile.findFirst({
      where: {
        OR: [
          { user: { username: slug } },
          { id: slug },
        ],
        status: "APPROVED",
      },
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
          orderBy: { priceFrom: "asc" },
        },
        portfolioItems: {
          select: {
            id: true,
            mediaUrl: true,
            thumbnailUrl: true,
            title: true,
            description: true,
            mediaType: true,
            categoryId: true,
            sortOrder: true,
          },
          orderBy: { sortOrder: "asc" },
        },
        packages: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
        reviews: {
          where: { isApproved: true },
          select: {
            id: true,
            rating: true,
            comment: true,
            photos: true,
            artistReply: true,
            artistReplyAt: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            booking: {
              select: {
                eventType: true,
                bookingDate: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        availability: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
          select: {
            id: true,
            date: true,
            status: true,
            startTime: true,
            endTime: true,
            note: true,
          },
          orderBy: { date: "asc" },
          take: 90,
        },
      },
    });

    if (!artist) {
      return apiError("Artist not found or profile is not active.", 404);
    }

    // Increment profile views non-blockingly
    prisma.artistProfile
      .update({
        where: { id: artist.id },
        data: { profileViews: { increment: 1 } },
      })
      .catch((err) => console.error("Failed to increment views:", err));

    // Calculate rating breakdown
    const ratingsBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    artist.reviews.forEach((r: { rating: number }) => {
      const star = Math.min(5, Math.max(1, r.rating)) as 1 | 2 | 3 | 4 | 5;
      ratingsBreakdown[star] = (ratingsBreakdown[star] || 0) + 1;
    });

    const lowestPrice =
      artist.services && artist.services.length > 0
        ? artist.services.reduce((min: number, s: { priceFrom: number }) => {
            return s.priceFrom < min ? s.priceFrom : min;
          }, artist.services[0].priceFrom)
        : 0;

    const primaryCategory = artist.services[0]?.category?.name || "Bridal Artist";

    // Query 3 similar recommended artists in the same city or category
    const similarArtistsRaw = await prisma.artistProfile.findMany({
      where: {
        id: { not: artist.id },
        status: "APPROVED",
        OR: [
          { user: { locationCity: artist.user.locationCity || undefined } },
          {
            services: {
              some: {
                categoryId: artist.services[0]?.categoryId || undefined,
              },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            avatarUrl: true,
            locationCity: true,
          },
        },
        services: {
          where: { isActive: true },
          include: { category: true },
          take: 2,
        },
        portfolioItems: {
          select: { mediaUrl: true },
          take: 1,
        },
      },
      take: 3,
    });

    const similarArtists = similarArtistsRaw.map((sim: any) => ({
      id: sim.id,
      userId: sim.userId,
      slug: sim.user.username || sim.id,
      name: sim.user.name,
      businessName: sim.businessName || sim.user.name,
      avatarUrl: sim.user.avatarUrl,
      coverImage: sim.portfolioItems[0]?.mediaUrl || sim.user.avatarUrl,
      categoryName: sim.services[0]?.category?.name || "Bridal Artist",
      city: sim.user.locationCity || "Mumbai",
      startingPrice: sim.services[0]?.priceFrom || 0,
      avgRating: sim.avgRating || 5.0,
      totalReviews: sim.totalReviews || 0,
      isFeatured: sim.isFeatured,
      yearsOfExperience: sim.experienceYears,
    }));

    const responseData = {
      id: artist.id,
      userId: artist.userId,
      slug: artist.user.username || artist.id,
      name: artist.user.name,
      businessName: artist.businessName || artist.user.name,
      bio: artist.bio,
      avatarUrl: artist.user.avatarUrl,
      coverImage: artist.portfolioItems[0]?.mediaUrl || artist.user.avatarUrl,
      categoryName: primaryCategory,
      city: artist.user.locationCity || "Mumbai",
      state: artist.user.locationState || "Maharashtra",
      experienceYears: artist.experienceYears,
      serviceRadiusKm: artist.serviceRadiusKm,
      avgRating: artist.avgRating || 5.0,
      totalReviews: artist.totalReviews || 0,
      isFeatured: artist.isFeatured,
      startingPrice: lowestPrice,
      ratingsBreakdown,
      services: artist.services,
      portfolioItems: artist.portfolioItems,
      packages: artist.packages,
      reviews: artist.reviews,
      availability: artist.availability,
      similarArtists,
    };

    return apiSuccess(responseData, "Artist profile loaded successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
