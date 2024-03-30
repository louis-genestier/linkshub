import { AuthAppType } from "@repo/backend/src/api/auth/auth.controller";
import { useMutation } from "@tanstack/react-query";
import { hc } from "hono/client";
import { useAuthStore } from "../stores/user-store";
import { ApiError } from "./apiError";

const authClient = hc<AuthAppType>("/api/auth/");

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (payload: { username: string; password: string }) => {
      const res = await authClient.login.$post({
        json: payload,
      });

      if (res.status === 400) {
        return Promise.reject(new ApiError("Invalid credentials", 400));
      }

      const user = await res.json();
      useAuthStore.getState().setUser(user);
      return user;
    },
  });
