import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { signupSchema } from "@/lib/validations/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { createServerSupabase } from "@/lib/supabase";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { sendVerificationEmail } from "@/lib/email";
import { UserRole } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    const { email, password, name, role, phone } = validatedData;

    // 1. Check if user already exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return apiError("An account with this email already exists.", 409);
    }

    // 2. Generate a unique username
    const baseSlug = slugify(name) || "user";
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    let username = `${baseSlug}-${randomSuffix}`;

    // Ensure username uniqueness
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      username = `${baseSlug}-${Date.now().toString().slice(-6)}`;
    }

    // 3. Register user in Supabase Auth
    const supabase = await createServerSupabase();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
          role,
        },
        emailRedirectTo: `${appUrl}/verify-email`,
      },
    });

    if (authError) {
      // In development without live Supabase, gracefully proceed for local development if desired
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
        console.warn("[Auth Notice] Supabase placeholder in use, creating local DB user directly.");
      } else {
        return apiError(authError.message, 400);
      }
    }

    const userId = authData?.user?.id;

    // 4. Create user record in Prisma DB (and artist profile if role is ARTIST)
    const newUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdUser = await tx.user.create({
        data: {
          ...(userId && { id: userId }),
          email,
          name,
          username,
          phone,
          role: role as UserRole,
          isEmailVerified: false,
          isActive: true,
        },
      });

      // If user registered as an artist, automatically initialize pending artist profile
      if (role === "ARTIST") {
        await tx.artistProfile.create({
          data: {
            userId: createdUser.id,
            businessName: name,
            status: "PENDING",
          },
        });
      }

      return createdUser;
    });

    // 5. Send verification email via Resend
    const verificationUrl = `${appUrl}/verify-email?email=${encodeURIComponent(email)}`;
    await sendVerificationEmail(email, name, verificationUrl);

    return apiSuccess(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          username: newUser.username,
          role: newUser.role,
        },
      },
      "Account registered successfully. Please check your email to verify your account.",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
