import { BookmarkAppType } from "@repo/backend/src/api/bookmarks/bookmarks.controller";
import { useMutation, useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";
import { ApiError } from "./apiError";
import { queryClient } from "../utils/react-query";

const bookmarkClient = hc<BookmarkAppType>("/api/bookmarks");

export const useBookmarks = () =>
  useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const res = await bookmarkClient.index.$get();

      if (res.status === 401) {
        return Promise.reject(new ApiError("Unauthorized", 401));
      }

      return await res.json();
    },
  });

export const useCreateBookmark = () =>
  useMutation({
    mutationFn: async (bookmark: { title?: string; url: string }) => {
      const res = await bookmarkClient.index.$post({ json: bookmark });

      if (res.status === 401) {
        return Promise.reject(new ApiError("Unauthorized", 401));
      }

      return await res.json();
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
    },
  });

export const useDeleteBookmark = () =>
  useMutation({
    mutationFn: async (id: number) => {
      const res = await bookmarkClient[":id"].$delete({
        param: { id: id.toString() },
      });

      if (res.status === 401) {
        return Promise.reject(new ApiError("Unauthorized", 401));
      }

      return await res.json();
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
    },
  });
