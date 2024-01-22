import { auth } from "./lucia.js";

export const createUserWithUsername = async (
  username: string,
  password: string
) => {
  return await auth.createUser({
    attributes: {
      username,
    },
    key: {
      password,
      providerId: "username",
      providerUserId: username,
    },
  });
};

export const createCookieSession = async (userId: string) => {
  const session = await auth.createSession({
    userId: userId,
    attributes: {},
  });
  const sessionCookie = auth.createSessionCookie(session);

  return sessionCookie.serialize();
};

export const getUserKeyByUsername = async (
  username: string,
  password: string
) => {
  const key = await auth.useKey("username", username, password);
  return key;
};
