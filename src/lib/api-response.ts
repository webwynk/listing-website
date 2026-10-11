import { NextResponse } from "next/server";
import { ApiResponse } from "@/types";

/**
 * Standard Success Response Helper
 */
export function apiSuccess<T>(
  data?: T,
  message?: string,
  statusCode = 200,
  pagination?: ApiResponse["pagination"]
) {
  const body: ApiResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data !== undefined && { data }),
    ...(pagination && { pagination }),
  };

  return NextResponse.json(body, { status: statusCode });
}

/**
 * Standard Error Response Helper
 */
export function apiError(
  message = "An unexpected error occurred",
  statusCode = 500,
  errors?: Record<string, string[]>
) {
  const body: ApiResponse = {
    success: false,
    error: message,
    ...(errors && { errors }),
  };

  return NextResponse.json(body, { status: statusCode });
}
