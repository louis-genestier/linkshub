import { AuthAppType } from "@repo/backend/src/api/auth/auth.controller";
import { useMutation } from "@tanstack/react-query";
import { hc } from "hono/client";
import { useAuthStore } from "../stores/user-store";

const authClient = hc<AuthAppType>("/api/auth/");

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (payload: { username: string; password: string }) => {
      const res = await authClient.login.$post({
        json: payload,
      });

      const user = await res.json();
      useAuthStore.getState().setUser(user);
      return user;
    },
  });
