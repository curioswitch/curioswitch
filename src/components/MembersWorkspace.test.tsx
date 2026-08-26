// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  getMembersWorkspaceCameraConfig,
  getMembersWorkspaceConfig,
  getMembersWorkspacePlan,
  MembersWorkspace,
  WORKSPACE_ROLES,
} from "./MembersWorkspace";

describe("MembersWorkspace", () => {
  it("presents the three distinct kinds of work", () => {
    expect(WORKSPACE_ROLES).toEqual(["engineering", "design", "experiment"]);
  });

  it("keeps the office focused on two workers on desktop and mobile", () => {
    const plan = getMembersWorkspacePlan(1440);

    expect(plan.workers).toHaveLength(2);
    expect(getMembersWorkspacePlan(390).workers).toHaveLength(2);
    expect(plan.laptop.rotationY).toBe(Math.PI);
  });

  it("shows an Indian man working at a computer", () => {
    const plan = getMembersWorkspacePlan(1440);
    const worker = plan.workers.find((item) => item.identity === "indian-man");

    expect(worker).toMatchObject({
      hair: "short",
      outfit: "trousers",
      role: "engineering",
      seated: true,
    });
  });

  it("shows a long-haired Japanese woman working at the right desk", () => {
    const plan = getMembersWorkspacePlan(1440);
    const worker = plan.workers.find(
      (item) => item.identity === "japanese-woman",
    );

    expect(worker).toMatchObject({
      hair: "long",
      role: "design",
      rotationY: 0,
      seated: true,
    });
    expect(worker?.x).toBeGreaterThan(3);
  });

  it("places the team across desks, a meeting area, and a making area", () => {
    const plan = getMembersWorkspacePlan(1440);

    expect(plan.zones).toEqual([
      "desks",
      "meeting",
      "making",
      "conversation",
      "lounge",
    ]);
    expect(plan.stage).toBe(false);
  });

  it("keeps both workers facing their own workstations", () => {
    const plan = getMembersWorkspacePlan(1440);
    const man = plan.workers.find((worker) => worker.identity === "indian-man");
    const woman = plan.workers.find(
      (worker) => worker.identity === "japanese-woman",
    );

    expect(plan.workers.filter((worker) => worker.seated)).toHaveLength(2);
    expect(man?.rotationY).toBe(0);
    expect(woman?.rotationY).toBe(0);
  });

  it("keeps both workers clear of the central meeting table", () => {
    const plan = getMembersWorkspacePlan(1440);

    expect(
      plan.workers.every((worker) => Math.hypot(worker.x, worker.z - 0.35) > 3),
    ).toBe(true);
  });

  it("uses a centered, closer camera on desktop", () => {
    const camera = getMembersWorkspaceCameraConfig(1440);

    expect(camera.x).toBe(0);
    expect(camera.fov).toBeLessThan(35);
    expect(camera.y).toBeLessThan(5.5);
    expect(camera.z).toBeLessThan(11);
  });

  it("reduces rendering work on mobile and removes motion when requested", () => {
    expect(getMembersWorkspaceConfig(390, false)).toEqual({
      animate: true,
      maxFrameRate: 30,
      motionScale: 0.55,
      pixelRatioCap: 1,
      shadows: false,
    });
    expect(getMembersWorkspaceConfig(1280, true)).toEqual({
      animate: false,
      maxFrameRate: 0,
      motionScale: 0,
      pixelRatioCap: 1,
      shadows: false,
    });
  });

  it("exposes an accessible description for the 3D workspace", () => {
    render(<MembersWorkspace />);

    expect(
      screen.getByRole("img", {
        name: "オフィスで一緒に仕事をするインド人男性と日本人女性のブロック人形",
      }),
    ).not.toBeNull();
  });
});
