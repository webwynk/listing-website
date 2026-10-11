import { z } from "zod";

export const createReviewSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
  rating: z.coerce.number().int().min(1, "Rating must be at least 1 star").max(5, "Rating cannot exceed 5 stars"),
  comment: z
    .string()
    .min(5, "Review comment must be at least 5 characters")
    .max(1500, "Review comment cannot exceed 1500 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  photos: z.array(z.string().url("Must be a valid URL")).optional().nullable(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
