import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
      default: "",
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    thumbnail: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    // SEO fields
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [70, "SEO title should not exceed 70 characters"],
      default: "",
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: [160, "SEO description should not exceed 160 characters"],
      default: "",
    },

    published: {
      type: Boolean,
      default: false,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

// Full-text search index on title and content
blogSchema.index({ title: "text", content: "text", tags: "text" });

// Compound index for public listing
blogSchema.index({ published: 1, featured: -1, createdAt: -1 });

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
