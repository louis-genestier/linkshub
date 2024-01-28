import { Hono } from "hono";
import type { User, Session } from "lucia";
import { ErrorWithHttpCode } from "../../utils/errorWithHttpCode.ts";

const app = new Hono<{
  Variables: {
    user: User | null;
    session: Session | null;
  };
}>();

const route = app.get("/me", async (c) => {
  const user = c.get("user");

  if (!user) {
    throw new ErrorWithHttpCode("Unauthorized", 401);
  }

  return c.json({
    ...user,
  });
});

export default app;

export type UserAppType = typeof route;
