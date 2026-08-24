import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const worksDirectory = path.join(projectRoot, "content/works");
const expectedHeroName = "003-oss-projects.hero.png";

describe("open source project imagery", () => {
  it.each(["ja", "en"])(
    "uses the selected laptop image for the %s work card",
    async (locale) => {
      const markdown = await readFile(
        path.join(worksDirectory, `003-oss-projects.${locale}.md`),
        "utf8",
      );
      const workHero = await readFile(
        path.join(worksDirectory, expectedHeroName),
      );
      const selectedImage = await readFile(
        path.join(projectRoot, "src/assets/service-oss-laptop.png"),
      );

      expect(markdown).toContain(`heroImage: "./${expectedHeroName}"`);
      expect(workHero.equals(selectedImage)).toBe(true);
    },
  );
});
