import { NextRequest } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Do not disclose whether email exists for security
      return apiSuccess(null, "If an unverified account exists, a new verification link has been sent.");
    }

    if (user.isEmailVerified) {
      return apiError("This email address is already verified.", 400);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${appUrl}/verify-email?email=${encodeURIComponent(email)}`;

    await sendVerificationEmail(email, user.name, verificationUrl);

    return apiSuccess(null, "Verification link sent to your email.");
  } catch (error) {
    return handleApiError(error);
  }
}
