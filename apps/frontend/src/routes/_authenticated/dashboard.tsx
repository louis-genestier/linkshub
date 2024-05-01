import { AuthAppType } from "@repo/backend/src/api/auth/auth.controller";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { hc } from "hono/client";
import { useAuthStore } from "../../stores/user-store";
import { useBookmarks, useDeleteBookmark } from "../../api/bookmarks.queries";
import { CreateBookmarkForm } from "../../components/CreateBookmarkForm";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Index,
});

function Index() {
  const { data: bookmarks, isLoading: isBookmarksLoading } = useBookmarks();
  const { mutate: deleteBookmark } = useDeleteBookmark();
  const authClient = hc<AuthAppType>("/api/auth/");
  const navigate = useNavigate();

  const { mutate: logoutMutate } = useMutation({
    mutationFn: async () => {
      const res = await authClient.logout.$post();

      useAuthStore.getState().logout();
      return res.json();
    },
    onSuccess: () => {
      navigate({
        to: "/",
      });
    },
  });

  return (
    <div>
      <button onClick={() => logoutMutate()}>logout</button>
      <div>
        <CreateBookmarkForm />
        <h2>My bookmarks</h2>
        {bookmarks?.length === 0 && <div>No bookmarks</div>}
        {isBookmarksLoading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {bookmarks?.map((bookmark) => (
              <li key={bookmark.id}>
                <a href={bookmark.url} target="_blank" rel="noreferrer">
                  {bookmark.title || bookmark.url}
                </a>
                <button onClick={() => deleteBookmark(bookmark.id)}>
                  delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
