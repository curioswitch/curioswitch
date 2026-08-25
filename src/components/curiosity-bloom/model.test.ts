import { describe, expect, it } from "vitest";

import { chooseBloomMode, createBloomItems, getBloomCount } from "./model";

function sequenceRandom(values: number[]) {
  let index = 0;
  return () => values[index++ % values.length] ?? 0;
}

describe("chooseBloomMode", () => {
  it("reserves the lower twenty percent for jackpot mode", () => {
    expect(chooseBloomMode(() => 0.199)).toBe("jackpot");
    expect(chooseBloomMode(() => 0.2)).toBe("edge");
  });
});

describe("getBloomCount", () => {
  it("uses the approved desktop and mobile ranges", () => {
    expect(getBloomCount({ width: 1280, mode: "edge", random: () => 0 })).toBe(
      18,
    );
    expect(
      getBloomCount({ width: 1280, mode: "jackpot", random: () => 0.999 }),
    ).toBe(45);
    expect(getBloomCount({ width: 390, mode: "edge", random: () => 0 })).toBe(
      10,
    );
    expect(
      getBloomCount({ width: 390, mode: "jackpot", random: () => 0.999 }),
    ).toBe(26);
  });

  it("uses a small fixed set when motion is reduced", () => {
    expect(
      getBloomCount({
        width: 390,
        mode: "jackpot",
        random: () => 0.5,
        reducedMotion: true,
      }),
    ).toBe(4);
    expect(
      getBloomCount({
        width: 1280,
        mode: "edge",
        random: () => 0.5,
        reducedMotion: true,
      }),
    ).toBe(6);
  });
});

describe("createBloomItems", () => {
  it("places edge-mode items on viewport or supplied anchor boundaries", () => {
    const items = createBloomItems({
      width: 1280,
      height: 720,
      mode: "edge",
      anchorRects: [{ left: 120, top: 180, right: 520, bottom: 420 }],
      random: sequenceRandom([0, 0.25, 0.5, 0.75, 0.9]),
    });

    expect(items).toHaveLength(18);
    expect(
      items.every(
        (item) =>
          item.x <= 48 ||
          item.x >= 1232 ||
          item.y <= 48 ||
          item.y >= 672 ||
          Math.abs(item.x - 120) <= 24 ||
          Math.abs(item.x - 520) <= 24 ||
          Math.abs(item.y - 180) <= 24 ||
          Math.abs(item.y - 420) <= 24,
      ),
    ).toBe(true);
  });

  it("keeps the flower-to-nose ratio and four-second lifetime", () => {
    const items = createBloomItems({
      width: 1280,
      height: 720,
      mode: "jackpot",
      anchorRects: [],
      random: sequenceRandom([0, 0.1, 0.3, 0.6, 0.9]),
    });
    const noses = items.filter((item) => item.kind === "nose");

    expect(noses.length).toBeGreaterThanOrEqual(Math.floor(items.length * 0.2));
    expect(noses.length).toBeLessThanOrEqual(Math.ceil(items.length * 0.3));
    expect(items.every((item) => item.delayMs + item.durationMs <= 4000)).toBe(
      true,
    );
  });

  it("varies size, rotation, and color", () => {
    const items = createBloomItems({
      width: 1280,
      height: 720,
      mode: "jackpot",
      anchorRects: [],
      random: sequenceRandom([0, 0.15, 0.35, 0.65, 0.95]),
    });

    expect(new Set(items.map((item) => item.size)).size).toBeGreaterThan(1);
    expect(new Set(items.map((item) => item.rotation)).size).toBeGreaterThan(1);
    expect(new Set(items.map((item) => item.color)).size).toBeGreaterThan(1);
  });
});
