import { createClient } from "@libsql/client";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function isTursoConfigured() {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

function splitSqlStatements(sql) {
  return sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function applyTursoMigrations() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      id TEXT PRIMARY KEY,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const migrationsDir = path.join(projectRoot, "prisma", "migrations");
  const migrationDirs = (await readdir(migrationsDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const migrationId of migrationDirs) {
    const existing = await client.execute({
      sql: "SELECT id FROM _prisma_migrations WHERE id = ?",
      args: [migrationId],
    });

    if (existing.rows.length > 0) {
      console.log(`Migration already applied: ${migrationId}`);
      continue;
    }

    const migrationPath = path.join(migrationsDir, migrationId, "migration.sql");
    const sql = await readFile(migrationPath, "utf8");
    const statements = splitSqlStatements(sql);

    for (const statement of statements) {
      await client.execute(statement);
    }

    await client.execute({
      sql: "INSERT INTO _prisma_migrations (id) VALUES (?)",
      args: [migrationId],
    });

    console.log(`Applied migration: ${migrationId}`);
  }
}

async function main() {
  if (isTursoConfigured()) {
    console.log("Applying migrations to Turso...");
    await applyTursoMigrations();
    return;
  }

  console.log("Applying migrations to local SQLite...");
  const { execSync } = await import("child_process");
  execSync("npx prisma migrate deploy", { stdio: "inherit", env: process.env });
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
