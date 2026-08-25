import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  MdAccessibility,
  MdArrowDropDownCircle,
  MdSearch,
  MdSouth,
  MdWeb,
} from "react-icons/md";

import picServiceOss from "../../../content/works/003-oss-projects.hero.png?w=320;480;640;960&format=avif;webp;jpg&as=picture";
import picServiceCreativeLab from "../../assets/home-service-creativelab-cooking.png?w=480;640;960;1280&format=avif;webp;jpg&as=picture";
import picServiceDesign from "../../assets/home-service-design-exhibition.png?w=480;640;960;1280&format=avif;webp;jpg&as=picture";
import picServiceStudio from "../../assets/home-service-studio-concept-phone.png?w=480;640;960;1280&format=avif;webp;jpg&as=picture";
import picServiceEngineering from "../../assets/service-engineering.webp?w=320;480;640;960&format=avif;webp;jpg&as=picture";
import picServicePlanning from "../../assets/service-planning.webp?w=320;480;640;960&format=avif;webp;jpg&as=picture";
import picServicePrototyping from "../../assets/service-prototyping.webp?w=320;480;640;960&format=avif;webp;jpg&as=picture";
import picServiceUidesign from "../../assets/service-uidesign.webp?w=320;480;640;960&format=avif;webp;jpg&as=picture";
import picServiceUserTest from "../../assets/service-usertest.webp?w=320;480;640;960&format=avif;webp;jpg&as=picture";
import { CellularHero } from "../../components/CellularHero";
import { CuriosityBloomExperience } from "../../components/curiosity-bloom/CuriosityBloomExperience";
import { FadeIn } from "../../components/FadeIn";
import { NewsCard } from "../../components/NewsCard";
import { Picture } from "../../components/Picture";
import WorksCarousel from "../../components/WorksCarousel";
import { getLocalizedNews, getLocalizedWorks } from "../../lib/content";
import { m } from "../../paraglide/messages";
import { getLocale } from "../../paraglide/runtime";

export const Route = createFileRoute("/")({
  loader: () => {
    const locale = getLocale();

    return {
      news: getLocalizedNews(locale).slice(0, 3),
      works: getLocalizedWorks(locale),
    };
  },
  component: Home,
});

function ServiceListItem({ service, href }: { service: string; href: string }) {
  return (
    <Link to={href} className="transition hover:text-gray-500">
      <li className="flex items-center gap-2">
        <MdArrowDropDownCircle
          className="-rotate-90 text-black"
          aria-hidden="true"
        />
        <span>{service}</span>
      </li>
    </Link>
  );
}

function ServiceList({
  Icon,
  category,
  children,
}: {
  Icon: IconType;
  category: string;
  children: ReactNode;
}) {
  return (
    <article className="flex flex-col items-center gap-4 text-center">
      <Icon size={40} aria-hidden="true" />
      <h2 className="text-xl">{category}</h2>
      <ul className="flex flex-col items-start space-y-2 text-left text-gray-700">
        {children}
      </ul>
    </article>
  );
}

function ServiceFeature({
  alt,
  description,
  picture,
  reversed,
  title,
}: {
  alt: string;
  description: string;
  picture: typeof picServiceStudio;
  reversed?: boolean;
  title: string;
}) {
  return (
    <article className="grid items-center gap-10 md:grid-cols-2">
      <div className={reversed ? "md:order-2" : undefined}>
        <Picture
          picture={picture}
          className="h-full w-full rounded-xl overflow-hidden"
          alt={alt}
          sizePreset="twoColumn"
        />
      </div>
      <div
        className={
          reversed ? "flex flex-col gap-4 md:order-1" : "flex flex-col gap-4"
        }
      >
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm leading-7 whitespace-pre-line">
          {description}
        </p>
      </div>
    </article>
  );
}

function CapabilityCard({
  alt,
  picture,
  title,
  href,
}: {
  alt: string;
  picture: typeof picServicePlanning;
  title: string;
  href: string;
}) {
  return (
    <Link to={href} className="group block">
      <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-[border-color,box-shadow] duration-200 group-hover:border-gray-400">
        <div className="aspect-16/9 overflow-hidden bg-gray-100">
          <Picture
            picture={picture}
            className="h-full w-full object-cover"
            alt={alt}
            sizePreset="threeColumn"
          />
        </div>
        <h3 className="p-8 text-lg">{title}</h3>
      </article>
    </Link>
  );
}

function Home() {
  const { works, news } = Route.useLoaderData();

  return (
    <main className="min-h-screen overflow-x-clip">
      <section className="relative flex flex-col justify-end rounded-bl-[4rem] bg-white px-[var(--page-gutter)] pt-6 pb-16 md:min-h-96 md:justify-center md:px-[var(--page-gutter)] md:py-20">
        <div className="flex max-w-4xl flex-col gap-6 md:gap-8">
          <FadeIn>
            <h1 className="text-5xl font-medium whitespace-pre-line md:text-7xl font-sans tracking-[-0.06em]">
              {m.home_hero_title()}
            </h1>
          </FadeIn>
          <FadeIn delay={150}>
            <p className="text-gray-500">{m.common_brand_tagline()}</p>
          </FadeIn>
        </div>
        <Link
          to="/"
          hash="works"
          aria-label={m.home_scroll_to_works_label()}
          className="absolute right-8 bottom-0 z-20 flex h-20 w-20 translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:scale-110 md:right-20 md:h-32 md:w-32 lg:right-40"
        >
          <MdSouth
            size={32}
            style={{ animation: "arrow-float 1.8s ease-in-out infinite" }}
          />
        </Link>
      </section>

      <div
        id="mobile-hero-background-frame"
        className="relative aspect-[3/2] w-full overflow-hidden md:h-[25rem] md:aspect-auto"
      >
        <CellularHero />
      </div>

      <div className="rounded-tl-[4rem] bg-white">
        <section className="page-gutter py-16 hidden md:block">
          <FadeIn>
            <div
              role="note"
              aria-labelledby="ai-expertise-overview-heading"
              className="mx-auto mb-12 max-w-4xl md:flex md:items-start md:gap-12"
            >
              <h2
                id="ai-expertise-overview-heading"
                className="shrink-0 text-xl font-bold md:text-2xl"
              >
                {m.home_overview_ai_title()}
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-700 md:mt-0">
                {m.home_overview_ai_description()}
              </p>
            </div>
          </FadeIn>
          <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-3">
            <FadeIn delay={0}>
              <ServiceList
                category={m.home_overview_strategy_title()}
                Icon={MdWeb}
              >
                <ServiceListItem
                  service={m.home_overview_strategy_service_1()}
                  href="/services/planning"
                />
              </ServiceList>
            </FadeIn>
            <FadeIn delay={100}>
              <ServiceList
                category={m.home_overview_uiux_title()}
                Icon={MdSearch}
              >
                <ServiceListItem
                  service={m.home_overview_uiux_service_1()}
                  href="/services/usertest"
                />
                <ServiceListItem
                  service={m.home_overview_uiux_service_2()}
                  href="/services/prototyping"
                />
                <ServiceListItem
                  service={m.home_overview_uiux_service_3()}
                  href="/services/uiux"
                />
              </ServiceList>
            </FadeIn>
            <FadeIn delay={200}>
              <ServiceList
                category={m.home_overview_engineering_title()}
                Icon={MdAccessibility}
              >
                <ServiceListItem
                  service={m.home_overview_engineering_service_1()}
                  href="/services/engineering"
                />
                <ServiceListItem
                  service={m.home_overview_engineering_service_2()}
                  href="/services/oss"
                />
              </ServiceList>
            </FadeIn>
          </div>
        </section>

        <section
          id="works"
          className="scroll-mt-32 md:border-t border-gray-200 py-10 md:scroll-mt-28 lg:py-20"
        >
          <div className="page-gutter">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold">
                {m.common_page_works()}
              </h2>
            </FadeIn>
          </div>
          <WorksCarousel works={works} />
        </section>

        <section
          id="services"
          className="page-gutter scroll-mt-32 border-t border-gray-200 py-10 md:scroll-mt-28 lg:py-20"
        >
          <FadeIn>
            <h2 className="mb-10 text-2xl md:text-3xl font-bold">
              {m.home_services_heading()}
            </h2>
          </FadeIn>
          <div className="flex flex-col gap-10">
            <FadeIn direction="left">
              <ServiceFeature
                alt={m.home_feature_studio_alt()}
                picture={picServiceStudio}
                title={m.home_feature_studio_title()}
                description={m.home_feature_studio_description()}
              />
            </FadeIn>
            <FadeIn direction="right">
              <ServiceFeature
                alt={m.home_feature_creative_lab_alt()}
                picture={picServiceCreativeLab}
                reversed
                title={m.home_feature_creative_lab_title()}
                description={m.home_feature_creative_lab_description()}
              />
            </FadeIn>
            <FadeIn direction="left">
              <ServiceFeature
                alt={m.home_feature_design_exhibition_alt()}
                picture={picServiceDesign}
                title={m.home_feature_design_exhibition_title()}
                description={m.home_feature_design_exhibition_description()}
              />
            </FadeIn>
          </div>
        </section>

        <section className="page-gutter border-t border-gray-200 bg-gray-50 py-10 lg:py-20">
          <FadeIn>
            <p className="text-sm font-semibold tracking-[0.14em] text-gray-500">
              {m.home_capabilities_heading()}
            </p>
            <h2 className="mt-4 max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
              {m.home_capabilities_ai_heading()}
            </h2>
            <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-8 text-gray-600">
              {m.home_capabilities_ai_intro()}
            </p>
          </FadeIn>

          <section
            className="mt-12 lg:mt-16"
            aria-labelledby="ai-development-process-heading"
          >
            <FadeIn>
              <h3
                id="ai-development-process-heading"
                className="text-xl font-bold md:text-2xl"
              >
                {m.home_capabilities_ai_process_heading()}
              </h3>
            </FadeIn>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: m.home_capabilities_ai_research_title(),
                  body: m.home_capabilities_ai_research_body(),
                },
                {
                  title: m.home_capabilities_ai_prototype_title(),
                  body: m.home_capabilities_ai_prototype_body(),
                },
                {
                  title: m.home_capabilities_ai_build_title(),
                  body: m.home_capabilities_ai_build_body(),
                },
                {
                  title: m.home_capabilities_ai_validate_title(),
                  body: m.home_capabilities_ai_validate_body(),
                },
              ].map((step, i) => (
                <FadeIn key={step.title} delay={i * 80}>
                  <article className="flex h-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 md:p-8">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-300 text-sm font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="text-lg font-semibold">{step.title}</h4>
                    <p className="text-sm leading-7 text-gray-600">
                      {step.body}
                    </p>
                  </article>
                </FadeIn>
              ))}
            </div>
          </section>

          <section
            className="mt-14 lg:mt-20"
            aria-labelledby="core-expertise-heading"
          >
            <FadeIn>
              <h3
                id="core-expertise-heading"
                className="text-xl font-bold md:text-2xl"
              >
                {m.home_capabilities_expertise_heading()}
              </h3>
            </FadeIn>
            <div className="mt-6 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  alt: m.home_capability_planning_title(),
                  picture: picServicePlanning,
                  title: m.home_capability_planning_title(),
                  href: "/services/planning",
                },
                {
                  alt: m.home_capability_prototyping_title(),
                  picture: picServicePrototyping,
                  title: m.home_capability_prototyping_title(),
                  href: "/services/prototyping",
                },
                {
                  alt: m.home_capability_engineering_title(),
                  picture: picServiceEngineering,
                  title: m.home_capability_engineering_title(),
                  href: "/services/engineering",
                },
                {
                  alt: m.home_capability_uiux_title(),
                  picture: picServiceUidesign,
                  title: m.home_capability_uiux_title(),
                  href: "/services/uiux",
                },
                {
                  alt: m.home_capability_user_testing_title(),
                  picture: picServiceUserTest,
                  title: m.home_capability_user_testing_title(),
                  href: "/services/usertest",
                },
                {
                  alt: m.home_capability_open_source_title(),
                  picture: picServiceOss,
                  title: m.home_capability_open_source_title(),
                  href: "/services/oss",
                },
              ].map((card, i) => (
                <FadeIn key={card.href} delay={i * 80}>
                  <CapabilityCard {...card} />
                </FadeIn>
              ))}
            </div>
          </section>
        </section>

        <section className="grid grid-cols-1 items-center gap-20 px-[var(--page-gutter)] py-10 md:grid-cols-2 lg:px-0 lg:py-0">
          <FadeIn
            direction="left"
            className="overflow-hidden rounded-xl lg:rounded-none lg:rounded-tr-4xl"
          >
            <CuriosityBloomExperience label={m.home_curiosity_switch_label()} />
          </FadeIn>
          <FadeIn direction="right" className="lg:pr-[var(--page-gutter)]">
            <h2 className="mb-10 text-2xl md:text-3xl font-bold">
              {m.home_about_title()}
            </h2>
            <p className="leading-8 whitespace-pre-line">
              {m.home_about_description()}
            </p>
          </FadeIn>
        </section>

        <section className="page-gutter bg-gray-50 py-10 lg:py-20">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold">
              {m.common_page_news()}
            </h2>
          </FadeIn>
          {news.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article, i) => (
                <FadeIn
                  key={`${article.locale}:${article.slug}`}
                  delay={i * 100}
                >
                  <NewsCard article={article} />
                </FadeIn>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
