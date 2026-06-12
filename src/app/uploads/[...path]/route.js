import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import uploadConfig from "../../../config/upload.js";

const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

/**
 * Dev/fallback static file serving for uploaded media.
 * In production, Nginx should serve /uploads/ directly from disk.
 */
export async function GET(_request, { params }) {
  try {
    const segments = (await params).path;
    if (!segments?.length || segments.length > 2) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const [subdir, filename] = segments;

    if (subdir !== "images" && subdir !== "videos") {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json({ message: "Invalid path" }, { status: 400 });
    }

    const baseDir = subdir === "images" ? uploadConfig.imagesDir : uploadConfig.videosDir;
    const absolutePath = path.join(baseDir, filename);

    const fileBuffer = await fs.readFile(absolutePath);
    const ext = path.extname(filename).toLowerCase();

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=2592000, immutable",
      },
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    console.error("[uploads] Static serve error:", error);
    return NextResponse.json({ message: "Failed to serve file" }, { status: 500 });
  }
}
