import { mkdir } from "fs/promises";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

export const DATABASE_URL =
  process.env.DATABASE_URL ?? (isProduction ? "file:/data/dev.db" : "file:./dev.db");

export const UPLOAD_DIR =
  process.env.UPLOAD_DIR ??
  (isProduction ? "/data/uploads" : path.join(process.cwd(), "public", "uploads"));

export async function ensureRuntimeDirs() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}
