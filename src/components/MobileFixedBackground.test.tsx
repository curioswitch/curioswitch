// @vitest-environment jsdom

import { act, render } from "@testing-library/react";
import type { ComponentType } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import MobileFixedBackground from "./MobileFixedBackground";

const FixedBackground = MobileFixedBackground as ComponentType<{
  image: string;
  targetId: string;
}>;

describe("MobileFixedBackground", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(1);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fills the tall parallax layer with one vertically scaled photo", () => {
    const { container } = render(
      <FixedBackground image="/hero.jpg" targetId="hero-photo-frame" />,
    );
    const imageLayer = container.querySelector('[aria-hidden="true"]');

    if (!(imageLayer instanceof HTMLElement)) {
      throw new Error("Parallax image layer was not rendered");
    }

    expect(imageLayer.children).toHaveLength(0);
    expect(imageLayer.style.backgroundImage).toBe('url("/hero.jpg")');
    expect(imageLayer.style.backgroundSize).toBe("auto 100%");
    expect(imageLayer.style.backgroundRepeat).toBe("no-repeat");
  });

  it("counteracts page scroll while the photo frame is visible", () => {
    const { container } = render(
      <>
        <div id="hero-photo-frame" />
        <FixedBackground image="/hero.jpg" targetId="hero-photo-frame" />
      </>,
    );
    const frame = container.querySelector("#hero-photo-frame");
    const imageLayer = container.querySelector('[aria-hidden="true"]');

    if (!(frame instanceof HTMLElement)) {
      throw new Error("Hero photo frame was not rendered");
    }

    frame.getBoundingClientRect = () =>
      ({
        bottom: 380,
        height: 260,
        left: 0,
        right: 390,
        top: 120,
        width: 390,
        x: 0,
        y: 120,
        toJSON: () => ({}),
      }) as DOMRect;

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 180,
    });

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    if (!(imageLayer instanceof HTMLElement)) {
      throw new Error("Parallax image layer was not rendered");
    }

    expect(imageLayer.style.transform).toBe("translate3d(0, 180px, 0)");
    expect(imageLayer.style.clipPath).toBe("");
  });
});
