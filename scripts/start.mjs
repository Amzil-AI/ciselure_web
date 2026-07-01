import { execSync } from "child_process";
import { mkdir } from "fs/promises";

const isProduction = process.env.NODE_ENV === "production";

process.env.DATABASE_URL ??= isProduction ? "file:/data/dev.db" : "file:./dev.db";
process.env.UPLOAD_DIR ??= isProduction ? "/data/uploads" : "public/uploads";

await mkdir(process.env.UPLOAD_DIR, { recursive: true });

execSync("npx prisma migrate deploy", { stdio: "inherit", env: process.env });
execSync("npm run start", { stdio: "inherit", env: process.env });
