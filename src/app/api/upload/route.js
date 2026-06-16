import { NextResponse } from "next/server";
import {
  saveUploadedFile,
  validateUploadFile,
} from "../../../services/upload.service.js";
import connectDB from "../../../lib/mongodb.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import ApiError from "../../../utils/ApiError.js";
import { jwtVerify } from "jose";

export const maxDuration = 300;

export async function POST(request) {
  try {
    const token = request.cookies.get("adlyngo_token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
    } catch {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, message: "Invalid content type. Expected multipart/form-data" },
        { status: 400 }
      );
    }

    let formData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Upload failed. File may exceed the 100MB limit or the server body-size limit.",
        },
        { status: 413 }
      );
    }
    const file = formData.get("file");
    const declaredType = formData.get("type") || "image";

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (declaredType !== "image" && declaredType !== "video") {
      return NextResponse.json(
        { success: false, message: "Invalid upload type. Must be 'image' or 'video'" },
        { status: 400 }
      );
    }

    validateUploadFile(
      { name: file.name, type: file.type, size: file.size },
      declaredType
    );

    await connectDB();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await saveUploadedFile(buffer, file.type, file.name);

    return NextResponse.json(
      new ApiResponse(200, result, "File uploaded successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("[upload] API error:", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
