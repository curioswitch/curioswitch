import { createFileRoute } from "@tanstack/react-router";

import { PageIntro } from "../../components/PageLayout";
import { m } from "../../paraglide/messages";
import { getLocale } from "../../paraglide/runtime";

export const Route = createFileRoute("/contact/")({
  component: RouteComponent,
});

function RouteComponent() {
  const locale = getLocale();

  let formID: string;
  switch (locale) {
    case "en":
      formID = "1FAIpQLScytisDymMYdgI9Z78XcdD3ushmYeFdDCjldA4MwUNkxATX5Q";
      break;
    case "ja":
      formID = "1FAIpQLSdZzPH3aUJ1eZH565hoNdIPmIaZj46TksfrPLzeLtRLwkMHkw";
      break;
  }

  return (
    <main className="bg-white">
      <PageIntro title={m.common_page_contact()} />
      <section className="page-gutter border-t border-gray-200 bg-gray-50/60 py-10 md:py-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-4xl border border-gray-200 bg-white p-1 shadow-[0_20px_80px_rgba(15,23,42,0.08)] md:p-2">
          <iframe
            title={m.common_page_contact()}
            src={`https://docs.google.com/forms/d/e/${formID}/viewform?embedded=true&hl=${locale}`}
            className="block h-370 w-full rounded-3xl bg-white sm:h-340 lg:h-300"
            width="100%"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          >
            {m.common_loading()}
          </iframe>
        </div>
      </section>
    </main>
  );
}
