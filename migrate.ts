import { db } from "@/drizzle/client";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const startMigration = async () => {
  await migrate(db, { migrationsFolder: "drizzle" });
};
startMigration();
