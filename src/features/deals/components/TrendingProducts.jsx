'use client'

import { useState } from "react";
import { trending } from "@/data";
import { ProductCard } from "@/features/products/components/ProductCard";

const tabs = ["Trending", "New", "Top Rated", "Bestsellers"];

export function TrendingProducts() {
  const [tab, setTab] = useState(tabs[0]);

  return (
    <section className="pt-4">
      <div className="px-4">
        <h2 className="font-display text-lg font-bold tracking-tight text-fg">Trending across stores</h2>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar px-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              tab === t ? "bg-navy text-white" : "bg-surface text-fg-muted border border-line"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 px-4">
        {trending.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
