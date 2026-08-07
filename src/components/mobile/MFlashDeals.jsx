'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, ChevronRight } from "lucide-react";
import { MProductCard } from "./MProductCard";

function pad(n) {
  return n.toString().padStart(2, "0");
}

export function MFlashDeals({ products = [], remainingSeconds }) {
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

  if (!products || products.length === 0) {
    return null;
  }

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;

  // Get category and subcategory from first product for "All" link
  const firstProduct = products[0];

  return (
    <section className="mt-3 bg-navy py-4">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-orange">
            <Zap className="h-4 w-4 fill-white text-white" strokeWidth={0} />
          </span>
          <h2 className="font-display text-lg font-bold tracking-tight text-white">Flash Deals</h2>
          <div className="ml-1 flex items-center gap-1">
            {[h, m, s].map((v, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className="grid min-w-[26px] place-items-center rounded bg-white/10 px-1 py-0.5 text-[12px] font-bold tabular-nums text-white ring-1 ring-white/15">
                  {pad(v)}
                </span>
                {idx < 2 && <span className="text-[12px] font-bold text-orange-ring">:</span>}
              </div>
            ))}
          </div>
        </div>
        <button 
          onClick={() => router.push('/flash-deals')}
          className="flex items-center text-[12px] font-semibold text-orange-ring active:opacity-70"
        >
          All <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar px-4">
        {products.map((p) => (
          <MProductCard key={p.id} product={p} width="w-[144px] shrink-0" />
        ))}
      </div>
    </section>
  );
}
