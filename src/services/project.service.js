import Project from "../models/Project.js";
import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";
import { uniqueSlug } from "../utils/slugify.js";
import { buildQuery } from "../utils/queryBuilder.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";
import { deleteFromCloudinary } from "./upload.service.js";

export const getProjects = async (queryData) => {
  const { filter, sort } = buildQuery(queryData, ["title", "technologies", "clientName"]);
  const { page, limit, skip } = parsePagination(queryData);

  const [projects, totalDocs] = await Promise.all([
    Project.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Project.countDocuments(filter),
  ]);

  return {
    projects,
    meta: buildPaginationMeta(page, limit, totalDocs),
  };
};

export const getProjectBySlug = async (slug) => {
  const project = await Project.findOne({ slug }).populate("category", "name slug");
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  return project;
};

export const createProject = async (projectData) => {
  const slug = await uniqueSlug(projectData.title, Project);
  const project = await Project.create({ ...projectData, slug });
  return project.populate("category", "name slug");
};

export const updateProject = async (id, updateData) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (updateData.title && updateData.title !== project.title) {
    updateData.slug = await uniqueSlug(updateData.title, Project, id);
  }

  // Handle Cover Image replacement
  if (updateData.coverImage && project.coverImage?.publicId) {
    deleteFromCloudinary(project.coverImage.publicId);
  }

  // Note: Appending/removing from gallery should ideally have its own dedicated endpoints,
  // but for simplicity, if a new gallery array is passed, we replace the old one and clean up.
  if (updateData.gallery) {
    if (project.gallery?.length > 0) {
      project.gallery.forEach((img) => deleteFromCloudinary(img.publicId));
    }
  }

  Object.assign(project, updateData);
  await project.save();

  return project.populate("category", "name slug");
};

export const deleteProject = async (id) => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.coverImage?.publicId) {
    deleteFromCloudinary(project.coverImage.publicId);
  }
  
  if (project.gallery?.length > 0) {
    project.gallery.forEach((img) => deleteFromCloudinary(img.publicId));
  }

  return project;
};
