import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/pexels": {
        target: "https://api.pexels.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/pexels/, ""),
      },
    },
  },
});
