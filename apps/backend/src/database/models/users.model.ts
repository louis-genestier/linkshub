import { Argon2id } from "oslo/password";
import { db } from "../index.ts";
import { user } from "../schemas/user.ts";
import { SqliteError } from "better-sqlite3";
import { ErrorWithHttpCode } from "../../utils/errorWithHttpCode.ts";
import { eq } from "drizzle-orm";

export const createUser = async (
  username: string,
  password: string,
  userId: string
) => {
  try {
    const hashedPassword = await new Argon2id().hash(password);

    const [createdUser] = await db
      .insert(user)
      .values({
        hashedPassword,
        id: userId,
        username,
      })
      .returning({ id: user.id, username: user.username });

    return createdUser;
  } catch (e) {
    if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
      throw new ErrorWithHttpCode("Username already exists", 400);
    }

    throw new ErrorWithHttpCode("An unknown error occurred", 500);
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const foundUser = await db.query.user.findFirst({
      where: eq(user.username, username),
    });

    if (!foundUser) {
      throw new ErrorWithHttpCode("User not found", 404);
    }

    return foundUser;
  } catch (e) {
    if (e instanceof ErrorWithHttpCode) {
      throw e;
    }

    throw new ErrorWithHttpCode("An unknown error occurred", 500);
  }
};
