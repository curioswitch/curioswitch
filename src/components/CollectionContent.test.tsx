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

    expect(pictureElement?.getAttribute("class")).toBe("block rounded-xl");
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
});
