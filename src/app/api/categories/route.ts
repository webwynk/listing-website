import { NextResponse } from "next/server";
import { getActiveCategories } from "@/lib/categories";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

/**
 * GET /api/categories
 * Public endpoint to retrieve active categories with artist counts
 */
export async function GET() {
  try {
    const categories = await getActiveCategories();
    return apiSuccess(categories);
  } catch (error) {
    return handleApiError(error);
  }
}
