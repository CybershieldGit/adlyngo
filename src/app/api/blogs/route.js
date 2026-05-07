import { NextResponse } from "next/server";
import * as blogService from "../../../services/blog.service.js";
import connectDB from "../../../lib/mongodb.js";
import ApiResponse from "../../../utils/ApiResponse.js";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    
    const result = await blogService.getBlogs(query);
    
    return NextResponse.json(
      new ApiResponse(200, result, "Blogs fetched successfully"),
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
    
    const contentType = request.headers.get("content-type") || "";
    let body;
    
    if (contentType.includes("multipart/form-data")) {
      body = Object.fromEntries(await request.formData());
    } else {
      body = await request.json();
    }

    const authorId = request.headers.get("x-admin-id");
    const blog = await blogService.createBlog(body, authorId);
    
    return NextResponse.json(
      new ApiResponse(201, { blog }, "Blog created successfully"),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
