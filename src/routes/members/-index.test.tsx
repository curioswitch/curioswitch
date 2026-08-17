// @vitest-environment jsdom

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Route } from "./index";

describe("members route", () => {
  it("preserves the requested line break in Skop's introduction", () => {
    const Component = Route.options.component;
    if (!Component) {
      throw new Error("Members route component is not configured");
    }

    document.body.innerHTML = renderToStaticMarkup(<Component />);

    const introduction = Array.from(document.querySelectorAll("p")).find(
      (paragraph) =>
        paragraph.textContent?.startsWith(
          "ランニングとなっとうが好きな、UI/UXデザイナー兼プロダクトマネジャー。",
        ),
    );

    expect(introduction?.textContent).toBe(
      "ランニングとなっとうが好きな、UI/UXデザイナー兼プロダクトマネジャー。\n慶應義塾大学大学院 政策・メディア研究科でデザイン思考を学び、「かわいい検索」を全国に広める。",
    );
    expect(introduction?.classList.contains("whitespace-pre-line")).toBe(true);
  });
});
