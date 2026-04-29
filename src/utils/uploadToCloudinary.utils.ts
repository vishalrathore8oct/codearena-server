import { cloudinary } from "../services/cloudinary.service.js";

const uploadToCloudinary = async (fileBuffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "codearena/profile" }, (error, result) => {
        if (error) return reject(error);
        if (!result) return reject("Upload failed");

        resolve(result.secure_url);
      })
      .end(fileBuffer);
  });
};

export { uploadToCloudinary };
