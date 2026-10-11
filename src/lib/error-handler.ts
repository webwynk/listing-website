import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { apiError } from "./api-response";

/**
 * Global API Error Handler
 * Translates various error types into standardized, actionable API error responses
 */
export function handleApiError(error: unknown) {
  // 1. Zod Schema Validation Error
  if (error instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {};

    for (const issue of error.issues) {
      const path = issue.path.join(".") || "root";
      if (!formattedErrors[path]) {
        formattedErrors[path] = [];
      }
      formattedErrors[path].push(issue.message);
    }

    return apiError("Validation failed", 422, formattedErrors);
  }

  // 2. Prisma Database Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === "P2002") {
      const target = (error.meta?.target as string[])?.join(", ") || "field";
      return apiError(`A record with this ${target} already exists.`, 409);
    }
    // Record not found
    if (error.code === "P2025") {
      return apiError("The requested record was not found.", 404);
    }
    // Foreign key constraint failed
    if (error.code === "P2003") {
      return apiError("Referenced related record does not exist.", 400);
    }
    return apiError(`Database error [${error.code}]`, 400);
  }

  // 3. Standard JavaScript Error
  if (error instanceof Error) {
    return apiError(error.message, 400);
  }

  // 4. Fallback for unhandled unknowns
  return apiError("Internal server error", 500);
}
