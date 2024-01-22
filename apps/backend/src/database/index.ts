import { drizzle } from "drizzle-orm/better-sqlite3";
import sqlite, { Database } from "better-sqlite3";

export const sqliteDatabase: Database = sqlite("db.sqlite");
export const db = drizzle(sqliteDatabase);
