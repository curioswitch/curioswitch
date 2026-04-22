import { createFileRoute } from "@tanstack/react-router";

import { NewsCard } from "../../components/NewsCard";
import { PageIntro } from "../../components/PageLayout";
import { getLocalizedNews } from "../../lib/content";
import { m } from "../../paraglide/messages";
import { getLocale } from "../../paraglide/runtime";

export const Route = createFileRoute("/news/")({
  loader: () => getLocalizedNews(getLocale()),
  component: RouteComponent,
});

function RouteComponent() {
  const news = Route.useLoaderData();

  return (
    <main className="bg-white">
      <PageIntro
        title={m.common_page_news()}
        description={<p>{m.news_description()}</p>}
      />

      {news.length > 0 ? (
        <section className="border-t border-gray-200 px-6 py-12 md:px-20 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((article) => (
              <NewsCard
                key={`${article.locale}:${article.slug}`}
                article={article}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
