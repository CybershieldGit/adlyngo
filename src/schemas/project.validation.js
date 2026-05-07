import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .min(1, "Title is required")
      .max(200, "Title cannot exceed 200 characters")
      .trim(),
    description: z
      .string({ required_error: "Description is required" })
      .min(1, "Description is required"),
    category: z.string().optional(),
    technologies: z.array(z.string().trim()).optional().default([]),
    clientName: z.string().trim().optional().default(""),
    liveUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional().default(""),
    featured: z.boolean().optional().default(false),
    published: z.boolean().optional().default(false),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).trim().optional(),
    description: z.string().min(1).optional(),
    category: z.string().nullable().optional(),
    technologies: z.array(z.string().trim()).optional(),
    clientName: z.string().trim().optional(),
    liveUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
    featured: z.boolean().optional(),
    published: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
});
