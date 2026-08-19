"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
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
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-navy px-4 py-3.5 md:px-5">
          <div className="flex items-center gap-3">
            {/* Orange Icon */}
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-orange shadow-xs">
              <Zap className="h-5 w-5 fill-white text-white" strokeWidth={0} />
            </div>

            {/* Title & "ENDS IN:" */}
            <div className="flex flex-col justify-center shrink-0">
              <h2 className="text-[16px] font-bold text-white leading-tight">
                Flash Sale
              </h2>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase leading-none mt-1">
                ENDS IN:
              </span>
            </div>

            {/* Timer Display */}
            <div className="flex items-center gap-1.5 ml-2">
              {/* HRS */}
              <div className="flex min-w-[38px] flex-col items-center justify-center rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-black/5">
                <span className="text-[15px] font-black leading-none tabular-nums text-[#FF4500]">
                  {pad(h)}
                </span>
                <span className="text-[9px] font-black tracking-wider uppercase text-slate-900 leading-none mt-0.5">
                  HRS
                </span>
              </div>

              <span className="text-white font-black text-xs select-none">:</span>

              {/* MIN */}
              <div className="flex min-w-[38px] flex-col items-center justify-center rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-black/5">
                <span className="text-[15px] font-black leading-none tabular-nums text-[#FF4500]">
                  {pad(m)}
                </span>
                <span className="text-[9px] font-black tracking-wider uppercase text-slate-900 leading-none mt-0.5">
                  MIN
                </span>
              </div>

              <span className="text-white font-black text-xs select-none">:</span>

              {/* SEC */}
              <div className="flex min-w-[38px] flex-col items-center justify-center rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-black/5">
                <span className="text-[15px] font-black leading-none tabular-nums text-[#FF4500]">
                  {pad(s)}
                </span>
                <span className="text-[9px] font-black tracking-wider uppercase text-slate-900 leading-none mt-0.5">
                  SEC
                </span>
              </div>
            </div>
          </div>

          {/* Right Section: See all */}
          <button
            onClick={() => router.push('/flash-deals')}
            className="text-[14px] font-semibold text-orange hover:underline active:opacity-75 transition-opacity"
          >
            See all
          </button>
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
