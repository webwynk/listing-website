import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().max(150, "Title cannot exceed 150 characters").optional().nullable(),
  subtitle: z.string().max(300, "Subtitle cannot exceed 300 characters").optional().nullable(),
  imageUrl: z.string().url("A valid image URL is required"),
  linkUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  position: z.enum(["HOME_HERO", "HOME_MIDDLE", "FIND_ARTIST_TOP"], {
    errorMap: () => ({ message: "Position must be HOME_HERO, HOME_MIDDLE, or FIND_ARTIST_TOP" }),
  }),
  sortOrder: z.coerce.number().int().min(0, "Sort order must be 0 or greater").default(0),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional().nullable().or(z.literal("")),
  endsAt: z.string().optional().nullable().or(z.literal("")),
});

export type BannerFormData = z.infer<typeof bannerSchema>;

export const testimonialSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters").max(100),
  clientRole: z.string().max(100).optional().nullable().or(z.literal("")),
  clientLocation: z.string().max(100).optional().nullable().or(z.literal("")),
  avatarUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  reviewText: z.string().min(10, "Review quote must be at least 10 characters").max(1000),
  serviceCategory: z.string().max(100).optional().nullable().or(z.literal("")),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;

export const staticPageSchema = z.object({
  title: z.string().min(2, "Page title must be at least 2 characters").max(150),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(10, "Page content must be at least 10 characters"),
  metaTitle: z.string().max(100).optional().nullable().or(z.literal("")),
  metaDescription: z.string().max(250).optional().nullable().or(z.literal("")),
});

export type StaticPageFormData = z.infer<typeof staticPageSchema>;
