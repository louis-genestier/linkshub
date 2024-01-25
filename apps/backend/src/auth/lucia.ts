import { lucia } from "lucia";
import { hono } from "lucia/middleware";
import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import { sqliteDatabase } from "../database/index.js";

export const auth = lucia({
  env: "DEV",
  middleware: hono(),
  adapter: betterSqlite3(sqliteDatabase, {
    user: "user",
    key: "user_key",
    session: "user_session",
  }),
  getUserAttributes: (user) => ({ username: user.username }),
  sessionCookie: {
    expires: false,
  },
  csrfProtection: false, // TODO: configure csrf protection
});

export type Auth = typeof auth;
