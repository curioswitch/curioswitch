import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("global interaction styles", () => {
  it("opts click controls out of double-tap gesture delay", () => {
    const styles = readFileSync(
      new URL("./styles.css", import.meta.url),
      "utf8",
    );

    expect(styles).toContain(':where(a, button, [role="button"])');
    expect(styles).toContain("touch-action: manipulation");
  });
});
