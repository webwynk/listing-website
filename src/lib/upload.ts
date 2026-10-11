import { v2 as cloudinary } from "cloudinary";
import { supabaseAdmin } from "./supabase";

// Configure Cloudinary if credentials exist in environment
if (
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a file against allowed MIME types and max size
 */
export function validateMediaFile(
  file: { size: number; type: string; name: string },
  allowVideos = false
): FileValidationResult {
  const allowedTypes = allowVideos
    ? [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
    : ALLOWED_IMAGE_TYPES;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed formats: ${allowVideos ? "JPEG, PNG, WebP, MP4, MOV" : "JPEG, PNG, WebP"}`,
    };
  }

  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File exceeds maximum size limit of ${isVideo ? "100 MB" : "10 MB"}.`,
    };
  }

  return { valid: true };
}

/**
 * Uploads a file buffer to Cloudinary
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = "glambook",
  resourceType: "image" | "video" | "auto" = "auto"
): Promise<{ url: string | null; error: string | null }> {
  try {
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error || !result) {
            console.error("Cloudinary upload error:", error);
            resolve({
              url: null,
              error: error?.message || "Cloudinary upload failed.",
            });
          } else {
            resolve({ url: result.secure_url, error: null });
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (err: any) {
    console.error("Cloudinary upload exception:", err);
    return { url: null, error: err.message || "Failed to upload to Cloudinary." };
  }
}

/**
 * Uploads a file buffer or Blob to Supabase Storage
 */
export async function uploadToStorage(
  bucket: string,
  filePath: string,
  fileBody: Buffer | Uint8Array,
  contentType: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, fileBody, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      return { url: null, error: error.message };
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    console.error("Storage upload exception:", err);
    return { url: null, error: err.message || "Failed to upload file." };
  }
}

/**
 * Smart unified media uploader:
 * Uses Cloudinary if configured; otherwise defaults to Supabase Storage.
 */
export async function uploadMedia(
  fileBuffer: Buffer,
  filePath: string,
  contentType: string,
  bucket: string = "portfolio"
): Promise<{ url: string | null; error: string | null }> {
  if (
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    const isVideo = ALLOWED_VIDEO_TYPES.includes(contentType);
    return uploadToCloudinary(
      fileBuffer,
      `glambook/${bucket}`,
      isVideo ? "video" : "image"
    );
  }

  return uploadToStorage(bucket, filePath, fileBuffer, contentType);
}
