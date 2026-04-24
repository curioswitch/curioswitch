import { Link } from "@tanstack/react-router";
import type { Work } from "content-collections";
import useEmblaCarousel from "embla-carousel-react";
import {
  MdBusiness,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";

import { m } from "../paraglide/messages";

import { Picture } from "./Picture";

function CarouselWorkCard({ work }: { work: Work }) {
  return (
    <Link
      to="/works/$slug"
      params={{ slug: work.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(0,0,0,0.1)]"
    >
      <div className="aspect-16/10 overflow-hidden bg-gray-100">
        <Picture
          picture={work.heroPicture}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          alt={work.title}
          sizePreset="carousel"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-8 lg:p-10">
        <p className="flex items-center gap-2 text-xs tracking-[0.14em] text-gray-500 uppercase">
          <MdBusiness />
          {work.organization}
        </p>
        <h3 className="text-lg font-medium md:text-xl">{work.title}</h3>
        <p className="text-sm leading-7 text-gray-600 line-clamp-2 hidden md:block">
          {work.excerpt}
        </p>
      </div>
    </Link>
  );
}

export default function WorksCarousel({ works }: { works: Work[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: works.length > 2,
  });

  if (works.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 flex flex-col gap-6 md:gap-8">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-5 flex items-stretch md:-ml-6">
          {works.map((work) => (
            <div
              key={`${work.locale}:${work.slug}`}
              className="min-w-0 flex-[0_0_88%] pl-5 md:flex-[0_0_72%] md:pl-6 lg:flex-[0_0_60%]"
            >
              <CarouselWorkCard work={work} />
            </div>
          ))}
        </div>
      </div>

      {works.length > 1 ? (
        <div className="flex justify-end">
          <div className="inline-flex">
            <button
              type="button"
              aria-label={m.common_previous_work_label()}
              className="cursor-pointer flex h-14 w-14 items-center justify-center rounded-tl-4xl rounded-bl-4xl bg-black text-2xl leading-none text-white transition hover:bg-gray-900"
              onClick={() => emblaApi?.goToPrev()}
            >
              <MdKeyboardArrowLeft size={48} />
            </button>
            <button
              type="button"
              aria-label={m.common_next_work_label()}
              className="cursor-pointer flex h-14 w-14 items-center justify-center rounded-tr-4xl rounded-br-4xl border-l border-white/10 bg-black text-2xl leading-none text-white transition hover:bg-gray-900"
              onClick={() => emblaApi?.goToNext()}
            >
              <MdKeyboardArrowRight size={48} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
