import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { BloomGlyph } from "./BloomGlyph";
import { CuriositySwitch } from "./CuriositySwitch";
import {
  type BloomItem,
  type BloomRect,
  chooseBloomMode,
  createBloomItems,
} from "./model";

interface Burst {
  id: number;
  items: BloomItem[];
}

type BloomStyle = CSSProperties & {
  "--bloom-delay": string;
  "--bloom-duration": string;
  "--bloom-rotation": string;
  "--bloom-size": string;
  "--bloom-x": string;
  "--bloom-y": string;
};

function getVisibleAnchorRects(
  selector: string,
  width: number,
  height: number,
): BloomRect[] {
  return Array.from(document.querySelectorAll<HTMLElement>(selector))
    .map((element) => element.getBoundingClientRect())
    .filter(
      (rect) =>
        rect.width > 0 &&
        rect.height > 0 &&
        rect.right > 0 &&
        rect.bottom > 0 &&
        rect.left < width &&
        rect.top < height,
    )
    .map((rect) => ({
      left: Math.max(0, rect.left),
      top: Math.max(0, rect.top),
      right: Math.min(width, rect.right),
      bottom: Math.min(height, rect.bottom),
    }));
}

function capBursts(bursts: Burst[], maximumItems: number) {
  const next = [...bursts];
  while (
    next.length > 1 &&
    next.reduce((total, burst) => total + burst.items.length, 0) > maximumItems
  ) {
    next.shift();
  }
  return next;
}

export function CuriosityBloomExperience({
  label,
  anchorSelector = "img, article",
  random = Math.random,
}: {
  label: string;
  anchorSelector?: string;
  random?: () => number;
}) {
  const [mounted, setMounted] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextBurstId = useRef(0);
  const removalTimers = useRef(
    new Map<number, ReturnType<typeof setTimeout>>(),
  );

  useEffect(() => {
    setMounted(true);
    const timers = removalTimers.current;
    return () => {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
    };
  }, []);

  const activate = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const id = nextBurstId.current++;
    const items = createBloomItems({
      width,
      height,
      mode: chooseBloomMode(random),
      anchorRects: getVisibleAnchorRects(anchorSelector, width, height),
      random,
      reducedMotion,
    });

    setBursts((current) => capBursts([...current, { id, items }], 72));
    const timer = setTimeout(() => {
      setBursts((current) => current.filter((burst) => burst.id !== id));
      removalTimers.current.delete(id);
    }, 4100);
    removalTimers.current.set(id, timer);
  }, [anchorSelector, random]);

  const overlay = (
    <div
      data-bloom-overlay
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
    >
      {bursts.flatMap((burst) =>
        burst.items.map((item) => {
          const style: BloomStyle = {
            "--bloom-delay": `${item.delayMs}ms`,
            "--bloom-duration": `${item.durationMs}ms`,
            "--bloom-rotation": `${item.rotation}deg`,
            "--bloom-size": `${item.size}px`,
            "--bloom-x": `${item.x}px`,
            "--bloom-y": `${item.y}px`,
          };

          return (
            <span
              key={`${burst.id}:${item.id}`}
              data-bloom-item
              className="curiosity-bloom-item"
              style={style}
            >
              <BloomGlyph item={item} />
            </span>
          );
        }),
      )}
    </div>
  );

  return (
    <>
      <CuriositySwitch label={label} onActivate={activate} />
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
