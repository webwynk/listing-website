import { z } from "zod";

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(200, "Slug cannot exceed 200 characters")
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens"),
  excerpt: z
    .string()
    .max(500, "Excerpt cannot exceed 500 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  content: z.string().min(10, "Post content must be at least 10 characters"),
  coverImageUrl: z
    .string()
    .url("Must be a valid image URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  category: z
    .string()
    .max(100, "Category cannot exceed 100 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  tags: z
    .array(z.string())
    .optional()
    .nullable()
    .or(z.string().transform((val) => val.split(",").map((s) => s.trim()).filter(Boolean))),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  metaTitle: z
    .string()
    .max(150, "Meta title cannot exceed 150 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(300, "Meta description cannot exceed 300 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;
