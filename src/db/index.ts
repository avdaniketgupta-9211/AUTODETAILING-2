import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Page-data collection runs at build time, including on previews that do not
 * carry the production DATABASE_URL. Creating a Pool is lazy (no connection is
 * opened until a query), so a placeholder keeps builds working; routes that
 * actually query still fail clearly at request time when no URL is configured.
 */
const connectionString =
  process.env.DATABASE_URL || "postgresql://invalid:invalid@127.0.0.1:5432/invalid";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
