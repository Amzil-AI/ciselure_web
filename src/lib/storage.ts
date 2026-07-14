import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { uploadToCloudinary, isCloudinaryConfigured } from "./cloudinary";
import { UPLOAD_DIR } from "./config";

export async function storeImage(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (isCloudinaryConfigured()) {
    return uploadToCloudinary(buffer, file.name);
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return filename;
}

export async function storeLocalFile(relativePath: string) {
  const absolutePath = path.join(process.cwd(), relativePath);
  const buffer = await readFile(absolutePath);
  const filename = path.basename(relativePath);

  if (isCloudinaryConfigured()) {
    return uploadToCloudinary(buffer, filename);
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const dest = path.join(UPLOAD_DIR, filename);
  await writeFile(dest, buffer);
  return filename;
}
