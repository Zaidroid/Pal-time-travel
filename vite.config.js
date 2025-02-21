import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // REMOVE the proxy configuration:
  // server: {
  //   proxy: {
  //     "/api": "http://localhost:5000", // Proxy to Flask backend
  //   },
  // },
});
