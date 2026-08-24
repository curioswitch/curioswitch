# Curiosity Switch Bloom Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home-page About image with a branded switch that briefly grows flowers and three-dimensional noses around the page, including a rare full-screen variation.

**Architecture:** Pure TypeScript functions own mode selection, responsive counts, and placement. A React experience component renders the code-native switch and portals a pointer-transparent, short-lived SVG overlay to `document.body`.

**Tech Stack:** React 19, TypeScript, React DOM portals, Tailwind CSS 4, CSS keyframes, Vitest, Testing Library, Paraglide

**Spec:** `docs/superpowers/specs/2026-08-25-curiosity-switch-bloom-design.md`

## Global Constraints

- Jackpot probability is 20%; otherwise use edge mode.
- Desktop counts: edge 18–24, jackpot 35–45. Mobile counts: edge 10–14, jackpot 20–26.
- Flowers and noses use an approximate 3:1 ratio; every burst ends within four seconds.
- Reduced motion uses 4 mobile or 6 desktop items and opacity-only animation.
- The overlay must not block clicking, tapping, or scrolling.
- Do not add sound, vibration, persistence, dependencies, or a bloom mini-game.
- Preserve unrelated uncommitted work in the home route and cellular hero files.

---

### Task 1: Bloom model

**Files:**
- Create: `src/components/curiosity-bloom/model.ts`
- Test: `src/components/curiosity-bloom/model.test.ts`

**Interfaces:**
- Produces `BloomMode`, `BloomRect`, `BloomItem`, `chooseBloomMode(random)`, `getBloomCount(options)`, and `createBloomItems(options)`.

- [ ] **Step 1: Write failing selection and count tests**

```ts
import { describe, expect, it } from "vitest";
import { chooseBloomMode, getBloomCount } from "./model";

it("reserves the lower twenty percent for jackpot", () => {
  expect(chooseBloomMode(() => 0.199)).toBe("jackpot");
  expect(chooseBloomMode(() => 0.2)).toBe("edge");
});

it("uses responsive ranges and reduced-motion counts", () => {
  expect(getBloomCount({ width: 1280, mode: "edge", random: () => 0 })).toBe(18);
  expect(getBloomCount({ width: 1280, mode: "jackpot", random: () => 0.999 })).toBe(45);
  expect(getBloomCount({ width: 390, mode: "edge", random: () => 0 })).toBe(10);
  expect(getBloomCount({ width: 390, mode: "jackpot", random: () => 0.999 })).toBe(26);
  expect(getBloomCount({ width: 390, mode: "jackpot", random: () => 0.5, reducedMotion: true })).toBe(4);
  expect(getBloomCount({ width: 1280, mode: "edge", random: () => 0.5, reducedMotion: true })).toBe(6);
});
```

- [ ] **Step 2: Verify the red test**

Run: `bun run test src/components/curiosity-bloom/model.test.ts`

Expected: FAIL because `./model` does not exist.

- [ ] **Step 3: Implement selection, count, and public types**

```ts
export type BloomMode = "edge" | "jackpot";
export type BloomColor = "yellow" | "pink" | "cyan" | "green";
export interface BloomRect { left: number; top: number; right: number; bottom: number }
export interface BloomItem {
  id: string;
  kind: "flower" | "nose";
  variant: number;
  color: BloomColor;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delayMs: number;
  durationMs: number;
}

export function chooseBloomMode(random: () => number): BloomMode {
  return random() < 0.2 ? "jackpot" : "edge";
}

export function getBloomCount({ width, mode, random, reducedMotion = false }: CountOptions) {
  if (reducedMotion) return width < 768 ? 4 : 6;
  const [min, max] = width < 768
    ? mode === "edge" ? [10, 14] : [20, 26]
    : mode === "edge" ? [18, 24] : [35, 45];
  return min + Math.floor(random() * (max - min + 1));
}
```

Define `CountOptions` with `width`, `mode`, `random`, and optional `reducedMotion`.

- [ ] **Step 4: Verify the green selection/count test**

Run: `bun run test src/components/curiosity-bloom/model.test.ts`

Expected: PASS.

- [ ] **Step 5: Add failing placement tests**

```ts
it("places normal items on viewport or supplied anchor edges", () => {
  const items = createBloomItems({
    width: 1280, height: 720, mode: "edge",
    anchorRects: [{ left: 120, top: 180, right: 520, bottom: 420 }],
    random: sequenceRandom([0, 0.25, 0.5, 0.75, 0.9]),
  });
  expect(items).toHaveLength(18);
  expect(items.every((item) =>
    item.x <= 48 || item.x >= 1232 || item.y <= 48 || item.y >= 672 ||
    Math.abs(item.x - 120) <= 24 || Math.abs(item.x - 520) <= 24 ||
    Math.abs(item.y - 180) <= 24 || Math.abs(item.y - 420) <= 24,
  )).toBe(true);
});

it("keeps the approved ratio and lifetime", () => {
  const items = createBloomItems({
    width: 1280, height: 720, mode: "jackpot", anchorRects: [],
    random: sequenceRandom([0, 0.1, 0.3, 0.6, 0.9]),
  });
  const noses = items.filter((item) => item.kind === "nose");
  expect(noses.length).toBeGreaterThanOrEqual(Math.floor(items.length * 0.2));
  expect(noses.length).toBeLessThanOrEqual(Math.ceil(items.length * 0.3));
  expect(items.every((item) => item.delayMs + item.durationMs <= 4000)).toBe(true);
});
```

Add `sequenceRandom(values)` as a cycling test helper.

- [ ] **Step 6: Verify placement tests fail**

Run: `bun run test src/components/curiosity-bloom/model.test.ts`

Expected: FAIL because `createBloomItems` is absent.

- [ ] **Step 7: Implement placement**

Define `CreateBloomOptions` with viewport, mode, anchors, random, and reduced-motion fields. `createEdgePoint` selects one viewport/anchor side, adds at most 18 px jitter, and clamps to the viewport. `createJackpotPoint` samples the full viewport. Assign `kind: index % 4 === 3 ? "nose" : "flower"`; randomize color, three variants, size, rotation, and delay; clamp `delayMs + durationMs` to 4000.

- [ ] **Step 8: Format, test, and commit**

```bash
bunx biome format --write src/components/curiosity-bloom/model.ts src/components/curiosity-bloom/model.test.ts
bun run test src/components/curiosity-bloom/model.test.ts
git add src/components/curiosity-bloom/model.ts src/components/curiosity-bloom/model.test.ts
git commit -m "feat: add bloom interaction model"
```

---

### Task 2: Branded switch and SVG glyphs

**Files:**
- Create: `src/components/curiosity-bloom/BloomGlyph.tsx`
- Create: `src/components/curiosity-bloom/CuriositySwitch.tsx`
- Test: `src/components/curiosity-bloom/CuriositySwitch.test.tsx`
- Modify: `messages/ja.json`
- Modify: `messages/en.json`

**Interfaces:**
- Consumes `BloomItem`, `label: string`, and `onActivate(): void`.
- Produces `BloomGlyph({ item })` and `CuriositySwitch({ label, onActivate })`.

- [ ] **Step 1: Write the failing button test**

```tsx
// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { CuriositySwitch } from "./CuriositySwitch";

it("renders an accessible native button", () => {
  const onActivate = vi.fn();
  render(<CuriositySwitch label="好奇心のスイッチを押す" onActivate={onActivate} />);
  fireEvent.click(screen.getByRole("button", { name: "好奇心のスイッチを押す" }));
  expect(onActivate).toHaveBeenCalledOnce();
});
```

- [ ] **Step 2: Verify the red test**

Run: `bun run test src/components/curiosity-bloom/CuriositySwitch.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement switch and glyphs**

Use a native `<button type="button">` with a 16:10 yellow base, brown circular lever, inset shadow, visible focus ring, and a 220 ms pressed transform. Add a yellow radial glow layer that expands and fades during the same press cycle before the bloom begins. Native semantics handle Enter and Space.

`BloomGlyph` is `aria-hidden`. Flowers use three inline SVG petal arrangements and the selected brand color. The nose uses an inline SVG with peach/pink gradients, bridge highlight, nostril shadows, and a soft drop shadow for a three-dimensional appearance.

Add these exact messages:

```json
// messages/ja.json
"home_curiosity_switch_label": "好奇心のスイッチを押す"

// messages/en.json
"home_curiosity_switch_label": "Press the curiosity switch"
```

- [ ] **Step 4: Verify the green button test**

Run: `bun run test src/components/curiosity-bloom/CuriositySwitch.test.tsx`

Expected: PASS.

- [ ] **Step 5: Format, test, and commit**

```bash
bunx biome format --write src/components/curiosity-bloom/BloomGlyph.tsx src/components/curiosity-bloom/CuriositySwitch.tsx src/components/curiosity-bloom/CuriositySwitch.test.tsx messages/ja.json messages/en.json
bun run test src/components/curiosity-bloom/CuriositySwitch.test.tsx
git add src/components/curiosity-bloom/BloomGlyph.tsx src/components/curiosity-bloom/CuriositySwitch.tsx src/components/curiosity-bloom/CuriositySwitch.test.tsx messages/ja.json messages/en.json
git commit -m "feat: add branded curiosity switch"
```

---

### Task 3: Portal overlay and lifecycle

**Files:**
- Create: `src/components/curiosity-bloom/CuriosityBloomExperience.tsx`
- Test: `src/components/curiosity-bloom/CuriosityBloomExperience.test.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes Tasks 1–2, `label`, optional `anchorSelector = "img, article"`, and injectable `random = Math.random`.
- Produces `CuriosityBloomExperience`, including the switch and a body portal.

- [ ] **Step 1: Write failing lifecycle test**

```tsx
// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { CuriosityBloomExperience } from "./CuriosityBloomExperience";

beforeEach(() => {
  vi.useFakeTimers();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  });
});
afterEach(() => { vi.runOnlyPendingTimers(); vi.useRealTimers(); });

it("portals a pointer-transparent burst and removes it", () => {
  render(<CuriosityBloomExperience label="好奇心のスイッチを押す" random={() => 0.5} />);
  fireEvent.click(screen.getByRole("button", { name: "好奇心のスイッチを押す" }));
  expect(document.body.querySelector("[data-bloom-overlay]")?.className).toContain("pointer-events-none");
  expect(document.body.querySelectorAll("[data-bloom-item]").length).toBeGreaterThan(0);
  vi.advanceTimersByTime(4100);
  expect(document.body.querySelectorAll("[data-bloom-item]")).toHaveLength(0);
});
```

- [ ] **Step 2: Verify the red test**

Run: `bun run test src/components/curiosity-bloom/CuriosityBloomExperience.test.tsx`

Expected: FAIL because the experience does not exist.

- [ ] **Step 3: Implement portal and bounded lifecycle**

On activation, read viewport and reduced-motion state; collect visible anchor client rectangles; select mode; generate items; append a monotonic burst ID; drop oldest bursts until no more than 72 items remain; remove each burst at 4100 ms; clear timers on unmount. Portal a fixed `inset-0 z-[80] overflow-hidden pointer-events-none` layer to `document.body` after mount. Set item x, y, size, rotation, delay, and duration through CSS variables.

- [ ] **Step 4: Add animation CSS**

```css
@keyframes curiosity-bloom-pop {
  0% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--bloom-rotation)) scale(0.05); }
  18% { opacity: 1; transform: translate(-50%, -50%) rotate(var(--bloom-rotation)) scale(1.08); }
  72% { opacity: 1; transform: translate(-50%, -54%) rotate(calc(var(--bloom-rotation) + 5deg)) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -62%) rotate(calc(var(--bloom-rotation) - 4deg)) scale(0.15); }
}
@keyframes curiosity-bloom-fade {
  0%, 100% { opacity: 0; }
  20%, 75% { opacity: 1; }
}
.curiosity-bloom-item {
  position: absolute;
  left: var(--bloom-x);
  top: var(--bloom-y);
  width: var(--bloom-size);
  height: var(--bloom-size);
  animation: curiosity-bloom-pop var(--bloom-duration) ease-out var(--bloom-delay) both;
  will-change: transform, opacity;
}
@media (prefers-reduced-motion: reduce) {
  .curiosity-bloom-item { animation-name: curiosity-bloom-fade; }
}
```

- [ ] **Step 5: Add capacity and reduced-motion tests**

Mock `matchMedia().matches = true` and `window.innerWidth = 390`; assert exactly 4 items. Activate ten times without advancing timers and assert no more than 72 items.

- [ ] **Step 6: Format, run focused tests, and commit**

```bash
bunx biome format --write src/components/curiosity-bloom/CuriosityBloomExperience.tsx src/components/curiosity-bloom/CuriosityBloomExperience.test.tsx src/styles.css
bun run test src/components/curiosity-bloom/model.test.ts src/components/curiosity-bloom/CuriositySwitch.test.tsx src/components/curiosity-bloom/CuriosityBloomExperience.test.tsx
git add src/components/curiosity-bloom/CuriosityBloomExperience.tsx src/components/curiosity-bloom/CuriosityBloomExperience.test.tsx src/styles.css
git commit -m "feat: animate flowers and noses across the page"
```

Expected: all bloom tests PASS.

---

### Task 4: Home integration and verification

**Files:**
- Modify: `src/routes/index/route.tsx`
- Modify: `src/routes/index/-layout.test.tsx`
- Keep untouched: `src/assets/home-about-us.jpg`

**Interfaces:**
- Consumes `CuriosityBloomExperience` and `m.home_curiosity_switch_label()`.
- Produces the existing About grid with the switch in its left column and unchanged copy in its right column.

- [ ] **Step 1: Write the failing route integration test**

Extend the current About-section test:

```ts
const curiositySwitch = elementChildren(aboutSection).find(
  (element) =>
    isValidElement(element) &&
    typeof element.type === "function" &&
    element.type.name === "CuriosityBloomExperience",
);
expect(curiositySwitch?.props.label).toBe(m.home_curiosity_switch_label());

const aboutPictures = elementChildren(aboutSection).filter(
  (element) =>
    isValidElement(element) &&
    typeof element.type === "function" &&
    element.type.name === "Picture",
);
expect(aboutPictures).toHaveLength(0);
```

- [ ] **Step 2: Verify the red route test**

Run: `bun run test src/routes/index/-layout.test.tsx`

Expected: FAIL because the About section still renders `Picture`.

- [ ] **Step 3: Replace only the About picture**

Remove the `picHomeAboutUs` import, import `CuriosityBloomExperience`, and replace the left-column `Picture`:

```tsx
<FadeIn
  direction="left"
  className="overflow-hidden rounded-xl lg:rounded-none lg:rounded-tr-4xl"
>
  <CuriosityBloomExperience label={m.home_curiosity_switch_label()} />
</FadeIn>
```

Preserve the grid, padding, responsive corners, and right-column copy.

- [ ] **Step 4: Run focused and complete automated verification**

```bash
bunx biome format --write src/routes/index/route.tsx src/routes/index/-layout.test.tsx
bun run test src/routes/index/-layout.test.tsx src/components/curiosity-bloom/model.test.ts src/components/curiosity-bloom/CuriositySwitch.test.tsx src/components/curiosity-bloom/CuriosityBloomExperience.test.tsx
git diff --check
bun run test
bun run lint
bun run build
```

Expected: tests PASS, Biome reports no errors, and production/prerender build exits 0. Existing informational schema and content-collection notices may remain.

- [ ] **Step 5: Verify PC, mobile, and reduced-motion behavior**

At `1280 × 720`, confirm the switch replaces the image without changing copy alignment; repeated clicks reveal both patterns; flowers dominate; noses appear occasionally; links and scrolling remain usable; every burst disappears. At `390 × 844`, confirm the switch fits the gutter, counts are reduced, and no horizontal scroll appears. With reduced motion emulated, confirm a small fade-only set.

- [ ] **Step 6: Commit only integration files**

```bash
git status --short
git add src/routes/index/route.tsx src/routes/index/-layout.test.tsx
git commit -m "feat: add curiosity switch bloom experience"
```

Inspect status before staging and do not stage unrelated pre-existing changes.
