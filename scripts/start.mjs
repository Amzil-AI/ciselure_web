import { execSync } from "child_process";
import { access, cp, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const isProduction = process.env.NODE_ENV === "production";
const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

process.env.DATABASE_URL ??= isProduction ? "file:/data/dev.db" : "file:./dev.db";
process.env.UPLOAD_DIR ??= isProduction ? "/data/uploads" : "public/uploads";

await mkdir(process.env.UPLOAD_DIR, { recursive: true });

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

execSync("npx prisma migrate deploy", { stdio: "inherit", env: process.env });
execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env: process.env });
execSync("npm run start", { stdio: "inherit", env: process.env });
