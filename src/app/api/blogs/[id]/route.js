import { NextResponse } from "next/server";
import * as blogService from "../../../../services/blog.service.js";
import connectDB from "../../../../lib/mongodb.js";
import ApiResponse from "../../../../utils/ApiResponse.js";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    // Assuming [id] is the slug for GET requests based on express routes
    const blog = await blogService.getBlogBySlug(id); 
    return NextResponse.json(
      new ApiResponse(200, { blog }, "Blog fetched successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const contentType = request.headers.get("content-type") || "";
    let body;
    
    if (contentType.includes("multipart/form-data")) {
      body = Object.fromEntries(await request.formData());
    } else {
      body = await request.json();
    }
    const { id } = await params;
    const blog = await blogService.updateBlog(id, body);
    
    return NextResponse.json(
      new ApiResponse(200, { blog }, "Blog updated successfully"),
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
    await blogService.deleteBlog(id);
    
    return NextResponse.json(
      new ApiResponse(200, null, "Blog deleted successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
