import { describe, expect, it } from "vitest";

import { getMediaAnchorPercent } from "./layout";

describe("getMediaAnchorPercent", () => {
  it("keeps an image subject and its overlay on the same relative point", () => {
    expect(getMediaAnchorPercent({ imageSize: 887, subjectPoint: 590 })).toBe(
      "66.5%",
    );
    expect(getMediaAnchorPercent({ imageSize: 1000, subjectPoint: 650 })).toBe(
      "65%",
    );
  });

  it("keeps the anchor within the visible image range", () => {
    expect(getMediaAnchorPercent({ imageSize: 1000, subjectPoint: -20 })).toBe(
      "0%",
    );
    expect(getMediaAnchorPercent({ imageSize: 1000, subjectPoint: 1100 })).toBe(
      "100%",
    );
  });
});
