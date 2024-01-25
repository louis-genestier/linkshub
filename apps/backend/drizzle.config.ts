import type { Config } from "drizzle-kit";

export default {
  driver: "better-sqlite",
  dbCredentials: {
    url: "db.sqlite",
  },
  schema: "./src/database/schemas/*.ts",
  out: "./src/database/migrations",
} satisfies Config;
