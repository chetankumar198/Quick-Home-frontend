import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Required for Render deployment (SPA routing & correct build folder)
export default defineConfig({
  plugins: [react()],

  build: {
    outDir: "dist",
  },

  server: {
    host: true,
    port: 5173,
  },
});
