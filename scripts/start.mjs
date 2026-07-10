import { execSync } from "child_process";
import { access, cp } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { isTursoConfigured, resolveUploadDir } from "./runtime-paths.mjs";

const isProduction = process.env.NODE_ENV === "production";
const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

process.env.UPLOAD_DIR = await resolveUploadDir(projectRoot, isProduction);

if (isTursoConfigured()) {
  console.log("Using Turso database");
  console.log(`TURSO_DATABASE_URL=${process.env.TURSO_DATABASE_URL}`);
} else {
  process.env.DATABASE_URL ??= isProduction
    ? `file:${path.join(projectRoot, ".data", "dev.db")}`
    : "file:./dev.db";
  console.log(`Using DATABASE_URL=${process.env.DATABASE_URL}`);
}

console.log(`Using UPLOAD_DIR=${process.env.UPLOAD_DIR}`);

for (const file of ["sample-1.jpeg", "sample-2.jpeg"]) {
  const src = path.join(projectRoot, "public", "uploads", file);
  const dest = path.join(process.env.UPLOAD_DIR, file);
  try {
    await access(dest);
  } catch {
    try {
      await cp(src, dest);
    } catch (error) {
      console.warn(`Could not copy ${file}:`, error.message);
    }
  }
}

execSync("node scripts/apply-migrations.mjs", { stdio: "inherit", env: process.env });
execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env: process.env });
execSync("npm run start", { stdio: "inherit", env: process.env });
