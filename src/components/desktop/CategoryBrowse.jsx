"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useCountry } from "../../context/CountryContext";

export function CategoryBrowse({ categories }) {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { categories: contextCategories } = useCountry();

  // Prefer contextCategories (same as Header nav bar) or passed categories prop
  const sourceCategories = (contextCategories && contextCategories.length > 0)
    ? contextCategories
    : (categories && categories.length > 0 ? categories : []);

  const displayCategories = sourceCategories.map(c => ({
    id: c.id,
    label: c.name || c.category_name || c.title || c.label,
    count: 'Explore',
    tint: 'var(--surface-2)',
    accent: 'var(--orange)',
    image: c.icon_url || c.icon_image || c.category_image
  }));

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-shell px-4 md:px-6 pt-6 relative group/section">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[15px] font-bold uppercase tracking-wide text-fg">Browse categories</h2>
        <button 
          onClick={() => router.push('/categories')}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-orange-deep hover:gap-2 transition-all"
        >
          All categories <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </div>

      <div className="relative mt-4">
        {/* Scroll Buttons - Desktop Only */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-25 hidden md:grid h-10 w-10 place-items-center rounded-full bg-surface border border-line text-fg shadow-md opacity-0 group-hover/section:opacity-100 transition-all hover:bg-surface-2 active:scale-95"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-25 hidden md:grid h-10 w-10 place-items-center rounded-full bg-surface border border-line text-fg shadow-md opacity-0 group-hover/section:opacity-100 transition-all hover:bg-surface-2 active:scale-95"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pt-2 pb-3 scroll-smooth"
        >
          {displayCategories.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id || c.label}
                onClick={() => c.id && router.push(`/categories/${c.id}`)}
                className="group flex w-[124px] shrink-0 flex-col items-center gap-3 rounded-xl border border-line bg-surface px-3 py-5 transition-all duration-300 hover:border-orange hover:bg-orange-tint/20 hover:shadow-[0_8px_20px_rgba(245,158,11,0.1)] hover:-translate-y-1.5 cursor-pointer"
                style={{ boxShadow: "var(--shadow-xs)" }}
              >
                <span
                  className="relative grid h-16 w-16 place-items-center rounded-full overflow-hidden transition-all duration-300 group-hover:scale-110 border border-line-soft shadow-inner"
                  style={{ background: c.tint }}
                >
                  {c.image ? (
                    <Image src={c.image} alt={c.label} width={64} height={64} className="h-full w-full object-cover" />
                  ) : Icon ? (
                    <Icon className="h-7 w-7" strokeWidth={1.5} style={{ color: c.accent }} />
                  ) : (
                    <Package className="h-7 w-7 text-fg-subtle" strokeWidth={1.5} />
                  )}
                </span>
                <span className="text-center w-full">
                  <span className="block text-[13px] font-bold text-fg leading-tight truncate group-hover:text-orange transition-colors">{c.label}</span>
                  <span className="block text-[11px] text-fg-muted mt-0.5 font-semibold group-hover:text-orange-deep transition-all flex items-center justify-center gap-0.5">
                    <span>Explore</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">&rarr;</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
