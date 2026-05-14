import { NextResponse } from "next/server";
import * as clientService from "../../../services/client.service.js";
import connectDB from "../../../lib/mongodb.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import { updateClientSchema } from "../../../schemas/client.validation.js";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const client = await clientService.getClientById(params.id);
    
    return NextResponse.json(
      new ApiResponse(200, { client }, "Client fetched successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = updateClientSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation Error", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const client = await clientService.updateClient(params.id, parsed.data);
    
    return NextResponse.json(
      new ApiResponse(200, { client }, "Client updated successfully"),
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
    await clientService.deleteClient(params.id);
    
    return NextResponse.json(
      new ApiResponse(200, null, "Client deleted successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
