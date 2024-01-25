import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./user.ts";

export const bookmark = sqliteTable("bookmark", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  title: text("title"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("update_at").default(sql`CURRENT_TIMESTAMP`),
  userId: text("user_id").notNull(),
});

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
  owner: one(user, {
    fields: [bookmark.userId],
    references: [user.id],
  }),
}));
