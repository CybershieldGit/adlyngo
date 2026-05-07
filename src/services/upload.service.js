import cloudinary from "../lib/cloudinary.js";
import ApiError from "../utils/ApiError.js";

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer from Multer.
 * @param {string} folder - The Cloudinary folder to upload to.
 * @returns {Promise<Object>} - Cloudinary upload result containing url and public_id.
 */
export const uploadBufferToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto", // Automatically detect image or video
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(new ApiError(500, "Failed to upload file to Cloudinary"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    // Write the buffer to the stream and end it
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete an asset from Cloudinary.
 * @param {string} publicId - The public ID of the asset to delete.
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    // Determine resource type if possible, or attempt destruction.
    // Cloudinary destroy defaults to image. If video, resource_type must be specified.
    // A more robust approach might store resource_type in DB, but for simplicity we try both.
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "not found") {
       await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    }
  } catch (error) {
    console.error(`Failed to delete asset ${publicId} from Cloudinary:`, error);
    // Non-fatal error, log and continue.
  }
};
