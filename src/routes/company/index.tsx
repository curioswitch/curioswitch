import { createFileRoute } from "@tanstack/react-router";

import picCompanyHero from "../../assets/company-hero.jpg?w=640;960;1440;2160&format=avif;webp;jpg&as=picture";
import picCompanyMessage from "../../assets/company-message.jpg?w=480;640;960;1280&format=avif;webp;jpg&as=picture";
import { PageIntro } from "../../components/PageLayout";
import { Picture } from "../../components/Picture";
import { m } from "../../paraglide/messages";
import { getLocale } from "../../paraglide/runtime";

export const Route = createFileRoute("/company/")({
  component: RouteComponent,
});

function RouteComponent() {
  const locale = getLocale();
  // Comparing two share URLs, we can see which parameter to tweak to change the language without going to the full API-key embed approach
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.639148566826!2d139.6903493757879!3d35.68588627258575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d17b7bee02d%3A0x99c25292bbd24a73!2z6KW_5paw5a6_5rC06ZaT44OT44Or!5e0!3m2!1s${locale}!2sjp!4v1776324685667!5m2!1s${locale}!2sjp`;
  return (
    <main className="bg-white">
      <PageIntro
        title={m.common_page_company()}
        description={<p>{m.common_brand_tagline()}</p>}
      />
      <Picture
        picture={picCompanyHero}
        alt={m.company_hero_alt()}
        className="h-48 w-full object-cover md:h-96"
        priority
        sizePreset="fullWidth"
      />
      <section className="grid gap-4 p-10 md:gap-8 lg:grid-cols-[1fr_9fr_6fr] lg:p-24">
        <p className="text-sm font-medium tracking-[0.18em] text-gray-500 uppercase whitespace-nowrap">
          {m.company_mission_label()}
        </p>
        <div className="flex flex-col gap-6 md:gap-12">
          <h2 className="text-3xl font-semibold whitespace-pre-line lg:text-6xl">
            {m.company_mission_title()}
          </h2>
          <p className="text-sm lg:text-base">{m.company_mission_summary()}</p>
        </div>
        <p className="text-sm leading-7 text-gray-600 whitespace-pre-line lg:text-base">
          {m.company_mission_body()}
        </p>
        <p className="text-sm font-medium tracking-[0.18em] text-gray-500 uppercase whitespace-nowrap">
          {m.company_vision_label()}
        </p>
        <div className="flex flex-col gap-12">
          <h2 className="text-3xl font-semibold whitespace-pre-line lg:text-6xl">
            {m.company_vision_title()}
          </h2>
          <p className="text-sm lg:text-base">{m.company_vision_summary()}</p>
        </div>
        <p className="text-sm leading-7 text-gray-600 whitespace-pre-line lg:text-base">
          {m.company_vision_body()}
        </p>
      </section>
      <section className="border-t border-gray-100 p-10 lg:p-20 lg:px-32">
        <header>
          <h2 className="text-4xl">{m.company_message_heading()}</h2>
        </header>
        <div className="mt-12 grid items-end gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl whitespace-pre-line">
              {m.company_message_title()}
            </h3>
            <p className="mt-8 leading-7 text-gray-800 whitespace-pre-line lg:leading-10">
              {m.company_message_body()}
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <Picture
              picture={picCompanyMessage}
              alt={m.company_message_image_alt()}
              className="h-48 w-full rounded-xl object-cover md:h-96"
              sizePreset="twoColumn"
            />
          </div>
        </div>
      </section>
      <section className="border-t border-gray-100 p-10 lg:p-20 lg:px-32">
        <header>
          <h2 className="text-4xl">{m.company_overview_heading()}</h2>
        </header>
        <div className="mt-12 grid items-start gap-12 lg:grid-cols-2">
          <iframe
            title={m.company_map_title()}
            src={mapUrl}
            className="h-96 w-full rounded-xl border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <dl className="grid grid-cols-[8rem_minmax(0,1fr)] items-start gap-x-12 gap-y-4 leading-7">
            <dt className="font-semibold">
              {m.company_overview_capital_label()}
            </dt>
            <dd className="text-gray-700">
              {m.company_overview_capital_value()}
            </dd>

            <dt className="font-semibold">
              {m.company_overview_established_label()}
            </dt>
            <dd className="text-gray-700">
              {m.company_overview_established_value()}
            </dd>

            <dt className="font-semibold">
              {m.company_overview_address_label()}
            </dt>
            <dd className="text-gray-700">
              {m.company_overview_address_value()}
            </dd>

            <dt className="font-semibold">
              {m.company_overview_business_label()}
            </dt>
            <dd className="text-gray-700">
              {m.company_overview_business_value()}
            </dd>
          </dl>
        </div>
      </section>
    </main>
  );
}
