import { NextRequest } from "next/server";
import { getPageHeroConfig } from "@/lib/heroes";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;
    const heroConfig = await getPageHeroConfig(page);
    return apiSuccess(heroConfig);
  } catch (error) {
    return handleApiError(error);
  }
}
