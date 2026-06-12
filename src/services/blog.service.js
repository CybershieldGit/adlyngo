import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import Admin from "../models/Admin.js";
import ApiError from "../utils/ApiError.js";
import { uniqueSlug } from "../utils/slugify.js";
import { buildQuery } from "../utils/queryBuilder.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";
import { deleteUploadedFile } from "./upload.service.js";

export const getBlogs = async (queryData) => {
  const { filter, sort } = buildQuery(queryData, ["title", "content", "tags"]);
  const { page, limit, skip } = parsePagination(queryData);

  const [blogs, totalDocs] = await Promise.all([
    Blog.find(filter)
      .populate("category", "name slug")
      .populate("author", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(filter),
  ]);

  return {
    blogs,
    meta: buildPaginationMeta(page, limit, totalDocs),
  };
};

export const getBlogBySlug = async (slug) => {
  const blog = await Blog.findOne({ slug })
    .populate("category", "name slug")
    .populate("author", "name");

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return blog;
};

export const createBlog = async (blogData, authorId) => {
  const slug = await uniqueSlug(blogData.title, Blog);

  // Set fallback SEO values if not provided
  const seoTitle = blogData.seoTitle || blogData.title.substring(0, 70);
  const seoDescription = blogData.seoDescription || blogData.excerpt.substring(0, 160);

  const blog = await Blog.create({
    ...blogData,
    slug,
    author: authorId,
    seoTitle,
    seoDescription
  });

  const populatedBlog = await Blog.findById(blog._id)
    .populate("category", "name slug")
    .populate("author", "name");

  return populatedBlog;
};

export const updateBlog = async (id, updateData) => {
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (updateData.title && updateData.title !== blog.title) {
    updateData.slug = await uniqueSlug(updateData.title, Blog, id);
  }

  if (updateData.thumbnail && blog.thumbnail?.publicId) {
    deleteUploadedFile(blog.thumbnail.publicId);
  }

  Object.assign(blog, updateData);
  await blog.save();

  const populatedBlog = await Blog.findById(blog._id)
    .populate("category", "name slug")
    .populate("author", "name");

  return populatedBlog;
};

export const deleteBlog = async (id) => {
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.thumbnail?.publicId) {
    deleteUploadedFile(blog.thumbnail.publicId);
  }

  return blog;
};
