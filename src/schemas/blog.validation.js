import { z } from "zod";

export const createBlogSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .min(1, "Title is required")
      .max(200, "Title cannot exceed 200 characters")
      .trim(),
    excerpt: z.string().max(500).trim().optional().default(""),
    content: z
      .string({ required_error: "Content is required" })
      .min(1, "Content is required"),
    tags: z.array(z.string().trim()).optional().default([]),
    category: z.string().optional(),
    seoTitle: z.string().max(70, "SEO title should not exceed 70 characters").trim().optional().default(""),
    seoDescription: z.string().max(160, "SEO description should not exceed 160 characters").trim().optional().default(""),
    published: z.boolean().optional().default(false),
    featured: z.boolean().optional().default(false),
  }),
});

export const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).trim().optional(),
    excerpt: z.string().max(500).trim().optional(),
    content: z.string().min(1).optional(),
    tags: z.array(z.string().trim()).optional(),
    category: z.string().nullable().optional(),
    seoTitle: z.string().max(70).trim().optional(),
    seoDescription: z.string().max(160).trim().optional(),
    published: z.boolean().optional(),
    featured: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Blog ID is required"),
  }),
});
