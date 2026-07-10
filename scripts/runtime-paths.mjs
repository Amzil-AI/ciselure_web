import { mkdir } from "fs/promises";
import path from "path";

export function isTursoConfigured() {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

export async function resolveUploadDir(projectRoot, isProduction) {
  if (process.env.UPLOAD_DIR) {
    await mkdir(process.env.UPLOAD_DIR, { recursive: true });
    return process.env.UPLOAD_DIR;
  }

  const candidates = isProduction
    ? ["/data", path.join(projectRoot, ".data", "uploads")]
    : [path.join(projectRoot, "public", "uploads")];

  for (const candidate of candidates) {
    try {
      await mkdir(candidate, { recursive: true });
      return candidate;
    } catch (error) {
      if (error.code === "EACCES" || error.code === "EPERM" || error.code === "ENOENT") {
        console.warn(`Cannot write to ${candidate}, trying next location...`);
        continue;
      }
      throw error;
    }
  }

  throw new Error("Could not find a writable directory for uploads.");
}
