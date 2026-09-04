import contentCollections from "@content-collections/vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

import {
  normalizeSitePathname,
  SITE_LOCALIZED_URL_PATTERNS,
  SITE_URL_PATTERN,
} from "./src/lib/localization.ts";

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
      trailingSlash: "never",
      urlPatterns: [
        {
          pattern: SITE_URL_PATTERN,
          localized: [
            ["en", SITE_LOCALIZED_URL_PATTERNS.en],
            ["ja", SITE_LOCALIZED_URL_PATTERNS.ja],
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
        filter: (page) => {
          const isCanonicalPath =
            normalizeSitePathname(page.path) === page.path;

          if (!isCanonicalPath) {
            page.sitemap = { ...page.sitemap, exclude: true };
          }

          return isCanonicalPath;
        },
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
          path: "/privacy",
          prerender: { enabled: true },
        },
        {
          path: "/en/privacy",
          prerender: { enabled: true },
        },
        {
          path: "/robots.txt",
          prerender: { enabled: true },
          sitemap: { exclude: true },
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
