import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb.js";
import SiteSettings from "../../../models/SiteSettings.js";

const KEY = "global";

export async function GET() {
  try {
    await connectDB();
    const doc = await SiteSettings.findOneAndUpdate(
      { key: KEY },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, data: { maintenanceMode: !!doc.maintenanceMode } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const { enabled } = await request.json();
    const doc = await SiteSettings.findOneAndUpdate(
      { key: KEY },
      { maintenanceMode: !!enabled },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, data: { maintenanceMode: doc.maintenanceMode } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
