import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";
import { uniqueSlug } from "../utils/slugify.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";

/**
 * Create a new category.
 */
export const createCategory = async (categoryData) => {
  const { name, type } = categoryData;
  const slug = await uniqueSlug(name, Category);

  const category = await Category.create({ name, slug, type });
  return category;
};

/**
 * Retrieve all categories with optional type filter.
 */
export const getCategories = async (query = {}) => {
  const filter = {};
  if (query.type) {
    filter.type = query.type;
  }
  
  const { page, limit, skip } = parsePagination(query);

  const [categories, totalDocs] = await Promise.all([
    Category.find(filter).sort("name").skip(skip).limit(limit),
    Category.countDocuments(filter),
  ]);

  return {
    categories,
    meta: buildPaginationMeta(page, limit, totalDocs),
  };
};

/**
 * Update an existing category.
 */
export const updateCategory = async (id, updateData) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (updateData.name && updateData.name !== category.name) {
    category.name = updateData.name;
    category.slug = await uniqueSlug(updateData.name, Category, category._id);
  }

  if (updateData.type) {
    category.type = updateData.type;
  }

  await category.save();
  return category;
};

/**
 * Delete a category.
 * Should ideally check if it's referenced by existing entities.
 */
export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  // Optional: Clean up references in Reel/Blog/Project models
  return category;
};
