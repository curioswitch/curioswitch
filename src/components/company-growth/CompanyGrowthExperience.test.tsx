// @vitest-environment jsdom

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CompanyGrowthProvider,
  CompanySeedScene,
  WateringCanTrigger,
} from "./CompanyGrowthExperience";

function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({
      matches,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function renderStory() {
  render(
    <CompanyGrowthProvider>
      <CompanySeedScene>
        <img src="/seed.jpg" alt="土に植えられた種" />
      </CompanySeedScene>
      <WateringCanTrigger label="じょうろで種に水をあげる">
        <img src="/watering-can.jpg" alt="黄色いじょうろ" />
      </WateringCanTrigger>
    </CompanyGrowthProvider>,
  );
}

describe("CompanyGrowthExperience", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReducedMotion(false);
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    act(() => vi.runOnlyPendingTimers());
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("waters the page, moves to the seed, and leaves a flower behind", () => {
    renderStory();
    const wateringCan = screen.getByRole("button", {
      name: "じょうろで種に水をあげる",
    });
    const seedScene = screen.getByTestId("company-seed-scene");

    fireEvent.click(wateringCan);

    expect(wateringCan.getAttribute("data-watering")).toBe("true");
    expect(
      document.querySelectorAll("[data-water-particle]").length,
    ).toBeGreaterThan(20);
    expect(seedScene.getAttribute("data-grown")).toBe("false");

    act(() => vi.advanceTimersByTime(500));
    expect(seedScene.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "center",
    });

    act(() => vi.advanceTimersByTime(700));
    expect(seedScene.getAttribute("data-grown")).toBe("true");
    expect(screen.queryByTestId("company-grown-flower")).not.toBeNull();

    act(() => vi.advanceTimersByTime(3000));
    expect(document.querySelectorAll("[data-water-particle]")).toHaveLength(0);
    expect(wateringCan.getAttribute("data-watering")).toBe("false");
    expect(seedScene.getAttribute("data-grown")).toBe("true");
  });

  it("grows immediately with a smaller rain shower when motion is reduced", () => {
    mockReducedMotion(true);
    renderStory();

    fireEvent.click(
      screen.getByRole("button", { name: "じょうろで種に水をあげる" }),
    );

    expect(
      screen.getByTestId("company-seed-scene").getAttribute("data-grown"),
    ).toBe("true");
    expect(
      document.querySelectorAll("[data-water-particle]").length,
    ).toBeLessThanOrEqual(10);
  });

  it("keeps the watering can accessible without showing an extra text label", () => {
    renderStory();

    const wateringCan = screen.getByRole("button", {
      name: "じょうろで種に水をあげる",
    });

    expect(wateringCan.textContent).toBe("");
  });
});
