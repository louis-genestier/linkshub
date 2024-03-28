import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "../components/LoginForm";
import { css } from "@panda/css";

export const Route = createFileRoute("/login")({
  component: Index,
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({
        to: "/",
      });
    }
  },
});

export function Index() {
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
}
