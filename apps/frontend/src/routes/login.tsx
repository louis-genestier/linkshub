import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "../components/LoginForm";

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
    <div>
      <LoginForm />
    </div>
  );
}
