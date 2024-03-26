import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthState {
  user: { username: string } | undefined;
}

export interface AuthStore extends AuthState {
  setUser: (user: { username: string } | undefined) => void;
  logout: () => void;
}

const initialState: AuthState = {
  user: undefined,
} satisfies Pick<AuthStore, keyof AuthState>;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (providedUser) =>
        set(() => ({
          user: providedUser,
        })),
      logout: () => {
        set(() => ({ user: undefined }));
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
