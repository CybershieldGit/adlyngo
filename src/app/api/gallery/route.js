import { NextResponse } from "next/server";
import * as galleryService from "../../../services/gallery.service.js";
import connectDB from "../../../lib/mongodb.js";
import ApiResponse from "../../../utils/ApiResponse.js";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    
    const result = await galleryService.getGalleryItems(query);
    
    return NextResponse.json(
      new ApiResponse(200, result, "Gallery items fetched successfully"),
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
    const item = await galleryService.createGalleryItem(body);
    
    return NextResponse.json(
      new ApiResponse(201, item, "Gallery item created successfully"),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
