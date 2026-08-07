'use client'

import { ArrowRight, Store } from "lucide-react";

export function MSellerCTA() {
  return (
    <section className="px-4 pt-5">
      <div className="relative overflow-hidden rounded-lg bg-navy p-5">
        <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-orange opacity-20 blur-2xl" />
        <div className="relative">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-orange">
            <Store className="h-5 w-5 text-white" strokeWidth={2} />
          </span>
          <h2 className="mt-3 font-display text-xl font-bold leading-tight tracking-tight text-white">
            Sell on Jenideals
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-on-navy">
            Open your store in minutes and reach 2M+ shoppers. $0 to start.
          </p>
          <a
            href="https://jenideals.com/vendor/login"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-orange px-5 py-2.5 text-[14px] font-semibold text-white active:bg-orange-deep"
          >
            Start selling <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
          </a>
        </div>
      </div>
    </section>
  );
}
