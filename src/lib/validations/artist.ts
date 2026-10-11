import { z } from "zod";

export const artistProfileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  avatarUrl: z.string().url("Must be a valid URL").optional().nullable(),
  businessName: z.string().max(150).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  experienceYears: z.number().int().min(0).max(50).default(0),
  serviceRadiusKm: z.number().int().min(1).max(500).default(10),
  locationCity: z.string().min(2).max(100).optional().nullable(),
  locationState: z.string().min(2).max(100).optional().nullable(),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Invalid phone format").optional().nullable(),
});

export type ArtistProfileUpdateInput = z.infer<typeof artistProfileUpdateSchema>;

export const artistServiceSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  subCategoryId: z.string().optional().nullable().or(z.literal("")),
  priceFrom: z.coerce.number().min(0, "Price must be 0 or greater"),
  priceTo: z.coerce.number().min(0).optional().nullable(),
  priceType: z.enum(["FIXED", "STARTING_FROM", "RANGE", "NEGOTIABLE"]).default("STARTING_FROM"),
  description: z.string().max(1000).optional().nullable(),
  durationMinutes: z.coerce.number().int().min(15).max(720).optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ArtistServiceInput = z.infer<typeof artistServiceSchema>;

export const packageSchema = z.object({
  name: z.string().min(3, "Package name must be at least 3 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  durationHours: z.coerce.number().min(0.5, "Duration must be at least 30 minutes").max(48).optional().nullable(),
  includedServices: z.array(z.string().min(1)).min(1, "At least one service must be included"),
  imageUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type PackageInput = z.infer<typeof packageSchema>;

export const reviewReplySchema = z.object({
  reply: z.string().min(2, "Reply must be at least 2 characters").max(1000, "Reply cannot exceed 1000 characters"),
});

export type ReviewReplyInput = z.infer<typeof reviewReplySchema>;
