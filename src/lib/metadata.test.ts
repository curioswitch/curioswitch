import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createBaseMetadata, createPageMetadata } from "./metadata";

beforeEach(() => {
  vi.stubEnv("VITE_SITE_URL", "https://curioswitch.org");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("base metadata", () => {
  it("declares CurioSwitch as the site name on the domain home page", () => {
    const metadata = createBaseMetadata({
      isDomainHome: true,
      locale: "ja",
      pathname: "/",
    });
    const siteName = metadata.meta.find((entry) => "script:ld+json" in entry);

    expect(siteName).toEqual({
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "CurioSwitch",
        url: "https://curioswitch.org/",
      },
    });
  });

  it("does not repeat site-name structured data outside the domain home", () => {
    const metadata = createBaseMetadata({
      isDomainHome: false,
      locale: "en",
      pathname: "/",
    });

    expect(metadata.meta.some((entry) => "script:ld+json" in entry)).toBe(
      false,
    );
  });

  it("emits self-canonical and reciprocal localized URLs", () => {
    const metadata = createBaseMetadata({
      isDomainHome: false,
      locale: "en",
      pathname: "/works/",
    });

    expect(metadata.links).toEqual([
      { rel: "canonical", href: "https://curioswitch.org/en/works" },
      {
        rel: "alternate",
        href: "https://curioswitch.org/works",
        hreflang: "ja",
      },
      {
        rel: "alternate",
        href: "https://curioswitch.org/en/works",
        hreflang: "en",
      },
      {
        rel: "alternate",
        href: "https://curioswitch.org/works",
        hreflang: "x-default",
      },
    ]);
    expect(metadata.meta).toContainEqual({
      property: "og:url",
      content: "https://curioswitch.org/en/works",
    });
    expect(metadata.meta).toContainEqual({
      property: "og:locale",
      content: "en_US",
    });
    expect(metadata.meta).toContainEqual({
      property: "og:locale:alternate",
      content: "ja_JP",
    });
  });

  it("keeps the SPA fallback out of the search index", () => {
    const metadata = createBaseMetadata({
      isDomainHome: false,
      isIndexable: false,
      locale: "ja",
      pathname: "/_shell",
    });

    expect(metadata.links).toEqual([]);
    expect(metadata.meta).toContainEqual({
      name: "robots",
      content: "noindex",
    });
    expect(metadata.meta).not.toContainEqual(
      expect.objectContaining({ property: "og:url" }),
    );
  });
});

describe("page metadata", () => {
  it("combines the brand and localized page title", () => {
    expect(createPageMetadata("サービス")).toEqual({
      meta: [
        { title: "CurioSwitch - サービス" },
        { property: "og:title", content: "CurioSwitch - サービス" },
        { name: "twitter:title", content: "CurioSwitch - サービス" },
      ],
    });
  });
});
