import { NextResponse } from "next/server";
import { uploadBufferToCloudinary } from "../../../services/upload.service.js";
import connectDB from "../../../lib/mongodb.js";
import ApiResponse from "../../../utils/ApiResponse.js";

export async function POST(request) {
  try {
    // Manual Auth Check (since we bypassed middleware)
    const token = request.cookies.get("adlyngo_token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Logging headers for debugging
    console.log("Upload Request Headers:", Object.fromEntries(request.headers.entries()));

    // Check content type
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, message: "Invalid content type. Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "adlyngo/others";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Connect to DB after parsing body to prioritize body stream consumption
    await connectDB();

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadBufferToCloudinary(buffer, folder);

    return NextResponse.json(
      new ApiResponse(200, result, "File uploaded successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload API Error Details:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
