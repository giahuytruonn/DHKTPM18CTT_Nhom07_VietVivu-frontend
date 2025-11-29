import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  scope?: string;
  sub?: string;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  authenticated: boolean;
  role: string | null;
  setAuth: (token: string | null, authenticated: boolean) => void;
  logout: () => void;
  checkToken: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      authenticated: false,
      role: null,

      setAuth: (token, authenticated) => {
        let role = null;
        if (token) {
          try {
            const decoded = jwtDecode<DecodedToken>(token);
            role = decoded.scope || null;
          } catch (error) {
            console.error("Không thể decode token:", error);
          }
        }
        set({ token, authenticated, role });
      },

      logout: () => {
        set({ token: null, authenticated: false, role: null });
        localStorage.removeItem("auth-store");
      },

      checkToken: () => {
        const token = get().token;
        if (!token) return;

        try {
          const decoded = jwtDecode<DecodedToken>(token);
          if (decoded.exp * 1000 < Date.now()) {
            console.warn("Token đã hết hạn");
            set({ token: null, authenticated: false, role: null });
            localStorage.removeItem("auth-store");
          } else {
            set({ role: decoded.scope || null });
          }
        } catch (error) {
          console.error("Token không hợp lệ");
          set({ token: null, authenticated: false, role: null });
          localStorage.removeItem("auth-store");
        }
      },

      isAdmin: () => get().role === "ROLE_ADMIN",
    }),
    {
      name: "auth-store",
    }
  )
);

// Gọi kiểm tra token khi khởi tạo
useAuthStore.getState().checkToken();
