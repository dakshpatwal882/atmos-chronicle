import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { searchLocations } from "@/lib/weather/service";
import type { GeoLocation } from "@/lib/weather/types";

interface Props {
  location: GeoLocation;
  onSelect: (l: GeoLocation) => void;
}

export function SearchField({ location, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const results = searchLocations(query);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const choose = (l: GeoLocation) => {
    onSelect(l);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative w-full max-w-md">
      <div className="glass group flex items-center gap-3 rounded-full px-4 py-2.5 transition-[box-shadow,background-color] duration-500 focus-within:shadow-[0_0_0_1px_var(--ring)]">
        <Search
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-500 group-focus-within:rotate-[-12deg] group-focus-within:scale-110 group-hover:rotate-[-8deg]"
          strokeWidth={1.5}
        />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIndex((i) => Math.min(results.length - 1, i + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => Math.max(0, i - 1));
            } else if (e.key === "Enter" && results[index]) {
              choose(results[index]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Search city, country..."
          aria-label="Search for a city"
          className="w-full bg-transparent font-mono text-xs tracking-[0.14em] uppercase outline-none placeholder:text-muted-foreground/70"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        ) : (
          <span className="label-mono hidden shrink-0 sm:block">{location.timezone}</span>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="glass absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-xl py-1 animate-[fade-in_.3s_ease-out]">
          {results.map((l, i) => (
            <li key={l.id}>
              <button
                type="button"
                onMouseEnter={() => setIndex(i)}
                onClick={() => choose(l)}
                className={`flex w-full items-baseline justify-between gap-4 px-4 py-2.5 text-left transition-colors duration-300 ${
                  i === index ? "bg-foreground/[0.06]" : ""
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-display text-lg leading-tight">{l.city}</span>
                  <span className="label-mono">
                    {l.region ? `${l.region} · ` : ""}
                    {l.country}
                  </span>
                </span>
                <span className="label-mono shrink-0 tabular-nums">
                  {l.lat.toFixed(2)}° {l.lon.toFixed(2)}°
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
