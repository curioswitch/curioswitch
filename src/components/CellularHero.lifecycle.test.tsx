// @vitest-environment jsdom

import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CellularHero } from "./CellularHero";

const canvasBounds = {
  bottom: 400,
  height: 400,
  left: 0,
  right: 1_280,
  top: 0,
  width: 1_280,
  x: 0,
  y: 0,
  toJSON: () => ({}),
} as DOMRect;

describe("CellularHero lifecycle", () => {
  let intersectionCallback: IntersectionObserverCallback = () => {};
  let frameCallbacks: Map<number, FrameRequestCallback>;
  let nextFrameId: number;

  beforeEach(() => {
    frameCallbacks = new Map();
    nextFrameId = 1;

    const gradient = { addColorStop: vi.fn() };
    const context = {
      arc: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      createLinearGradient: vi.fn(() => gradient),
      createRadialGradient: vi.fn(() => gradient),
      ellipse: vi.fn(),
      fill: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      lineTo: vi.fn(),
      moveTo: vi.fn(),
      restore: vi.fn(),
      rotate: vi.fn(),
      save: vi.fn(),
      setTransform: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
    };

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    );
    vi.spyOn(
      HTMLCanvasElement.prototype,
      "getBoundingClientRect",
    ).mockReturnValue(canvasBounds);

    vi.stubGlobal(
      "ResizeObserver",
      class {
        disconnect() {}
        observe() {}
        unobserve() {}
      },
    );
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          intersectionCallback = callback;
        }
        disconnect() {}
        observe() {}
        takeRecords() {
          return [];
        }
        unobserve() {}
      },
    );
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        const id = nextFrameId++;
        frameCallbacks.set(id, callback);
        return id;
      }),
    );
    vi.stubGlobal(
      "cancelAnimationFrame",
      vi.fn((id: number) => frameCallbacks.delete(id)),
    );
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        addEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: false,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        removeEventListener: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("runs only while the canvas intersects the viewport", () => {
    const { unmount } = render(<CellularHero />);

    expect(requestAnimationFrame).not.toHaveBeenCalled();

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    const firstFrameId = nextFrameId - 1;
    const firstFrame = frameCallbacks.get(firstFrameId);
    expect(firstFrame).toBeDefined();

    act(() => {
      frameCallbacks.delete(firstFrameId);
      firstFrame?.(performance.now() + 16);
    });

    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
    const pendingFrameId = nextFrameId - 1;

    act(() => {
      intersectionCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(cancelAnimationFrame).toHaveBeenCalledWith(pendingFrameId);
    expect(frameCallbacks.size).toBe(0);

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(requestAnimationFrame).toHaveBeenCalledTimes(3);
    const restartedFrameId = nextFrameId - 1;
    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(restartedFrameId);
  });

  it("does not perform layout reads for page-wide pointer movement", () => {
    const boundsSpy = vi.mocked(
      HTMLCanvasElement.prototype.getBoundingClientRect,
    );
    const { container } = render(<CellularHero />);
    const canvas = container.querySelector("canvas");

    if (!canvas) throw new Error("Cellular canvas was not rendered");
    boundsSpy.mockClear();

    act(() => {
      window.dispatchEvent(new MouseEvent("pointermove"));
      canvas.dispatchEvent(new MouseEvent("pointermove"));
    });

    expect(boundsSpy).not.toHaveBeenCalled();
  });
});
