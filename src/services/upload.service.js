import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import uploadConfig from "../config/upload.js";
import { UPLOAD_LIMITS } from "../constants/index.js";
import ApiError from "../utils/ApiError.js";

const MIME_TO_EXTENSIONS = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/svg+xml": [".svg"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
};

const EXTENSION_TO_MIME = Object.entries(MIME_TO_EXTENSIONS).reduce(
  (acc, [mime, extensions]) => {
    extensions.forEach((ext) => {
      acc[ext] = mime;
    });
    return acc;
  },
  {}
);

function isImageMime(mimeType) {
  return mimeType.startsWith("image/");
}

function isVideoMime(mimeType) {
  return mimeType.startsWith("video/");
}

function getStorageDir(mimeType) {
  return isVideoMime(mimeType) ? uploadConfig.videosDir : uploadConfig.imagesDir;
}

function getSubdir(mimeType) {
  return isVideoMime(mimeType) ? "videos" : "images";
}

function generateSecureFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  return `${crypto.randomUUID()}${ext}`;
}

/**
 * Validate file metadata before saving to disk.
 * @param {{ name: string, type: string, size: number }} file
 * @param {'image'|'video'} declaredType
 */
export function validateUploadFile(file, declaredType) {
  const { name, type: mimeType, size } = file;
  const ext = path.extname(name).toLowerCase();

  if (!name || !mimeType) {
    throw new ApiError(400, "Invalid file metadata");
  }

  if (declaredType === "image" && !isImageMime(mimeType)) {
    throw new ApiError(400, "Only image files are allowed for this upload");
  }

  if (declaredType === "video" && !isVideoMime(mimeType)) {
    throw new ApiError(400, "Only video files are allowed for this upload");
  }

  const allowedTypes = isVideoMime(mimeType)
    ? UPLOAD_LIMITS.ALLOWED_VIDEO_TYPES
    : UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES;

  if (!allowedTypes.includes(mimeType)) {
    throw new ApiError(400, `File type ${mimeType} is not allowed`);
  }

  const allowedExtensions = MIME_TO_EXTENSIONS[mimeType] || [];
  if (!allowedExtensions.includes(ext)) {
    throw new ApiError(400, `File extension ${ext} does not match MIME type ${mimeType}`);
  }

  const expectedMime = EXTENSION_TO_MIME[ext];
  if (expectedMime && expectedMime !== mimeType) {
    throw new ApiError(400, "File extension does not match declared MIME type");
  }

  const maxSize = isVideoMime(mimeType)
    ? UPLOAD_LIMITS.VIDEO_MAX_SIZE
    : UPLOAD_LIMITS.IMAGE_MAX_SIZE;

  if (size > maxSize) {
    const maxMb = Math.round(maxSize / (1024 * 1024));
    throw new ApiError(400, `File size exceeds the ${maxMb}MB limit`);
  }
}

/**
 * Save an uploaded file buffer to the VPS filesystem.
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function saveUploadedFile(fileBuffer, mimeType, originalName) {
  const storageDir = getStorageDir(mimeType);
  const subdir = getSubdir(mimeType);
  const filename = generateSecureFilename(originalName);
  const absolutePath = path.join(storageDir, filename);

  await fs.mkdir(storageDir, { recursive: true });
  await fs.writeFile(absolutePath, fileBuffer);

  const publicId = `${subdir}/${filename}`;
  const url = `${uploadConfig.baseUrl}/${publicId}`;

  console.info(`[upload] Saved ${publicId} (${fileBuffer.length} bytes)`);

  return { url, publicId };
}

/**
 * Extract a stored publicId from a local upload URL.
 * @param {string} url
 * @returns {string|null}
 */
export function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;

  const base = uploadConfig.baseUrl.replace(/\/$/, "");
  if (url.startsWith(`${base}/`)) {
    return url.slice(base.length + 1);
  }

  const match = url.match(/\/uploads\/(images|videos)\/([^/?#]+)/);
  return match ? `${match[1]}/${match[2]}` : null;
}

function resolveAbsolutePath(publicId) {
  if (!publicId) return null;

  if (publicId.startsWith("images/")) {
    return path.join(uploadConfig.imagesDir, path.basename(publicId));
  }

  if (publicId.startsWith("videos/")) {
    return path.join(uploadConfig.videosDir, path.basename(publicId));
  }

  return null;
}

function isLegacyCloudinaryId(publicId) {
  return publicId.includes("adlyngo/") || publicId.includes("cloudinary");
}

/**
 * Delete a locally stored upload by publicId or URL.
 * @param {string} publicIdOrUrl
 */
export async function deleteUploadedFile(publicIdOrUrl) {
  if (!publicIdOrUrl) return;

  const publicId = publicIdOrUrl.includes("://")
    ? extractPublicIdFromUrl(publicIdOrUrl)
    : publicIdOrUrl;

  if (!publicId) {
    console.warn(`[upload] Could not resolve local path for deletion: ${publicIdOrUrl}`);
    return;
  }

  if (isLegacyCloudinaryId(publicId)) {
    console.info(`[upload] Skipping delete for legacy Cloudinary asset: ${publicId}`);
    return;
  }

  const absolutePath = resolveAbsolutePath(publicId);
  if (!absolutePath) {
    console.warn(`[upload] Unknown publicId format: ${publicId}`);
    return;
  }

  try {
    await fs.unlink(absolutePath);
    console.info(`[upload] Deleted ${publicId}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn(`[upload] File already missing: ${publicId}`);
      return;
    }
    console.error(`[upload] Failed to delete ${publicId}:`, error);
  }
}

/**
 * Ensure upload directories exist (called at startup in production).
 */
export async function ensureUploadDirectories() {
  await fs.mkdir(uploadConfig.imagesDir, { recursive: true });
  await fs.mkdir(uploadConfig.videosDir, { recursive: true });
}
