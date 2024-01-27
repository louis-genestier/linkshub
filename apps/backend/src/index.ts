import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import auth from "./api/auth/auth.controller.ts";
import users from "./api/users/users.controller.ts";
import bookmarks from "./api/bookmarks/bookmarks.controller.ts";

const port = 3000;

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

const route = app
  .route("/auth", auth)
  .route("/users", users)
  .route("/bookmarks", bookmarks);

serve({
  fetch: app.fetch,
  port,
});

export type AppType = typeof route;
