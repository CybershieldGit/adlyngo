import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Reel title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    reelUrl: {
      type: String,
      required: [true, "Reel video URL is required"],
    },
    thumbnail: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

// Compound index for default listing query
reelSchema.index({ published: 1, order: 1, createdAt: -1 });

const Reel = mongoose.models.Reel || mongoose.model("Reel", reelSchema);

export default Reel;
