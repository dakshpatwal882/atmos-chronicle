import { useEffect, useRef } from "react";
import type { Atmosphere } from "./atmosphere";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
}

interface Props {
  atmosphere: Atmosphere;
  /** -1 … 1 smoothed pointer */
  pointer: { x: number; y: number; nx: number; ny: number; active: boolean };
  intensity: number;
  reduced: boolean;
}

/**
 * Atmospheric particle field. One canvas, rAF driven, GPU friendly.
 * Particles carry a depth value (z) so the pointer parallax separates them.
 */
export function ParticleField({ atmosphere, pointer, intensity, reduced }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef(pointer);
  pointerRef.current = pointer;
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  const kind = atmosphere.particle;
  const baseDensity = atmosphere.density;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const count = Math.round(baseDensity * (mobile ? 0.45 : 1));
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);

    let w = 0;
    let h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: count }, () => spawn(w, h, kind));

    if (reduced) {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) drawParticle(ctx, p, kind, 0.5);
      return () => window.removeEventListener("resize", resize);
    }

    let frame = 0;
    const render = () => {
      const p0 = pointerRef.current;
      const boost = intensityRef.current;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        const depth = 0.35 + p.z * 0.9;
        p.x += p.vx * depth * (kind === "rain" ? 1 + boost : 1) - p0.x * depth * 0.35;
        p.y += p.vy * depth * (kind === "rain" ? 1 + boost * 1.4 : 1) - p0.y * depth * 0.2;

        if (p.y > h + 30) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        if (p.y < -40) p.y = h + 10;
        if (p.x > w + 30) p.x = -20;
        if (p.x < -30) p.x = w + 20;

        const px = p.x + p0.x * depth * 26;
        const py = p.y + p0.y * depth * 18;
        drawParticle(ctx, { ...p, x: px, y: py }, kind, 0.6 + boost * 0.5);
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [kind, baseDensity, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

function spawn(w: number, h: number, kind: Atmosphere["particle"]): Particle {
  const z = Math.random();
  const base = {
    x: Math.random() * (w || 1200),
    y: Math.random() * (h || 800),
    z,
    a: 0.15 + Math.random() * 0.5,
    r: 0.6 + z * 1.6,
    vx: 0,
    vy: 0,
  };
  switch (kind) {
    case "rain":
      return { ...base, vx: -0.6 - z, vy: 6 + z * 9, r: 0.5 + z * 0.9 };
    case "snow":
      return { ...base, vx: (Math.random() - 0.5) * 0.6, vy: 0.5 + z * 1.1, r: 1 + z * 2 };
    case "mist":
      return { ...base, vx: 0.15 + z * 0.3, vy: -0.05, r: 18 + z * 46, a: 0.03 + z * 0.05 };
    case "star":
      return { ...base, vx: 0.01, vy: 0.008, r: 0.4 + z * 1.1, a: 0.25 + Math.random() * 0.6 };
    case "spark":
      return { ...base, vx: 0.2 + z, vy: -0.3 - z, r: 0.8 + z };
    default:
      return { ...base, vx: 0.12 + z * 0.4, vy: -0.06 - z * 0.12, r: 0.6 + z * 1.4, a: 0.08 + z * 0.3 };
  }
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  kind: Atmosphere["particle"],
  alphaScale: number,
) {
  const alpha = Math.min(1, p.a * alphaScale);
  if (kind === "rain") {
    ctx.strokeStyle = `rgba(232, 226, 210, ${alpha * 0.55})`;
    ctx.lineWidth = p.r;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - 1.6, p.y + 12 + p.z * 12);
    ctx.stroke();
    return;
  }
  if (kind === "mist") {
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    g.addColorStop(0, `rgba(238, 230, 212, ${alpha})`);
    g.addColorStop(1, "rgba(238, 230, 212, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.fillStyle =
    kind === "snow"
      ? `rgba(245, 243, 236, ${alpha})`
      : kind === "star"
        ? `rgba(240, 232, 208, ${alpha})`
        : `rgba(226, 200, 150, ${alpha})`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
}
