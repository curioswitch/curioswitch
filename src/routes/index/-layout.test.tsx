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
  it("shows AI as guidance shared by all three service disciplines", () => {
    const elements = elementChildren(renderHomeTree());
    const overviewSection = elements.find(
      (element) =>
        isValidElement(element) &&
        element.type === "section" &&
        elementChildren(element).some(
          (child) => isValidElement(child) && child.props.role === "note",
        ) &&
        elementChildren(element).some(
          (child) =>
            isValidElement(child) &&
            typeof child.type === "function" &&
            child.type.name === "ServiceList",
        ),
    );
    const aiGuidance = elementChildren(overviewSection).find(
      (element) => isValidElement(element) && element.props.role === "note",
    );
    const serviceDisciplines = elementChildren(overviewSection).filter(
      (element) =>
        isValidElement(element) &&
        typeof element.type === "function" &&
        element.type.name === "ServiceList",
    );

    expect(aiGuidance).toBeDefined();
    expect(serviceDisciplines).toHaveLength(3);
  });

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

  it("renders service link icons in black", () => {
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
    const serviceLinkElement = elementChildren(serviceList).find(
      (element) =>
        isValidElement(element) &&
        typeof element.type === "function" &&
        typeof element.props.service === "string",
    );

    if (!isValidElement(serviceLinkElement)) {
      throw new Error("Service link was not rendered");
    }

    const ServiceLinkComponent = serviceLinkElement.type as (
      props: typeof serviceLinkElement.props,
    ) => ReactElement;
    const serviceLink = ServiceLinkComponent(serviceLinkElement.props);
    const arrowIcon = elementChildren(serviceLink).find(
      (element) =>
        isValidElement(element) &&
        element.props["aria-hidden"] === "true" &&
        typeof element.props.className === "string" &&
        element.props.className.includes("-rotate-90"),
    );

    expect(arrowIcon?.props.className).toContain("text-black");
    expect(arrowIcon?.props.className).not.toContain("text-gray-400");
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
    expect(heroSection?.props.className).toContain("pt-6");
    expect(heroSection?.props.className).toContain("pb-16");
    expect(heroSection?.props.className).toContain("md:py-20");
    expect(heroCopy?.props.className).toContain("gap-6");
    expect(heroCopy?.props.className).toContain("md:gap-8");
    expect(heroCopy?.props.className).not.toContain("lg:ml-");
    expect(worksArrow?.props.className).toContain("md:right-20");
    expect(homeMain?.props.className).toContain("overflow-x-clip");
    expect(worksArrow?.props.className).toContain("lg:right-40");
    expect(worksArrow?.props.className).toContain("z-20");
  });

  it("renders the hero photo as a mobile banner directly before the content", () => {
    const elements = elementChildren(renderHomeTree());
    const backgroundBanner = elements.find(
      (element) =>
        isValidElement(element) &&
        element.type === "div" &&
        element.props.id === "mobile-hero-background-frame",
    );

    expect(backgroundBanner?.props.className).toContain("aspect-[3/2]");
    expect(backgroundBanner?.props.className).toContain("overflow-hidden");
    expect(backgroundBanner?.props.className).toContain("md:h-[25rem]");
    expect(backgroundBanner?.props.style?.backgroundImage).toBeUndefined();

    const mobileImage = elementChildren(backgroundBanner).find(
      (element) =>
        isValidElement(element) &&
        typeof element.type === "function" &&
        element.type.name === "MobileFixedBackground",
    );
    expect(mobileImage).toBeDefined();

    const backgroundIndex = elements.indexOf(backgroundBanner as ReactElement);
    const contentWrapper = elements
      .slice(backgroundIndex + 1)
      .find(
        (element) =>
          isValidElement(element) &&
          element.type === "div" &&
          typeof element.props.className === "string" &&
          element.props.className.includes("rounded-tl-[4rem]"),
      );

    expect(contentWrapper?.props.className).not.toContain("mt-100");
  });

  it("uses the mobile fixed-background treatment for the hero photo", () => {
    const elements = elementChildren(renderHomeTree());
    const mobileBackground = elements.find(
      (element) =>
        isValidElement(element) &&
        typeof element.type === "function" &&
        element.type.name === "MobileFixedBackground",
    );

    expect(mobileBackground).toBeDefined();
    expect(mobileBackground?.props.image).toBeTruthy();
  });

  it("keeps the hero background as a photo without a WebGL overlay", () => {
    const elements = elementChildren(renderHomeTree());
    const aiField = elements.find(
      (element) =>
        isValidElement(element) &&
        typeof element.type === "function" &&
        element.type.name === "InteractiveAiField",
    );

    expect(aiField).toBeUndefined();
  });

  it("does not repeat the Works heading in English", () => {
    const elements = elementChildren(renderHomeTree());
    const worksSection = elements.find(
      (element) =>
        isValidElement(element) &&
        element.type === "section" &&
        element.props.id === "works",
    );
    const englishSubtitle = elementChildren(worksSection).find(
      (element) =>
        isValidElement(element) &&
        element.type === "p" &&
        hasText(element, "Works"),
    );

    expect(englishSubtitle).toBeUndefined();
  });

  it("keeps every capability image at the same aspect ratio", () => {
    const elements = elementChildren(renderHomeTree());
    const openSourceCardElement = elements.find(
      (element) =>
        isValidElement(element) &&
        typeof element.type === "function" &&
        element.type.name === "CapabilityCard" &&
        element.props.href === "/services/oss",
    );

    if (!isValidElement(openSourceCardElement)) {
      throw new Error("Open source capability card was not rendered");
    }

    const CapabilityCardComponent = openSourceCardElement.type as (
      props: typeof openSourceCardElement.props,
    ) => ReactElement;
    const capabilityCard = CapabilityCardComponent(openSourceCardElement.props);
    const imageFrame = elementChildren(capabilityCard).find(
      (element) =>
        isValidElement(element) &&
        element.type === "div" &&
        typeof element.props.className === "string" &&
        element.props.className.includes("aspect-16/9"),
    );

    expect(imageFrame).toBeDefined();
    expect(imageFrame?.props.className).toContain("overflow-hidden");
  });

  it("presents AI acceleration separately from the core expertise", () => {
    const elements = elementChildren(renderHomeTree());
    const aiProcess = elements.find(
      (element) =>
        isValidElement(element) &&
        element.type === "section" &&
        element.props["aria-labelledby"] === "ai-development-process-heading",
    );
    const expertise = elements.find(
      (element) =>
        isValidElement(element) &&
        element.type === "section" &&
        element.props["aria-labelledby"] === "core-expertise-heading",
    );

    const aiSteps = elementChildren(aiProcess).filter(
      (element) => isValidElement(element) && element.type === "article",
    );
    const expertiseLinks = elementChildren(expertise).filter(
      (element) =>
        isValidElement(element) &&
        typeof element.type === "function" &&
        element.type.name === "CapabilityCard",
    );

    expect(aiProcess).toBeDefined();
    expect(aiSteps).toHaveLength(4);
    expect(expertise).toBeDefined();
    expect(expertiseLinks).toHaveLength(6);
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
