import { Hono } from "hono";
import { isAuth } from "../middleware/isAuth.ts";
import { db } from "../database/index.ts";
import { eq } from "drizzle-orm";
import { user } from "../database/schemas/user.ts";

const app = new Hono();

app.get("/me", isAuth(), async (c) => {
  const userId = c.get("userId");

  const foundUser = await db.query.user.findFirst({
    where: eq(user.id, userId),
    with: {
      bookmarks: true,
    },
  });

  return c.json({ ...foundUser });
});

export default app;
