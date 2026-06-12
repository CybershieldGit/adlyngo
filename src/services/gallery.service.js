import Gallery from "../models/Gallery.js";
import Category from "../models/Category.js";
import Client from "../models/Client.js";
import ApiError from "../utils/ApiError.js";
import { deleteUploadedFile } from "./upload.service.js";

/**
 * Get all gallery items with pagination and filtering
 */
export const getGalleryItems = async (query = {}) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.published) filter.published = query.published === "true";
  if (query.client) filter.client = query.client;

  const items = await Gallery.find(filter)
    .populate("category", "name slug")
    .populate("client", "name slug")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Gallery.countDocuments(filter);

  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Create a new gallery item
 */
export const createGalleryItem = async (data) => {
  if (data.client === "") {
    delete data.client;
  }
  const item = await Gallery.create(data);
  return item.populate([
    { path: "category", select: "name slug" },
    { path: "client", select: "name slug" }
  ]);
};

/**
 * Update a gallery item
 */
export const updateGalleryItem = async (id, data) => {
  if (data.client === "") {
    data.client = null;
  }

  const existing = await Gallery.findById(id);
  if (!existing) {
    throw new ApiError(404, "Gallery item not found");
  }

  if (data.imageUrl && existing.imageUrl && data.imageUrl !== existing.imageUrl) {
    deleteUploadedFile(existing.publicId || existing.imageUrl);
  }

  const item = await Gallery.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!item) {
    throw new ApiError(404, "Gallery item not found");
  }

  return item.populate([
    { path: "category", select: "name slug" },
    { path: "client", select: "name slug" }
  ]);
};

/**
 * Delete a gallery item
 */
export const deleteGalleryItem = async (id) => {
  const item = await Gallery.findByIdAndDelete(id);

  if (!item) {
    throw new ApiError(404, "Gallery item not found");
  }

  deleteUploadedFile(item.publicId || item.imageUrl);

  return item.populate([
    { path: "category", select: "name slug" },
    { path: "client", select: "name slug" }
  ]);
};
