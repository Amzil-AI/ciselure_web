import { mkdir } from "fs/promises";
import path from "path";

export async function resolveRuntimePaths(projectRoot, isProduction) {
  if (process.env.DATABASE_URL && process.env.UPLOAD_DIR) {
    await mkdir(process.env.UPLOAD_DIR, { recursive: true });
    return {
      databaseUrl: process.env.DATABASE_URL,
      uploadDir: process.env.UPLOAD_DIR,
    };
  }

  const candidates = isProduction
    ? ["/data", path.join(projectRoot, ".data")]
    : [path.join(projectRoot, "public", "uploads")];

  let dataDir = null;

  for (const candidate of candidates) {
    try {
      await mkdir(candidate, { recursive: true });
      dataDir = candidate;
      break;
    } catch (error) {
      if (error.code === "EACCES" || error.code === "EPERM" || error.code === "ENOENT") {
        console.warn(`Cannot write to ${candidate}, trying next location...`);
        continue;
      }
      throw error;
    }
  }

  if (!dataDir) {
    throw new Error("Could not find a writable directory for database and uploads.");
  }

  if (isProduction) {
    const uploadDir = path.join(dataDir, "uploads");
    await mkdir(uploadDir, { recursive: true });
    return {
      databaseUrl: `file:${path.join(dataDir, "dev.db")}`,
      uploadDir,
    };
  }

  return {
    databaseUrl: "file:./dev.db",
    uploadDir: dataDir,
  };
}
