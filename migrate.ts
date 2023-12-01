import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// // for migrations
// const migrationClient = postgres(
//   "postgres://xzanuwbb:gKUrI313K_Iq24T8hjMowQ6-uXFC088v@flora.db.elephantsql.com/xzanuwbb",
//   { max: 1 }
// );

// // for query purposes
// const queryClient = postgres(
//   "postgres://xzanuwbb:gKUrI313K_Iq24T8hjMowQ6-uXFC088v@flora.db.elephantsql.com/xzanuwbb"
// );
// const db = drizzle(queryClient);
const client = postgres({ ssl: "require" });
const db: PostgresJsDatabase = drizzle(client);

const main = async () => {
  await migrate(db, { migrationsFolder: "drizzle" });
};
main();
