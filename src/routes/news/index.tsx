import { createFileRoute } from "@tanstack/react-router";

import { FadeIn } from "../../components/FadeIn";
import { NewsCard } from "../../components/NewsCard";
import { PageIntro } from "../../components/PageLayout";
import { getLocalizedNewsSummaries } from "../../lib/content-summaries";
import { createPageMetadata } from "../../lib/metadata";
import { m } from "../../paraglide/messages";
import { getLocale } from "../../paraglide/runtime";

export const Route = createFileRoute("/news/")({
  loader: () => getLocalizedNewsSummaries(getLocale()),
  head: () => createPageMetadata(m.common_page_news()),
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
        <section className="page-gutter border-t border-gray-200 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((article, i) => (
              <FadeIn key={`${article.locale}:${article.slug}`} delay={i * 80}>
                <NewsCard article={article} />
              </FadeIn>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
