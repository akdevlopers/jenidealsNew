'use client';

export const dynamic = 'force-dynamic'

import { useState, useMemo } from "react";
import {
  ChevronRight, X, SlidersHorizontal, LayoutGrid, List, ChevronDown,
  Star, Heart, Plus, BadgeCheck, Truck, Zap, TrendingUp,
} from "lucide-react";
import { Header } from "../../src/components/desktop/Header";
import { Footer } from "../../src/components/desktop/Footer";
import { FilterSidebar, emptyFilters } from "../../src/components/FilterSidebar";
import { catalog, discountOf, priceBounds, priceBrackets } from "../../src/catalogWebCategory";
import { categories } from "../../src/dataWebCategory";
import { useCountry } from "../../src/context/CountryContext";

const sortOptions = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top rated" },
  { id: "discount", label: "Biggest discount" },
  { id: "newest", label: "Newest first" },
];

/* ---- compact list-view row ---- */
function ProductRow({ product }) {
  const Icon = product.icon;
  const { price } = useCountry();
  const off = discountOf(product);
  return (
    <div className="group flex gap-4 rounded-lg border border-line bg-surface p-3 transition-all hover:border-line-strong" style={{ boxShadow: "var(--shadow-xs)" }}>
      <div className="relative grid h-32 w-32 shrink-0 place-items-center overflow-hidden rounded-md" style={{ background: product.tint }}>
        <Icon className="h-14 w-14 transition-transform group-hover:scale-110" strokeWidth={1.25} style={{ color: product.accent }} />
        {off > 0 && <span className="absolute left-2 top-2 rounded-md bg-sale px-1.5 py-0.5 text-[10px] font-bold text-white">-{off}%</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 text-[12px] text-fg-muted">
          <BadgeCheck className="h-3.5 w-3.5 text-success" strokeWidth={2} /> {product.seller}
        </div>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-fg">{product.name}</h3>
        {product.rating > 0 && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-success-tint px-1.5 py-0.5 text-[12px] font-semibold text-success">
              <Star className="h-3 w-3 fill-success" strokeWidth={0} /> {product.rating}
            </span>
            <span className="text-[12px] text-fg-muted">({product.reviews.toLocaleString()})</span>
          </div>
        )}
        <div className="mt-1.5 flex flex-wrap gap-2 text-[11.5px]">
          {product.freeShipping && <span className="inline-flex items-center gap-1 text-success"><Truck className="h-3.5 w-3.5" strokeWidth={2} /> Free shipping</span>}
          {product.express && <span className="inline-flex items-center gap-1 text-orange-deep"><Zap className="h-3.5 w-3.5" strokeWidth={2} /> Express</span>}
          {!product.inStock && <span className="text-sale">Out of stock</span>}
        </div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-fg">{price(product.price)}</span>
            <span className="text-[13px] text-fg-muted line-through">{price(product.mrp)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-line text-fg-muted transition-colors hover:border-sale hover:text-sale"><Heart className="h-4 w-4" strokeWidth={1.75} /></button>
            <button className="flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-orange-deep"><Plus className="h-4 w-4" strokeWidth={2.25} /> Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- grid card ---- */
function ProductGridCard({ product }) {
  const Icon = product.icon;
  const { price } = useCountry();
  const off = discountOf(product);
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-all hover:border-line-strong hover:-translate-y-0.5" style={{ boxShadow: "var(--shadow-xs)" }}>
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: product.tint }}>
        <div className="absolute inset-0 grid place-items-center">
          <Icon className="h-16 w-16 transition-transform group-hover:scale-110" strokeWidth={1.25} style={{ color: product.accent }} />
        </div>
        {off > 0 && <span className="absolute left-2.5 top-2.5 rounded-md bg-sale px-2 py-1 text-[11px] font-bold text-white">-{off}%</span>}
        {product.badge && <span className="absolute right-2.5 top-2.5 rounded-md bg-navy px-2 py-1 text-[11px] font-semibold text-white">{product.badge}</span>}
        {!product.inStock && <div className="absolute inset-0 grid place-items-center bg-white/60"><span className="rounded-full bg-navy px-3 py-1 text-[12px] font-semibold text-white">Out of stock</span></div>}
        <button className="absolute bottom-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-full bg-white text-fg-muted opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:text-sale"><Heart className="h-4 w-4" strokeWidth={1.75} /></button>
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center gap-1 text-[12px] text-fg-muted"><BadgeCheck className="h-3.5 w-3.5 text-success" strokeWidth={2} /><span className="truncate">{product.seller}</span></div>
        <h3 className="mt-1.5 line-clamp-2 min-h-[40px] text-[14px] font-medium leading-snug text-fg">{product.name}</h3>
        {product.rating > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded bg-success-tint px-1.5 py-0.5 text-[12px] font-semibold text-success"><Star className="h-3 w-3 fill-success" strokeWidth={0} />{product.rating}</span>
            <span className="text-[12px] text-fg-muted">({product.reviews.toLocaleString()})</span>
          </div>
        )}
        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-bold text-fg">{price(product.price)}</span>
            <span className="text-[12px] text-fg-muted line-through">{price(product.mrp)}</span>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-white transition-colors hover:bg-orange-deep"><Plus className="h-4 w-4" strokeWidth={2.25} /></button>
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState("recommended");
  const [view, setView] = useState("grid");
  const [mobileFilters, setMobileFilters] = useState(false);

  const results = useMemo(() => {
    let list = catalog.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.brands.length && !filters.brands.includes(p.seller)) return false;
      if (filters.colors.length && !filters.colors.includes(p.color)) return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.priceRanges.length) {
        const inRange = filters.priceRanges.some((id) => {
          const b = priceBrackets.find((x) => x.id === id);
          return b && p.price >= b.min && p.price < b.max;
        });
        if (!inRange) return false;
      }
      if (filters.rating && p.rating < filters.rating) return false;
      if (filters.discounts.length && discountOf(p) < Math.min(...filters.discounts)) return false;
      if (filters.inStock && !p.inStock) return false;
      if (filters.freeShipping && !p.freeShipping) return false;
      if (filters.express && !p.express) return false;
      return true;
    });
    const s = [...list];
    switch (sort) {
      case "price-asc": s.sort((a, b) => a.price - b.price); break;
      case "price-desc": s.sort((a, b) => b.price - a.price); break;
      case "rating": s.sort((a, b) => b.rating - a.rating); break;
      case "discount": s.sort((a, b) => discountOf(b) - discountOf(a)); break;
      case "newest": s.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
      default: s.sort((a, b) => b.soldRecently - a.soldRecently);
    }
    return s;
  }, [filters, sort]);

  const { price } = useCountry();

  // active filter chips
  const chips = [];
  filters.categories.forEach((c) => chips.push({ label: categories.find((x) => x.id === c)?.label || c, clear: () => setFilters({ ...filters, categories: filters.categories.filter((x) => x !== c) }) }));
  filters.brands.forEach((b) => chips.push({ label: b, clear: () => setFilters({ ...filters, brands: filters.brands.filter((x) => x !== b) }) }));
  filters.colors.forEach((c) => chips.push({ label: c, clear: () => setFilters({ ...filters, colors: filters.colors.filter((x) => x !== c) }) }));
  filters.discounts.forEach((d) => chips.push({ label: `${d}%+ off`, clear: () => setFilters({ ...filters, discounts: filters.discounts.filter((x) => x !== d) }) }));
  if (filters.rating) chips.push({ label: `${filters.rating}★ & up`, clear: () => setFilters({ ...filters, rating: 0 }) });
  if (filters.maxPrice < priceBounds.max) chips.push({ label: `Up to ${price(filters.maxPrice)}`, clear: () => setFilters({ ...filters, maxPrice: priceBounds.max }) });
  filters.priceRanges.forEach((id) => {
    const b = priceBrackets.find((x) => x.id === id);
    if (b) chips.push({ label: b.max === Infinity ? `${price(b.min)}+` : `${price(b.min)}-${price(b.max)}`, clear: () => setFilters({ ...filters, priceRanges: filters.priceRanges.filter((x) => x !== id) }) });
  });
  if (filters.inStock) chips.push({ label: "In stock", clear: () => setFilters({ ...filters, inStock: false }) });
  if (filters.freeShipping) chips.push({ label: "Free shipping", clear: () => setFilters({ ...filters, freeShipping: false }) });
  if (filters.express) chips.push({ label: "Express", clear: () => setFilters({ ...filters, express: false }) });

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="mx-auto max-w-shell px-4 py-6 md:px-6">
        {/* breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12.5px] text-fg-muted">
          <a href="/" className="hover:text-orange-deep">Home</a>
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
          <span className="font-medium text-navy">All Products</span>
        </nav>

        {/* title band */}
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-navy">All Products</h1>
            <p className="mt-1 text-[13.5px] text-fg-muted">
              <span className="font-semibold text-navy">{results.length}</span> results from verified sellers across the marketplace
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-orange-tint px-3 py-1.5 text-[12.5px] font-medium text-orange-deep">
            <TrendingUp className="h-4 w-4" strokeWidth={2} /> Prices shown in your region
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[264px_1fr]">
          {/* sidebar — desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-[136px]">
              <div className="max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
                <FilterSidebar filters={filters} setFilters={setFilters} resultCount={results.length} />
                {chips.length > 0 && (
                  <button onClick={() => setFilters(emptyFilters)} className="mt-4 w-full rounded-lg border border-line py-2.5 text-[13px] font-semibold text-fg-muted transition-colors hover:border-sale hover:text-sale">
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* content */}
          <section className="min-w-0">
            {/* toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button onClick={() => setMobileFilters(true)} className="flex items-center gap-2 rounded-lg border border-line-strong px-3.5 py-2 text-[13px] font-semibold text-navy lg:hidden">
                <SlidersHorizontal className="h-4 w-4" strokeWidth={2} /> Filters
                {chips.length > 0 && <span className="rounded-full bg-orange px-1.5 text-[10px] font-bold text-white">{chips.length}</span>}
              </button>

              <div className="hidden text-[13px] text-fg-muted lg:block">
                Showing <span className="font-semibold text-navy">{results.length}</span> of {catalog.length}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <div className="relative">
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 cursor-pointer appearance-none rounded-lg border border-line-strong bg-surface pl-3.5 pr-9 text-[13px] font-semibold text-navy focus:border-orange focus:outline-none">
                    {sortOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" strokeWidth={2.25} />
                </div>
                <div className="flex items-center rounded-lg border border-line-strong p-0.5">
                  <button onClick={() => setView("grid")} className={`grid h-8 w-8 place-items-center rounded-md transition-colors ${view === "grid" ? "bg-navy text-white" : "text-fg-muted hover:text-navy"}`}><LayoutGrid className="h-4 w-4" strokeWidth={2} /></button>
                  <button onClick={() => setView("list")} className={`grid h-8 w-8 place-items-center rounded-md transition-colors ${view === "list" ? "bg-navy text-white" : "text-fg-muted hover:text-navy"}`}><List className="h-4 w-4" strokeWidth={2} /></button>
                </div>
              </div>
            </div>

            {/* active chips */}
            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {chips.map((c, i) => (
                  <button key={i} onClick={c.clear} className="group flex items-center gap-1.5 rounded-full border border-orange bg-orange-tint py-1 pl-3 pr-2 text-[12.5px] font-medium text-orange-deep transition-colors hover:bg-orange hover:text-white">
                    {c.label}
                    <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                ))}
              </div>
            )}

            {/* results */}
            {results.length === 0 ? (
              <div className="mt-16 flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong py-20 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-surface-2"><SlidersHorizontal className="h-6 w-6 text-fg-subtle" strokeWidth={1.75} /></div>
                <h3 className="mt-4 font-display text-lg font-bold text-navy">No products match these filters</h3>
                <p className="mt-1 max-w-sm text-[13.5px] text-fg-muted">Try loosening the price range or clearing a filter or two.</p>
                <button onClick={() => setFilters(emptyFilters)} className="mt-5 rounded-lg bg-navy px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-orange-deep">Clear all filters</button>
              </div>
            ) : view === "grid" ? (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {results.map((p) => <ProductGridCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-3">
                {results.map((p) => <ProductRow key={p.id} product={p} />)}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-navy-deep/50 anim-fade" onClick={() => setMobileFilters(false)} />
          <div className="absolute left-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-surface p-4 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-navy">Filters</h2>
              <button onClick={() => setMobileFilters(false)} className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-fg-muted"><X className="h-5 w-5" strokeWidth={2} /></button>
            </div>
            <FilterSidebar filters={filters} setFilters={setFilters} resultCount={results.length} />
            <div className="sticky bottom-0 mt-4 flex gap-2 bg-surface pt-3">
              <button onClick={() => setFilters(emptyFilters)} className="flex-1 rounded-lg border border-line py-3 text-[13px] font-semibold text-fg-muted">Clear all</button>
              <button onClick={() => setMobileFilters(false)} className="flex-1 rounded-lg bg-navy py-3 text-[13px] font-semibold text-white">Show {results.length} results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
