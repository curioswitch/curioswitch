import { createFileRoute } from "@tanstack/react-router";

import picServicePlanning from "../../../assets/service-planning.webp?w=640;960;1440;2160&format=avif;webp;jpg&as=picture";
import { PageIntro } from "../../../components/PageLayout";
import { Picture } from "../../../components/Picture";
import { m } from "../../../paraglide/messages";

export const Route = createFileRoute("/services/planning/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-white">
      <PageIntro
        title={m.home_capability_planning_title()}
        description={
          <p className="whitespace-pre-line">{m.service_planning_description()}</p>
        }
      />
      <div className="flex flex-col gap-10 p-10 lg:p-20 lg:px-32">
        <Picture
          picture={picServicePlanning}
          alt={m.home_capability_planning_title()}
          className="rounded-xl object-cover"
          priority
          sizePreset="fullWidth"
        />
        <div className="prose xl:max-w-[70%]">
          <h2>{m.service_planning_section_1_title()}</h2>
          <p className="whitespace-pre-line">{m.service_planning_section_1_body()}</p>
        </div>
        <div className="prose xl:max-w-[70%]">
          <h2>{m.service_planning_section_2_title()}</h2>
          <p className="whitespace-pre-line">{m.service_planning_section_2_body()}</p>
        </div>
        <p className="my-10 whitespace-pre-line text-lg leading-9">
          {m.service_planning_closing()}
        </p>
      </div>
    </main>
  );
}
