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
  it("names the home logo after the brand without making it a heading", async () => {
    vi.stubGlobal("scrollTo", vi.fn());

    const rootRoute = createRootRoute({ component: Header });
    const router = createRouter({
      routeTree: rootRoute,
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });

    await router.load();
    render(<RouterProvider router={router} />);

    const header = document.querySelector("header");
    if (!(header instanceof HTMLElement)) {
      throw new Error("Header was not rendered");
    }

    const homeLogo = within(header).getByRole("link", {
      name: "CurioSwitch",
    });

    expect(homeLogo.querySelector("img")?.alt).toBe("CurioSwitch");
    expect(homeLogo.closest("h1, h2, h3, h4, h5, h6")).toBeNull();
  });

  it("uses compact vertical padding in the mobile header", async () => {
    vi.stubGlobal("scrollTo", vi.fn());

    const rootRoute = createRootRoute({ component: Header });
    const router = createRouter({
      routeTree: rootRoute,
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });

    await router.load();
    render(<RouterProvider router={router} />);

    const navigation = document.querySelector("header nav");

    expect(navigation?.classList.contains("py-4")).toBe(true);
    expect(navigation?.classList.contains("py-8")).toBe(false);
    expect(navigation?.classList.contains("md:py-0")).toBe(true);
  });

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

    expect(homeLink.classList.contains("text-xl")).toBe(true);
    expect(homeLink.classList.contains("sm:text-2xl")).toBe(true);
    expect(homeLink.classList.contains("text-2xl")).toBe(false);
    expect(homeLink.classList.contains("sm:text-3xl")).toBe(false);
  });

  it("starts the mobile menu near the top of the screen", async () => {
    vi.stubGlobal("scrollTo", vi.fn());

    const rootRoute = createRootRoute({ component: Header });
    const router = createRouter({
      routeTree: rootRoute,
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });

    await router.load();
    render(<RouterProvider router={router} />);

    const menuLinks = document.querySelector("#mobile-menu .flex-1");

    expect(menuLinks?.classList.contains("justify-start")).toBe(true);
    expect(menuLinks?.classList.contains("justify-center")).toBe(false);
    expect(menuLinks?.classList.contains("pt-12")).toBe(true);
  });
});
