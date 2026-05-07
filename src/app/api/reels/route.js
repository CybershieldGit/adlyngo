import { NextResponse } from "next/server";
import * as reelService from "../../../services/reel.service.js";
import connectDB from "../../../lib/mongodb.js";
import ApiResponse from "../../../utils/ApiResponse.js";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    
    const result = await reelService.getReels(query);
    
    return NextResponse.json(
      new ApiResponse(200, result, "Reels fetched successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const adminId = request.headers.get("x-admin-id");
    const reel = await reelService.createReel(body, adminId);
    
    return NextResponse.json(
      new ApiResponse(201, { reel }, "Reel created successfully"),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
