import { defineConfig } from "vite";
        import react from "@vitejs/plugin-react";

        // https://vitejs.dev/config/
        export default defineConfig({
          plugins: [react()],
          server: {
            proxy: {
              "/api/elevenlabs": { // <--- Proxy for ElevenLabs
                target: "https://api.elevenlabs.io",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/elevenlabs/, '/v1'), // Remove /api/elevenlabs prefix
              },
            },
          },
        });
