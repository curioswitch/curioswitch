// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CollectionContent } from "./CollectionContent";

const picture = {
  sources: {
    avif: "/images/example.avif 640w, /images/example@2x.avif 1280w",
    webp: "/images/example.webp 640w, /images/example@2x.webp 1280w",
  },
  img: {
    src: "/images/example.jpg",
    w: 1280,
    h: 720,
  },
};

describe("CollectionContent", () => {
  it("renders mapped markdown images as responsive picture markup", () => {
    const { container } = render(
      <CollectionContent
        mdx={null}
        html={
          '<p><img src="./example.webp" alt="Example" class="rounded-xl" title="Caption"></p>'
        }
        contentAssetMap={{
          "./example.webp": picture,
        }}
      />,
    );

    const pictureElement = container.querySelector("picture");
    const imageElement = container.querySelector("picture img");
    const sourceElements = Array.from(
      container.querySelectorAll("picture source"),
    );

    expect(pictureElement?.getAttribute("class")).toBe(
      "block max-w-3xl mx-auto rounded-xl",
    );
    expect(imageElement?.getAttribute("src")).toBe("/images/example.jpg");
    expect(imageElement?.getAttribute("width")).toBe("1280");
    expect(imageElement?.getAttribute("height")).toBe("720");
    expect(imageElement?.getAttribute("loading")).toBe("lazy");
    expect(imageElement?.getAttribute("title")).toBe("Caption");
    expect(sourceElements).toHaveLength(2);
    expect(sourceElements.map((source) => source.getAttribute("type"))).toEqual(
      ["image/avif", "image/webp"],
    );
    expect(sourceElements[0]?.getAttribute("sizes")).toBeTruthy();
  });

  it("keeps unmapped images as plain img tags", () => {
    const { container } = render(
      <CollectionContent
        mdx={null}
        html='<p><img src="https://example.com/example.jpg" alt="Remote"></p>'
        contentAssetMap={{}}
      />,
    );

    expect(container.querySelector("picture")).toBeNull();
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "https://example.com/example.jpg",
    );
  });

  it("renders consecutive work images as a compact responsive grid", () => {
    const { container } = render(
      <CollectionContent
        mdx={null}
        html={
          '<p><img src="./first.webp" alt="First">\n<img src="./second.webp" alt="Second"></p>'
        }
        contentAssetMap={{
          "./first.webp": picture,
          "./second.webp": picture,
        }}
        imageLayout="work"
      />,
    );

    const grid = container.querySelector(".work-image-grid");
    const pictures = Array.from(grid?.querySelectorAll("picture") ?? []);

    expect(grid?.classList.contains("md:grid-cols-2")).toBe(true);
    expect(pictures).toHaveLength(2);
    expect(pictures[0]?.classList.contains("max-w-2xl")).toBe(true);
    expect(pictures[0]?.classList.contains("w-full")).toBe(true);
  });
});
