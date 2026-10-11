import { NextRequest } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { createServerSupabase } from "@/lib/supabase";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const genericSuccessMessage =
      "If an account with that email address exists, a password reset link has been sent.";

    if (!user) {
      // Prevent user enumeration attacks
      return apiSuccess(null, genericSuccessMessage);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const supabase = await createServerSupabase();

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/reset-password`,
    });

    if (error) {
      console.warn("Supabase resetPassword error (may be using placeholder):", error.message);
    }

    // Also send branded email via Resend
    const resetUrl = `${appUrl}/reset-password?email=${encodeURIComponent(email)}`;
    await sendPasswordResetEmail(email, user.name, resetUrl);

    return apiSuccess(null, genericSuccessMessage);
  } catch (error) {
    return handleApiError(error);
  }
}
