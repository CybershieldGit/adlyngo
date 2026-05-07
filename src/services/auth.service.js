import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";

/**
 * Generate a JWT for a user ID.
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Authenticate admin by email and password.
 * @returns {Promise<{ admin: Object, token: string }>}
 */
export const loginAdmin = async (email, password) => {
  // Find admin and select password (excluded by default)
  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Update last login
  admin.lastLoginAt = new Date();
  await admin.save();

  const token = generateToken(admin._id);

  // Return clean admin object (JSON transform removes password)
  return { admin: admin.toJSON(), token };
};

/**
 * Retrieve current admin profile.
 */
export const getAdminProfile = async (adminId) => {
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(404, "Admin profile not found");
  }
  return admin;
};
