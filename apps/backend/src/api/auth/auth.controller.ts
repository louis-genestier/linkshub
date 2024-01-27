import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { SqliteError } from "better-sqlite3";
import {
  createCookieSession,
  createUserWithUsername,
  getUserKeyByUsername,
} from "../../auth/utils.ts";
import { LuciaError } from "lucia";

const authValidator = z.object({
  username: z.string(),
  password: z.string(),
});

const app = new Hono();

const route = app
  .post("/signup", zValidator("json", authValidator), async (c) => {
    try {
      const { username, password } = c.req.valid("json");
      const user = await createUserWithUsername(username, password);
      const cookie = await createCookieSession(user.userId);
      c.header("Set-Cookie", cookie);
      return c.json({ message: "Signed up" });
    } catch (e) {
      if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
        c.status(400);
        return c.json({ message: "Username already exists" });
      }

      c.status(500);
      return c.json({ message: "An unknown error occurred" });
    }
  })
  .post("/login", zValidator("json", authValidator), async (c) => {
    const { username, password } = c.req.valid("json");
    try {
      const userKey = await getUserKeyByUsername(username, password);
      const cookie = await createCookieSession(userKey.userId);
      c.header("Set-Cookie", cookie);
      return c.json({ message: "Logged in" });
    } catch (e) {
      if (
        e instanceof LuciaError &&
        (e.message === "AUTH_INVALID_KEY_ID" ||
          e.message === "AUTH_INVALID_PASSWORD")
      ) {
        c.status(400);
        return c.json({ message: "Incorrect username or password" });
      }

      c.status(500);
      return c.json({ message: "An unknown error occurred" });
    }
  });

export default app;

export type AuthAppType = typeof route;
