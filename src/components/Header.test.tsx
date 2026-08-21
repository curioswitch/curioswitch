// @vitest-environment jsdom

import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { m } from "../paraglide/messages";

import Header from "./Header";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Header mobile menu", () => {
  it("uses compact menu text on phones", async () => {
    vi.stubGlobal("scrollTo", vi.fn());

    const rootRoute = createRootRoute({ component: Header });
    const router = createRouter({
      routeTree: rootRoute,
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });

    await router.load();
    render(<RouterProvider router={router} />);

    const menu = document.querySelector("#mobile-menu");
    if (!(menu instanceof HTMLElement)) {
      throw new Error("Mobile menu was not rendered");
    }

    const homeLink = within(menu).getByRole("link", {
      name: m.common_nav_home(),
    });

    expect(homeLink.classList.contains("text-3xl")).toBe(true);
    expect(homeLink.classList.contains("sm:text-4xl")).toBe(true);
    expect(homeLink.classList.contains("text-4xl")).toBe(false);
    expect(homeLink.classList.contains("sm:text-5xl")).toBe(false);
  });
});
