// @vitest-environment jsdom

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CuriosityBloomExperience } from "./CuriosityBloomExperience";

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

describe("CuriosityBloomExperience", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReducedMotion(false);
  });

  afterEach(() => {
    act(() => vi.runOnlyPendingTimers());
    vi.useRealTimers();
    document.body.innerHTML = "";
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1024,
    });
  });

  it("portals a pointer-transparent burst and removes it after four seconds", () => {
    render(
      <CuriosityBloomExperience
        label="好奇心のスイッチを押す"
        random={() => 0.5}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "好奇心のスイッチを押す" }),
    );

    expect(
      document.body.querySelector("[data-bloom-overlay]")?.className,
    ).toContain("pointer-events-none");
    expect(
      document.body.querySelectorAll("[data-bloom-item]").length,
    ).toBeGreaterThan(0);

    act(() => vi.advanceTimersByTime(4100));

    expect(document.body.querySelectorAll("[data-bloom-item]")).toHaveLength(0);
  });

  it("uses the small mobile set when motion is reduced", () => {
    mockReducedMotion(true);
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 390,
    });
    render(
      <CuriosityBloomExperience
        label="好奇心のスイッチを押す"
        random={() => 0.5}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "好奇心のスイッチを押す" }),
    );

    expect(document.body.querySelectorAll("[data-bloom-item]")).toHaveLength(4);
  });

  it("caps repeated bursts before they overload the page", () => {
    render(
      <CuriosityBloomExperience
        label="好奇心のスイッチを押す"
        random={() => 0.5}
      />,
    );
    const button = screen.getByRole("button", {
      name: "好奇心のスイッチを押す",
    });

    for (let index = 0; index < 10; index += 1) fireEvent.click(button);

    expect(
      document.body.querySelectorAll("[data-bloom-item]").length,
    ).toBeLessThanOrEqual(72);
  });
});
