import path from "path";
import env from "./env.js";

const isProduction = env.NODE_ENV === "production";

const uploadRoot =
  env.UPLOAD_ROOT ||
  (isProduction ? "/www/wwwroot/uploads" : path.join(process.cwd(), "uploads"));

const imagesDir = env.UPLOAD_DIR_IMAGES || path.join(uploadRoot, "images");
const videosDir = env.UPLOAD_DIR_VIDEOS || path.join(uploadRoot, "videos");

const baseUrl =
  env.UPLOAD_BASE_URL ||
  (isProduction
    ? "https://admin.adlyngo.com/uploads"
    : `http://localhost:${env.PORT}/uploads`);

const uploadConfig = Object.freeze({
  imagesDir,
  videosDir,
  baseUrl: baseUrl.replace(/\/$/, ""),
});

export default uploadConfig;
