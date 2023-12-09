import * as schema from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
export const db = drizzle(sql, { schema });
