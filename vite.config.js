import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/Earth/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        stutti: path.resolve(__dirname, "stutti.html"),
      },
    },
  },
});
