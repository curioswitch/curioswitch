export const SITE_LOCALES = ["ja", "en"] as const;
export type SiteLocale = (typeof SITE_LOCALES)[number];

export const SITE_BASE_LOCALE: SiteLocale = "ja";

export const SITE_URL_PATTERN = "/:path(.*)?";

export const SITE_LOCALIZED_URL_PATTERNS = {
  en: "/en/:path(.*)?",
  ja: SITE_URL_PATTERN,
} satisfies Record<SiteLocale, string>;

export const OPEN_GRAPH_LOCALES = {
  en: "en_US",
  ja: "ja_JP",
} satisfies Record<SiteLocale, string>;

const LOCALE_PATH_PREFIXES = {
  en: "/en",
  ja: "",
} satisfies Record<SiteLocale, string>;

export type LocalizedAlternateUrl = {
  href: string;
  hreflang: SiteLocale | "x-default";
};

type LocalizedDocument = {
  locale: string;
  slug: string;
};

export function normalizeSitePathname(pathname: string) {
  const suffixIndex = pathname.search(/[?#]/);
  const pathnameWithoutSuffix =
    suffixIndex === -1 ? pathname : pathname.slice(0, suffixIndex);
  const pathnameWithLeadingSlash = pathnameWithoutSuffix.startsWith("/")
    ? pathnameWithoutSuffix
    : `/${pathnameWithoutSuffix}`;
  const normalized = pathnameWithLeadingSlash.replace(/\/+$/, "");

  return normalized || "/";
}

export function deLocalizeSitePathname(pathname: string) {
  const normalized = normalizeSitePathname(pathname);

  for (const locale of SITE_LOCALES) {
    if (locale === SITE_BASE_LOCALE) {
      continue;
    }

    const prefix = LOCALE_PATH_PREFIXES[locale];
    if (normalized === prefix) {
      return "/";
    }
    if (normalized.startsWith(`${prefix}/`)) {
      return normalized.slice(prefix.length);
    }
  }

  return normalized;
}

export function getSiteLocaleFromPathname(pathname: string): SiteLocale {
  const normalized = normalizeSitePathname(pathname);

  for (const locale of SITE_LOCALES) {
    if (locale === SITE_BASE_LOCALE) {
      continue;
    }

    const prefix = LOCALE_PATH_PREFIXES[locale];
    if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
      return locale;
    }
  }

  return SITE_BASE_LOCALE;
}

export function localizeSitePathname(pathname: string, locale: SiteLocale) {
  const logicalPathname = deLocalizeSitePathname(pathname);
  const prefix = LOCALE_PATH_PREFIXES[locale];

  if (!prefix) {
    return logicalPathname;
  }

  return logicalPathname === "/" ? prefix : `${prefix}${logicalPathname}`;
}

export function getLocalizedPageUrl(
  pathname: string,
  locale: SiteLocale,
  siteOrigin: string | URL,
) {
  return new URL(localizeSitePathname(pathname, locale), siteOrigin).toString();
}

export function getLocalizedAlternateUrls(
  pathname: string,
  siteOrigin: string | URL,
): LocalizedAlternateUrl[] {
  const localizedUrls = SITE_LOCALES.map((locale) => ({
    href: getLocalizedPageUrl(pathname, locale, siteOrigin),
    hreflang: locale,
  }));

  return [
    ...localizedUrls,
    {
      href: getLocalizedPageUrl(pathname, SITE_BASE_LOCALE, siteOrigin),
      hreflang: "x-default",
    },
  ];
}

export function assertCompleteTranslations(
  collectionName: string,
  documents: readonly LocalizedDocument[],
) {
  const localeCountsBySlug = new Map<string, Map<string, number>>();

  for (const document of documents) {
    const localeCounts =
      localeCountsBySlug.get(document.slug) ?? new Map<string, number>();
    localeCounts.set(
      document.locale,
      (localeCounts.get(document.locale) ?? 0) + 1,
    );
    localeCountsBySlug.set(document.slug, localeCounts);
  }

  const issues: string[] = [];
  for (const [slug, localeCounts] of localeCountsBySlug) {
    const missingLocales = SITE_LOCALES.filter(
      (locale) => !localeCounts.has(locale),
    );
    if (missingLocales.length > 0) {
      issues.push(`${slug} (missing ${missingLocales.join(", ")})`);
    }

    for (const [locale, count] of localeCounts) {
      if (count > 1) {
        issues.push(`${slug} (${locale} appears ${count} times)`);
      }
    }
  }

  if (issues.length > 0) {
    throw new Error(
      `Incomplete ${collectionName} translations: ${issues.sort().join("; ")}`,
    );
  }
}
