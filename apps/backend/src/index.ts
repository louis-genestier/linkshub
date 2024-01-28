import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import auth from "./api/auth/auth.controller.ts";
import users from "./api/users/users.controller.ts";
import bookmarks from "./api/bookmarks/bookmarks.controller.ts";
import { ErrorWithHttpCode } from "./utils/errorWithHttpCode.ts";

import type { User, Session } from "lucia";
import { showRoutes } from "hono/dev";
import { csrf } from "./middlewares/csrf.ts";
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
app.use("*", cors());

// CSRF middleware
app.use("*", csrf());

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

if (process.env.NODE_ENV !== "production") {
  showRoutes(route);
}

export type AppType = typeof route;
