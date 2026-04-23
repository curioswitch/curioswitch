import { createFileRoute } from "@tanstack/react-router";

import picServiceEngineering from "../../../assets/service-engineering.webp?w=640;960;1440;2160&format=avif;webp;jpg&as=picture";
import { PageIntro } from "../../../components/PageLayout";
import { Picture } from "../../../components/Picture";
import { m } from "../../../paraglide/messages";

export const Route = createFileRoute("/services/engineering/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-white">
      <PageIntro
        title={m.home_capability_engineering_title()}
        description={
          <p className="whitespace-pre-line">
            {m.service_engineering_description()}
          </p>
        }
      />
      <div className="flex flex-col gap-10 p-10 lg:p-20 lg:px-32">
        <Picture
          picture={picServiceEngineering}
          alt={m.home_capability_engineering_title()}
          className="rounded-xl object-cover"
          priority
          sizePreset="fullWidth"
        />
        <div className="prose xl:max-w-[70%]">
          <h2 className="whitespace-pre-line">
            {m.service_engineering_section_1_title()}
          </h2>
          <p className="whitespace-pre-line">
            {m.service_engineering_section_1_body()}
          </p>
        </div>
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[7fr_3fr]">
          <div className="prose">
            <h2 className="whitespace-pre-line">
              {m.service_engineering_section_2_title()}
            </h2>
            <p className="whitespace-pre-line">
              {m.service_engineering_section_2_body()}
            </p>
          </div>
          <div>
            <p className="whitespace-pre-line text-sm text-gray-600">
              {m.service_engineering_ai_note()}
            </p>
          </div>
        </div>
        <p className="my-10 whitespace-pre-line text-lg leading-9">
          {m.service_engineering_closing()}
        </p>
      </div>
    </main>
  );
}
