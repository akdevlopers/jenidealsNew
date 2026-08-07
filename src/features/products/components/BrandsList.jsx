'use client'

import { ChevronRight } from "lucide-react";
import { brands } from "@/data";

export function BrandsList() {
  return (
    <section className="pt-5">
      <div className="flex items-center justify-between px-4">
        <h2 className="font-display text-lg font-bold tracking-tight text-fg">Brands</h2>
        <button className="flex items-center text-[12px] font-semibold text-orange-deep active:opacity-70">
          All <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar px-4">
        {brands.map((b) => {
          const initials = b.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
          return (
            <button key={b} className="flex w-[92px] shrink-0 flex-col items-center gap-2 rounded-lg border border-line bg-surface p-3 active:opacity-80" style={{ boxShadow: "var(--shadow-xs)" }}>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 font-display text-[14px] font-bold text-navy">{initials}</span>
              <span className="truncate w-full text-center text-[11px] font-semibold text-fg">{b}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
