'use client'

import { Ticket, Store } from "lucide-react";

export function PromoTiles() {
  return (
    <section className="grid grid-cols-2 gap-3 px-4 pt-3">
      <button className="flex flex-col rounded-lg border border-line bg-surface p-3.5 text-left active:opacity-80" style={{ boxShadow: "var(--shadow-xs)" }}>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-tint">
          <Ticket className="h-5 w-5 text-orange-deep" strokeWidth={1.75} />
        </span>
        <span className="mt-2.5 text-[13px] font-bold text-fg">Extra 15% off</span>
        <span className="text-[12px] text-fg-muted">Code BAZ15 · 1st order</span>
      </button>
      <button className="flex flex-col rounded-lg border border-line bg-surface p-3.5 text-left active:opacity-80" style={{ boxShadow: "var(--shadow-xs)" }}>
        <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: "#EEF2FF" }}>
          <Store className="h-5 w-5" strokeWidth={1.75} style={{ color: "#4F46E5" }} />
        </span>
        <span className="mt-2.5 text-[13px] font-bold text-fg">Store spotlight</span>
        <span className="text-[12px] text-fg-muted">Casa Nordic · 4.9★</span>
      </button>
    </section>
  );
}
