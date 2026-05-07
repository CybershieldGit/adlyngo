import { z } from "zod";

export const createReelSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .min(1, "Title is required")
      .max(120, "Title cannot exceed 120 characters")
      .trim(),
    reelUrl: z
      .string({ required_error: "Reel URL is required" })
      .url("Must be a valid URL"),
    category: z
      .string({ required_error: "Category is required" })
      .min(1, "Category is required"),
    featured: z.boolean().optional().default(false),
    order: z.number().int().optional().default(0),
    published: z.boolean().optional().default(false),
  }),
});

export const updateReelSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(120).trim().optional(),
    reelUrl: z.string().url("Must be a valid URL").optional(),
    category: z.string().min(1).optional(),
    featured: z.boolean().optional(),
    order: z.number().int().optional(),
    published: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Reel ID is required"),
  }),
});

export const reorderReelsSchema = z.object({
  body: z.object({
    orderedIds: z
      .array(z.string().min(1))
      .min(1, "At least one reel ID is required"),
  }),
});
