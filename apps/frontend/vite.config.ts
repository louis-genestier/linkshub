import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), TanStackRouterVite(), tsconfigPaths({ root: "./" })],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => {
          let newPath = path.replace(/^\/api/, "");
          if (newPath.endsWith("/")) {
            newPath = newPath.slice(0, -1);
          }

          return newPath;
        },
      },
    },
  },
});
