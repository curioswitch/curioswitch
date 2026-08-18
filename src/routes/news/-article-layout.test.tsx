import { isValidElement, type ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Picture } from "../../components/Picture";

import { Route } from "./$slug";

vi.mock("../../lib/content", () => ({
  findLocalizedNews: () => undefined,
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("news article layout", () => {
  it("uses the approved news article image frame", () => {
    vi.spyOn(Route, "useLoaderData").mockReturnValue({
      title: "Example news",
      heroPicture: {},
      mdx: null,
      html: "",
      contentAssetMap: {},
    } as unknown as ReturnType<typeof Route.useLoaderData>);

    const Component = Route.options.component;
    if (!Component) {
      throw new Error("News article component is not configured");
    }

    const page = (Component as () => ReactElement)();
    expect(page.props.variant).toBe("news");

    const hero = page.props.hero;
    expect(isValidElement(hero)).toBe(true);
    expect(hero.props.className).toContain("mx-auto");
    expect(hero.props.className).toContain("aspect-4/3");
    expect(hero.props.className).toContain("max-w-[700px]");
    expect(hero.props.className).not.toContain("max-w-[800px]");
    expect(hero.props.className).not.toContain("rounded");
    expect(hero.props.className).not.toContain("h-[200px]");
    expect(hero.props.className).not.toContain("md:h-[300px]");

    const picture = hero.props.children;
    expect(isValidElement(picture)).toBe(true);
    expect(picture.type).toBe(Picture);
    expect(picture.props.sizePreset).toBe("maxWidth5xl");
  });
});
