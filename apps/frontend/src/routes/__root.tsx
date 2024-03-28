import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { AuthState } from "../stores/user-store";

export const Route = createRootRouteWithContext<{ auth: AuthState }>()({
  component: () => (
    <>
      <div>
        <Link to="/">Home</Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
