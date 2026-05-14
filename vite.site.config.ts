import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "demos",
  base: "/wtc-math/",
  build: {
    outDir: resolve(__dirname, "dist-site"),
    emptyOutDir: true,
  },
});
