"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";

function pad(n) {
  return n.toString().padStart(2, "0");
}

export function FlashDeals({ products, remainingSeconds }) {
  const [left, setLeft] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (remainingSeconds !== undefined && remainingSeconds !== null) {
      setLeft(Number(remainingSeconds));
    } else {
      setLeft(7 * 3600 + 42 * 60 + 15);
    }
  }, [remainingSeconds]);

  useEffect(() => {
    const t = setInterval(() => setLeft((p) => (p <= 0 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;

  const displayProducts = products && products.length > 0 ? products.slice(0, 6) : [];

  if (!displayProducts || displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-shell px-4 md:px-6 pt-8">
      <div className="overflow-hidden rounded-lg border border-line bg-surface" style={{ boxShadow: "var(--shadow-xs)" }}>
        {/* Deal header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-navy px-4 py-3 md:px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-orange">
              <Zap className="h-4.5 w-4.5 fill-white text-white" strokeWidth={0} />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-white">Flash Deals</h2>
              <p className="text-[12px] text-on-navy-muted">Hot prices, limited stock</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[12.5px] font-medium text-on-navy">Ends in</span>
            <div className="flex items-center gap-1">
              {[h, m, s].map((v, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="grid min-w-[32px] place-items-center rounded-md bg-white/10 px-1.5 py-1 font-display text-base font-bold tabular-nums text-white ring-1 ring-white/15">
                    {pad(v)}
                  </span>
                  {idx < 2 && <span className="font-bold text-orange-ring">:</span>}
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push('/flash-deals')}
              className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-white/10 transition-colors"
            >
              All deals <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Deal cards */}
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {displayProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
