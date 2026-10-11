import { cookies } from "next/headers";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { createServerSupabase } from "@/lib/supabase";

export async function POST() {
  try {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();

    const cookieStore = await cookies();
    cookieStore.delete("glambook_dev_user");

    return apiSuccess(null, "Logged out successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
