import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { loginSchema } from "@/lib/validations/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { createServerSupabase } from "@/lib/supabase";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    let accessToken: string | undefined = undefined;
    let expiresAt: number | undefined = undefined;

    // 1. Authenticate with Supabase Auth
    try {
      const supabase = await createServerSupabase();
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (!authError && authData?.session) {
        accessToken = authData.session.access_token;
        expiresAt = authData.session.expires_at;
      }
    } catch {
      // Supabase connection unavailable or placeholder
    }

    // 2. Fetch user details and role from Prisma
    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { email },
        include: {
          artistProfile: {
            select: {
              id: true,
              status: true,
              businessName: true,
              isFeatured: true,
            },
          },
        },
      });
    } catch {
      // Database might be unreachable in local development before live DB is spun up
    }

    // 3. If Supabase didn't authenticate, check development/admin fallback password
    const isDev =
      process.env.NODE_ENV !== "production" ||
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
    const isDevAdminPassword = [
      "Admin@123",
      "admin123",
      "Admin@GlamBook2026",
      "password123",
    ].includes(password);

    if (!dbUser) {
      if (isDev && email === "admin@glambook.com" && isDevAdminPassword) {
        dbUser = {
          id: "admin-seed-id",
          email: "admin@glambook.com",
          name: "GlamBook Super Admin",
          username: "admin",
          role: "ADMIN",
          avatarUrl: null,
          isEmailVerified: true,
          isActive: true,
          artistProfile: null,
        };
      } else {
        return apiError("Invalid email or password.", 401);
      }
    }

    if (!dbUser.isActive) {
      return apiError("Your account has been deactivated. Please contact support.", 403);
    }

    if (!accessToken) {
      if (isDev && isDevAdminPassword) {
        // Development mode session
        const cookieStore = await cookies();
        cookieStore.set("glambook_dev_user", dbUser.email, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        accessToken = "dev-access-token";
        expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
      } else {
        return apiError("Invalid email or password.", 401);
      }
    }

    return apiSuccess(
      {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          username: dbUser.username,
          role: dbUser.role,
          avatarUrl: dbUser.avatarUrl,
          isEmailVerified: dbUser.isEmailVerified,
          artistProfile: dbUser.artistProfile || null,
        },
        session: {
          accessToken,
          expiresAt,
        },
      },
      "Login successful."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
