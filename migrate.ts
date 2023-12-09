import { db, sql } from "@/drizzle/client";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
const startMigration = async () => {
  console.log("starting migration...");
  await migrate(db, { migrationsFolder: "src/drizzle/migrations" }).then(() =>
    sql.end()
  );
  console.log(migrate);
  console.log("Migration completed!");
};
startMigration();
