// src/stores/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  authenticated: boolean;
  setAuth: (token: string | null, authenticated: boolean) => void;
  logout: () => void;
  checkToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      authenticated: false,

      setAuth: (token, authenticated) => {
        set({ token, authenticated });
      },

      logout: () => {
        set({ token: null, authenticated: false });
        localStorage.removeItem("auth-store");
      },

      checkToken: () => {
        const token = get().token;
        if (!token) return;

        try {
          const decoded = jwtDecode<DecodedToken>(token);
          if (decoded.exp * 1000 < Date.now()) {
            console.warn("Token đã hết hạn, xóa khỏi localStorage");
            set({ token: null, authenticated: false });
            localStorage.removeItem("auth-store");
          }
        } catch (error) {
          console.error("Token không hợp lệ, xóa khỏi localStorage");
          set({ token: null, authenticated: false });
          localStorage.removeItem("auth-store");
        }
      },
    }),
    {
      name: "auth-store",
    }
  )
);

useAuthStore.getState().checkToken();
