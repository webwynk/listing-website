import { z } from "zod";

export const createBookingSchema = z.object({
  artistId: z.string().uuid("Invalid artist ID"),
  serviceId: z.string().uuid("Invalid service ID").optional().nullable(),
  bookingDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid booking date format",
  }),
  bookingTime: z.string().optional().nullable(),
  eventType: z.string().min(2, "Event type is required (e.g., Wedding, Party)"),
  eventLocation: z.string().min(3, "Event location or venue address is required"),
  requirements: z.string().optional().nullable(),
  numberOfPeople: z.coerce.number().int().min(1, "At least 1 person required").default(1),
  userName: z.string().min(2, "Your name is required"),
  userPhone: z.string().min(10, "A valid contact phone number is required"),
  userEmail: z.string().email("A valid contact email is required"),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const updateBookingStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"]),
  rejectionReason: z.string().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
});

export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
