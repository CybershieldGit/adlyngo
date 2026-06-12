import Client from "../models/Client.js";
import ApiError from "../utils/ApiError.js";
import { uniqueSlug } from "../utils/slugify.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";
import { deleteUploadedFile } from "./upload.service.js";

/**
 * Create a new client.
 */
export const createClient = async (clientData) => {
  const { name, logo, description, website } = clientData;
  const slug = await uniqueSlug(name, Client);

  const client = await Client.create({ name, slug, logo, description, website });
  return client;
};

/**
 * Retrieve all clients with pagination.
 */
export const getClients = async (query = {}) => {
  const filter = {};
  if (query.search) {
    filter.name = { $regex: query.search, $options: "i" };
  }
  
  const { page, limit, skip } = parsePagination(query);

  const [clients, totalDocs] = await Promise.all([
    Client.find(filter).sort("-createdAt").skip(skip).limit(limit),
    Client.countDocuments(filter),
  ]);

  return {
    clients,
    meta: buildPaginationMeta(page, limit, totalDocs),
  };
};

/**
 * Get a single client by ID.
 */
export const getClientById = async (id) => {
  const client = await Client.findById(id);
  if (!client) {
    throw new ApiError(404, "Client not found");
  }
  return client;
};

/**
 * Update an existing client.
 */
export const updateClient = async (id, updateData) => {
  const client = await Client.findById(id);
  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  const updates = { ...updateData };

  // Re-slugify if name changed
  if (updates.name && updates.name !== client.name) {
    updates.slug = await uniqueSlug(updates.name, Client, client._id);
  }

  if (updates.logo?.url && client.logo?.publicId && updates.logo.url !== client.logo.url) {
    deleteUploadedFile(client.logo.publicId);
  }

  const updatedClient = await Client.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return updatedClient;
};

/**
 * Delete a client.
 */
export const deleteClient = async (id) => {
  const client = await Client.findByIdAndDelete(id);
  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  if (client.logo?.publicId) {
    deleteUploadedFile(client.logo.publicId);
  }

  return client;
};
