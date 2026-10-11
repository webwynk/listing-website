import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { staticPageSchema } from "@/lib/validations/content";
import { StoredStaticPage } from "../route";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/admin/pages/[slug]
 * Retrieves single static page content
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { slug } = await params;
    const key = `page_${slug}`;

    const setting = await prisma.siteSetting.findUnique({
      where: { key },
    });

    if (!setting) {
      return apiError("Static page not found.", 404);
    }

    try {
      const page: StoredStaticPage = JSON.parse(setting.value);
      return apiSuccess(page);
    } catch {
      return apiError("Failed to parse static page content.", 500);
    }
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/admin/pages/[slug]
 * Updates static page content and SEO metadata
 */
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { slug } = await params;
    const key = `page_${slug}`;

    const body = await req.json();
    const validatedData = staticPageSchema.parse(body);

    const updatedPage: StoredStaticPage = {
      slug: validatedData.slug,
      title: validatedData.title,
      content: validatedData.content,
      metaTitle: validatedData.metaTitle || null,
      metaDescription: validatedData.metaDescription || null,
      updatedAt: new Date().toISOString(),
    };

    await prisma.siteSetting.upsert({
      where: { key },
      update: {
        value: JSON.stringify(updatedPage),
      },
      create: {
        key,
        value: JSON.stringify(updatedPage),
        type: "JSON",
        group: "pages",
      },
    });

    return apiSuccess(updatedPage, "Static page updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
