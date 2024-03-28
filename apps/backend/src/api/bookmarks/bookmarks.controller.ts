import { Hono } from "hono";
import { isAuth } from "../../middlewares/isAuth.ts";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  createBookmark,
  deleteBookmarkById,
  getBookmarkById,
  getUserBookmarks,
  updateBookmarkById,
} from "../../database/models/bookmarks.model.ts";
import type { User, Session } from "lucia";
import { getTitleFromUrl } from "../../utils/getTitleFromUrl.ts";

const app = new Hono<{
  Variables: {
    user: User;
    session: Session;
  };
}>();

app.use("*", isAuth());

const route = app
  .get("/", async (c) => {
    const { id: userId } = c.get("user");

    const foundBookmarks = await getUserBookmarks(userId);

    return c.json([...foundBookmarks]);
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        url: z.string().url(),
        title: z.string().optional(),
      })
    ),
    async (c) => {
      const { id: userId } = c.get("user");
      const { url, title } = c.req.valid("json");
      let titleFromUrl = "";

      if (!title) {
        titleFromUrl = await getTitleFromUrl(url);
      }

      const createdBookmark = await createBookmark(
        userId,
        url,
        title || titleFromUrl
      );

      return c.json({ ...createdBookmark[0] });
    }
  )
  .get("/:id", async (c) => {
    const { id: userId } = c.get("user");
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
  .delete("/:id", async (c) => {
    const { id: userId } = c.get("user");
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
    zValidator(
      "json",
      z.object({
        url: z.string().url(),
        title: z.string().optional(),
      })
    ),
    async (c) => {
      const { id: userId } = c.get("user");
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
