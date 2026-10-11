import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { testimonialSchema } from "@/lib/validations/content";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export interface StoredTestimonial {
  id: string;
  clientName: string;
  clientRole?: string | null;
  clientLocation?: string | null;
  avatarUrl?: string | null;
  rating: number;
  reviewText: string;
  serviceCategory?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

/**
 * GET /api/admin/testimonials
 * Lists all client testimonials stored in site_settings (group: testimonials)
 */
export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const settings = await prisma.siteSetting.findMany({
      where: { group: "testimonials" },
    });

    const testimonials: StoredTestimonial[] = [];

    for (const item of settings) {
      try {
        const parsed = JSON.parse(item.value);
        testimonials.push({
          id: parsed.id || item.key.replace("testimonial_", ""),
          clientName: parsed.clientName,
          clientRole: parsed.clientRole || null,
          clientLocation: parsed.clientLocation || null,
          avatarUrl: parsed.avatarUrl || null,
          rating: parsed.rating || 5,
          reviewText: parsed.reviewText,
          serviceCategory: parsed.serviceCategory || null,
          isActive: parsed.isActive ?? true,
          sortOrder: parsed.sortOrder ?? 0,
          createdAt: parsed.createdAt || new Date().toISOString(),
        });
      } catch {
        // Skip malformed entries
      }
    }

    // Sort by sortOrder asc, then createdAt desc
    testimonials.sort((a, b) => a.sortOrder - b.sortOrder);

    return apiSuccess({
      testimonials,
      total: testimonials.length,
      activeCount: testimonials.filter((t) => t.isActive).length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/testimonials
 * Adds a new client testimonial in site_settings
 */
export async function POST(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validatedData = testimonialSchema.parse(body);

    const id = randomUUID();
    const newTestimonial: StoredTestimonial = {
      id,
      ...validatedData,
      createdAt: new Date().toISOString(),
    };

    const setting = await prisma.siteSetting.create({
      data: {
        key: `testimonial_${id}`,
        value: JSON.stringify(newTestimonial),
        type: "JSON",
        group: "testimonials",
      },
    });

    return apiSuccess(newTestimonial, "Testimonial created successfully.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
