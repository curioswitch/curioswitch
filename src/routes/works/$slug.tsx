import { createFileRoute, notFound } from "@tanstack/react-router";

import { CollectionContent } from "../../components/CollectionContent";
import { ContentEntryPage } from "../../components/PageLayout";
import { Picture } from "../../components/Picture";
import { findLocalizedWork } from "../../lib/content";
import { getLocale } from "../../paraglide/runtime";

export const Route = createFileRoute("/works/$slug")({
  loader: ({ params }) => {
    const locale = getLocale();
    const work = findLocalizedWork(locale, params.slug);

    if (!work) {
      throw notFound();
    }

    return work;
  },
  component: WorkPage,
});

function WorkPage() {
  const work = Route.useLoaderData();

  return (
    <ContentEntryPage
      title={work.title}
      titleMeta={
        <p className="text-sm font-semibold tracking-[0.18em] text-gray-500 uppercase">
          {work.organization}
        </p>
      }
      hero={
        <div className="overflow-hidden rounded-3xl bg-gray-100">
          <Picture
            picture={work.heroPicture}
            className="h-full w-full object-cover"
            alt={work.title}
            priority
            sizePreset="maxWidth5xl"
          />
        </div>
      }
    >
      <CollectionContent
        mdx={work.mdx}
        html={work.html}
        contentAssetMap={work.contentAssetMap}
      />
    </ContentEntryPage>
  );
}
