import { resolve } from "path";
import { existsSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import pug from "pug";

function pugPlugin(): Plugin {
  return {
    name: "vite-pug",
    transformIndexHtml: {
      order: "pre",
      handler(_, ctx) {
        const pugPath = ctx.filename.replace(/\.html$/, ".pug");
        if (!existsSync(pugPath)) return _;
        return pug.renderFile(pugPath, { pretty: true });
      },
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith(".pug")) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
  };
}

export default defineConfig({
  root: "demos",
  base: "/wtc-math/",
  plugins: [pugPlugin()],
  build: {
    outDir: resolve(__dirname, "dist-site"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:      resolve(__dirname, "demos/index.html"),
        camera:    resolve(__dirname, "demos/camera.html"),
        gradients: resolve(__dirname, "demos/gradients.html"),
        color:     resolve(__dirname, "demos/color.html"),
        plane:     resolve(__dirname, "demos/plane.html"),
        ray:       resolve(__dirname, "demos/ray.html"),
      },
    },
  },
});
