import { useEffect, useRef } from "react";

type Cell = {
  baseRadius: number;
  burstAge: number | null;
  burstSeed: number;
  phase: number;
  pulseSpeed: number;
  radius: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
};

type BurstCell = Pick<Cell, "burstAge" | "burstSeed" | "radius" | "x" | "y">;

type Point = {
  x: number;
  y: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const CURIOSITY_BURST_DURATION = 1.5;
const CURIOSITY_BURST_COLORS = ["#ec008c", "#00a8e8", "#8cc63f"] as const;
const CURIOSITY_BURST_TEXT = [
  "Why",
  "Curious",
  "Wonder",
  "Discover",
  "Explore",
  "Imagine",
  "Notice",
  "Seek",
  "Create",
  "?",
  "!!!",
  "Lucky",
  "Jackpot",
  "Winner",
  "Great Find",
  "You Found It",
] as const;

function seededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

export function getCuriosityBurstContent(seed: number) {
  const random = seededRandom(seed * 97 + 41);
  const showStar = random() < 0.24;
  const value =
    CURIOSITY_BURST_TEXT[Math.floor(random() * CURIOSITY_BURST_TEXT.length)];
  const motion = {
    angle: random() * Math.PI * 2,
    distance: 0.72 + random() * 0.4,
    rotation: (random() - 0.5) * 0.52,
    scale: 1.2 + random() * 0.42,
  };

  if (showStar) {
    return {
      ...motion,
      type: "star" as const,
    };
  }

  return {
    ...motion,
    type: "text" as const,
    value,
  };
}

export function getCellLayout(width: number) {
  if (width < 768) {
    return { count: 12, maxRadius: 71, minRadius: 71 };
  }

  return { count: 30, maxRadius: 104, minRadius: 104 };
}

export function getPuchiDecorations(width: number, height: number) {
  const isMobile = width < 768;
  const count = isMobile ? 3 : 5;
  const random = seededRandom(Math.round(width * 11 + height * 13));

  return Array.from({ length: count }, (_, index) => ({
    amplitude: (isMobile ? 4 : 7) + random() * (isMobile ? 5 : 8),
    fontSize: (isMobile ? 18 : 27) + random() * (isMobile ? 9 : 17),
    opacity: 0.55 + random() * 0.3,
    phase: random() * Math.PI * 2,
    rotation: (random() - 0.5) * 0.42,
    speed: 0.18 + random() * 0.2,
    text: "♾プチプチ" as const,
    x: ((index + random()) / count) * width,
    y: height * (0.14 + random() * 0.72),
  }));
}

export function startCuriosityBurst(
  cells: BurstCell[],
  point: Point,
  seed: number,
) {
  if (cells.filter((cell) => cell.burstAge !== null).length >= 3) return null;

  let closestIndex: number | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < cells.length; index += 1) {
    const cell = cells[index];
    if (cell.burstAge !== null) continue;

    const distance = Math.hypot(cell.x - point.x, cell.y - point.y);
    if (distance <= cell.radius && distance < closestDistance) {
      closestIndex = index;
      closestDistance = distance;
    }
  }

  if (closestIndex === null) return null;

  cells[closestIndex].burstAge = 0;
  cells[closestIndex].burstSeed = seed;
  return closestIndex;
}

export function advanceCuriosityBurst(
  age: number | null,
  deltaSeconds: number,
) {
  if (age === null) return null;

  const nextAge = age + deltaSeconds;
  return nextAge >= CURIOSITY_BURST_DURATION ? null : nextAge;
}

export function repelCellFromPointer(
  cell: Pick<Cell, "radius" | "vx" | "vy" | "x" | "y">,
  pointer: Point,
  deltaSeconds: number,
) {
  const dx = cell.x - pointer.x;
  const dy = cell.y - pointer.y;
  const distance = Math.hypot(dx, dy);
  const influenceRadius = cell.radius + 90;

  if (distance === 0 || distance >= influenceRadius) return;

  const strength = 1 - distance / influenceRadius;
  const push = (90 + strength * 230) * strength * deltaSeconds;
  cell.vx += (dx / distance) * push;
  cell.vy += (dy / distance) * push;
}

export function resolveCellCollision(
  first: Pick<Cell, "radius" | "vx" | "vy" | "x" | "y">,
  second: Pick<Cell, "radius" | "vx" | "vy" | "x" | "y">,
) {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const distance = Math.hypot(dx, dy);
  const minimumDistance = first.radius + second.radius;

  if (distance >= minimumDistance) return;

  const directionX = distance === 0 ? 1 : dx / distance;
  const directionY = distance === 0 ? 0 : dy / distance;
  const firstInverseMass = 1 / first.radius ** 2;
  const secondInverseMass = 1 / second.radius ** 2;
  const inverseMassTotal = firstInverseMass + secondInverseMass;
  const overlap = minimumDistance - distance;

  first.x -= directionX * overlap * (firstInverseMass / inverseMassTotal);
  first.y -= directionY * overlap * (firstInverseMass / inverseMassTotal);
  second.x += directionX * overlap * (secondInverseMass / inverseMassTotal);
  second.y += directionY * overlap * (secondInverseMass / inverseMassTotal);

  const relativeVelocity =
    (second.vx - first.vx) * directionX + (second.vy - first.vy) * directionY;
  if (relativeVelocity >= 0) return;

  const restitution = 0.88;
  const impulse = (-(1 + restitution) * relativeVelocity) / inverseMassTotal;
  first.vx -= impulse * firstInverseMass * directionX;
  first.vy -= impulse * firstInverseMass * directionY;
  second.vx += impulse * secondInverseMass * directionX;
  second.vy += impulse * secondInverseMass * directionY;
}

export function CellularHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let cells: Cell[] = [];
    let animationFrame: number | null = null;
    let previousTime = 0;
    let width = 0;
    let height = 0;
    let visible = false;
    let burstSeed = 0;
    let puchiDecorations: ReturnType<typeof getPuchiDecorations> = [];
    let lastPointerBurstTime = Number.NEGATIVE_INFINITY;
    const reducedMotionTimers = new Set<number>();
    const pointer = { active: false, x: 0, y: 0 };

    const createCells = () => {
      const random = seededRandom(Math.round(width * 3 + height * 7));
      const isMobile = width < 768;
      const { count, maxRadius, minRadius } = getCellLayout(width);

      cells = Array.from({ length: count }, () => {
        const radius = minRadius + random() * (maxRadius - minRadius);
        const angle = random() * Math.PI * 2;
        const speed = (isMobile ? 5 : 7) + random() * (isMobile ? 8 : 12);

        return {
          baseRadius: radius,
          burstAge: null,
          burstSeed: 0,
          phase: random() * Math.PI * 2,
          pulseSpeed: 0.32 + random() * 0.28,
          radius,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          x: random() * width,
          y: random() * height,
        };
      });
    };

    const resolveCollisions = (passes: number) => {
      for (let pass = 0; pass < passes; pass += 1) {
        for (let first = 0; first < cells.length; first += 1) {
          for (let second = first + 1; second < cells.length; second += 1) {
            resolveCellCollision(cells[first], cells[second]);
          }
        }
      }
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;

      width = bounds.width;
      height = bounds.height;
      const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createCells();
      puchiDecorations = getPuchiDecorations(width, height);
      resolveCollisions(12);
    };

    const update = (deltaSeconds: number, elapsedSeconds: number) => {
      for (const cell of cells) {
        cell.burstAge = advanceCuriosityBurst(cell.burstAge, deltaSeconds);
        cell.radius =
          cell.baseRadius *
          (1 + Math.sin(elapsedSeconds * cell.pulseSpeed + cell.phase) * 0.045);

        if (pointer.active) {
          repelCellFromPointer(cell, pointer, deltaSeconds);
        }

        cell.x += cell.vx * deltaSeconds;
        cell.y += cell.vy * deltaSeconds;

        const horizontalLimit = cell.radius * 0.55;
        const verticalLimit = cell.radius * 0.55;
        if (cell.x < -horizontalLimit && cell.vx < 0) cell.vx *= -1;
        if (cell.x > width + horizontalLimit && cell.vx > 0) cell.vx *= -1;
        if (cell.y < -verticalLimit && cell.vy < 0) cell.vy *= -1;
        if (cell.y > height + verticalLimit && cell.vy > 0) cell.vy *= -1;

        const speed = Math.hypot(cell.vx, cell.vy);
        const maxSpeed = 24;
        if (speed > maxSpeed) {
          cell.vx = (cell.vx / speed) * maxSpeed;
          cell.vy = (cell.vy / speed) * maxSpeed;
        }
      }

      resolveCollisions(4);
    };

    const draw = (elapsedSeconds = 0) => {
      const background = context.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, "#f5ac00");
      background.addColorStop(0.55, "#ffc400");
      background.addColorStop(1, "#ee9f00");
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      const blobGradient = context.createLinearGradient(0, 0, width, height);
      blobGradient.addColorStop(0, "#ffe85a");
      blobGradient.addColorStop(0.52, "#ffd51b");
      blobGradient.addColorStop(1, "#e9a500");

      const drawSphere = (cell: Cell, scale = 1, opacity = 1) => {
        const radius = cell.radius * scale;
        if (radius <= 0) return;

        context.save();
        context.globalAlpha = opacity;
        context.fillStyle = blobGradient;
        context.shadowColor = "rgba(153, 91, 0, 0.24)";
        context.shadowBlur = 18;
        context.shadowOffsetY = 7;
        context.beginPath();
        context.arc(cell.x, cell.y, radius, 0, Math.PI * 2);
        context.fill();
        context.restore();

        const gradient = context.createRadialGradient(
          cell.x - radius * 0.32,
          cell.y - radius * 0.38,
          radius * 0.08,
          cell.x,
          cell.y,
          radius,
        );
        gradient.addColorStop(0, "rgba(255, 255, 202, 0.92)");
        gradient.addColorStop(0.3, "rgba(255, 242, 104, 0.66)");
        gradient.addColorStop(0.68, "rgba(255, 224, 45, 0.24)");
        gradient.addColorStop(1, "rgba(255, 209, 19, 0)");

        context.save();
        context.globalAlpha = opacity;
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(cell.x, cell.y, radius, 0, Math.PI * 2);
        context.fill();
        context.restore();

        context.save();
        context.globalAlpha = opacity;
        context.fillStyle = "rgba(255, 255, 255, 0.55)";
        context.beginPath();
        context.ellipse(
          cell.x - radius * 0.3,
          cell.y - radius * 0.36,
          radius * 0.14,
          radius * 0.08,
          -0.45,
          0,
          Math.PI * 2,
        );
        context.fill();
        context.restore();
      };

      const drawIcon = (
        kind: "bulb" | "eye" | "star",
        x: number,
        y: number,
        size: number,
        color: string,
        rotation: number,
        opacity: number,
      ) => {
        context.save();
        context.translate(x, y);
        context.rotate(rotation);
        context.globalAlpha = opacity;
        context.strokeStyle = color;
        context.fillStyle = color;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = Math.max(2, size * 0.11);
        context.shadowColor = "rgba(255, 255, 255, 0.7)";
        context.shadowBlur = 8;
        context.beginPath();

        if (kind === "star") {
          for (let point = 0; point < 10; point += 1) {
            const angle = -Math.PI / 2 + (point * Math.PI) / 5;
            const radius = point % 2 === 0 ? size * 0.5 : size * 0.22;
            const pointX = Math.cos(angle) * radius;
            const pointY = Math.sin(angle) * radius;
            if (point === 0) context.moveTo(pointX, pointY);
            else context.lineTo(pointX, pointY);
          }
          context.closePath();
          context.stroke();
        } else if (kind === "eye") {
          context.ellipse(0, 0, size * 0.52, size * 0.3, 0, 0, Math.PI * 2);
          context.stroke();
          context.beginPath();
          context.arc(0, 0, size * 0.13, 0, Math.PI * 2);
          context.fill();
        } else {
          context.arc(
            0,
            -size * 0.1,
            size * 0.28,
            Math.PI * 0.1,
            Math.PI * 0.9,
          );
          context.lineTo(size * 0.13, size * 0.3);
          context.lineTo(-size * 0.13, size * 0.3);
          context.closePath();
          context.stroke();
          context.beginPath();
          context.moveTo(-size * 0.12, size * 0.42);
          context.lineTo(size * 0.12, size * 0.42);
          context.stroke();
          for (let ray = 0; ray < 5; ray += 1) {
            const angle = -Math.PI + (ray * Math.PI) / 4;
            context.beginPath();
            context.moveTo(
              Math.cos(angle) * size * 0.42,
              Math.sin(angle) * size * 0.42 - size * 0.1,
            );
            context.lineTo(
              Math.cos(angle) * size * 0.55,
              Math.sin(angle) * size * 0.55 - size * 0.1,
            );
            context.stroke();
          }
        }
        context.restore();
      };

      const drawBurst = (cell: Cell) => {
        if (cell.burstAge === null) return;

        const progress = clamp(cell.burstAge / CURIOSITY_BURST_DURATION, 0, 1);
        const seedAngle = cell.burstSeed * 1.73;
        const content = getCuriosityBurstContent(cell.burstSeed);

        if (progress < 0.14) {
          const anticipation = progress / 0.14;
          drawSphere(cell, 1 - Math.sin(anticipation * Math.PI) * 0.17);
          context.save();
          context.globalAlpha = anticipation * 0.7;
          context.fillStyle = "#ffffff";
          context.shadowColor = "#ffffff";
          context.shadowBlur = 30;
          context.beginPath();
          context.arc(
            cell.x,
            cell.y,
            cell.radius * anticipation,
            0,
            Math.PI * 2,
          );
          context.fill();
          context.restore();
          return;
        }

        const life = clamp((progress - 0.1) / 0.82, 0, 1);
        const eased = 1 - (1 - life) ** 3;
        const fade = clamp(1 - (progress - 0.68) / 0.32, 0, 1);
        const reveal = clamp(life * 5, 0, 1);
        const effectOpacity = reveal * fade;

        context.save();
        context.globalAlpha = fade * 0.75;
        context.strokeStyle = "#ffffff";
        context.lineWidth = 4;
        context.shadowColor = "#ffffff";
        context.shadowBlur = 16;
        context.beginPath();
        context.arc(
          cell.x,
          cell.y,
          cell.radius * (0.25 + eased * 0.9),
          0,
          Math.PI * 2,
        );
        context.stroke();
        context.restore();

        if (progress < 0.56) {
          const shardLife = clamp((progress - 0.1) / 0.46, 0, 1);
          for (let shard = 0; shard < 7; shard += 1) {
            const angle = seedAngle + (shard * Math.PI * 2) / 7;
            const distance = cell.radius * (0.18 + shardLife * 0.7);
            const size = cell.radius * (0.34 - shardLife * 0.16);
            context.save();
            context.translate(
              cell.x + Math.cos(angle) * distance,
              cell.y + Math.sin(angle) * distance,
            );
            context.rotate(angle + shardLife * (shard % 2 === 0 ? 1.1 : -1.1));
            context.globalAlpha = 1 - shardLife;
            context.fillStyle = shard % 2 === 0 ? "#ffe85a" : "#ffd51b";
            context.shadowColor = "rgba(153, 91, 0, 0.2)";
            context.shadowBlur = 10;
            context.lineJoin = "round";
            context.beginPath();
            context.moveTo(-size * 0.45, -size * 0.32);
            context.lineTo(size * 0.5, 0);
            context.lineTo(-size * 0.35, size * 0.38);
            context.closePath();
            context.fill();
            context.restore();
          }
        }

        const curiosityDistance =
          cell.radius * (0.24 + eased * content.distance);
        const curiosityX = cell.x + Math.cos(content.angle) * curiosityDistance;
        const curiosityY = cell.y + Math.sin(content.angle) * curiosityDistance;

        if (content.type === "text") {
          const lengthScale =
            content.value.length > 9
              ? 0.68
              : content.value.length > 7
                ? 0.78
                : content.value.length > 5
                  ? 0.88
                  : 1;
          context.save();
          context.translate(curiosityX, curiosityY);
          context.rotate(content.rotation);
          context.globalAlpha = effectOpacity;
          context.fillStyle =
            CURIOSITY_BURST_COLORS[
              Math.floor(content.angle * 10) % CURIOSITY_BURST_COLORS.length
            ];
          context.shadowColor = "rgba(255, 255, 255, 0.85)";
          context.shadowBlur = 10;
          context.font = `700 ${Math.max(24, cell.radius * 0.4 * content.scale * lengthScale)}px Inter, "Noto Sans JP", sans-serif`;
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(content.value, 0, 0);
          context.restore();
        }

        if (content.type === "star") {
          drawIcon(
            "star",
            curiosityX,
            curiosityY,
            cell.radius * 0.52 * content.scale,
            CURIOSITY_BURST_COLORS[
              Math.floor(content.angle * 10) % CURIOSITY_BURST_COLORS.length
            ],
            content.rotation + eased * 0.6,
            effectOpacity,
          );
        }

        if (progress > 0.78) {
          const reform = clamp((progress - 0.78) / 0.22, 0, 1);
          drawSphere(cell, 1 - (1 - reform) ** 2, reform);
        }
      };

      for (const cell of cells) {
        if (cell.burstAge === null) drawSphere(cell);
      }

      for (const decoration of puchiDecorations) {
        const drift = elapsedSeconds * decoration.speed + decoration.phase;
        context.save();
        context.translate(
          decoration.x + Math.sin(drift) * decoration.amplitude,
          decoration.y + Math.cos(drift * 0.83) * decoration.amplitude * 0.58,
        );
        context.rotate(decoration.rotation + Math.sin(drift * 0.7) * 0.035);
        context.globalAlpha = decoration.opacity;
        context.fillStyle = "#ffffff";
        context.font = `700 ${decoration.fontSize}px "Noto Sans JP", sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(decoration.text, 0, 0);
        context.restore();
      }

      for (const cell of cells) {
        drawBurst(cell);
      }
    };

    const animate = (time: number) => {
      animationFrame = null;
      if (!visible) return;

      const deltaSeconds = clamp((time - previousTime) / 1_000, 0, 0.04);
      update(deltaSeconds, time / 1_000);
      draw(time / 1_000);
      previousTime = time;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (reduceMotion || !visible || animationFrame !== null) return;

      previousTime = performance.now();
      animationFrame = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (animationFrame === null) return;

      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.active = true;
      pointer.x = event.offsetX;
      pointer.y = event.offsetY;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const activateBurst = (x: number, y: number) => {
      const index = startCuriosityBurst(cells, { x, y }, burstSeed);
      burstSeed += 1;

      if (index === null || !reduceMotion) return index;

      cells[index].burstAge = CURIOSITY_BURST_DURATION * 0.28;
      draw();
      const timer = window.setTimeout(() => {
        reducedMotionTimers.delete(timer);
        cells[index].burstAge = null;
        draw();
      }, 700);
      reducedMotionTimers.add(timer);
      return index;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (activateBurst(event.offsetX, event.offsetY) !== null) {
        lastPointerBurstTime = performance.now();
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (performance.now() - lastPointerBurstTime < 500) return;
      activateBurst(event.offsetX, event.offsetY);
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          startAnimation();
        } else {
          pointer.active = false;
          stopAnimation();
        }
      },
      { rootMargin: "100px" },
    );
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    canvas.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    canvas.addEventListener("pointerleave", handlePointerLeave, {
      passive: true,
    });
    canvas.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    canvas.addEventListener("click", handleClick, { passive: true });
    resize();
    draw();

    return () => {
      stopAnimation();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("click", handleClick);
      for (const timer of reducedMotionTimers) window.clearTimeout(timer);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="黄色い球をタップすると好奇心が弾けます"
      className="block h-full w-full touch-manipulation cursor-pointer bg-yellow-400"
    />
  );
}
