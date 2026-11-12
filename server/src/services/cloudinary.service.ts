import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";
import { ApiError } from "../utils/api-error";

const isConfigured = Boolean(
  env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET,
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface UploadedImage {
  url: string;
  publicId: string;
}

/** Upload a hotel or room photo buffer (received by Multer) to Cloudinary. */
export async function uploadImage(
  buffer: Buffer,
  folder = "josstay/hotels",
): Promise<UploadedImage> {
  if (!isConfigured) {
    throw new ApiError(
      503,
      "Cloudinary is not configured. Add the CLOUDINARY_* variables to server/.env.",
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 2400, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(new ApiError(502, "The photo could not be uploaded."));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );

    stream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!isConfigured) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("[cloudinary] Could not delete image:", error);
  }
}
