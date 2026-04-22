import { Link } from "@tanstack/react-router";
import type { News } from "content-collections";

import { getLocale } from "../paraglide/runtime";

import { Picture } from "./Picture";

function formatDate(pubDate: string, locale: "ja" | "en") {
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(pubDate));
}

export function NewsCard({ article }: { article: News }) {
  const locale = getLocale();

  return (
    <Link
      to="/news/$slug"
      params={{ slug: article.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
    >
      <div className="aspect-16/10 overflow-hidden bg-gray-100">
        <Picture
          picture={article.heroPicture}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          alt={article.title}
          sizePreset="threeColumn"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-sm font-medium text-gray-500">
          {formatDate(article.pubDate, locale)}
        </p>
        <h2 className="font-semibold">{article.title}</h2>
      </div>
    </Link>
  );
}
