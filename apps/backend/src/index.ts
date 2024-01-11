import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { z } from "zod";

const port = 3000;

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

const route = app
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .get(
    "/hello",
    zValidator(
      "query",
      z.object({
        name: z.string(),
      })
    ),
    (c) => {
      const { name } = c.req.valid("query");
      return c.json({ message: `Hello ${name}!` });
    }
  );

serve({
  fetch: app.fetch,
  port,
});

export type AppType = typeof route;
