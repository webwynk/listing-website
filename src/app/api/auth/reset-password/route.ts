import { NextRequest } from "next/server";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { createServerSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { newPassword } = resetPasswordSchema.parse(body);

    const supabase = await createServerSupabase();

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return apiError(error.message || "Failed to reset password.", 400);
    }

    return apiSuccess(
      null,
      "Password has been reset successfully. You can now log in with your new password."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
