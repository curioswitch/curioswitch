import { useEffect, useRef } from "react";

export default function MobileFixedBackground({
  image,
  targetId,
}: {
  image: string;
  targetId: string;
}) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = document.getElementById(targetId);
    const layer = layerRef.current;

    if (!frame || !layer) {
      return;
    }

    let animationFrame: number | null = null;

    const updatePosition = () => {
      animationFrame = null;

      const rect = frame.getBoundingClientRect();
      const offset = Math.max(0, Math.min(window.scrollY, rect.height));

      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const scheduleUpdate = () => {
      if (animationFrame !== null) {
        return;
      }

      animationFrame = window.requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetId]);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -top-full h-[300%] will-change-transform md:hidden"
      style={{
        backgroundImage: `url(${image})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto 100%",
      }}
    />
  );
}
