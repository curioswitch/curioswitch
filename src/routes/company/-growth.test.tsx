// @vitest-environment jsdom

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Route } from "./index";

describe("company growth experience", () => {
  it("offers an accessible watering-can control for growing the seed", () => {
    const Component = Route.options.component;
    if (!Component) {
      throw new Error("Company route component is not configured");
    }

    document.body.innerHTML = renderToStaticMarkup(<Component />);

    const wateringCan = document.querySelector(
      'button[aria-label="じょうろで種に水をあげる"]',
    );

    expect(wateringCan).not.toBeNull();
    expect(document.querySelector('[data-testid="company-seed-scene"]')).not.toBeNull();
  });
});
