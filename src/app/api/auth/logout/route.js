import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import ApiResponse from "../../../../utils/ApiResponse.js";
import { COOKIE_NAME } from "../../../../constants/index.js";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  
  return NextResponse.json(
    new ApiResponse(200, null, "Logged out successfully"),
    { status: 200 }
  );
}
