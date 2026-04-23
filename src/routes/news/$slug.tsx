import { createFileRoute, notFound } from "@tanstack/react-router";

import { CollectionContent } from "../../components/CollectionContent";
import { ContentEntryPage } from "../../components/PageLayout";
import { Picture } from "../../components/Picture";
import { findLocalizedNews } from "../../lib/content";
import { createContentMetadata } from "../../lib/metadata";
import { getLocale } from "../../paraglide/runtime";

export const Route = createFileRoute("/news/$slug")({
  loader: ({ params }) => {
    const locale = getLocale();
    const article = findLocalizedNews(locale, params.slug);
    if (!article) {
      throw notFound();
    }
    return article;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }

    return createContentMetadata({
      description: loaderData.excerpt,
      image: loaderData.heroSocialImage,
      title: loaderData.title,
    });
  },
  component: Article,
});

function Article() {
  const article = Route.useLoaderData();
  return (
    <ContentEntryPage
      title={article.title}
      hero={
        <div className="overflow-hidden rounded-3xl bg-gray-100">
          <Picture
            picture={article.heroPicture}
            className="h-full w-full object-cover"
            alt={article.title}
            priority
            sizePreset="maxWidth5xl"
          />
        </div>
      }
    >
      <CollectionContent
        mdx={article.mdx}
        html={article.html}
        contentAssetMap={article.contentAssetMap}
      />
    </ContentEntryPage>
  );
}
