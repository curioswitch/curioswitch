import contentCollections from "@content-collections/vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

const config = defineConfig(() => ({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    // Avoid a feedback loop when browser errors are also shown by devtools.
    forwardConsole: false,
  },
  plugins: [
    devtools(),
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
    contentCollections(),
    imagetools(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
      sitemap: {
        enabled: true,
        host: import.meta.env.VITE_SITE_URL,
      },
      router: {
        // Keep route data and its dependencies out of the global client entry.
        // The router plugin adds HMR support to these splits in development.
        codeSplittingOptions: {
          defaultBehavior: [
            ["loader"],
            ["component"],
            ["pendingComponent"],
            ["errorComponent"],
            ["notFoundComponent"],
          ],
        },
      },
      spa: {
        maskPath: "/_shell",
        prerender: {
          enabled: true,
        },
      },
      pages: [
        {
          path: "/robots.txt",
          prerender: { enabled: true },
        },
      ],
    }),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
}));

export default config;
