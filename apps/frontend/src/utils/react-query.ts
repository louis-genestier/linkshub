import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError } from "../api/apiError";
import { useAuthStore } from "../stores/user-store";

const handleError = (error: Error) => {
  if (error instanceof ApiError && error.status === 401) {
    useAuthStore.getState().logout();
  }
};

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => handleError(error),
  }),
  queryCache: new QueryCache({
    onError: (error) => handleError(error),
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
