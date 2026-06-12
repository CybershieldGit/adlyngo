import mongoose from "mongoose";

const schema = new mongoose.Schema({
  key: { type: String, unique: true, default: "global" },
  maintenanceMode: { type: Boolean, default: false },
});

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", schema);
