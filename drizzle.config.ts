import "dotenv/config";
import type { Config } from "drizzle-kit";
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}
export default {
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    // host: process.env.DB_HOST!,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME!,
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
