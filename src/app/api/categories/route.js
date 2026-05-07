import { NextResponse } from "next/server";
import * as categoryService from "../../../services/category.service.js";
import connectDB from "../../../lib/mongodb.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import { createCategorySchema } from "../../../schemas/category.validation.js";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    
    const categories = await categoryService.getCategories(query);
    
    return NextResponse.json(
      new ApiResponse(200, { categories }, "Categories fetched successfully"),
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
    const parsed = createCategorySchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation Error", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const category = await categoryService.createCategory(parsed.data);
    
    return NextResponse.json(
      new ApiResponse(201, { category }, "Category created successfully"),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
