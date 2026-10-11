import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { validateMediaFile, uploadMedia } from "@/lib/upload";

export const dynamic = "force-dynamic";

/**
 * POST /api/upload
 * Unified media upload endpoint for user avatars, artist portfolio, and banners.
 * Automatically uploads to Cloudinary (if configured) or Supabase Storage.
 */
export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "portfolio";
    const allowVideos = formData.get("allowVideos") === "true";

    if (!file) {
      return apiError("No file uploaded. Please select a media file.", 400);
    }

    // 1. Validate file format and size
    const validation = validateMediaFile(
      { size: file.size, type: file.type, name: file.name },
      allowVideos
    );

    if (!validation.valid) {
      return apiError(validation.error || "Invalid media file.", 400);
    }

    // 2. Read array buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Generate sanitized unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const sanitizedName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const storagePath = `${user.id}/${sanitizedName}`;

    // 4. Upload using unified uploader (Cloudinary or Supabase)
    const { url, error } = await uploadMedia(
      buffer,
      storagePath,
      file.type,
      folder
    );

    if (error || !url) {
      return apiError(error || "Upload failed. Please try again.", 500);
    }

    return apiSuccess(
      {
        url,
        fileName: file.name,
        size: file.size,
        contentType: file.type,
      },
      "File uploaded successfully.",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
