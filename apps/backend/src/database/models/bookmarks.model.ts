import { db } from "../index.ts";
import { bookmark } from "../schemas/bookmark.ts";
import { eq } from "drizzle-orm";

export const getUserBookmarks = async (userId: string) =>
  await db.query.bookmark.findMany({
    where: eq(bookmark.userId, userId),
  });

export const createBookmark = async (
  userId: string,
  url: string,
  title: string | undefined
) =>
  await db
    .insert(bookmark)
    .values({
      userId,
      url,
      title,
    })
    .returning({
      id: bookmark.id,
      url: bookmark.url,
      title: bookmark.title,
    });

export const getBookmarkById = async (id: number) =>
  await db.query.bookmark.findFirst({
    where: eq(bookmark.id, id),
  });

export const deleteBookmarkById = async (id: number) =>
  await db.delete(bookmark).where(eq(bookmark.id, id));

export const updateBookmarkById = async (
  id: number,
  url: string,
  title: string | undefined
) =>
  await db
    .update(bookmark)
    .set({
      url,
      title,
    })
    .where(eq(bookmark.id, id))
    .returning({
      id: bookmark.id,
      url: bookmark.url,
      title: bookmark.title,
    });
