import { Hono } from "hono";

const app = new Hono();

const route = app.get("/users", async (c) => {
  c.json({});
});

export default app;

export type UserAppType = typeof route;
