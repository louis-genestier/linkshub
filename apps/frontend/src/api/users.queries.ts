import { UserAppType } from "@repo/backend/src/api/users/users.controller";
import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";
import { ApiError } from "./apiError";

const userClient = hc<UserAppType>("/api/users/");

const getCurrentUser = async () => {
  const res = await userClient.me.$get();

  if (res.status === 401) {
    return Promise.reject(new ApiError("Unauthorized", 401));
  }

  return res.json();
};

export const userQueryOptions = queryOptions({
  queryKey: ["currentUser"],
  queryFn: getCurrentUser,
});
