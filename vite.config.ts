import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { localDataApi } from "./vite-plugins/local-data-api.js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localDataApi()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
