import { describe, expect, it } from "vitest";

import {
  advanceCuriosityBurst,
  getCellLayout,
  getCuriosityBurstContent,
  getPuchiDecorations,
  repelCellFromPointer,
  resolveCellCollision,
  startCuriosityBurst,
} from "./CellularHero";

const cell = (x: number, radius = 50) => ({
  baseRadius: radius,
  burstAge: null,
  burstSeed: 0,
  phase: 0,
  pulseSpeed: 0,
  radius,
  vx: 0,
  vy: 0,
  x,
  y: 0,
});

describe("curiosity burst", () => {
  it("starts on the sphere that was tapped", () => {
    const cells = [cell(0), cell(160)];

    expect(startCuriosityBurst(cells, { x: 160, y: 0 }, 7)).toBe(1);
    expect(cells[1].burstAge).toBe(0);
    expect(cells[1].burstSeed).toBe(7);
  });

  it("allows no more than three simultaneous bursts", () => {
    const cells = [cell(0), cell(160), cell(320), cell(480)];

    startCuriosityBurst(cells, { x: 0, y: 0 }, 1);
    startCuriosityBurst(cells, { x: 160, y: 0 }, 2);
    startCuriosityBurst(cells, { x: 320, y: 0 }, 3);

    expect(startCuriosityBurst(cells, { x: 480, y: 0 }, 4)).toBeNull();
    expect(cells[3].burstAge).toBeNull();
  });

  it("restores the sphere after the burst duration", () => {
    expect(advanceCuriosityBurst(1.45, 0.1)).toBeNull();
  });

  it("selects exactly one curiosity item for each burst", () => {
    const first = getCuriosityBurstContent(1);
    const second = getCuriosityBurstContent(2);

    expect(first).not.toEqual(second);
    expect(["star", "text"]).toContain(first.type);
    expect(["star", "text"]).toContain(second.type);
  });

  it("only selects a star or approved curiosity text", () => {
    const contents = Array.from({ length: 1_000 }, (_, seed) =>
      getCuriosityBurstContent(seed),
    );
    const types = new Set(contents.map((content) => content.type));
    const text = new Set(
      contents.flatMap((content) =>
        content.type === "text" ? [content.value] : [],
      ),
    );

    expect(types).toEqual(new Set(["star", "text"]));
    expect(text).toEqual(
      new Set([
        "Why",
        "Curious",
        "Wonder",
        "Discover",
        "Explore",
        "Imagine",
        "Notice",
        "Seek",
        "Create",
        "?",
        "!!!",
        "Lucky",
        "Jackpot",
        "Winner",
        "Great Find",
        "You Found It",
      ]),
    );
  });
});

describe("getCellLayout", () => {
  it("keeps the enlarged sphere range while using a non-overlapping count", () => {
    expect(getCellLayout(390)).toEqual({
      count: 12,
      maxRadius: 71,
      minRadius: 71,
    });
    expect(getCellLayout(1280)).toEqual({
      count: 30,
      maxRadius: 104,
      minRadius: 104,
    });
  });
});

describe("getPuchiDecorations", () => {
  it("adds five desktop decorations and three mobile decorations", () => {
    expect(getPuchiDecorations(1280, 400)).toHaveLength(5);
    expect(getPuchiDecorations(390, 260)).toHaveLength(3);
  });

  it("varies the placement while keeping the white text label consistent", () => {
    const decorations = getPuchiDecorations(1280, 400);

    expect(new Set(decorations.map((item) => item.text))).toEqual(
      new Set(["♾プチプチ"]),
    );
    expect(
      new Set(decorations.map((item) => item.rotation)).size,
    ).toBeGreaterThan(1);
    expect(
      new Set(decorations.map((item) => item.fontSize)).size,
    ).toBeGreaterThan(1);
  });

  it("distributes desktop decorations across the full width", () => {
    const xPositions = getPuchiDecorations(1280, 400).map((item) => item.x);

    expect(xPositions.some((x) => x < 1280 / 3)).toBe(true);
    expect(xPositions.some((x) => x >= 1280 / 3 && x < (1280 * 2) / 3)).toBe(
      true,
    );
    expect(xPositions.some((x) => x >= (1280 * 2) / 3)).toBe(true);
  });
});

describe("resolveCellCollision", () => {
  it("separates overlapping spheres and makes them move apart", () => {
    const first = { ...cell(0), vx: 10 };
    const second = { ...cell(80), vx: -10 };

    resolveCellCollision(first, second);

    expect(Math.hypot(second.x - first.x, second.y - first.y)).toBe(100);
    expect(first.vx).toBeLessThan(0);
    expect(second.vx).toBeGreaterThan(0);
  });
});

describe("repelCellFromPointer", () => {
  it("pushes a nearby sphere away from the pointer", () => {
    const target = { ...cell(100), y: 100 };

    repelCellFromPointer(target, { x: 120, y: 100 }, 1 / 60);

    expect(target.vx).toBeLessThan(0);
    expect(target.vy).toBe(0);
  });

  it("leaves a distant sphere unchanged", () => {
    const target = { ...cell(100), y: 100 };

    repelCellFromPointer(target, { x: 400, y: 100 }, 1 / 60);

    expect(target.vx).toBe(0);
    expect(target.vy).toBe(0);
  });
});
