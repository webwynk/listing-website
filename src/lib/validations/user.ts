import { z } from "zod";

export const userProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^[0-9+\s-]{10,15}$/, "Invalid phone number format")
    .optional()
    .nullable()
    .or(z.literal("")),
  locationCity: z
    .string()
    .max(100, "City name must be under 100 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  locationState: z
    .string()
    .max(100, "State name must be under 100 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  avatarUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>;

export const userPasswordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type UserPasswordUpdateInput = z.infer<typeof userPasswordUpdateSchema>;
