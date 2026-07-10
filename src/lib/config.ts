import { mkdir } from "fs/promises";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";
const dataDir = path.join(process.cwd(), ".data");

export const DATABASE_URL =
  process.env.DATABASE_URL ??
  (isProduction ? `file:${path.join(dataDir, "dev.db")}` : "file:./dev.db");

export const UPLOAD_DIR =
  process.env.UPLOAD_DIR ??
  (isProduction ? path.join(dataDir, "uploads") : path.join(process.cwd(), "public", "uploads"));

export async function ensureRuntimeDirs() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}
