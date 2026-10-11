import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "./auth";
import { apiError } from "./api-response";
import { SafeUser, UserRole } from "@/types";

type GuardResult =
  | { user: SafeUser; errorResponse: null }
  | { user: null; errorResponse: NextResponse };

/**
 * Requires the request to have a valid, active user session
 */
export async function requireAuth(req: Request): Promise<GuardResult> {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return {
      user: null,
      errorResponse: apiError("Authentication required. Please sign in.", 401),
    };
  }

  return { user, errorResponse: null };
}

/**
 * Requires the authenticated user to possess one of the allowed roles
 */
export async function requireRole(
  req: Request,
  allowedRoles: UserRole[]
): Promise<GuardResult> {
  const authResult = await requireAuth(req);

  if (authResult.errorResponse) {
    return authResult;
  }

  const { user } = authResult;

  if (!allowedRoles.includes(user.role)) {
    return {
      user: null,
      errorResponse: apiError(
        "Forbidden: You do not have permission to access this resource.",
        403
      ),
    };
  }

  return { user, errorResponse: null };
}

/**
 * Guard specifically for Admin only routes
 */
export async function requireAdmin(req: Request): Promise<GuardResult> {
  return requireRole(req, ["ADMIN"]);
}

/**
 * Guard specifically for Artist only routes
 */
export async function requireArtist(req: Request): Promise<GuardResult> {
  return requireRole(req, ["ARTIST", "ADMIN"]);
}
