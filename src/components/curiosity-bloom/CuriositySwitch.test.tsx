// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CuriositySwitch } from "./CuriositySwitch";

describe("CuriositySwitch", () => {
  it("exposes an accessible native button that starts the experience", () => {
    const onActivate = vi.fn();

    render(
      <CuriositySwitch
        label="好奇心のスイッチを押す"
        onActivate={onActivate}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "好奇心のスイッチを押す" }),
    );

    expect(onActivate).toHaveBeenCalledOnce();
  });
});
