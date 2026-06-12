import { z } from "zod";

/**
 * Validate ALL required environment variables at boot.
 * App crashes immediately if any are missing — fail fast.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  COOKIE_SECRET: z.string().min(32, "COOKIE_SECRET must be at least 32 characters"),

  UPLOAD_ROOT: z.string().optional(),
  UPLOAD_DIR_IMAGES: z.string().optional(),
  UPLOAD_DIR_VIDEOS: z.string().optional(),
  UPLOAD_BASE_URL: z.string().optional(),

  CLIENT_URL: z.string().default("http://localhost:3000"),

  // Admin Seed Credentials
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = Object.freeze(parsed.data);

export default env;
