import { NextResponse } from "next/server";
import * as projectService from "../../../../services/project.service.js";
import connectDB from "../../../../lib/mongodb.js";
import ApiResponse from "../../../../utils/ApiResponse.js";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const project = await projectService.getProjectBySlug(id); // Assuming [id] is slug in GET
    return NextResponse.json(
      new ApiResponse(200, { project }, "Project fetched successfully"),
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
    const project = await projectService.updateProject(id, body);
    
    return NextResponse.json(
      new ApiResponse(200, { project }, "Project updated successfully"),
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
    await projectService.deleteProject(id);
    
    return NextResponse.json(
      new ApiResponse(200, null, "Project deleted successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
