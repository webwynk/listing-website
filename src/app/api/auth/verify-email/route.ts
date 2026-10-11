import { NextRequest } from "next/server";
import { verifyEmailSchema } from "@/lib/validations/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { createServerSupabase } from "@/lib/supabase";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = verifyEmailSchema.parse(body);

    const supabase = await createServerSupabase();

    // Verify token with Supabase Auth
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "email",
    });

    if (error) {
      return apiError("Invalid or expired verification link.", 400);
    }

    if (data.user?.email) {
      // Mark verified in Prisma
      await prisma.user.update({
        where: { email: data.user.email },
        data: { isEmailVerified: true },
      });
    }

    return apiSuccess(null, "Email verified successfully. You can now log in.");
  } catch (error) {
    return handleApiError(error);
  }
}
