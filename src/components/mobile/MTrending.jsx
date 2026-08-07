'use client'

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MProductCard } from "./MProductCard";

const tabs = ["Trending", "New", "Top Rated", "Bestsellers"];
const INITIAL_DISPLAY_COUNT = 8;

export function MTrending({ allData = {} }) {
  const [tab, setTab] = useState(tabs[0]);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  // Map tab names to API data keys
  const getProductsForTab = () => {
    switch (tab) {
      case "Trending":
        return allData?.most_popular || []; // Using most_popular for Trending
      case "New":
        return allData?.new_arrivals || [];
      case "Top Rated":
        return allData?.top_rated || [];
      case "Bestsellers":
        return allData?.best_sellers || [];
      default:
        return [];
    }
  };

  const products = getProductsForTab();

  // Check if ANY tab has products - show section if at least one does
  const hasAnyProducts = 
    (allData?.most_popular?.length > 0) ||
    (allData?.new_arrivals?.length > 0) ||
    (allData?.top_rated?.length > 0) ||
    (allData?.best_sellers?.length > 0);

  // Don't render if no data at all
  if (!allData || !hasAnyProducts) {
    return null;
  }

  const displayedProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 8, products.length));
  };

  // Reset display count when tab changes
  const handleTabChange = (newTab) => {
    setTab(newTab);
    setDisplayCount(INITIAL_DISPLAY_COUNT);
  };

  return (
    <section className="pt-4">
      <div className="px-4">
        <h2 className="font-display text-lg font-bold tracking-tight text-fg">Trending across stores</h2>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar px-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              tab === t ? "bg-navy text-white" : "bg-surface text-fg-muted border border-line"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-6 px-4 text-center">
          <p className="text-sm text-fg-muted">No products available in this category</p>
        </div>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3 px-4">
            {displayedProducts.map((p) => (
              <MProductCard key={p.id} product={p} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-4 px-4">
              <button
                onClick={handleLoadMore}
                className="w-full flex items-center justify-center gap-2 rounded-full border border-line bg-white px-4 py-3 text-sm font-semibold text-navy shadow-sm active:scale-[0.98] transition-transform"
              >
                Load more products
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
