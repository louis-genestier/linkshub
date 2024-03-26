import { AuthAppType } from "@repo/backend/src/api/auth/auth.controller";
import { UserAppType } from "@repo/backend/src/api/users/users.controller";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { hc } from "hono/client";
import { useAuthStore } from "../stores/user-store";
import { ApiError } from "../api/apiError";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function Index() {
  const authClient = hc<AuthAppType>("/api/auth/");
  const userClient = hc<UserAppType>("/api/users/");
  const navigate = useNavigate();

  const {
    data: userData,
    refetch: refecthUser,
    isLoading: isUserLoading,
  } = useQuery({
    retry: false,
    queryKey: ["user"],
    queryFn: async () => {
      const res = await userClient.me.$get();

      if (res.status === 401) {
        return Promise.reject(new ApiError("Unauthorized", 401));
      }

      return res.json();
    },
  });

  const { mutate: logoutMutate } = useMutation({
    mutationFn: async () => {
      const res = await authClient.logout.$post();

      useAuthStore.getState().logout();
      return res.json();
    },
    onSuccess: () => {
      navigate({
        to: "/login",
      });
    },
  });

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => refecthUser()}>Get /users/me</button>
      <button onClick={() => logoutMutate()}>logout</button>
      <div>
        <p>User data:</p>
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      </div>
    </div>
  );
}
