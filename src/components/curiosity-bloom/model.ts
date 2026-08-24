export type BloomMode = "edge" | "jackpot";
export type BloomColor = "yellow" | "pink" | "cyan" | "green";

export interface BloomRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

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

interface CountOptions {
  width: number;
  mode: BloomMode;
  random: () => number;
  reducedMotion?: boolean;
}

export interface CreateBloomOptions extends CountOptions {
  height: number;
  anchorRects: BloomRect[];
}

interface Point {
  x: number;
  y: number;
}

const COLORS: BloomColor[] = ["yellow", "pink", "cyan", "green"];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value));
}

export function chooseBloomMode(random: () => number): BloomMode {
  return random() < 0.2 ? "jackpot" : "edge";
}

export function getBloomCount({
  width,
  mode,
  random,
  reducedMotion = false,
}: CountOptions) {
  if (reducedMotion) return width < 768 ? 4 : 6;

  const [minimum, maximum] =
    width < 768
      ? mode === "edge"
        ? [10, 14]
        : [20, 26]
      : mode === "edge"
        ? [18, 24]
        : [35, 45];

  return minimum + Math.floor(random() * (maximum - minimum + 1));
}

function pointOnRectEdge(rect: BloomRect, random: () => number): Point {
  const side = Math.floor(random() * 4);
  const progress = random();
  const jitter = (random() - 0.5) * 36;

  switch (side) {
    case 0:
      return {
        x: rect.left + (rect.right - rect.left) * progress,
        y: rect.top + jitter,
      };
    case 1:
      return {
        x: rect.right + jitter,
        y: rect.top + (rect.bottom - rect.top) * progress,
      };
    case 2:
      return {
        x: rect.left + (rect.right - rect.left) * progress,
        y: rect.bottom + jitter,
      };
    default:
      return {
        x: rect.left + jitter,
        y: rect.top + (rect.bottom - rect.top) * progress,
      };
  }
}

function createEdgePoint(options: CreateBloomOptions): Point {
  const useAnchor = options.anchorRects.length > 0 && options.random() < 0.58;
  const rect = useAnchor
    ? options.anchorRects[
        Math.floor(options.random() * options.anchorRects.length)
      ]
    : { left: 0, top: 0, right: options.width, bottom: options.height };
  const point = pointOnRectEdge(rect, options.random);

  return {
    x: clamp(point.x, 0, options.width),
    y: clamp(point.y, 0, options.height),
  };
}

function createJackpotPoint(options: CreateBloomOptions): Point {
  return {
    x: options.random() * options.width,
    y: options.random() * options.height,
  };
}

export function createBloomItems(options: CreateBloomOptions): BloomItem[] {
  const count = getBloomCount(options);

  return Array.from({ length: count }, (_, index) => {
    const point =
      options.mode === "jackpot"
        ? createJackpotPoint(options)
        : createEdgePoint(options);
    const delayMs = options.reducedMotion
      ? 0
      : Math.round(options.random() * 550);
    const durationMs = options.reducedMotion
      ? 1400
      : 3000 + Math.round(options.random() * 400);
    const mobile = options.width < 768;

    return {
      id: `${Date.now()}-${index}-${Math.round(options.random() * 1_000_000)}`,
      kind: index % 4 === 3 ? "nose" : "flower",
      variant: Math.floor(options.random() * 3),
      color: COLORS[Math.floor(options.random() * COLORS.length)],
      x: point.x,
      y: point.y,
      size: Math.round(
        (mobile ? 34 : 48) + options.random() * (mobile ? 38 : 70),
      ),
      rotation: Math.round(-28 + options.random() * 56),
      delayMs,
      durationMs: Math.min(durationMs, 4000 - delayMs),
    };
  });
}
