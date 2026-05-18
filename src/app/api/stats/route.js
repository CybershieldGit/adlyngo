import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb.js";
import Blog from "../../../models/Blog.js";
import Project from "../../../models/Project.js";
import Reel from "../../../models/Reel.js";
import Category from "../../../models/Category.js";
import Gallery from "../../../models/Gallery.js";
import Client from "../../../models/Client.js";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days')) || 0;

    let query = {};
    if (days > 0) {
      const date = new Date();
      date.setDate(date.getDate() - days);
      query = { createdAt: { $gte: date } };
    }

    const [blogsCount, projectsCount, reelsCount, categoriesCount, galleryCount, clientsCount] = await Promise.all([
      Blog.countDocuments(query),
      Project.countDocuments(query),
      Reel.countDocuments(query),
      Category.countDocuments(query),
      Gallery.countDocuments(query),
      Client.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        blogs: blogsCount,
        projects: projectsCount,
        reels: reelsCount,
        categories: categoriesCount,
        gallery: galleryCount,
        clients: clientsCount,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
