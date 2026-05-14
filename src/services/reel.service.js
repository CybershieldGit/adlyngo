import Reel from "../models/Reel.js";
import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";
import { uniqueSlug } from "../utils/slugify.js";
import { buildQuery } from "../utils/queryBuilder.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";
import { deleteFromCloudinary } from "./upload.service.js";

export const getReels = async (queryData) => {
  const { filter, sort } = buildQuery(queryData, ["title"]);
  const { page, limit, skip } = parsePagination(queryData);

  const [reels, totalDocs] = await Promise.all([
    Reel.find(filter)
      .populate("category", "name slug")
      .populate("client", "name slug logo")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Reel.countDocuments(filter),
  ]);

  return {
    reels,
    meta: buildPaginationMeta(page, limit, totalDocs),
  };
};

export const createReel = async (reelData) => {
  const slug = await uniqueSlug(reelData.title, Reel);
  const order = reelData.order ?? (await Reel.countDocuments()) + 1;

  const reel = await Reel.create({ ...reelData, slug, order });
  return reel.populate([
    { path: "category", select: "name slug" },
    { path: "client", select: "name slug logo" }
  ]);
};

export const updateReel = async (id, updateData) => {
  const reel = await Reel.findById(id);
  if (!reel) {
    throw new ApiError(404, "Reel not found");
  }

  // Update slug if title changed
  if (updateData.title && updateData.title !== reel.title) {
    updateData.slug = await uniqueSlug(updateData.title, Reel, id);
  }

  // Handle new thumbnail (assumes controller uploads and passes the object)
  if (updateData.thumbnail && reel.thumbnail?.publicId) {
    // Fire and forget old image deletion
    deleteFromCloudinary(reel.thumbnail.publicId);
  }

  Object.assign(reel, updateData);
  await reel.save();

  return reel.populate([
    { path: "category", select: "name slug" },
    { path: "client", select: "name slug logo" }
  ]);
};

export const deleteReel = async (id) => {
  const reel = await Reel.findByIdAndDelete(id);
  if (!reel) {
    throw new ApiError(404, "Reel not found");
  }

  if (reel.thumbnail?.publicId) {
    deleteFromCloudinary(reel.thumbnail.publicId);
  }

  return reel;
};

export const reorderReels = async (orderedIds) => {
  // orderedIds is an array of Reel _ids in the new order
  const bulkOps = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { order: index },
    },
  }));

  await Reel.bulkWrite(bulkOps);
  return { message: "Reels reordered successfully" };
};
