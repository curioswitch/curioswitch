// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContentEntryPage } from "./PageLayout";

describe("ContentEntryPage", () => {
  it("accepts work-specific typography for article section headings", () => {
    const { container } = render(
      <ContentEntryPage
        title="Example"
        hero={null}
        contentClassName="prose-h1:text-[2rem] prose-h1:leading-tight"
      >
        <h1>Background</h1>
      </ContentEntryPage>,
    );

    const content = container.querySelector(".prose");

    expect(content?.classList.contains("prose-h1:text-[2rem]")).toBe(true);
    expect(content?.classList.contains("prose-h1:leading-tight")).toBe(true);
  });

  it("uses the compact desktop title size for work entries", () => {
    const { container } = render(
      <ContentEntryPage title="Example" hero={null} variant="work">
        <p>Article</p>
      </ContentEntryPage>,
    );

    const title = container.querySelector("article > header h1");

    expect(title?.classList.contains("md:text-5xl")).toBe(true);
    expect(title?.classList.contains("md:text-6xl")).toBe(false);
  });

  it("renders a full-bleed responsive banner for work entries", () => {
    const { container } = render(
      <ContentEntryPage
        title="Example"
        hero={<img src="/hero.jpg" alt="Hero" />}
        variant="work"
      >
        <p>Article</p>
      </ContentEntryPage>,
    );

    const hero = container.querySelector("article > .w-screen");

    expect(hero?.classList.contains("h-60")).toBe(true);
    expect(hero?.classList.contains("md:h-[30rem]")).toBe(true);
    expect(hero?.classList.contains("-translate-x-1/2")).toBe(true);
    expect(hero?.querySelector('img[alt="Hero"]')).not.toBeNull();
  });
});
