import mongoose from "mongoose";
import { CATEGORY_TYPES } from "../constants/index.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    type: {
      type: String,
      required: [true, "Category type is required"],
      enum: {
        values: Object.values(CATEGORY_TYPES),
        message: `Type must be one of: ${Object.values(CATEGORY_TYPES).join(", ")}`,
      },
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

// Compound index: unique name per type
categorySchema.index({ name: 1, type: 1 }, { unique: true });

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
