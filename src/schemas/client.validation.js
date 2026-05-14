import { z } from "zod";

export const createClientSchema = z.object({
  name: z
    .string({ required_error: "Client name is required" })
    .min(1, "Client name is required")
    .max(100, "Client name cannot exceed 100 characters")
    .trim(),
  logo: z.object({
    url: z.string().optional(),
    publicId: z.string().optional(),
  }).optional(),
  description: z.string().max(500).optional(),
});

export const updateClientSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100, "Client name cannot exceed 100 characters")
    .trim()
    .optional(),
  logo: z.object({
    url: z.string().optional(),
    publicId: z.string().optional(),
  }).optional(),
  description: z.string().max(500).optional(),
});
