import { NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary.js";
import env from "../../../config/env.js";

export async function POST(request) {
  try {
    const token = request.cookies.get("adlyngo_token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { paramsToSign } = await request.json();

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      success: true,
      signature,
      apiKey: env.CLOUDINARY_API_KEY,
      cloudName: env.CLOUDINARY_CLOUD_NAME
    });
  } catch (error) {
    console.error("Sign API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate signature" },
      { status: 500 }
    );
  }
}
