"use client";

import { ArrowRight, TrendingUp, Users, Wallet } from "lucide-react";

const stats = [
  { icon: Users, value: "2M+", label: "active shoppers" },
  { icon: TrendingUp, value: "18k", label: "sellers growing" },
  { icon: Wallet, value: "$0", label: "to start selling" },
];

export function SellerCTA() {
  return (
    <section className="mx-auto max-w-shell px-4 md:px-6 pt-8">
      <div className="relative overflow-hidden rounded-lg bg-navy px-6 py-8 md:px-10 md:py-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-orange opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-orange-deep opacity-10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-orange/15 px-3 py-1 text-[11px] font-semibold text-orange-ring ring-1 ring-orange/25">
              Become a seller
            </span>
            <h2 className="mt-3 font-display text-2xl md:text-[30px] font-bold leading-[1.1] tracking-tight text-white">
              Turn your products into<br className="hidden md:block" /> a thriving storefront.
            </h2>
            <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-on-navy">
              Open your store in minutes, reach millions of shoppers, and let Jenideals handle payments, shipping and support — so you can focus on what you make.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="https://jenideals.com/vendor/login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-orange px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-orange-deep transition-colors"
              >
                Start selling <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
                  <Icon className="h-4.5 w-4.5 text-orange-ring" strokeWidth={1.5} />
                  <div className="mt-2.5 font-display text-xl font-bold text-white">{s.value}</div>
                  <div className="text-[11px] text-on-navy-muted leading-tight">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
