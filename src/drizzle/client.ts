import postgres from "postgres";
import * as schema from "@/drizzle/schema";

import { drizzle } from "drizzle-orm/postgres-js";
const client = postgres({ ssl: "require" });
export const db = drizzle(client, { schema });
