import { z } from "zod";

/**
 * Category Validation Schemas
 */
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must not exceed 100 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(120, "Slug must not exceed 120 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(500, "Description must not exceed 500 characters").optional().nullable(),
  iconUrl: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

/**
 * Sub-Category Validation Schemas
 */
export const createSubCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Sub-category name must be at least 2 characters")
    .max(100, "Sub-category name must not exceed 100 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(120, "Slug must not exceed 120 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(500, "Description must not exceed 500 characters").optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateSubCategorySchema = createSubCategorySchema.partial();

export type CreateSubCategoryInput = z.infer<typeof createSubCategorySchema>;
export type UpdateSubCategoryInput = z.infer<typeof updateSubCategorySchema>;
