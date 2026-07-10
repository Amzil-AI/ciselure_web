import path from "path";

export function isTursoConfigured() {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

export function getLibSqlConfig() {
  if (isTursoConfigured()) {
    return {
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    };
  }

  const isProduction = process.env.NODE_ENV === "production";
  const dataDir = path.join(process.cwd(), ".data");

  const url =
    process.env.DATABASE_URL ??
    (isProduction ? `file:${path.join(dataDir, "dev.db")}` : "file:./dev.db");

  return { url };
}
