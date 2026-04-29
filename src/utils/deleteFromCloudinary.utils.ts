import logger from "../logger/winston.logger.js";
import { cloudinary } from "../services/cloudinary.service.js";

const deleteFromCloudinary = async (imageUrl: string) => {
  try {
    const parts = imageUrl.split("/");

    const fileName = parts.pop();

    if (!fileName) return;

    const uploadIndex = parts.indexOf("upload");

    const pathParts = parts.slice(uploadIndex + 2);

    const publicId = pathParts.join("/") + "/" + fileName.split(".")[0];

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error(`❌ Failed to delete image from Cloudinary:`, error);
  }
};

export { deleteFromCloudinary };
