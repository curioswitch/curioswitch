import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

const worksDirectory = path.join(process.cwd(), "content/works");

const cases = [
  {
    id: "016-opentelemetry-java",
    organization: "OpenTelemetry",
    source: "https://github.com/open-telemetry/opentelemetry-java",
  },
  {
    id: "017-armeria",
    organization: "Armeria",
    source: "https://armeria.dev/",
  },
  {
    id: "018-zipkin",
    organization: "OpenZipkin",
    source: "https://zipkin.io/",
  },
  {
    id: "019-pyvoy",
    organization: "CurioSwitch",
    source: "https://pyvoy.dev/",
  },
] as const;

describe("engineering work case studies", () => {
  it.each(cases)("provides bilingual copy and a hero for $id", async (work) => {
    const heroName = `${work.id}.hero.png`;
    const hero = await readFile(path.join(worksDirectory, heroName));

    expect(hero.byteLength).toBeGreaterThan(100_000);

    for (const locale of ["ja", "en"]) {
      const markdown = await readFile(
        path.join(worksDirectory, `${work.id}.${locale}.md`),
        "utf8",
      );

      expect(markdown).toContain(`organization: "${work.organization}"`);
      expect(markdown).toContain(`heroImage: "./${heroName}"`);
      expect(markdown).toContain(work.source);
    }
  });

  it("uses a different photograph for every case study", async () => {
    const heroes = await Promise.all(
      cases.map((work) =>
        readFile(path.join(worksDirectory, `${work.id}.hero.png`)),
      ),
    );
    const uniqueImages = new Set(heroes.map((hero) => hero.toString("base64")));

    expect(uniqueImages.size).toBe(cases.length);
  });
});
