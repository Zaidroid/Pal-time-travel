// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/mimic": {
        target: "http://localhost:59125",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mimic/, '/api'),
      },
      "/api/openrouter": { // Add proxy for OpenRouter
        target: "https://openrouter.ai/api/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openrouter/, ''), // Remove /api/openrouter
      },
    },
  },
});
