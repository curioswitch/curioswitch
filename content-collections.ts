import path from "node:path";

import {
  createDefaultImport,
  defineCollection,
  defineConfig,
} from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import { compileMDX } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";
import type { Picture as ImageToolsPicture } from "vite-imagetools";
import { z } from "zod";

const LOCALE_SUFFIX = /\.(ja|en)$/;
const NEWS_DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;
const NUMERIC_PREFIX = /^\d+-/;
const WORKS_EXCERPT_LENGTH = 180;
const CONTENT_PICTURE_QUERY =
  "w=640;960;1280;1600;2048&format=avif;webp;jpg&as=picture";

function getLocalizedContentMeta(
  path: string,
  options?: { stripDatePrefix?: boolean; stripNumericPrefix?: boolean },
) {
  const m = path.match(LOCALE_SUFFIX);
  if (!m) {
    throw new Error(`Missing locale suffix: ${path}`);
  }

  const locale = m[1] as "ja" | "en";
  const pathWithoutLocale = path.replace(LOCALE_SUFFIX, "");
  const segments = pathWithoutLocale.split("/");
  const fileName = segments.pop() ?? pathWithoutLocale;
  let slug = [...segments, fileName].join("/");

  if (options?.stripDatePrefix) {
    slug = slug.replace(NEWS_DATE_PREFIX, "");
  }

  if (options?.stripNumericPrefix) {
    slug = [...segments, fileName.replace(NUMERIC_PREFIX, "")].join("/");
  }

  return { locale, slug };
}

function getNumericPrefixOrder(path: string) {
  const fileName = path.replace(LOCALE_SUFFIX, "").split("/").pop() ?? path;
  const m = fileName.match(/^(\d+)-/);

  return m ? Number.parseInt(m[1], 10) : null;
}

function markdownToPlainText(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\\\r?\n/g, " ")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(content: string, maxLength: number) {
  if (content.length <= maxLength) {
    return content;
  }

  return `${content.slice(0, maxLength).trimEnd()}…`;
}

function resolveRelativeAssetImportPath(
  collectionDirectory: string,
  document: { _meta: { directory: string } },
  assetPath: string | undefined,
) {
  if (!assetPath) {
    return undefined;
  }

  if (
    assetPath.startsWith("/") ||
    /^(?:[a-z]+:)?\/\//i.test(assetPath) ||
    assetPath.startsWith("data:")
  ) {
    return undefined;
  }

  const absoluteAssetPath = path.resolve(
    collectionDirectory,
    document._meta.directory,
    assetPath,
  );
  const importPath = path.relative(
    ".content-collections/generated",
    absoluteAssetPath,
  );

  return importPath;
}

function resolveAssetImport(
  collectionDirectory: string,
  document: { _meta: { directory: string } },
  assetPath: string | undefined,
) {
  if (!assetPath) {
    return assetPath;
  }

  const importPath = resolveRelativeAssetImportPath(
    collectionDirectory,
    document,
    assetPath,
  );

  if (!importPath) {
    return assetPath;
  }

  return createDefaultImport<string>(importPath);
}

function resolvePictureAssetImport(
  collectionDirectory: string,
  document: { _meta: { directory: string } },
  assetPath: string,
) {
  const importPath = resolveRelativeAssetImportPath(
    collectionDirectory,
    document,
    assetPath,
  );

  if (!importPath) {
    throw new Error(
      `Image must be a local asset import: ${collectionDirectory}/${document._meta.directory}/${assetPath}`,
    );
  }

  return createDefaultImport<ImageToolsPicture>(
    `${importPath}?${CONTENT_PICTURE_QUERY}`,
  );
}

function extractContentAssetPaths(content: string) {
  const matches = new Set<string>();
  const patterns = [
    /!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g,
    /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/g,
  ];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null = pattern.exec(content);

    while (match) {
      const assetPath = match[1]?.replace(/^<|>$/g, "");
      if (
        assetPath &&
        !assetPath.startsWith("/") &&
        !/^(?:[a-z]+:)?\/\//i.test(assetPath) &&
        !assetPath.startsWith("data:")
      ) {
        matches.add(assetPath);
      }

      match = pattern.exec(content);
    }
  }

  return Array.from(matches);
}

function createContentAssetMap(
  collectionDirectory: string,
  document: { _meta: { directory: string }; content: string },
) {
  return Object.fromEntries(
    extractContentAssetPaths(document.content).map((assetPath) => [
      assetPath,
      resolvePictureAssetImport(collectionDirectory, document, assetPath),
    ]),
  );
}

async function compileDocument(
  context: Parameters<typeof compileMarkdown>[0],
  document: Parameters<typeof compileMarkdown>[1],
) {
  const isMdx = document._meta.filePath.endsWith(".mdx");

  return {
    html: isMdx
      ? null
      : await compileMarkdown(context, document, {
          allowDangerousHtml: true,
        }),
    mdx: isMdx
      ? await compileMDX(context, document, {
          remarkPlugins: [remarkGfm],
        })
      : null,
  };
}

const news = defineCollection({
  name: "news",
  directory: "content/news",
  include: "**/*.{md,mdx}",
  schema: z.object({
    title: z.string(),
    pubDate: z.string(),
    content: z.string(),
    heroImage: z.string(),
  }),
  transform: async (document, context) => {
    const { locale, slug } = getLocalizedContentMeta(document._meta.path, {
      stripDatePrefix: true,
    });

    return {
      ...document,
      slug,
      locale,
      pubDate: new Date(document.pubDate).toISOString(),
      heroImage: resolveAssetImport(
        "content/news",
        document,
        document.heroImage,
      ),
      heroPicture: resolvePictureAssetImport(
        "content/news",
        document,
        document.heroImage,
      ),
      contentAssetMap: createContentAssetMap("content/news", document),
      ...(await compileDocument(context, document)),
    };
  },
});

const legal = defineCollection({
  name: "legal",
  directory: "content/legal",
  include: "**/*.{md,mdx}",
  schema: z.object({
    title: z.string(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const { locale, slug } = getLocalizedContentMeta(document._meta.path);

    return {
      ...document,
      slug,
      locale,
      contentAssetMap: createContentAssetMap("content/legal", document),
      ...(await compileDocument(context, document)),
    };
  },
});

const works = defineCollection({
  name: "works",
  directory: "content/works",
  include: "**/*.{md,mdx}",
  schema: z.object({
    title: z.string(),
    organization: z.string(),
    content: z.string(),
    heroImage: z.string(),
  }),
  transform: async (document, context) => {
    const { locale, slug } = getLocalizedContentMeta(document._meta.path, {
      stripNumericPrefix: true,
    });

    return {
      ...document,
      slug,
      locale,
      heroImage: resolveAssetImport(
        "content/works",
        document,
        document.heroImage,
      ),
      heroPicture: resolvePictureAssetImport(
        "content/works",
        document,
        document.heroImage,
      ),
      contentAssetMap: createContentAssetMap("content/works", document),
      order: getNumericPrefixOrder(document._meta.path),
      excerpt: truncateText(
        markdownToPlainText(document.content),
        WORKS_EXCERPT_LENGTH,
      ),
      ...(await compileDocument(context, document)),
    };
  },
});

export default defineConfig({
  collections: [news, legal, works],
});
