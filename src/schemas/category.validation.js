import { z } from "zod";
import { CATEGORY_TYPES } from "../constants/index.js";

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .min(1, "Category name is required")
    .max(50, "Category name cannot exceed 50 characters")
    .trim(),
  type: z.enum(Object.values(CATEGORY_TYPES), {
    required_error: "Category type is required",
    invalid_type_error: `Type must be one of: ${Object.values(CATEGORY_TYPES).join(", ")}`,
  }),
  description: z.string().max(200).optional(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50, "Category name cannot exceed 50 characters")
    .trim()
    .optional(),
  type: z
    .enum(Object.values(CATEGORY_TYPES))
    .optional(),
  description: z.string().max(200).optional(),
});
