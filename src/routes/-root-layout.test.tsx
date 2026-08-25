// @vitest-environment jsdom

import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { Route } from "./__root";

function elementChildren(node: ReactNode): ReactNode[] {
  if (Array.isArray(node)) {
    return node.flatMap(elementChildren);
  }

  if (!isValidElement(node)) {
    return [];
  }

  return [node, ...elementChildren(node.props.children)];
}

describe("root document layout", () => {
  it("clips mobile horizontal overflow without creating root scrollers", () => {
    const Shell = Route.options.shellComponent;
    if (!Shell) {
      throw new Error("Root shell is not configured");
    }

    const tree = (Shell as (props: { children: ReactNode }) => ReactElement)({
      children: <main />,
    });
    const elements = elementChildren(tree);
    const html = elements.find(
      (element) => isValidElement(element) && element.type === "html",
    );
    const body = elements.find(
      (element) => isValidElement(element) && element.type === "body",
    );

    expect(html?.props.className ?? "").toContain("overflow-x-clip");
    expect(body?.props.className ?? "").toContain("overflow-x-clip");
    expect(html?.props.className ?? "").not.toContain("overflow-x-hidden");
    expect(body?.props.className ?? "").not.toContain("overflow-x-hidden");
  });

  it("reserves a viewport-height content area while a route is loading", () => {
    const Shell = Route.options.shellComponent;
    if (!Shell) {
      throw new Error("Root shell is not configured");
    }

    const child = <main data-route-content />;
    const tree = (Shell as (props: { children: ReactNode }) => ReactElement)({
      children: child,
    });
    const elements = elementChildren(tree);
    const contentSlot = elements.find(
      (element) =>
        isValidElement(element) &&
        element.type === "div" &&
        element.props.children === child,
    );

    expect(contentSlot?.props.className).toContain("min-h-dvh");
  });
});
