import { Hono } from "hono";
import { isAuth } from "../middleware/isAuth.ts";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  createBookmark,
  deleteBookmarkById,
  getBookmarkById,
  getUserBookmarks,
  updateBookmarkById,
} from "./bookmarks.model.ts";

const app = new Hono();

const route = app
  .get("/", isAuth(), async (c) => {
    const userId = c.get("userId");

    const foundBookmarks = await getUserBookmarks(userId);

    return c.json([...foundBookmarks]);
  })
  .post(
    "/",
    isAuth(),
    zValidator(
      "json",
      z.object({
        url: z.string().url(),
        title: z.string().optional(),
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const { url, title } = c.req.valid("json");

      const createdBookmark = await createBookmark(userId, url, title);

      return c.json({ ...createdBookmark[0] });
    }
  )
  .get("/:id", isAuth(), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");

    const foundBookmark = await getBookmarkById(+id);

    if (!foundBookmark) {
      c.status(404);
      return c.json({ message: "Bookmark not found" });
    }

    if (foundBookmark.userId !== userId) {
      c.status(401);
      return c.json({ message: "Unauthorized" });
    }

    return c.json({ ...foundBookmark });
  })
  .delete("/:id", isAuth(), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");

    const foundBookmark = await getBookmarkById(+id);

    if (!foundBookmark) {
      c.status(404);
      return c.json({ message: "Bookmark not found" });
    }

    if (foundBookmark.userId !== userId) {
      c.status(401);
      return c.json({ message: "Unauthorized" });
    }

    await deleteBookmarkById(+id);

    return c.json({ message: "Bookmark deleted" });
  })
  .put(
    "/:id",
    isAuth(),
    zValidator(
      "json",
      z.object({
        url: z.string().url(),
        title: z.string().optional(),
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const { url, title } = c.req.valid("json");

      const foundBookmark = await getBookmarkById(+id);

      if (!foundBookmark) {
        c.status(404);
        return c.json({ message: "Bookmark not found" });
      }

      if (foundBookmark.userId !== userId) {
        c.status(401);
        return c.json({ message: "Unauthorized" });
      }

      const updatedBookmark = await updateBookmarkById(+id, url, title);

      return c.json({ ...updatedBookmark[0] });
    }
  );

export default app;

export type BookmarkAppType = typeof route;
