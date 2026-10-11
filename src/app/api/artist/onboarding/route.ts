import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireArtist } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { fullOnboardingSchema } from "@/lib/validations/onboarding";

export const dynamic = "force-dynamic";

/**
 * GET /api/artist/onboarding
 * Preloads existing artist profile draft, services, portfolio, hours, and available categories
 */
export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    // Fetch or ensure artist profile exists
    let artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
      include: {
        services: {
          include: {
            category: { select: { id: true, name: true } },
            subCategory: { select: { id: true, name: true } },
          },
        },
        portfolioItems: {
          orderBy: { sortOrder: "asc" },
        },
        workingHours: {
          orderBy: { dayOfWeek: "asc" },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            locationCity: true,
            locationState: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!artistProfile) {
      artistProfile = await prisma.artistProfile.create({
        data: {
          userId: user.id,
          businessName: user.name,
          status: "PENDING",
        },
        include: {
          services: {
            include: {
              category: { select: { id: true, name: true } },
              subCategory: { select: { id: true, name: true } },
            },
          },
          portfolioItems: {
            orderBy: { sortOrder: "asc" },
          },
          workingHours: {
            orderBy: { dayOfWeek: "asc" },
          },
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              locationCity: true,
              locationState: true,
              avatarUrl: true,
            },
          },
        },
      });
    }

    // Fetch active categories with their subcategories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        subCategories: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return apiSuccess({
      profile: {
        ...artistProfile,
        portfolio: (artistProfile as any).portfolioItems || [],
      },
      categories,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/artist/onboarding
 * Completes 5-step onboarding and submits application for administrative review
 */
export async function POST(req: Request) {
  try {
    const { user, errorResponse } = await requireArtist(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validatedData = fullOnboardingSchema.parse(body);

    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId: user.id },
    });

    if (!artistProfile) {
      return apiError("Artist profile not found.", 404);
    }

    // Execute atomic transaction
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Update User Location
      await tx.user.update({
        where: { id: user.id },
        data: {
          locationCity: validatedData.details.locationCity,
          locationState: validatedData.details.locationState,
        },
      });

      // 2. Update Artist Profile Details
      await tx.artistProfile.update({
        where: { id: artistProfile.id },
        data: {
          businessName: validatedData.details.businessName,
          bio: validatedData.details.bio,
          experienceYears: validatedData.details.experienceYears,
          serviceRadiusKm: validatedData.details.serviceRadiusKm,
          status: "PENDING",
        },
      });

      // 3. Recreate Services
      await tx.artistService.deleteMany({
        where: { artistId: artistProfile.id },
      });

      for (const service of validatedData.services) {
        await tx.artistService.create({
          data: {
            artistId: artistProfile.id,
            categoryId: service.categoryId,
            subCategoryId: service.subCategoryId || null,
            priceType: service.priceType,
            priceFrom: service.priceFrom,
            priceTo: service.priceTo || null,
            durationMinutes: service.durationMinutes,
            description: service.description || null,
            isActive: true,
          },
        });
      }

      // 4. Recreate Portfolio Items
      await tx.portfolioItem.deleteMany({
        where: { artistId: artistProfile.id },
      });

      for (let i = 0; i < validatedData.portfolio.length; i++) {
        const item = validatedData.portfolio[i];
        await tx.portfolioItem.create({
          data: {
            artistId: artistProfile.id,
            mediaUrl: item.mediaUrl,
            thumbnailUrl: item.thumbnailUrl || null,
            mediaType: item.mediaType,
            title: item.title || null,
            categoryId: item.categoryId || null,
            sortOrder: i,
          },
        });
      }

      // 5. Upsert Weekly Working Hours
      for (const hour of validatedData.workingHours) {
        await tx.artistWorkingHours.upsert({
          where: {
            artistId_dayOfWeek: {
              artistId: artistProfile.id,
              dayOfWeek: hour.dayOfWeek,
            },
          },
          update: {
            isWorking: hour.isWorking,
            startTime: hour.startTime,
            endTime: hour.endTime,
          },
          create: {
            artistId: artistProfile.id,
            dayOfWeek: hour.dayOfWeek,
            isWorking: hour.isWorking,
            startTime: hour.startTime,
            endTime: hour.endTime,
          },
        });
      }

      // 6. Send in-app notification to the artist
      await tx.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          title: "Application Submitted for Review",
          message:
            "Your artist profile and services have been submitted for verification. Our administrative review team will review your application within 24–48 hours.",
          link: "/artist/dashboard",
        },
      });
    });

    return apiSuccess(
      null,
      "Artist onboarding application submitted successfully. Your profile is now under review."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
