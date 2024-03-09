import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import auth from "./api/auth/auth.controller.ts";
import users from "./api/users/users.controller.ts";
import bookmarks from "./api/bookmarks/bookmarks.controller.ts";
import { ErrorWithHttpCode } from "./utils/errorWithHttpCode.ts";

import type { User, Session } from "lucia";
import { csrf } from "hono/csrf";
import { validateSession } from "./middlewares/validateSession.ts";

const port = 3000;

export type ExtendedVariables = {
  user: User | null;
  session: Session | null;
};

const app = new Hono<{
  Variables: ExtendedVariables;
}>();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (origin) => "http://127.0.0.1:5173",
    credentials: true,
  })
);

// CSRF middleware
app.use(
  "*",
  csrf({
    origin: "http://127.0.0.1:5173",
  })
);

app.use("*", validateSession());

const route = app
  .route("/auth", auth)
  .route("/users", users)
  .route("/bookmarks", bookmarks)
  .onError((e, c) => {
    if (e instanceof ErrorWithHttpCode) {
      c.status(e.httpCode);
      return c.json({ error: e.message });
    }

    console.error(e);

    c.status(500);
    return c.json({ message: "An unknown error occurred" });
  });

serve({
  fetch: app.fetch,
  port,
});

export type AppType = typeof route;
