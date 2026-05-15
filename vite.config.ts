import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src/**/*.ts"],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        Color: resolve(__dirname, "src/Color.ts"),
        Plane: resolve(__dirname, "src/Plane.ts"),
        Ray: resolve(__dirname, "src/Ray.ts"),
      },
      formats: ["es"],
      fileName: (_, entryName) => `${entryName}.es.js`,
    },
  },
});
