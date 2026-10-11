import { z } from "zod";

export const professionalDetailsSchema = z.object({
  businessName: z.string().min(2, "Business or brand name must be at least 2 characters").max(100),
  bio: z.string().min(20, "Please provide a bio of at least 20 characters describing your artistry").max(1000),
  experienceYears: z.coerce.number().int().min(0, "Experience years cannot be negative").max(50),
  serviceRadiusKm: z.coerce.number().int().min(1, "Service radius must be at least 1 km").max(500).default(25),
  locationCity: z.string().min(2, "City is required").max(100),
  locationState: z.string().min(2, "State is required").max(100),
});

export const serviceItemSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  subCategoryId: z.string().optional().nullable(),
  priceType: z.enum(["FIXED", "STARTING_FROM", "RANGE", "NEGOTIABLE"]).default("STARTING_FROM"),
  priceFrom: z.coerce.number().min(0, "Price cannot be negative"),
  priceTo: z.coerce.number().min(0).optional().nullable(),
  durationMinutes: z.coerce.number().int().min(15, "Duration must be at least 15 minutes").default(60),
  description: z.string().max(500).optional().nullable(),
});

export const portfolioItemSchema = z.object({
  mediaUrl: z.string().url("Must be a valid image/media URL"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  mediaType: z.enum(["IMAGE", "VIDEO"]).default("IMAGE"),
  title: z.string().max(100).optional().nullable(),
  categoryId: z.string().optional().nullable(),
});

export const workingHourItemSchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  isWorking: z.boolean().default(true),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
});

export const fullOnboardingSchema = z.object({
  details: professionalDetailsSchema,
  services: z.array(serviceItemSchema).min(1, "Please add at least one service offered"),
  portfolio: z.array(portfolioItemSchema).min(3, "Please add at least 3 portfolio images of your work"),
  workingHours: z.array(workingHourItemSchema).length(7, "Operating hours must cover all 7 days of the week"),
});

export type ProfessionalDetailsData = z.infer<typeof professionalDetailsSchema>;
export type ServiceItemData = z.infer<typeof serviceItemSchema>;
export type PortfolioItemData = z.infer<typeof portfolioItemSchema>;
export type WorkingHourItemData = z.infer<typeof workingHourItemSchema>;
export type FullOnboardingData = z.infer<typeof fullOnboardingSchema>;
