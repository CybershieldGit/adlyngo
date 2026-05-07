import { NextResponse } from "next/server";
import * as projectService from "../../../services/project.service.js";
import connectDB from "../../../lib/mongodb.js";
import ApiResponse from "../../../utils/ApiResponse.js";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    
    const result = await projectService.getProjects(query);
    
    return NextResponse.json(
      new ApiResponse(200, result, "Projects fetched successfully"),
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
    
    // In Express, multer handled the 'thumbnail'. We are migrating so the frontend will send it via FormData or JSON.
    // If it's multipart/form-data:
    const contentType = request.headers.get("content-type") || "";
    let body;
    
    if (contentType.includes("multipart/form-data")) {
      body = Object.fromEntries(await request.formData());
    } else {
      body = await request.json();
    }

    const adminId = request.headers.get("x-admin-id");
    const project = await projectService.createProject(body, adminId);
    
    return NextResponse.json(
      new ApiResponse(201, { project }, "Project created successfully"),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
