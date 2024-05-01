import { NotFoundRoute, createRouter, redirect } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import { queryClient } from "./react-query";

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => routeTree,
  beforeLoad: () => {
    redirect({
      to: "/dashboard",
    });
  },
});

export const router = createRouter({
  routeTree,
  notFoundRoute,
  context: {
    queryClient: queryClient,
  },
});
