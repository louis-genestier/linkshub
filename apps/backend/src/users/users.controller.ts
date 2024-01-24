import { Hono } from "hono";
import { IsAuthContext, isAuth } from "../middleware/isAuth.ts";

const app = new Hono();

app.use("*", isAuth());

app.get("/me", async (c: IsAuthContext) => {
  const userId = c.get("userId");

  return c.json({ message: `Logged in ${userId}` });
});

export default app;
