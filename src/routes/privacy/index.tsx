import { createFileRoute, notFound } from "@tanstack/react-router";

import { CollectionContent } from "../../components/CollectionContent";
import { ContentEntryPage } from "../../components/PageLayout";
import { findLocalizedLegal } from "../../lib/content";
import { getLocale } from "../../paraglide/runtime";

export const Route = createFileRoute("/privacy/")({
  loader: () => {
    const policy = findLocalizedLegal(getLocale(), "privacy");

    if (!policy) {
      throw notFound();
    }

    return policy;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const policy = Route.useLoaderData();

  return (
    <ContentEntryPage title={policy.title} hero={null}>
      <CollectionContent
        mdx={policy.mdx}
        html={policy.html}
        contentAssetMap={policy.contentAssetMap}
      />
    </ContentEntryPage>
  );
}
