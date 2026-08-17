import { paraglideVitePlugin } from "@inlang/paraglide-js";
import viteReact from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      strategy: ["url", "baseLocale"],
      urlPatterns: [
        {
          pattern: "/:path(.*)?",
          localized: [
            ["en", "/en/:path(.*)?"],
            ["ja", "/:path(.*)?"],
          ],
        },
      ],
    }),
    imagetools(),
    viteReact(),
  ],
});
