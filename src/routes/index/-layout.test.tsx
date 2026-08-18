// @vitest-environment jsdom

import { isValidElement, type ReactElement, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { m } from "../../paraglide/messages";

import { Route } from "./route";

vi.mock("../../lib/content", () => ({
  getLocalizedNews: () => [],
  getLocalizedWorks: () => [],
}));

function elementChildren(node: ReactNode): ReactNode[] {
  if (Array.isArray(node)) {
    return node.flatMap(elementChildren);
  }

  if (!isValidElement(node)) {
    return [];
  }

  return [node, ...elementChildren(node.props.children)];
}

function hasText(node: ReactNode, text: string): boolean {
  if (typeof node === "string") {
    return node === text;
  }

  if (Array.isArray(node)) {
    return node.some((child) => hasText(child, text));
  }

  return isValidElement(node) && hasText(node.props.children, text);
}

function renderHomeTree(): ReactElement {
  vi.spyOn(Route, "useLoaderData").mockReturnValue({ news: [], works: [] });

  const Component = Route.options.component;
  if (!Component) {
    throw new Error("Home route component is not configured");
  }

  return (Component as () => ReactElement)();
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("home desktop layout", () => {
  it("narrows the service overview columns", () => {
    const elements = elementChildren(renderHomeTree());
    const overviewGrid = elements.find(
      (element) =>
        isValidElement(element) &&
        element.type === "div" &&
        typeof element.props.className === "string" &&
        element.props.className.includes("md:grid-cols-3") &&
        elementChildren(element).some(
          (child) =>
            isValidElement(child) &&
            child.props.category === m.home_overview_strategy_title(),
        ),
    );
    expect(overviewGrid?.props.className).toContain("max-w-4xl");
  });

  it("centers each service column while left-aligning its links", () => {
    const elements = elementChildren(renderHomeTree());
    const serviceListElement = elements.find(
      (element) =>
        isValidElement(element) &&
        typeof element.type === "function" &&
        element.props.category === m.home_overview_strategy_title(),
    );

    if (!isValidElement(serviceListElement)) {
      throw new Error("Service overview list was not rendered");
    }

    const ServiceListComponent = serviceListElement.type as (
      props: typeof serviceListElement.props,
    ) => ReactElement;
    const serviceList = ServiceListComponent(serviceListElement.props);
    const serviceListChildren = elementChildren(serviceList);
    const list = serviceListChildren.find(
      (element) => isValidElement(element) && element.type === "ul",
    );

    expect(serviceList.props.className).toContain("items-center");
    expect(serviceList.props.className).toContain("text-center");
    expect(list?.props.className).toContain("items-start");
    expect(list?.props.className).toContain("text-left");
    expect(list?.props.className).not.toContain("items-center");
  });

  it("aligns the hero copy with the shared responsive gutter", () => {
    const elements = elementChildren(renderHomeTree());
    const homeMain = elements.find(
      (element) => isValidElement(element) && element.type === "main",
    );
    const heroSection = elements.find(
      (element) =>
        isValidElement(element) &&
        element.type === "section" &&
        hasText(element, m.home_hero_title()),
    );
    const heroCopy = elements.find(
      (element) =>
        isValidElement(element) &&
        element.type === "div" &&
        hasText(element, m.home_hero_title()),
    );
    const worksArrow = elements.find(
      (element) =>
        isValidElement(element) &&
        element.type === "a" &&
        element.props["aria-label"] === m.home_scroll_to_works_label(),
    );

    expect(heroSection?.props.className).toContain(
      "md:px-[var(--page-gutter)]",
    );
    expect(heroSection?.props.className).not.toContain("md:px-[7.8125vw]");
    expect(heroSection?.props.className).toContain("md:min-h-96");
    expect(heroSection?.props.className).toContain("md:justify-center");
    expect(heroCopy?.props.className).toContain("gap-6");
    expect(heroCopy?.props.className).toContain("md:gap-8");
    expect(heroCopy?.props.className).not.toContain("lg:ml-");
    expect(worksArrow?.props.className).toContain("md:right-20");
    expect(homeMain?.props.className).toContain("overflow-x-clip");
    expect(worksArrow?.props.className).toContain("lg:right-40");
  });

  it("removes the About image's outer gutter only on large screens", () => {
    const elements = elementChildren(renderHomeTree());
    const aboutSection = elements.find(
      (element) =>
        isValidElement(element) &&
        element.type === "section" &&
        hasText(element, m.home_about_title()),
    );

    expect(aboutSection?.props.className).toContain("px-[var(--page-gutter)]");
    expect(aboutSection?.props.className).toContain("lg:px-0");
    expect(aboutSection?.props.className).toContain("py-10");
    expect(aboutSection?.props.className).toContain("lg:py-0");
    expect(aboutSection?.props.className).not.toContain("lg:py-20");

    const aboutChildren = isValidElement(aboutSection)
      ? elementChildren(aboutSection.props.children)
      : [];
    const aboutCopy = aboutChildren.find(
      (element) =>
        isValidElement(element) && hasText(element, m.home_about_title()),
    );

    expect(aboutCopy?.props.className).toContain("lg:pr-[var(--page-gutter)]");
  });
});
