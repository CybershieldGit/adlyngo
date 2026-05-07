import { NextResponse } from "next/server";
import * as reelService from "../../../../services/reel.service.js";
import connectDB from "../../../../lib/mongodb.js";
import ApiResponse from "../../../../utils/ApiResponse.js";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id } = await params;
    const reel = await reelService.updateReel(id, body);
    
    return NextResponse.json(
      new ApiResponse(200, { reel }, "Reel updated successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await reelService.deleteReel(id);
    
    return NextResponse.json(
      new ApiResponse(200, null, "Reel deleted successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
