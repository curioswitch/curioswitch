import { afterEach, describe, expect, it, vi } from "vitest";

import { createBaseMetadata, createPageMetadata } from "./metadata";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("base metadata", () => {
  it("declares CurioSwitch as the site name on the domain home page", () => {
    vi.stubEnv("VITE_SITE_URL", "https://curioswitch.org");

    const metadata = createBaseMetadata({
      isDomainHome: true,
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
      pathname: "/",
    });

    expect(metadata.meta.some((entry) => "script:ld+json" in entry)).toBe(
      false,
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
