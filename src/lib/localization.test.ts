import { describe, expect, it } from "vitest";

import inlangSettings from "../../project.inlang/settings.json";

import {
  assertCompleteTranslations,
  deLocalizeSitePathname,
  getLocalizedAlternateUrls,
  getLocalizedPageUrl,
  getSiteLocaleFromPathname,
  localizeSitePathname,
  normalizeSitePathname,
  SITE_BASE_LOCALE,
  SITE_LOCALES,
} from "./localization";

describe("locale configuration", () => {
  it("matches the Inlang project locales", () => {
    expect(SITE_BASE_LOCALE).toBe(inlangSettings.baseLocale);
    expect(SITE_LOCALES).toEqual(inlangSettings.locales);
  });
});

describe("localized page URLs", () => {
  it("normalizes suffixes and trailing slashes", () => {
    expect(normalizeSitePathname("en/works/?preview=1#details")).toBe(
      "/en/works",
    );
    expect(normalizeSitePathname("/#services")).toBe("/");
  });

  it("converts between logical, Japanese, and English paths", () => {
    expect(deLocalizeSitePathname("/en/works/")).toBe("/works");
    expect(getSiteLocaleFromPathname("/en/works")).toBe("en");
    expect(getSiteLocaleFromPathname("/works")).toBe("ja");
    expect(localizeSitePathname("/en/works/", "ja")).toBe("/works");
    expect(localizeSitePathname("/works/", "en")).toBe("/en/works");
    expect(localizeSitePathname("/", "en")).toBe("/en");
  });

  it("builds absolute canonical and alternate URLs", () => {
    expect(
      getLocalizedPageUrl("/works/", "en", "https://curioswitch.org"),
    ).toBe("https://curioswitch.org/en/works");
    expect(
      getLocalizedAlternateUrls("/works/", "https://curioswitch.org"),
    ).toEqual([
      { href: "https://curioswitch.org/works", hreflang: "ja" },
      { href: "https://curioswitch.org/en/works", hreflang: "en" },
      { href: "https://curioswitch.org/works", hreflang: "x-default" },
    ]);
  });
});

describe("translation completeness", () => {
  it("accepts one document per supported locale", () => {
    expect(() =>
      assertCompleteTranslations("news", [
        { slug: "launch", locale: "ja" },
        { slug: "launch", locale: "en" },
      ]),
    ).not.toThrow();
  });

  it("reports missing and duplicate translations", () => {
    expect(() =>
      assertCompleteTranslations("works", [
        { slug: "alpha", locale: "ja" },
        { slug: "beta", locale: "ja" },
        { slug: "beta", locale: "ja" },
        { slug: "beta", locale: "en" },
      ]),
    ).toThrowError(
      "Incomplete works translations: alpha (missing en); beta (ja appears 2 times)",
    );
  });
});
