import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ArtistProfileClient } from "./client";
import {
  CURATED_FEATURED_ARTISTS,
  getCuratedArtistProfile,
} from "@/lib/data/curated-artists";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const artist = await prisma.artistProfile.findFirst({
      where: {
        OR: [{ user: { username: slug } }, { id: slug }],
        status: "APPROVED",
      },
      include: {
        user: { select: { name: true, locationCity: true } },
        services: { select: { category: { select: { name: true } } }, take: 1 },
      },
    });

    if (artist) {
      const title = `${artist.businessName || artist.user.name} — ${artist.services[0]?.category?.name || "Bridal Artist"} in ${artist.user.locationCity || "India"}`;
      const desc = artist.bio || `View verified portfolio, reviews, services, and check calendar availability for ${artist.businessName || artist.user.name} on GlamBook.`;

      return {
        title: `${title} | GlamBook`,
        description: desc,
        openGraph: {
          title,
          description: desc,
          type: "profile",
        },
      };
    }
  } catch (err) {
    console.error("Error generating metadata:", err);
  }

  // Fallback to curated showcase artist metadata
  const curated = CURATED_FEATURED_ARTISTS.find(
    (c) => c.slug === slug || c.id === slug
  );
  if (curated) {
    const title = `${curated.businessName || curated.name} — ${curated.categoryName || "Bridal Artist"} in ${curated.city || "India"}`;
    const desc = `View verified portfolio, reviews, services, and check calendar availability for ${curated.businessName || curated.name} on GlamBook.`;

    return {
      title: `${title} | GlamBook`,
      description: desc,
      openGraph: {
        title,
        description: desc,
        type: "profile",
      },
    };
  }

  return {
    title: "Bridal Artist Profile | GlamBook",
    description: "Explore verified portfolios, services, and availability on GlamBook.",
  };
}

export default async function ArtistProfilePage({ params }: PageProps) {
  const { slug } = await params;

  let artistData: any = null;

  try {
    const dbArtist = await prisma.artistProfile.findFirst({
      where: {
        OR: [{ user: { username: slug } }, { id: slug }],
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

    if (dbArtist) {
      // Calculate ratings breakdown
      const ratingsBreakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      dbArtist.reviews.forEach((r: { rating: number }) => {
        const star = Math.min(5, Math.max(1, r.rating));
        ratingsBreakdown[star] = (ratingsBreakdown[star] || 0) + 1;
      });

      const lowestPrice =
        dbArtist.services.length > 0
          ? dbArtist.services.reduce(
              (min: number, s: { priceFrom: number }) => (s.priceFrom < min ? s.priceFrom : min),
              dbArtist.services[0].priceFrom
            )
          : 0;

      // Query similar artists
      const similar = await prisma.artistProfile.findMany({
        where: {
          id: { not: dbArtist.id },
          status: "APPROVED",
        },
        include: {
          user: { select: { name: true, username: true, avatarUrl: true, locationCity: true } },
          services: { where: { isActive: true }, include: { category: true }, take: 1 },
          portfolioItems: { select: { mediaUrl: true }, take: 1 },
        },
        take: 3,
      });

      artistData = {
        id: dbArtist.id,
        userId: dbArtist.userId,
        slug: dbArtist.user.username || dbArtist.id,
        name: dbArtist.user.name,
        businessName: dbArtist.businessName || dbArtist.user.name,
        bio: dbArtist.bio,
        avatarUrl: dbArtist.user.avatarUrl,
        coverImage: dbArtist.portfolioItems[0]?.mediaUrl || dbArtist.user.avatarUrl,
        categoryName: dbArtist.services[0]?.category?.name || "Bridal Artist",
        city: dbArtist.user.locationCity || "Mumbai",
        state: dbArtist.user.locationState || "Maharashtra",
        experienceYears: dbArtist.experienceYears,
        serviceRadiusKm: dbArtist.serviceRadiusKm,
        avgRating: dbArtist.avgRating || 5.0,
        totalReviews: dbArtist.totalReviews || 0,
        isFeatured: dbArtist.isFeatured,
        startingPrice: lowestPrice,
        ratingsBreakdown,
        services: dbArtist.services,
        portfolioItems: dbArtist.portfolioItems,
        packages: dbArtist.packages,
        reviews: dbArtist.reviews,
        availability: dbArtist.availability,
        similarArtists: similar.map((s: any) => ({
          id: s.id,
          userId: s.userId,
          slug: s.user.username || s.id,
          name: s.user.name,
          businessName: s.businessName || s.user.name,
          avatarUrl: s.user.avatarUrl,
          coverImage: s.portfolioItems[0]?.mediaUrl || s.user.avatarUrl,
          categoryName: s.services[0]?.category?.name || "Bridal Artist",
          city: s.user.locationCity || "Mumbai",
          startingPrice: s.services[0]?.priceFrom || 0,
          avgRating: s.avgRating || 5.0,
          totalReviews: s.totalReviews || 0,
          isFeatured: s.isFeatured,
          yearsOfExperience: s.experienceYears,
        })),
      };
    }
  } catch (err) {
    console.error("Error loading artist profile:", err);
  }

  // Fallback to curated mock if not found in db yet
  if (!artistData) {
    artistData = getCuratedArtistProfile(slug);
  }

  return <ArtistProfileClient artist={artistData} />;
}
