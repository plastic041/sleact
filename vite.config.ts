import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3095",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "components"),
      "@hooks": path.resolve(__dirname, "hooks"),
      "@layouts": path.resolve(__dirname, "layouts"),
      "@pages": path.resolve(__dirname, "pages"),
      "@typings": path.resolve(__dirname, "typings"),
      "@utils": path.resolve(__dirname, "utils"),
    },
  },
});
