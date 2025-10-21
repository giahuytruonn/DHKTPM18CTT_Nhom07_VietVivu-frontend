// src/stores/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  authenticated: boolean;
  setAuth: (token: string | null, authenticated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      authenticated: false,
      setAuth: (token, authenticated) => {
        set({ token, authenticated });
      },
      logout: () => {
        set({ token: null, authenticated: false });
      },
    }),
    {
      name: "auth-store",
    }
  )
);
