import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

interface Props {
  unit: "C" | "F";
  onUnit: (u: "C" | "F") => void;
  night: boolean;
  onNight: (v: boolean) => void;
}

const LINKS = [
  { label: "Forecast", href: "#forecast" },
  { label: "Map", href: "#map" },
  { label: "Radar", href: "#radar" },
  { label: "About", href: "#about" },
];

export function Nav({ unit, onUnit, night, onNight }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled
          ? "border-b border-[var(--glass-line)] bg-[var(--glass)] backdrop-blur-xl"
          : "cinematic border-b border-transparent"
      }`}
    >
      <nav className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 md:grid-cols-3 md:px-10">
        <a href="#top" className="flex min-w-0 items-baseline gap-2">
          <span className="font-display text-2xl leading-none tracking-[0.18em]">ATMOS</span>
          <span className="label-mono hidden sm:inline">Obs. 1897</span>
        </a>

        <ul className="hidden items-center justify-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="label-mono relative py-1 text-foreground/70 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 hover:text-foreground hover:after:origin-bottom-left hover:after:scale-x-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end gap-2">
          <div className="glass flex items-center rounded-full p-0.5">
            {(["C", "F"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => onUnit(u)}
                aria-pressed={unit === u}
                className={`label-mono rounded-full px-3 py-1.5 transition-all duration-500 ${
                  unit === u
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                °{u}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onNight(!night)}
            aria-label={night ? "Switch to vintage daylight" : "Switch to vintage night"}
            className="glass magnetic grid h-9 w-9 place-items-center rounded-full"
          >
            {night ? (
              <Sun className="h-4 w-4" strokeWidth={1.4} />
            ) : (
              <Moon className="h-4 w-4" strokeWidth={1.4} />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
