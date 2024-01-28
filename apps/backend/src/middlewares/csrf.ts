import { Context, Next } from "hono";
import { verifyRequestOrigin } from "lucia";
import { ErrorWithHttpCode } from "../utils/errorWithHttpCode.ts";

export const csrf = () => {
  return async (c: Context, next: Next) => {
    if (c.req.method === "GET" || process.env.NODE_ENV !== "production") {
      return next();
    }
    const originHeader = c.req.header("origin");
    const hostHeader = c.req.raw.headers.get("host");

    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      throw new ErrorWithHttpCode("", 403);
    }

    return next();
  };
};
