import { allNewsSummaries, allWorkSummaries } from "content-collections";

export type NewsSummaryEntry = (typeof allNewsSummaries)[number];
export type WorkSummaryEntry = (typeof allWorkSummaries)[number];

function compareNewsByDate(a: NewsSummaryEntry, b: NewsSummaryEntry) {
  return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
}

function compareWorksByOrder(a: WorkSummaryEntry, b: WorkSummaryEntry) {
  return (
    (a.order ?? Number.MAX_SAFE_INTEGER) -
      (b.order ?? Number.MAX_SAFE_INTEGER) || a.slug.localeCompare(b.slug)
  );
}

export function getLocalizedNewsSummaries(locale: string) {
  return allNewsSummaries
    .filter((article) => article.locale === locale)
    .sort(compareNewsByDate);
}

export function getLocalizedWorkSummaries(locale: string) {
  return allWorkSummaries
    .filter((work) => work.locale === locale)
    .sort(compareWorksByOrder);
}
