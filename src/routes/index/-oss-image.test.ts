import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const worksDirectory = path.join(projectRoot, "content/works");
const expectedHeroName = "003-oss-projects.hero.png";
const duplicateImagePath = path.join(
  projectRoot,
  "src/assets/service-oss-laptop.png",
);

describe("open source project imagery", () => {
  it.each(["ja", "en"])(
    "uses the shared image for the %s work card",
    async (locale) => {
      const markdown = await readFile(
        path.join(worksDirectory, `003-oss-projects.${locale}.md`),
        "utf8",
      );

      expect(markdown).toContain(`heroImage: "./${expectedHeroName}"`);
    },
  );

  it("uses the work hero directly for both service views", async () => {
    const [homeRoute, serviceRoute] = await Promise.all([
      readFile(path.join(projectRoot, "src/routes/index/route.tsx"), "utf8"),
      readFile(
        path.join(projectRoot, "src/routes/services/oss/index.tsx"),
        "utf8",
      ),
    ]);

    expect(homeRoute).toContain(
      `content/works/${expectedHeroName}?w=320;480;640;960`,
    );
    expect(serviceRoute).toContain(
      `content/works/${expectedHeroName}?w=640;960;1440;2160`,
    );
    await expect(access(duplicateImagePath)).rejects.toMatchObject({
      code: "ENOENT",
    });
  });
});
