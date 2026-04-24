import { createFileRoute } from "@tanstack/react-router";

import picServiceUsertest from "../../../assets/service-usertest.webp?w=640;960;1440;2160&format=avif;webp;jpg&as=picture";
import { PageIntro } from "../../../components/PageLayout";
import { Picture } from "../../../components/Picture";
import { m } from "../../../paraglide/messages";

export const Route = createFileRoute("/services/usertest/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-white">
      <PageIntro
        title={m.home_capability_user_testing_title()}
        description={
          <p className="whitespace-pre-line">
            {m.service_user_testing_description()}
          </p>
        }
      />
      <div className="page-gutter-wide flex flex-col gap-10 py-10 lg:py-20">
        <Picture
          picture={picServiceUsertest}
          alt={m.home_capability_user_testing_title()}
          className="rounded-xl object-cover"
          priority
          sizePreset="fullWidth"
        />
        <div className="prose xl:max-w-[70%]">
          <h2>{m.service_user_testing_section_1_title()}</h2>
          <p className="whitespace-pre-line">
            {m.service_user_testing_section_1_body()}
          </p>
        </div>
        <div className="prose xl:max-w-[70%]">
          <h2>{m.service_user_testing_section_2_title()}</h2>
          <p className="whitespace-pre-line">
            {m.service_user_testing_section_2_body()}
          </p>
        </div>
        <p className="my-10 whitespace-pre-line text-lg leading-9">
          {m.service_user_testing_closing()}
        </p>
      </div>
    </main>
  );
}
