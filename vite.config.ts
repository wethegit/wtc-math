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
      entry: resolve(__dirname, "src/index.ts"),
      name: "WTCMath",
      fileName: (format) => `index.${format === "es" ? "es" : "umd"}.js`,
      formats: ["es", "umd"],
    },
  },
});
