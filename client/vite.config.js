import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// El front corre en :5173 y reenvía /api y /uploads a la API (:3000).
// Así el navegador ve un solo origen: las cookies funcionan y no hace falta CORS.
const API = process.env.API_URL || "http://localhost:3000";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": { target: API, changeOrigin: false },
      "/uploads": { target: API, changeOrigin: false },
    },
  },
});
