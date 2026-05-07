import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as authService from "../../../../services/auth.service.js";
import connectDB from "../../../../lib/mongodb.js";
import ApiResponse from "../../../../utils/ApiResponse.js";
import { COOKIE_NAME } from "../../../../constants/index.js";
import jwt from "jsonwebtoken";
import env from "../../../../config/env.js";

export async function GET(request) {
  try {
    await connectDB();
    
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const admin = await authService.getAdminProfile(decoded.id);
    
    return NextResponse.json(
      new ApiResponse(200, { admin }, "Profile fetched successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid session or profile not found" },
      { status: 401 }
    );
  }
}
