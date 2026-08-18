import { describe, expect, it } from "vitest";

import viteConfig from "./vite.config";

describe("development server configuration", () => {
  it("does not forward browser console errors back into the server", () => {
    if (typeof viteConfig !== "function") {
      throw new Error("Vite config must be environment-aware");
    }

    const config = viteConfig({
      command: "serve",
      mode: "development",
      isSsrBuild: false,
      isPreview: false,
    });

    expect(config.server?.forwardConsole).toBe(false);
  });
});
