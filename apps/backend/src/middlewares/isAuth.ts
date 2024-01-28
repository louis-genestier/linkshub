import { Context, Next } from "hono";
import { ExtendedVariables } from "../index.ts";
import { ErrorWithHttpCode } from "../utils/errorWithHttpCode.ts";

export const isAuth = () => {
  return async (c: Context<{ Variables: ExtendedVariables }>, next: Next) => {
    const user = c.get("user");

    if (!user) {
      throw new ErrorWithHttpCode("Unauthorized", 401);
    }

    return next();
  };
};
