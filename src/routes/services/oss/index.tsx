import { createFileRoute } from "@tanstack/react-router";

import picServiceOss from "../../../assets/service-oss.webp?w=640;960;1440;2160&format=avif;webp;jpg&as=picture";
import { PageIntro } from "../../../components/PageLayout";
import { Picture } from "../../../components/Picture";
import { m } from "../../../paraglide/messages";

export const Route = createFileRoute("/services/oss/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-white">
      <PageIntro
        title={m.home_capability_open_source_title()}
        description={
          <p className="whitespace-pre-line">{m.service_oss_description()}</p>
        }
      />
      <div className="page-gutter-wide flex flex-col gap-10 py-10 lg:py-20">
        <Picture
          picture={picServiceOss}
          alt={m.home_capability_open_source_title()}
          className="rounded-xl object-cover"
          priority
          sizePreset="fullWidth"
        />
        <div className="prose xl:max-w-[70%]">
          <p className="whitespace-pre-line">{m.service_oss_body()}</p>
        </div>
      </div>
    </main>
  );
}
