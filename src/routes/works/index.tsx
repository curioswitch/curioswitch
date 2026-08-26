import { createFileRoute, Link } from "@tanstack/react-router";
import { MdBusiness } from "react-icons/md";

import picWorksHero from "../../assets/works-hero.jpg?w=640;960;1440;2160&format=avif;webp;jpg&as=picture";
import { FadeIn } from "../../components/FadeIn";
import { PageIntro } from "../../components/PageLayout";
import { Picture } from "../../components/Picture";
import {
  getLocalizedWorkSummaries,
  type WorkSummaryEntry,
} from "../../lib/content-summaries";
import { m } from "../../paraglide/messages";
import { getLocale } from "../../paraglide/runtime";

export const Route = createFileRoute("/works/")({
  loader: () => getLocalizedWorkSummaries(getLocale()),
  component: RouteComponent,
});

function WorkCard({ work }: { work: WorkSummaryEntry }) {
  return (
    <Link
      to="/works/$slug"
      params={{ slug: work.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
    >
      <div className="aspect-3/2 overflow-hidden bg-gray-100">
        <Picture
          picture={work.heroPicture}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          alt={work.title}
          sizePreset="threeColumn"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-8">
        <p className="flex items-center gap-2 text-xs text-gray-500">
          <MdBusiness aria-hidden="true" />
          {work.organization}
        </p>
        <h2 className="text-xl font-semibold">{work.title}</h2>
        <p className="line-clamp-3 text-sm leading-8 text-gray-600">
          {work.excerpt}
        </p>
      </div>
    </Link>
  );
}

function RouteComponent() {
  const works = Route.useLoaderData();

  return (
    <main className="bg-white">
      <PageIntro
        title={m.common_page_works()}
        description={<p>{m.works_description()}</p>}
      />
      <Picture
        picture={picWorksHero}
        alt={m.works_hero_alt()}
        className="h-48 w-full object-cover md:h-96"
        priority
        sizePreset="fullWidth"
      />

      {works.length > 0 ? (
        <section className="page-gutter border-t border-gray-200 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {works.map((work, i) => (
              <FadeIn key={`${work.locale}:${work.slug}`} delay={i * 80}>
                <WorkCard work={work} />
              </FadeIn>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
