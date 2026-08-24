import { useId } from "react";

import type { BloomItem } from "./model";

const COLORS = {
  yellow: "#fff200",
  pink: "#ed168c",
  cyan: "#66d9f2",
  green: "#a9dc4f",
} as const;

function Flower({ item }: { item: BloomItem }) {
  const petalCount = [5, 6, 8][item.variant % 3];
  const petalWidth = item.variant % 3 === 1 ? 20 : 24;
  const petalHeight = item.variant % 3 === 2 ? 37 : 32;

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
      <title>Flower</title>
      {Array.from({ length: petalCount }, (_, index) => (
        <ellipse
          key={`${petalCount}-${index}`}
          cx="50"
          cy={50 - petalHeight / 2}
          rx={petalWidth / 2}
          ry={petalHeight / 2}
          fill={COLORS[item.color]}
          transform={`rotate(${(360 / petalCount) * index} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="14" fill="#fff7d5" />
      <circle cx="46" cy="46" r="4" fill="white" opacity="0.72" />
    </svg>
  );
}

function Nose() {
  const gradientId = useId();
  const shadowId = useId();

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <title>Nose</title>
      <defs>
        <radialGradient id={gradientId} cx="38%" cy="27%" r="72%">
          <stop offset="0" stopColor="#ffe1d0" />
          <stop offset="0.5" stopColor="#f3a58f" />
          <stop offset="1" stopColor="#bf665e" />
        </radialGradient>
        <filter id={shadowId} x="-40%" y="-40%" width="180%" height="200%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodOpacity="0.3" />
        </filter>
      </defs>
      <path
        d="M48 10C39 15 38 34 35 47c-2 10-14 15-13 27 1 14 15 18 27 12 8 8 27 7 31-7 4-13-10-19-14-28-5-13-4-34-12-41-2-2-4-2-6 0Z"
        fill={`url(#${gradientId})`}
        filter={`url(#${shadowId})`}
      />
      <ellipse cx="38" cy="72" rx="8" ry="5" fill="#773f42" opacity="0.72" />
      <ellipse cx="63" cy="72" rx="8" ry="5" fill="#773f42" opacity="0.72" />
      <path
        d="M47 20c-4 14-3 31-8 43"
        fill="none"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.42"
      />
    </svg>
  );
}

export function BloomGlyph({ item }: { item: BloomItem }) {
  return item.kind === "nose" ? <Nose /> : <Flower item={item} />;
}
