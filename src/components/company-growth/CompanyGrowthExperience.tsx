import {
  type CSSProperties,
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getMediaAnchorPercent } from "./layout";

type GrowthContextValue = {
  activate: () => void;
  hasGrown: boolean;
  isWatering: boolean;
  seedSceneRef: RefObject<HTMLDivElement | null>;
};

const GrowthContext = createContext<GrowthContextValue | null>(null);

function useGrowthContext() {
  const context = useContext(GrowthContext);
  if (!context) {
    throw new Error("Company growth components require CompanyGrowthProvider");
  }
  return context;
}

type WaterParticleStyle = CSSProperties & {
  "--water-drift": string;
};

type SeedSceneStyle = CSSProperties & {
  "--company-seed-y": string;
};

const seedSceneStyle: SeedSceneStyle = {
  "--company-seed-y": getMediaAnchorPercent({
    imageSize: 887,
    subjectPoint: 590,
  }),
};

function WaterRain({
  burst,
  reducedMotion,
}: {
  burst: number;
  reducedMotion: boolean;
}) {
  const particles = useMemo(() => {
    const count = reducedMotion ? 8 : 42;
    return Array.from({ length: count }, (_, index) => {
      const seed = index + burst * 17;
      const size = 5 + ((seed * 13) % 12);
      const style: WaterParticleStyle = {
        left: `${(seed * 37) % 101}%`,
        width: `${size}px`,
        height: `${size * 2.4}px`,
        animationDelay: `${(seed * 71) % 900}ms`,
        animationDuration: `${1700 + ((seed * 53) % 1400)}ms`,
        opacity: 0.45 + ((seed * 11) % 45) / 100,
        "--water-drift": `${((seed * 29) % 90) - 45}px`,
      };
      return { id: `${burst}-${index}`, style };
    });
  }, [burst, reducedMotion]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
      data-water-rain
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          data-water-particle
          className="company-water-particle absolute -top-12 rounded-full"
          style={particle.style}
        />
      ))}
    </div>
  );
}

export function CompanyGrowthProvider({ children }: { children: ReactNode }) {
  const [hasGrown, setHasGrown] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [burst, setBurst] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const seedSceneRef = useRef<HTMLDivElement>(null);
  const timers = useRef<Set<number>>(new Set());

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, delay);
    timers.current.add(timer);
  }, []);

  useEffect(
    () => () => {
      for (const timer of timers.current) window.clearTimeout(timer);
      timers.current.clear();
    },
    [],
  );

  const activate = useCallback(() => {
    for (const timer of timers.current) window.clearTimeout(timer);
    timers.current.clear();

    const shouldReduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReducedMotion(shouldReduceMotion);
    setBurst((current) => current + 1);
    setIsWatering(true);

    if (shouldReduceMotion) {
      seedSceneRef.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
      setHasGrown(true);
      schedule(() => setIsWatering(false), 1200);
      return;
    }

    schedule(() => {
      seedSceneRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 450);
    schedule(() => setHasGrown(true), 1000);
    schedule(() => setIsWatering(false), 3800);
  }, [schedule]);

  const value = useMemo(
    () => ({ activate, hasGrown, isWatering, seedSceneRef }),
    [activate, hasGrown, isWatering],
  );

  return (
    <GrowthContext.Provider value={value}>
      {children}
      {isWatering ? (
        <WaterRain burst={burst} reducedMotion={reducedMotion} />
      ) : null}
    </GrowthContext.Provider>
  );
}

function GrownFlower() {
  return (
    <svg
      data-testid="company-grown-flower"
      className="company-grown-flower h-full w-full overflow-visible"
      viewBox="0 0 180 260"
      aria-hidden="true"
    >
      <path
        className="company-grown-stem"
        d="M90 254 C88 204 95 166 90 110"
        fill="none"
        stroke="#43834f"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        className="company-grown-leaf company-grown-leaf-left"
        d="M89 198 C55 166 27 178 35 207 C47 228 71 221 89 198Z"
        fill="#79b85b"
      />
      <path
        className="company-grown-leaf company-grown-leaf-right"
        d="M92 164 C118 132 151 142 146 171 C136 194 111 187 92 164Z"
        fill="#9dcc69"
      />
      <g transform="translate(90 83)">
        <g className="company-grown-blossom">
          <ellipse
            rx="25"
            ry="48"
            fill="#fff174"
            transform="rotate(0) translate(0 -35)"
          />
          <ellipse
            rx="25"
            ry="48"
            fill="#ffd951"
            transform="rotate(60) translate(0 -35)"
          />
          <ellipse
            rx="25"
            ry="48"
            fill="#fff174"
            transform="rotate(120) translate(0 -35)"
          />
          <ellipse
            rx="25"
            ry="48"
            fill="#ffd951"
            transform="rotate(180) translate(0 -35)"
          />
          <ellipse
            rx="25"
            ry="48"
            fill="#fff174"
            transform="rotate(240) translate(0 -35)"
          />
          <ellipse
            rx="25"
            ry="48"
            fill="#ffd951"
            transform="rotate(300) translate(0 -35)"
          />
          <circle r="25" fill="#8d5a2e" />
        </g>
      </g>
    </svg>
  );
}

export function CompanySeedScene({ children }: { children: ReactNode }) {
  const { hasGrown, seedSceneRef } = useGrowthContext();
  return (
    <div
      ref={seedSceneRef}
      data-testid="company-seed-scene"
      data-grown={hasGrown}
      className="company-seed-scene relative isolate overflow-hidden"
      style={seedSceneStyle}
    >
      {children}
      {hasGrown ? (
        <div className="company-grown-flower-anchor pointer-events-none absolute left-1/2 z-10 h-28 w-20 md:h-52 md:w-36">
          <GrownFlower />
        </div>
      ) : null}
    </div>
  );
}

export function WateringCanTrigger({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const { activate, isWatering } = useGrowthContext();
  return (
    <button
      type="button"
      onClick={activate}
      aria-label={label}
      title={label}
      data-watering={isWatering}
      className="company-watering-trigger group relative mx-auto block aspect-[4/3] w-full max-w-xl cursor-pointer overflow-hidden rounded-xl text-left focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-yellow-400"
    >
      {children}
    </button>
  );
}
