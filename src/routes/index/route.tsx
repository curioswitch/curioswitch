import { createFileRoute } from "@tanstack/react-router";
import type { IconType } from "react-icons";
import {
  MdAccessibility,
  MdArrowDropDownCircle,
  MdSearch,
  MdSouth,
  MdWeb,
} from "react-icons/md";

import picHomeAboutUs from "../../assets/home-about-us.jpg?w=480;640;960;1280&format=avif;webp;jpg&as=picture";
import picServiceCreativeLab from "../../assets/home-service-creativelab.webp?w=480;640;960;1280&format=avif;webp;jpg&as=picture";
import picServiceDesign from "../../assets/home-service-design.webp?w=480;640;960;1280&format=avif;webp;jpg&as=picture";
import picServiceStudio from "../../assets/home-service-studio.webp?w=480;640;960;1280&format=avif;webp;jpg&as=picture";
import picServiceEngineering from "../../assets/service-engineering.webp?w=320;480;640;960&format=avif;webp;jpg&as=picture";
import picServiceOss from "../../assets/service-oss.webp?w=320;480;640;960&format=avif;webp;jpg&as=picture";
import picServicePlanning from "../../assets/service-planning.webp?w=320;480;640;960&format=avif;webp;jpg&as=picture";
import picServicePrototyping from "../../assets/service-prototyping.webp?w=320;480;640;960&format=avif;webp;jpg&as=picture";
import picServiceUidesign from "../../assets/service-uidesign.webp?w=320;480;640;960&format=avif;webp;jpg&as=picture";
import picServiceUserTest from "../../assets/service-usertest.webp?w=320;480;640;960&format=avif;webp;jpg&as=picture";
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

function ServiceListItem({ service }: { service: string }) {
  return (
    <li className="flex items-center gap-2">
      <MdArrowDropDownCircle
        className="-rotate-90 text-gray-400"
        aria-hidden="true"
      />
      <span>{service}</span>
    </li>
  );
}

function ServiceList({
  Icon,
  category,
  services,
}: {
  Icon: IconType;
  category: string;
  services: string[];
}) {
  return (
    <article className="flex flex-col gap-4">
      <Icon size={40} aria-hidden="true" />
      <h2 className="text-xl">{category}</h2>
      <ul className="space-y-2 text-gray-700">
        {services.map((service) => (
          <ServiceListItem key={service} service={service} />
        ))}
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
          className="h-full w-full"
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
        <p className="text-gray-600 text-sm leading-6 whitespace-pre-line">
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
}: {
  alt: string;
  picture: typeof picServicePlanning;
  title: string;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <Picture
        picture={picture}
        className="block w-full"
        alt={alt}
        sizePreset="threeColumn"
      />
      <h3 className="p-8 text-lg">{title}</h3>
    </article>
  );
}

function Home() {
  const { works, news } = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-orange-400">
      <section className="relative flex flex-col justify-end rounded-bl-4xl bg-white px-6 pb-10 md:min-h-140 md:px-20 md:pb-20">
        <div className="flex max-w-4xl flex-col gap-6 md:gap-8">
          <h1 className="text-5xl font-medium whitespace-pre-line md:text-7xl">
            {m.home_hero_title()}
          </h1>
          <p className="text-gray-500">{m.common_brand_tagline()}</p>
        </div>
        <a
          href="#works"
          aria-label={m.home_scroll_to_works_label()}
          className="absolute right-8 bottom-0 flex h-20 w-20 translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-[0_12px_32px_rgba(0,0,0,0.28)] md:right-20 md:h-32 md:w-32"
        >
          <MdSouth size={32} />
        </a>
      </section>

      <div className="mt-100 rounded-tl-4xl bg-white">
        <section className="px-10 py-16 lg:px-20">
          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">
            <ServiceList
              category={m.home_overview_strategy_title()}
              Icon={MdWeb}
              services={[m.home_overview_strategy_service_1()]}
            />
            <ServiceList
              category={m.home_overview_uiux_title()}
              Icon={MdSearch}
              services={[
                m.home_overview_uiux_service_1(),
                m.home_overview_uiux_service_2(),
                m.home_overview_uiux_service_3(),
              ]}
            />
            <ServiceList
              category={m.home_overview_engineering_title()}
              Icon={MdAccessibility}
              services={[
                m.home_overview_engineering_service_1(),
                m.home_overview_engineering_service_2(),
                m.home_overview_engineering_service_3(),
              ]}
            />
          </div>
        </section>

        <section
          id="works"
          className="scroll-mt-32 border-t border-gray-200 p-10 md:scroll-mt-28 lg:p-20"
        >
          <h2 className="text-3xl font-bold">{m.common_page_works()}</h2>
          <WorksCarousel works={works} />
        </section>

        <section
          id="services"
          className="scroll-mt-32 border-t border-gray-200 p-10 md:scroll-mt-28 lg:p-20"
        >
          <h2 className="mb-10 text-3xl font-bold">
            {m.home_services_heading()}
          </h2>
          <div className="flex flex-col gap-10">
            <ServiceFeature
              alt={m.home_feature_studio_alt()}
              picture={picServiceStudio}
              title={m.home_feature_studio_title()}
              description={m.home_feature_studio_description()}
            />
            <ServiceFeature
              alt={m.home_feature_creative_lab_alt()}
              picture={picServiceCreativeLab}
              reversed
              title={m.home_feature_creative_lab_title()}
              description={m.home_feature_creative_lab_description()}
            />
            <ServiceFeature
              alt={m.home_feature_design_exhibition_alt()}
              picture={picServiceDesign}
              title={m.home_feature_design_exhibition_title()}
              description={m.home_feature_design_exhibition_description()}
            />
          </div>
        </section>

        <section className="border-t border-gray-200 bg-gray-50 p-10 lg:p-20">
          <h2 className="mb-10 text-3xl font-bold">
            {m.home_capabilities_heading()}
          </h2>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            <CapabilityCard
              alt={m.home_capability_planning_title()}
              picture={picServicePlanning}
              title={m.home_capability_planning_title()}
            />
            <CapabilityCard
              alt={m.home_capability_prototyping_title()}
              picture={picServicePrototyping}
              title={m.home_capability_prototyping_title()}
            />
            <CapabilityCard
              alt={m.home_capability_engineering_title()}
              picture={picServiceEngineering}
              title={m.home_capability_engineering_title()}
            />
            <CapabilityCard
              alt={m.home_capability_uiux_title()}
              picture={picServiceUidesign}
              title={m.home_capability_uiux_title()}
            />
            <CapabilityCard
              alt={m.home_capability_user_testing_title()}
              picture={picServiceUserTest}
              title={m.home_capability_user_testing_title()}
            />
            <CapabilityCard
              alt={m.home_capability_open_source_title()}
              picture={picServiceOss}
              title={m.home_capability_open_source_title()}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 items-center gap-20 p-10 md:grid-cols-2 lg:p-20">
          <div className="overflow-hidden rounded-xl lg:rounded-none lg:rounded-tr-4xl">
            <Picture
              picture={picHomeAboutUs}
              className="block w-full"
              alt={m.home_about_image_alt()}
              sizePreset="twoColumn"
            />
          </div>
          <div>
            <h2 className="mb-10 text-3xl font-bold">{m.home_about_title()}</h2>
            <p className="leading-8 whitespace-pre-line">
              {m.home_about_description()}
            </p>
          </div>
        </section>

        <section className="bg-gray-50 p-10 lg:p-20">
          <h2 className="text-3xl font-bold">{m.common_page_news()}</h2>
          {news.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article) => (
                <NewsCard
                  key={`${article.locale}:${article.slug}`}
                  article={article}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
