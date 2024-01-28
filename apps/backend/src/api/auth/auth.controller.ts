import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import {
  createUser,
  getUserByUsername,
} from "../../database/models/users.model.ts";
import { lucia } from "../../auth/lucia.ts";
import { ErrorWithHttpCode } from "../../utils/errorWithHttpCode.ts";

const authValidator = z.object({
  username: z.string(),
  password: z.string(),
});

const app = new Hono();

const route = app
  .post("/signup", zValidator("json", authValidator), async (c) => {
    const { username, password } = c.req.valid("json");
    const userId = generateId(15);
    const user = await createUser(username, password, userId);
    const session = await lucia.createSession(userId, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);

    c.header("Set-Cookie", sessionCookie.serialize());
    return c.json({ ...user });
  })
  .post("/login", zValidator("json", authValidator), async (c) => {
    const { username, password } = c.req.valid("json");

    const user = await getUserByUsername(username);

    const validPassword = await new Argon2id().verify(
      user.hashedPassword,
      password
    );

    if (!validPassword) {
      throw new ErrorWithHttpCode("Incorrect username or password", 400);
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);

    c.header("Set-Cookie", sessionCookie.serialize());
    return c.json({ message: "Logged in" });
  });

export default app;

export type AuthAppType = typeof route;
