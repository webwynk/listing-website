import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/role-guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { createServerSupabase } from "@/lib/supabase";
import { userPasswordUpdateSchema } from "@/lib/validations/user";

export const dynamic = "force-dynamic";

/**
 * PUT /api/user/profile/password
 * Verifies current password and updates to a new password
 */
export async function PUT(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const { currentPassword, newPassword } = userPasswordUpdateSchema.parse(body);

    const supabase = await createServerSupabase();

    // 1. Verify current credentials
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      return apiError("Current password is incorrect.", 400);
    }

    // 2. Set new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return apiError(updateError.message || "Failed to update password.", 400);
    }

    return apiSuccess(null, "Password updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
