import { Context, Next } from "hono";
import { ExtendedVariables } from "../index.ts";
import { getCookie } from "hono/cookie";
import { lucia } from "../auth/lucia.ts";

export const validateSession = () => {
  return async (c: Context<{ Variables: ExtendedVariables }>, next: Next) => {
    const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

    if (!sessionId) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }
    const { session, user } = await lucia.validateSession(sessionId);

    if (session && session.fresh) {
      c.header(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
        {
          append: true,
        }
      );
    }

    if (!session) {
      c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
        append: true,
      });
    }

    c.set("user", user);
    c.set("session", session);

    return next();
  };
};
