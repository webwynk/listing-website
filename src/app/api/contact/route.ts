import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please provide a valid email address."),
  phone: z.string().optional().nullable(),
  subject: z.string().min(3, "Subject must be at least 3 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = contactSchema.parse(body);

    const submission = await prisma.contactSubmission.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        subject: validated.subject,
        message: validated.message,
        status: "NEW",
      },
    });

    return apiSuccess(
      { id: submission.id },
      "Your message has been received by our concierge team. We will respond within 24 hours.",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
