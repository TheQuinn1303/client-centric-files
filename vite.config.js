import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Aumenta o limite de warning para 1000KB (1MB)
    chunkSizeWarningLimit: 1000,
  },
});
