'use client';

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Package, ChevronRight, X, SlidersHorizontal, LayoutGrid, List, ChevronDown, Star, Heart, Plus, Check, BadgeCheck, Truck, Zap, TrendingUp, Search } from 'lucide-react';
import { MobileHeader } from '../../src/components/mobile/MobileHeader';
import { MenuDrawer } from '../../src/components/mobile/MenuDrawer';
import { BottomNav } from '../../src/components/mobile/BottomNav';
import { Header } from '../../src/components/desktop/Header';
import { Footer } from '../../src/components/desktop/Footer';
import { FilterSidebar, emptyFilters } from '../../src/components/FilterSidebar';
import { catalog, discountOf, priceBounds, priceBrackets } from '../../src/catalogWebCategory';
import { categories as browseCategories } from '../../src/dataWebCategory';
import { useCountry } from '../../src/context/CountryContext'
import { useWishlist } from '../../src/context/WishlistContext'
import { useCart } from '../../src/context/CartContext'
import { getCategoryList, getSubcategoryList, getAllProducts } from '../../src/services/homeService';
import { ProductCard } from '../../src/components/desktop/ProductCard';

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
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const name = product.product_name || product.name || "";
  const mrpVal = parseFloat(product.orginal_rate || product.mrp || 0);
  const priceVal = parseFloat(product.offer_price || product.price || 0);
  const ratingVal = product.rating || product.average_rating || 0;
  const reviewsCount = product.reviews || product.review_count || 0;
  const sellerName = product.brand || product.seller || "Jeni Deals";
  const imgUrl = product.product_img_url || product.product_img;
  const isLiked = isInWishlist(product.id);

  const off = mrpVal > priceVal ? Math.round(((mrpVal - priceVal) / mrpVal) * 100) : 0;

  return (
    <div
      onClick={() => router.push(`/product/${product.id}`)}
      className="group flex gap-3 rounded-lg border border-line bg-surface p-2.5 transition-all hover:border-line-strong hover:shadow-sm cursor-pointer"
      style={{ boxShadow: "var(--shadow-xs)" }}
    >
      <div className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-md bg-[#FAFAFA]" style={{ background: product.tint }}>
        {imgUrl ? (
          <img src={imgUrl} alt={name} className="h-full w-full object-contain transition-transform group-hover:scale-105 p-1.5" />
        ) : Icon ? (
          <Icon className="h-12 w-12 transition-transform group-hover:scale-110" strokeWidth={1.25} style={{ color: product.accent }} />
        ) : (
          <Package className="h-8 w-8 text-fg-subtle" strokeWidth={1.25} />
        )}
        {off > 0 && <span className="absolute left-1.5 top-1.5 rounded bg-sale px-1 py-0.5 text-[9px] font-bold text-white">-{off}%</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5 text-[11px] text-fg-muted">
          <BadgeCheck className="h-3 w-3 text-success" strokeWidth={2} /> {sellerName}
        </div>
        <h3 className="mt-0.5 line-clamp-2 text-[13.5px] font-semibold leading-snug text-fg">{name}</h3>
        {ratingVal > 0 && (
          <div className="mt-1 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 rounded bg-success-tint px-1 py-0.5 text-[11px] font-semibold text-success">
              <Star className="h-2.5 w-2.5 fill-success" strokeWidth={0} /> {ratingVal.toFixed(1)}
            </span>
            <span className="text-[11px] text-fg-muted">({reviewsCount.toLocaleString()})</span>
          </div>
        )}
        <div className="mt-1 flex flex-wrap gap-1.5 text-[10px]">
          {product.freeShipping && <span className="inline-flex items-center gap-0.5 text-success"><Truck className="h-3 w-3" strokeWidth={2} /> Free ship</span>}
          {product.express && <span className="inline-flex items-center gap-0.5 text-orange-deep"><Zap className="h-3 w-3" strokeWidth={2} /> Express</span>}
        </div>
        <div className="mt-auto flex items-end justify-between pt-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-base font-bold text-fg">{price(priceVal)}</span>
            {mrpVal > priceVal && (
              <span className="text-[11px] text-fg-muted line-through">{price(mrpVal)}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => toggleWishlist(product)}
              className="grid h-7 w-7 place-items-center rounded-lg border border-line text-fg-muted transition-colors hover:border-sale hover:text-sale"
            >
              <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-sale text-sale" : ""}`} strokeWidth={isLiked ? 2 : 1.75} />
            </button>
            <button
              onClick={() => {
                if (isInCart(product.id)) {
                  router.push('/cart');
                } else {
                  addToCart(product, 1);
                }
              }}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold text-white transition-colors whitespace-nowrap ${
                isInCart(product.id)
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-navy hover:bg-orange-deep'
              }`}
            >
              {isInCart(product.id) ? (
                <>
                  <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                  <span className="whitespace-nowrap">Added</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                  <span className="whitespace-nowrap">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubcategorySkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-32 rounded-xl bg-gray-200/80 w-full" />
      {/* Cards Skeletons */}
      {[1, 2].map((i) => (
        <div key={i} className="p-1 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-4 pt-2">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="flex flex-col items-center space-y-2.5">
                <div className="h-16 w-16 rounded-xl bg-gray-200/80" />
                <div className="h-3 bg-gray-200 rounded w-12" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopCategoriesUI() {
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoriesCache, setSubcategoriesCache] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { country, categories, categoriesLoading } = useCountry();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Reset cache when country changes
  useEffect(() => {
    setSubcategoriesCache({});
    setSubcategories([]);
  }, [country?.id]);

  // Set selected category when categories load or categoryParam changes
  useEffect(() => {
    if (categories.length > 0) {
      const initialCategoryId = categoryParam 
        ? categories.find(c => String(c.id) === String(categoryParam))?.id || categories[0].id
        : categories[0].id;
      setSelectedCategoryId(initialCategoryId);
    }
  }, [categories, categoryParam]);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcats = async () => {
      if (!selectedCategoryId || !country) return; // Only fetch if country is set

      // Use cache if available for instant load
      if (subcategoriesCache[selectedCategoryId]) {
        setSubcategories(subcategoriesCache[selectedCategoryId]);
        return;
      }

      try {
        setLoading(true);
        const data = await getSubcategoryList(selectedCategoryId, country.id);
        const list = data || [];
        setSubcategories(list);
        setSubcategoriesCache(prev => ({ ...prev, [selectedCategoryId]: list }));
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchSubcats();
  }, [selectedCategoryId, country?.id, subcategoriesCache]);

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  // Filter subcategories locally in real-time
  const filteredSubcategories = useMemo(() => {
    if (!searchQuery.trim()) return subcategories;
    const query = searchQuery.toLowerCase().trim();
    return subcategories.map(sub => {
      const subMatch = sub.name.toLowerCase().includes(query);
      const matchedChildren = (sub.childsubcategory || []).filter(child =>
        child.name.toLowerCase().includes(query)
      );
      if (subMatch || matchedChildren.length > 0) {
        return {
          ...sub,
          childsubcategory: matchedChildren
        };
      }
      return null;
    }).filter(Boolean);
  }, [subcategories, searchQuery]);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />

      <main className="mx-auto max-w-shell w-full px-4 md:px-6 pt-3 pb-8 flex-1">
        {/* breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] text-fg-muted mb-2">
          <Link href="/" className="hover:text-orange transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
          <span className="font-semibold text-navy">Categories</span>
        </nav>

        {/* page title header */}
        <div className="mb-3 pb-1.5 border-b border-line/60 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-navy">Shop by Category</h1>
            <p className="mt-0.5 text-[12.5px] text-fg-muted">
              Select a department on the left to explore its subcategories.
            </p>
          </div>
          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subcategories..."
              className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-line bg-white text-xs font-semibold focus:border-orange focus:ring-2 focus:ring-orange/10 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 grid place-items-center text-fg-muted hover:text-fg rounded-full hover:bg-gray-100"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6 items-start">
          {/* Left Rail: Categories List */}
          <aside className="w-[260px] shrink-0 sticky top-[116px] max-h-[calc(100vh-148px)] flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-line/40">
            <div className="px-4 py-3.5 bg-gradient-to-br from-orange/5 to-orange/[0.02] border-b border-line/40 shrink-0">
              <h2 className="font-display text-[11px] font-extrabold text-navy uppercase tracking-[0.08em] flex items-center gap-2">
                <LayoutGrid className="h-3.5 w-3.5 text-orange" strokeWidth={2.5} />
                All Departments
              </h2>
              <p className="text-[10.5px] text-fg-muted mt-0.5 font-medium">Browse by category</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
              {categories.map((c) => {
                const isActive = c.id === selectedCategoryId;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCategoryId(c.id);
                      setSearchQuery(''); // Reset search when switching categories
                    }}
                    className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-orange/10 to-orange/5 shadow-sm"
                        : "hover:bg-surface-2/60"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-gradient-to-b from-orange to-orange-deep shadow-md" />
                    )}
                    <span
                      className={`relative grid h-9 w-9 place-items-center rounded-xl overflow-hidden shrink-0 transition-all duration-200 ${
                        isActive
                          ? "bg-white shadow-md border-2 border-orange/30 scale-105"
                          : "bg-surface border border-line/60 group-hover:border-orange/20 group-hover:scale-[1.02]"
                      }`}
                    >
                      {c.icon_url || c.icon_image ? (
                        <img
                          src={c.icon_url || c.icon_image}
                          alt={c.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package
                          className={`h-4.5 w-4.5 transition-colors ${
                            isActive ? "text-orange" : "text-fg-subtle group-hover:text-orange"
                          }`}
                          strokeWidth={1.75}
                        />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-transparent pointer-events-none" />
                      )}
                    </span>
                    <span
                      className={`text-[12.5px] font-semibold leading-tight text-left line-clamp-2 flex-1 transition-colors ${
                        isActive ? "text-orange-deep" : "text-fg group-hover:text-navy"
                      }`}
                    >
                      {c.name}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 transition-all duration-200 ${
                        isActive
                          ? "translate-x-0 opacity-100 text-orange-deep"
                          : "opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0"
                      }`}
                      strokeWidth={2.5}
                    />
                  </button>
                );
              })}
            </div>
            {/* Optional: Category count footer */}
            <div className="px-4 py-2.5 bg-surface/30 border-t border-line/40 shrink-0">
              <p className="text-[10px] text-fg-muted font-medium text-center">
                {categories.length} {categories.length === 1 ? 'Category' : 'Categories'} Available
              </p>
            </div>
          </aside>

          {/* Right Rail: Category Header and Subcategory Cards */}
          <section className="flex-1 min-w-0">
            {loading && subcategories.length === 0 ? (
              <SubcategorySkeleton />
            ) : activeCategory ? (
              <div className="space-y-4">
                {/* Category Banner */}
                <div className="relative h-28 overflow-hidden rounded-xl bg-[#A9AEB6] flex items-center justify-between px-8 py-4 shadow-sm">
                  <div className="flex flex-col justify-center">
                    <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                      {activeCategory.name}
                    </h1>
                    <Link
                      href={`/products?category=${activeCategory.id}`}
                      className="mt-3 inline-flex w-fit items-center gap-1 rounded-lg bg-[#F97316] hover:bg-orange-deep px-4 py-1.5 text-[12px] font-bold text-white transition-all shadow-md shadow-orange/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      Shop all <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.25} />
                    </Link>
                  </div>

                  <div className="relative h-20 w-20 shrink-0 rounded-full bg-white/25 flex items-center justify-center p-2 border border-white/10 shadow-inner">
                    {(activeCategory.icon_url || activeCategory.icon_image) ? (
                      <img
                        src={activeCategory.icon_url || activeCategory.icon_image}
                        alt={activeCategory.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Package className="h-10 w-10 text-white" strokeWidth={1.5} />
                    )}
                  </div>
                </div>

                {/* Subcategories Grid */}
                {filteredSubcategories.length > 0 ? (
                  <div className="space-y-4">
                    {filteredSubcategories.map((sub) => {
                      const children = sub.childsubcategory || [];
                      const hasChildren = children.length > 0;

                      return (
                        <div key={sub.id} className="p-1">
                          <div className="flex items-center justify-between border-b border-line pb-1.5 mb-3">
                            <h3 className="font-display text-[13px] font-bold text-navy">
                              {sub.name}
                            </h3>
                          </div>

                          {hasChildren ? (
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-4">
                              {children.map((child) => (
                                <button
                                  key={child.id}
                                  onClick={() => router.push(`/products?category=${activeCategory.id}&subcategory=${sub.id}&childcategoryid=${child.id}`)}
                                  className="group flex flex-col items-center text-center cursor-pointer select-none"
                                >
                                  <div className="h-16 w-16 rounded-xl bg-[#F8F9FA] border border-line-soft overflow-hidden flex items-center justify-center p-1.5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-xs group-hover:border-orange/20">
                                    {(child.image_url || child.subcategory_image || child.icon_image) ? (
                                      <img
                                        src={child.image_url || child.subcategory_image || child.icon_image}
                                        alt={child.name}
                                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                      />
                                    ) : (
                                      <Package className="h-6 w-6 text-fg-subtle opacity-65" strokeWidth={1.5} />
                                    )}
                                  </div>
                                  <span className="mt-2 text-[11px] font-medium text-fg-muted group-hover:text-orange-deep leading-tight transition-colors line-clamp-2 px-0.5">
                                    {child.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-4">
                              <button
                                onClick={() => router.push(`/products?category=${activeCategory.id}&subcategory=${sub.id}`)}
                                className="group flex flex-col items-center text-center cursor-pointer select-none"
                              >
                                <div className="h-16 w-16 rounded-xl bg-[#F8F9FA] border border-line-soft overflow-hidden flex items-center justify-center p-1.5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-xs group-hover:border-orange/20">
                                  {(sub.image_url || sub.subcategory_image || sub.icon_image) ? (
                                    <img
                                      src={sub.image_url || sub.subcategory_image || sub.icon_image}
                                      alt={sub.name}
                                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                  ) : (
                                    <Package className="h-6 w-6 text-fg-subtle opacity-65" strokeWidth={1.5} />
                                  )}
                                </div>
                                <span className="mt-2 text-[11px] font-medium text-fg-muted group-hover:text-orange-deep leading-tight transition-colors line-clamp-2 px-0.5">
                                  {sub.name}
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : subcategories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Package className="h-10 w-10 text-fg-subtle mb-2.5" strokeWidth={1.5} />
                    <h3 className="font-display text-sm font-bold text-navy">No Subcategories</h3>
                    <p className="text-xs text-fg-muted mt-0.5 font-medium">There are no subcategories listed under this section.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Search className="h-10 w-10 text-fg-subtle mb-2.5" strokeWidth={1.5} />
                    <h3 className="font-display text-sm font-bold text-navy">No Matching Subcategories</h3>
                    <p className="text-xs text-fg-muted mt-0.5 font-medium">We couldn&apos;t find any subcategories matching &quot;{searchQuery}&quot;.</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-3 text-xs font-bold text-orange hover:text-orange-deep cursor-pointer"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function MobileCategoriesUI() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { country, categories, categoriesLoading } = useCountry();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Set selected category when categories load or categoryParam changes
  useEffect(() => {
    if (categories.length > 0) {
      const paramStr = categoryParam ? String(categoryParam).toLowerCase().trim() : '';
      const matched = paramStr
        ? categories.find(c => 
            String(c.id) === paramStr || 
            (c.name && c.name.toLowerCase() === paramStr) ||
            (c.name && c.name.toLowerCase().includes(paramStr))
          )
        : null;
      
      const initialCategoryId = matched ? matched.id : categories[0].id;
      setSelectedCategoryId(initialCategoryId);
    }
  }, [categories, categoryParam]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategoryId && country) { // Only fetch if country is set
      fetchSubcategories(selectedCategoryId);
    }
  }, [selectedCategoryId, country?.id]);

  const fetchSubcategories = async (categoryId) => {
    if (!country) return; // Only fetch if country is set
    try {
      setLoading(true);
      setSubcategories([]); // Clear old subcategories while loading new ones

      const data = await getSubcategoryList(categoryId, country.id);
      if (data && data.length > 0) {
        setSubcategories(data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      {/* Top bar - same as MenuDrawer */}
      <div className="flex shrink-0 items-center gap-2 bg-navy px-3 py-3">
        <button
          onClick={() => router.back()}
          className="grid h-9 w-9 place-items-center rounded-lg text-white active:bg-white/10"
        >
          <X className="h-5 w-5" strokeWidth={2.25} />
        </button>
        <h2 className="flex-1 font-display text-lg font-bold tracking-tight text-white">Shop by Category</h2>
      </div>

      {/* Two-pane body - same as MenuDrawer */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left rail - Categories */}
        <div className="w-[88px] shrink-0 overflow-y-auto no-scrollbar bg-surface-2">
          {categories.map((c) => {
            const isActive = c.id === selectedCategoryId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryId(c.id)}
                className={`relative flex w-full flex-col items-center gap-1.5 px-1 py-3.5 ${isActive ? "bg-bg" : "active:bg-surface-3"}`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-orange" />
                )}
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl overflow-hidden ${isActive ? "bg-orange-tint" : "bg-surface"}`}
                >
                  {c.icon_url || c.icon_image ? (
                    <img
                      src={c.icon_url || c.icon_image}
                      alt={c.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package
                      className="h-5 w-5"
                      strokeWidth={1.75}
                      style={{ color: isActive ? "var(--orange-deep)" : "var(--fg-muted)" }}
                    />
                  )}
                </span>
                <span
                  className={`text-center text-[10.5px] leading-tight line-clamp-2 ${isActive ? "font-semibold text-navy" : "text-fg-muted"}`}
                >
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right pane - Subcategories */}
        <div className="flex-1 overflow-y-auto bg-bg p-4">
          {activeCategory && (
            <>
              {/* Category banner */}
              <div className="relative mb-5 h-24 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 shadow-md">
                <div className="relative flex h-full items-center justify-between px-5 py-3">
                  {/* Left side - Text and Button stacked */}
                  <div className="flex flex-col justify-center z-10">
                    <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-white drop-shadow-sm">
                      {activeCategory.name}
                    </h3>
                    <Link
                      href={`/products?category=${activeCategory.id}`}
                      className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-orange px-4 py-2 text-[12.5px] font-bold text-white shadow-lg active:bg-orange-deep transition-all whitespace-nowrap"
                    >
                      Shop all <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </Link>
                  </div>

                  {/* Right side - Icon/Image */}
                  <div className="relative h-20 w-20 shrink-0 z-10 flex items-center justify-center">
                    {(activeCategory.icon_url || activeCategory.icon_image) ? (
                      <img
                        src={activeCategory.icon_url || activeCategory.icon_image}
                        alt={activeCategory.name}
                        className="h-full w-full object-contain drop-shadow-lg"
                      />
                    ) : (
                      <Package className="h-14 w-14 text-white/90 drop-shadow-lg" strokeWidth={1.5} />
                    )}
                  </div>
                </div>
              </div>

              {/* Subcategories */}
              {subcategories.length > 0 ? (
                <div className="mb-5 space-y-6">
                  {subcategories.map((sub) => {
                    const children = sub.childsubcategory || [];
                    const hasChildren = children.length > 0;

                    return (
                      <div key={sub.id} className="mb-5">
                        <h4 className="text-[13px] font-bold text-navy mb-3 flex items-center justify-between px-1">
                          <span className="font-display">{sub.name}</span>
                          <button
                            onClick={() => router.push(`/products?category=${activeCategory.id}&subcategory=${sub.id}`)}
                            className="text-[11px] font-semibold text-orange-deep"
                          >
                            View All
                          </button>
                        </h4>

                        {hasChildren ? (
                          <div className="grid grid-cols-3 gap-3">
                            {children.map((child) => (
                              <button
                                key={child.id}
                                onClick={() => router.push(`/products?category=${activeCategory.id}&subcategory=${sub.id}&childcategoryid=${child.id}`)}
                                className="flex flex-col items-center gap-1.5 active:opacity-70"
                              >
                                <span className="grid aspect-square w-full place-items-center rounded-lg border border-line bg-white overflow-hidden">
                                  {(child.image_url || child.subcategory_image || child.icon_image) ? (
                                    <img
                                      src={child.image_url || child.subcategory_image || child.icon_image}
                                      alt={child.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Package className="h-5 w-5 text-fg-muted" strokeWidth={1.5} />
                                  )}
                                </span>
                                <span className="text-center text-[10.5px] leading-tight text-fg line-clamp-2">
                                  {child.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              onClick={() => router.push(`/products?category=${activeCategory.id}&subcategory=${sub.id}`)}
                              className="flex flex-col items-center gap-1.5 active:opacity-70"
                            >
                              <span className="grid aspect-square w-full place-items-center rounded-lg border border-line bg-white overflow-hidden">
                                {(sub.image_url || sub.subcategory_image || sub.icon_image) ? (
                                  <img
                                    src={sub.image_url || sub.subcategory_image || sub.icon_image}
                                    alt={sub.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Package className="h-5 w-5 text-fg-muted" strokeWidth={1.5} />
                                )}
                              </span>
                              <span className="text-center text-[10.5px] leading-tight text-fg line-clamp-2">
                                {sub.name}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package className="h-12 w-12 text-fg-subtle mb-2" strokeWidth={1.5} />
                  <p className="text-sm text-fg-muted">No subcategories available</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default function CategoriesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const { isLoading: isCountryLoading } = useCountry();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isCountryLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange border-t-transparent" />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange border-t-transparent" />
      </div>
    }>
      {isMobile ? <MobileCategoriesUI /> : <DesktopCategoriesUI />}
    </Suspense>
  );
}
