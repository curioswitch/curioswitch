import { useEffect, useRef, useState } from "react";

export function CuriositySwitch({
  label,
  onActivate,
}: {
  label: string;
  onActivate: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
    },
    [],
  );

  const activate = () => {
    if (releaseTimer.current) clearTimeout(releaseTimer.current);
    setPressed(true);
    onActivate();
    releaseTimer.current = setTimeout(() => setPressed(false), 220);
  };

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={activate}
      className="group relative block aspect-16/10 w-full cursor-pointer overflow-hidden bg-[#fff200] text-left shadow-[inset_0_-18px_45px_rgba(151,113,26,0.18),inset_0_2px_0_rgba(255,255,255,0.8)] outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-inset"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.38)_24%,transparent_58%)] transition duration-500 ${pressed ? "scale-150 opacity-100" : "scale-75 opacity-0"}`}
      />
      <span
        aria-hidden="true"
        className="absolute left-[8%] top-[10%] text-[clamp(0.65rem,1.2vw,1rem)] font-semibold tracking-[0.22em] text-black/55"
      >
        CURIOSITY SWITCH
      </span>
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-[28%] bg-[#fffbd6] shadow-[0_18px_0_#d5b92f,0_28px_45px_rgba(79,47,5,0.28),inset_0_3px_0_white]"
      />
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-[47%] aspect-square w-[29%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#96602f] shadow-[0_12px_0_#68401f,0_20px_30px_rgba(61,32,8,0.35),inset_0_5px_8px_rgba(255,255,255,0.32)] transition-transform duration-150 group-hover:scale-[1.025] ${pressed ? "translate-y-[calc(-50%+11px)] scale-[0.96] shadow-[0_3px_0_#68401f,0_8px_14px_rgba(61,32,8,0.28),inset_0_4px_9px_rgba(255,255,255,0.2)]" : ""}`}
      >
        <span className="absolute left-[24%] top-[18%] h-[18%] w-[31%] rotate-[-24deg] rounded-full bg-white/24 blur-[2px]" />
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-[8%] right-[8%] text-[clamp(0.6rem,1vw,0.85rem)] tracking-[0.16em] text-black/45"
      >
        PRESS TO BLOOM
      </span>
    </button>
  );
}
