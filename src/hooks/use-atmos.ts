import { useEffect, useRef, useState } from "react";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export interface Pointer {
  /** -1 … 1 */
  x: number;
  y: number;
  /** 0 … 1 raw normalised */
  nx: number;
  ny: number;
  active: boolean;
}

/**
 * Smoothed pointer tracking scoped to an element, driven by rAF.
 * Falls back to device orientation-free idle drift on touch devices.
 */
export function usePointerParallax<T extends HTMLElement>(disabled = false) {
  const ref = useRef<T | null>(null);
  const target = useRef({ x: 0, y: 0, active: false });
  const [pointer, setPointer] = useState<Pointer>({ x: 0, y: 0, nx: 0.5, ny: 0.5, active: false });

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    let frame = 0;
    const cur = { x: 0, y: 0 };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.current = {
        x: ((e.clientX - r.left) / r.width) * 2 - 1,
        y: ((e.clientY - r.top) / r.height) * 2 - 1,
        active: true,
      };
    };
    const onLeave = () => {
      target.current = { x: 0, y: 0, active: false };
    };

    const tick = () => {
      cur.x += (target.current.x - cur.x) * 0.07;
      cur.y += (target.current.y - cur.y) * 0.07;
      setPointer({
        x: Math.round(cur.x * 1000) / 1000,
        y: Math.round(cur.y * 1000) / 1000,
        nx: (cur.x + 1) / 2,
        ny: (cur.y + 1) / 2,
        active: target.current.active,
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [disabled]);

  return { ref, pointer };
}

/** Adds data-visible="true" the first time the element enters the viewport. */
export function useReveal<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/** Eased numeric counter for temperature transitions. */
export function useCountUp(value: number, duration = 900) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const origin = from.current;
    const delta = value - origin;
    if (delta === 0) return;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(origin + delta * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  useEffect(() => {
    from.current = display;
  }, [display]);
  return display;
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
