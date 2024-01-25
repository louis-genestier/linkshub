import { Context, Next } from "hono";
import { auth } from "../auth/lucia.ts";

export type IsAuthContext = Context<{
  Variables: {
    userId: string;
  };
}>;

export const isAuth = () => {
  return async (c: IsAuthContext, next: Next) => {
    const authRequest = await auth.handleRequest(c);
    const session = await authRequest.validate();

    if (!session) {
      c.status(401);
      return c.json({ message: "Not logged in" });
    }

    c.set("userId", session.user.userId);

    await next();
  };
};
