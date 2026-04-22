import { createFileRoute } from "@tanstack/react-router";

import { PageIntro } from "../../components/PageLayout";
import { m } from "../../paraglide/messages";

export const Route = createFileRoute("/contact/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-white">
      <PageIntro title={m.common_page_contact()} />
      <section className="border-t border-gray-200 px-6 py-12 md:px-20 md:py-16">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gray-50 p-8 md:p-10">
          <h2 className="text-2xl font-semibold">{m.footer_contact_title()}</h2>
          <p className="mt-4 leading-8 text-gray-600">
            {m.footer_contact_description()}
          </p>
        </div>
      </section>
    </main>
  );
}
