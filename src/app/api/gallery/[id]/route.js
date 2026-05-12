import { NextResponse } from "next/server";
import * as galleryService from "../../../../services/gallery.service.js";
import connectDB from "../../../../lib/mongodb.js";
import ApiResponse from "../../../../utils/ApiResponse.js";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const item = await galleryService.updateGalleryItem(id, body);
    
    return NextResponse.json(
      new ApiResponse(200, item, "Gallery item updated successfully"),
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
    
    await galleryService.deleteGalleryItem(id);
    
    return NextResponse.json(
      new ApiResponse(200, null, "Gallery item deleted successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
