import { useReveal } from "@/hooks/use-atmos";
import type { ReactNode } from "react";

interface Props {
  id?: string;
  index: string;
  title: string;
  caption?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, index, title, caption, children, className = "" }: Props) {
  const { ref, visible } = useReveal<HTMLElement>();
  return (
    <section
      id={id}
      ref={ref}
      data-visible={visible}
      className={`reveal mx-auto w-full max-w-[1400px] px-5 py-20 md:px-10 md:py-28 ${className}`}
    >
      <header className="mb-10 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-4 border-b border-[var(--glass-line)] pb-4 md:mb-14">
        <span className="label-mono">{index}</span>
        <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">{title}</h2>
          {caption && <p className="label-mono">{caption}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}
