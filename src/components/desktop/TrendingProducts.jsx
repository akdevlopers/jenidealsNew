"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";

const tabs = ["Trending", "New Arrivals", "Top Rated", "Best Sellers"];
const INITIAL_DISPLAY_COUNT = 10;

export function TrendingProducts({ allData = {} }) {
  const [tab, setTab] = useState(tabs[0]);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  // Map tab names to API data keys
  const getProductsForTab = () => {
    switch (tab) {
      case "Trending":
        return allData?.most_popular || []; // Using most_popular for Trending
      case "New Arrivals":
        return allData?.new_arrivals || [];
      case "Top Rated":
        return allData?.top_rated || [];
      case "Best Sellers":
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
    setDisplayCount(prev => Math.min(prev + 10, products.length));
  };

  // Reset display count when tab changes
  const handleTabChange = (newTab) => {
    setTab(newTab);
    setDisplayCount(INITIAL_DISPLAY_COUNT);
  };

  return (
    <section className="mx-auto max-w-shell px-4 md:px-6 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-fg">Trending across stores</h2>
          <p className="mt-0.5 text-[13px] text-fg-muted">What shoppers are loving right now</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-surface p-0.5" style={{ boxShadow: "var(--shadow-xs)" }}>
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-semibold transition-colors ${
                tab === t ? "bg-navy text-white" : "text-fg-muted hover:text-fg"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-sm text-fg-muted">No products available in this category</p>
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {displayedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button 
            onClick={handleLoadMore}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-line-strong bg-white px-6 py-2.5 text-[13px] font-semibold text-navy hover:border-navy hover:bg-navy hover:text-white transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            Load more products 
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </section>
  );
}
