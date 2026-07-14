import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function getCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

export async function uploadToCloudinary(buffer: Buffer, originalName: string) {
  const cloudinaryClient = getCloudinary();
  const publicId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinaryClient.uploader.upload_stream(
      {
        folder: "ciselure",
        public_id: publicId,
        resource_type: "image",
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ secure_url: uploadResult.secure_url });
      }
    );
    stream.end(buffer);
  });

  return result.secure_url;
}

export async function deleteFromCloudinary(filenameOrUrl: string) {
  if (!isCloudinaryConfigured() || !filenameOrUrl.startsWith("http")) {
    return;
  }

  const publicId = getPublicIdFromUrl(filenameOrUrl);
  if (!publicId) return;

  const cloudinaryClient = getCloudinary();
  await cloudinaryClient.uploader.destroy(publicId);
}

function getPublicIdFromUrl(url: string) {
  const marker = "/upload/";
  const index = url.indexOf(marker);
  if (index === -1) return null;

  let path = url.slice(index + marker.length);
  if (/^v\d+\//.test(path)) {
    path = path.replace(/^v\d+\//, "");
  }

  return path.replace(/\.[^/.]+$/, "");
}
