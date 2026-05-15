import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "demos",
  base: "/wtc-math/",
  build: {
    outDir: resolve(__dirname, "dist-site"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:      resolve(__dirname, "demos/index.html"),
        camera:    resolve(__dirname, "demos/camera.html"),
        gradients: resolve(__dirname, "demos/gradients.html"),
      },
    },
  },
});
