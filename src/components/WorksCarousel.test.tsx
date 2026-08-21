// @vitest-environment jsdom

import { isValidElement, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { useEmblaCarousel } = vi.hoisted(() => ({
  useEmblaCarousel: vi.fn(() => [vi.fn(), undefined]),
}));

vi.mock("embla-carousel-react", () => ({
  default: useEmblaCarousel,
}));

import WorksCarousel from "./WorksCarousel";

function elementChildren(node: ReactNode): ReactNode[] {
  if (Array.isArray(node)) {
    return node.flatMap(elementChildren);
  }

  if (!isValidElement(node)) {
    return [];
  }

  return [node, ...elementChildren(node.props.children)];
}

describe("WorksCarousel", () => {
  beforeEach(() => {
    useEmblaCarousel.mockClear();
  });

  it("centers two desktop cards with matching partial cards on both sides", () => {
    const works = Array.from({ length: 4 }, (_, index) => ({
      locale: "ja",
      slug: `work-${index + 1}`,
    })) as Parameters<typeof WorksCarousel>[0]["works"];
    const carousel = WorksCarousel({ works });

    expect(useEmblaCarousel).toHaveBeenCalledWith(
      expect.objectContaining({
        align: "start",
        breakpoints: {
          "(min-width: 64rem)": {
            align: "center",
            slidesToScroll: 2,
          },
        },
      }),
    );

    const desktopSlides = elementChildren(carousel).filter(
      (element) =>
        isValidElement(element) &&
        typeof element.props.className === "string" &&
        element.props.className.includes("lg:flex-[0_0_32%]"),
    );

    expect(desktopSlides).toHaveLength(4);
  });

  it("adds the shared left gutter to mobile cards only", () => {
    const works = [
      { locale: "ja", slug: "work-1" },
      { locale: "ja", slug: "work-2" },
    ] as Parameters<typeof WorksCarousel>[0]["works"];
    const carousel = WorksCarousel({ works });
    const viewport = elementChildren(carousel).find(
      (element) =>
        isValidElement(element) &&
        typeof element.props.className === "string" &&
        element.props.className.includes("overflow-hidden"),
    );

    expect(viewport?.props.className).toContain("pl-[var(--page-gutter)]");
    expect(viewport?.props.className).toContain("md:pl-0");
  });
});
