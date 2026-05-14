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
    client: z.string().optional(),
    liveUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional().default(""),
    featured: z.boolean().optional().default(false),
    published: z.boolean().optional().default(false),
    socialLinks: z.array(z.object({
      platform: z.string().min(1, "Platform name is required"),
      url: z.string().url("Must be a valid URL"),
    })).optional().default([]),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).trim().optional(),
    description: z.string().min(1).optional(),
    category: z.string().nullable().optional(),
    technologies: z.array(z.string().trim()).optional(),
    clientName: z.string().trim().optional(),
    client: z.string().optional(),
    liveUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
    featured: z.boolean().optional(),
    published: z.boolean().optional(),
    socialLinks: z.array(z.object({
      platform: z.string().min(1),
      url: z.string().url(),
    })).optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
});
