import { NextResponse } from "next/server";
import * as categoryService from "../../../../services/category.service.js";
import connectDB from "../../../../lib/mongodb.js";
import ApiResponse from "../../../../utils/ApiResponse.js";
import { updateCategorySchema } from "../../../../schemas/category.validation.js";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const body = await request.json();
    const parsed = updateCategorySchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation Error", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id } = await params;
    const category = await categoryService.updateCategory(id, parsed.data);
    
    return NextResponse.json(
      new ApiResponse(200, { category }, "Category updated successfully"),
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
    await categoryService.deleteCategory(id);
    
    return NextResponse.json(
      new ApiResponse(200, null, "Category deleted successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
