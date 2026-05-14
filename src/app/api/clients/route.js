import { NextResponse } from "next/server";
import * as clientService from "../../../services/client.service.js";
import connectDB from "../../../lib/mongodb.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import { createClientSchema } from "../../../schemas/client.validation.js";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    
    const result = await clientService.getClients(query);
    
    return NextResponse.json(
      new ApiResponse(200, result, "Clients fetched successfully"),
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
    const parsed = createClientSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation Error", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const client = await clientService.createClient(parsed.data);
    
    return NextResponse.json(
      new ApiResponse(201, { client }, "Client created successfully"),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
