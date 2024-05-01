import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LoginForm } from "../components/LoginForm";
import { css } from "@panda/css";
import { userQueryOptions } from "~/api/users.queries";

const Login = () => {
  console.log("Login");
  return (
    <div
      className={css({
        width: "100vw",
        height: "100vh",
      })}
    >
      <LoginForm />
    </div>
  );
};

const Component = () => {
  const context = Route.useRouteContext<{
    user: { username: string; id: string };
  }>();

  if (!context.user) {
    return <Login />;
  }
  return <Outlet />;
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.fetchQuery(userQueryOptions);

      return { user };
    } catch (e) {
      return null;
    }
  },

  component: Component,
});
