import { useEffect, useState } from "react";

export function LoadingVeil() {
  const [gone, setGone] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setFading(true), 1100);
    const b = setTimeout(() => setGone(true), 2100);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={`grain fixed inset-0 z-[100] grid place-items-center bg-background transition-opacity duration-[900ms] ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border border-[var(--glass-line)]" />
          <div className="sweep absolute inset-0">
            <div className="absolute top-1/2 left-1/2 h-px w-1/2 origin-left bg-gradient-to-r from-[var(--rust)] to-transparent" />
          </div>
          <div className="breathe absolute inset-5 rounded-full border border-dashed border-[var(--glass-line)]" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--rust)]" />
          </div>
        </div>
        <p className="label-mono animate-[fade-in_.9s_ease-out]">Reading the atmosphere...</p>
      </div>
    </div>
  );
}
