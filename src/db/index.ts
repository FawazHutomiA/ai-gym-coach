import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { dbSchema } from "./schema";

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle<typeof dbSchema>> | undefined;
};

/**
 * Neon HTTP driver — cocok untuk Next.js / Vercel (serverless, tanpa WebSocket).
 * @see https://neon.tech/docs/serverless/serverless-driver
 */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!globalForDb.db) {
    const sql = neon(url);
    globalForDb.db = drizzle(sql, { schema: dbSchema });
  }
  return globalForDb.db;
}
