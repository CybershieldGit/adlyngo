import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as authService from "../../../../services/auth.service.js";
import connectDB from "../../../../lib/mongodb.js";
import ApiResponse from "../../../../utils/ApiResponse.js";
import { COOKIE_NAME } from "../../../../constants/index.js";
import env from "../../../../config/env.js";

export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const { admin, token } = await authService.loginAdmin(email, password);
    
    // Set HTTP-only cookie
    const cookieStore = await cookies();
    const isProduction = env.NODE_ENV === "production";
    const isSecureRequest = request.url.startsWith('https://');

    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction && isSecureRequest, // Only secure if production AND using https
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });
    
    return NextResponse.json(
      new ApiResponse(200, { admin }, "Logged in successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
