"use client";

import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";

const items = [
  { icon: Truck, title: "Free & fast delivery", sub: "On orders over $50, nationwide" },
  { icon: ShieldCheck, title: "Secure payments", sub: "256-bit encryption, buyer protection" },
  { icon: RotateCcw, title: "Easy 30-day returns", sub: "Hassle-free refunds on every order" },
  { icon: Headset, title: "24/7 support", sub: "Real people, whenever you need them" },
];

export function TrustStrip() {
  return (
    <section className="mx-auto max-w-shell px-4 md:px-6 pt-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div
              key={it.title}
              className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3"
              style={{ boxShadow: "var(--shadow-xs)" }}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange-tint">
                <Icon className="h-4.5 w-4.5 text-orange-deep" strokeWidth={1.5} />
              </span>
              <div>
                <div className="text-[13px] font-semibold text-fg leading-tight">{it.title}</div>
                <div className="mt-0.5 text-[11.5px] text-fg-muted leading-tight">{it.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
