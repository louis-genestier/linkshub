import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from ".";

const runMigrations = async () => {
  await migrate(db, {
    migrationsFolder: "./src/database/migrations",
  });

  console.log("Migrations complete");
};

runMigrations();
