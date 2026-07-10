import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { getLibSqlConfig } from "./database";

export function createPrismaClient() {
  const adapter = new PrismaLibSql(getLibSqlConfig());
  return new PrismaClient({ adapter });
}
