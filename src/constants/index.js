/**
 * Application-wide constants.
 * Centralized to prevent magic strings scattered across the codebase.
 */

export const COOKIE_NAME = "adlyngo_token";

export const UPLOAD_LIMITS = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024,   // 5 MB
  VIDEO_MAX_SIZE: 50 * 1024 * 1024,  // 50 MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm"],
};

export const CLOUDINARY_FOLDERS = {
  BLOGS: "adlyngo/blogs",
  REELS: "adlyngo/reels",
  PROJECTS: "adlyngo/projects",
  GALLERY: "adlyngo/gallery",
  GENERAL: "adlyngo/uploads",
};

export const CATEGORY_TYPES = {
  REEL: "reel",
  BLOG: "blog",
  PROJECT: "project",
  GALLERY: "gallery",
};

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 200,          // per window
  AUTH_MAX: 100,               // auth endpoints — increased for dev testing
};
