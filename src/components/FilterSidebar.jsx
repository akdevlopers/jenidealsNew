'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, Truck, Zap, PackageCheck } from "lucide-react";
import { priceBounds, priceBrackets } from "../catalogWebCategory";
import { useCountry } from "../context/CountryContext";
import { getCategoriesWithSubAndChild } from "../services/homeService";

export const emptyFilters = {
  categories: [],
  subcategories: [],
  selectedCategoryId: null,
  selectedSubcategoryId: null,
  selectedChildCategoryId: null,
  brands: [],
  colors: [],
  maxPrice: priceBounds.max,
  priceRanges: [],
  rating: 0,
  discounts: [],
  inStock: false,
  freeShipping: false,
  express: false,
};

function Section({ title, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-4">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between">
        <span className="flex items-center gap-2 text-[13.5px] font-bold text-navy">
          {title}
          {count ? <span className="rounded-full bg-orange-tint px-1.5 py-0.5 text-[10px] font-bold text-orange-deep">{count}</span> : null}
        </span>
        <ChevronDown className={`h-4 w-4 text-fg-muted transition-transform ${open ? "" : "-rotate-90"}`} strokeWidth={2.25} />
      </button>
      {open && <div className="mt-3.5">{children}</div>}
    </div>
  );
}

function Row({ checked, onClick, children, kind = "check", isActive = false, isSub = false, isChild = false }) {
  return (
    <button 
      onClick={onClick} 
      className={`group flex w-full items-center gap-2.5 py-1.5 text-left ${isSub ? "pl-4" : ""} ${isChild ? "pl-8" : ""}`}
    >
      <span
        className={`grid h-[18px] w-[18px] shrink-0 place-items-center border transition-colors ${
          kind === "radio" ? "rounded-full" : "rounded-[5px]"
        } ${checked ? "border-orange bg-orange" : "border-line-strong bg-surface group-hover:border-fg-subtle"}`}
      >
        {checked && (kind === "radio"
          ? <span className="h-2 w-2 rounded-full bg-white" />
          : <Check className="h-3 w-3 text-white" strokeWidth={3} />)}
      </span>
      <span className={`flex-1 text-[13px] ${isActive ? "text-orange font-semibold" : "text-fg-muted group-hover:text-fg"}`}>
        {children}
      </span>
    </button>
  );
}

export function FilterSidebar({ filters, setFilters, resultCount }) {
  const router = useRouter();
  const { price, country, isLoading: isCountryLoading } = useCountry();
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState([]);

  useEffect(() => {
    if (isCountryLoading || !country) return;
    const fetchCats = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getCategoriesWithSubAndChild(country.id);
        if (data && data.length > 0) {
          setCategoriesList(data);
        }
      } catch (err) {
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCats();
  }, [country?.id, isCountryLoading]);

  // Auto-expand selected category and subcategory
  useEffect(() => {
    if (filters.selectedCategoryId) {
      setExpandedCategories(prev => 
        prev.map(String).includes(String(filters.selectedCategoryId)) ? prev : [...prev, String(filters.selectedCategoryId)]
      );
    }
    if (filters.selectedSubcategoryId) {
      setExpandedSubcategories(prev => 
        prev.map(String).includes(String(filters.selectedSubcategoryId)) ? prev : [...prev, String(filters.selectedSubcategoryId)]
      );
    }
  }, [filters.selectedCategoryId, filters.selectedSubcategoryId]);

  const set = (patch) => {
    setFilters({ ...filters, ...patch });
  };

  const toggleCategoryExpand = (catId) => {
    const sId = String(catId);
    setExpandedCategories(prev => 
      prev.map(String).includes(sId) ? prev.filter(id => String(id) !== sId) : [...prev, sId]
    );
  };

  const toggleSubcategoryExpand = (subId) => {
    const sId = String(subId);
    setExpandedSubcategories(prev => 
      prev.map(String).includes(sId) ? prev.filter(id => String(id) !== sId) : [...prev, sId]
    );
  };

  const handleCategoryClick = (catId) => {
    if (String(filters.selectedCategoryId) === String(catId)) {
      // If clicking same category, deselect it
      set({
        selectedCategoryId: null,
        selectedSubcategoryId: null,
        selectedChildCategoryId: null,
        categories: [],
        subcategories: []
      });
      router.push('/products');
    } else {
      // Select new category ONLY, clear subcategory
      set({
        selectedCategoryId: catId,
        selectedSubcategoryId: null,
        selectedChildCategoryId: null,
        categories: [catId],
        subcategories: []
      });
      router.push(`/products?category=${catId}`);
      if (!expandedCategories.map(String).includes(String(catId))) {
        toggleCategoryExpand(catId);
      }
    }
  };

  const handleSubcategoryClick = (catId, subId, e) => {
    e.stopPropagation(); // Prevent category click
    if (String(filters.selectedSubcategoryId) === String(subId)) {
      // Deselect subcategory, keep category selected
      set({
        selectedSubcategoryId: null,
        selectedChildCategoryId: null,
        subcategories: []
      });
      router.push(`/products?category=${catId}`);
    } else {
      set({
        selectedCategoryId: catId,
        selectedSubcategoryId: subId,
        selectedChildCategoryId: null,
        categories: [catId],
        subcategories: [subId]
      });
      router.push(`/products?category=${catId}&subcategory=${subId}`);
      if (!expandedSubcategories.map(String).includes(String(subId))) {
        toggleSubcategoryExpand(subId);
      }
    }
  };

  const handleChildCategoryClick = (catId, subId, childId, e) => {
    e.stopPropagation();
    if (String(filters.selectedChildCategoryId) === String(childId)) {
      set({
        selectedChildCategoryId: null
      });
      router.push(`/products?category=${catId}&subcategory=${subId}`);
    } else {
      set({
        selectedCategoryId: catId,
        selectedSubcategoryId: subId,
        selectedChildCategoryId: childId
      });
      router.push(`/products?category=${catId}&subcategory=${subId}&childcategoryid=${childId}`);
    }
  };

  return (
    <div className="w-full">
      {/* header */}
      <div className="flex items-center justify-between pb-3">
        <h2 className="font-display text-lg font-bold text-navy">Filters</h2>
        <span className="text-[12px] text-fg-muted">{resultCount} items</span>
      </div>

      {/* Category */}
      <Section title="Category" count={filters.selectedCategoryId ? 1 : undefined}>
        <div className="max-h-52 space-y-0.5 overflow-y-auto pr-1">
          {isCountryLoading || categoriesLoading ? (
            <div className="space-y-2 py-2">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                  <div className="h-[18px] w-[18px] rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            categoriesList.map((cat) => {
              const subs = cat.subcategory || cat.subcategories || cat.sub_categories || [];
              const hasSubs = subs && subs.length > 0;

              return (
                <div key={cat.id}>
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    <Row 
                      checked={String(filters.selectedCategoryId) === String(cat.id) || (cat.name && String(filters.selectedCategoryId).toLowerCase() === String(cat.name).toLowerCase())}
                      onClick={() => {}} // Handled by parent div
                      isActive={String(filters.selectedCategoryId) === String(cat.id) || (cat.name && String(filters.selectedCategoryId).toLowerCase() === String(cat.name).toLowerCase())}
                    >
                      {cat.name}
                    </Row>
                    {hasSubs && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategoryExpand(cat.id);
                        }}
                        className="p-1"
                      >
                        <ChevronDown className={`h-3 w-3 text-fg-muted transition-transform ${expandedCategories.map(String).includes(String(cat.id)) ? "" : "-rotate-90"}`} />
                      </button>
                    )}
                  </div>
                  
                  {/* Subcategories */}
                  {expandedCategories.map(String).includes(String(cat.id)) && hasSubs && (
                    <div className="mt-1">
                      {subs.map((sub) => {
                        const children = sub.child || sub.childsubcategory || sub.child_subcategory || sub.children || [];
                        const hasChildren = children && children.length > 0;

                        return (
                          <div key={sub.id}>
                            <div 
                              className="flex items-center justify-between cursor-pointer"
                              onClick={(e) => handleSubcategoryClick(cat.id, sub.id, e)}
                            >
                              <Row 
                                checked={String(filters.selectedSubcategoryId) === String(sub.id) || (sub.name && String(filters.selectedSubcategoryId).toLowerCase() === String(sub.name).toLowerCase())}
                                onClick={() => {}}
                                isSub
                                isActive={String(filters.selectedSubcategoryId) === String(sub.id) || (sub.name && String(filters.selectedSubcategoryId).toLowerCase() === String(sub.name).toLowerCase())}
                              >
                                {sub.name}
                              </Row>
                              {hasChildren && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSubcategoryExpand(sub.id);
                                  }}
                                  className="p-1"
                                >
                                  <ChevronDown className={`h-3 w-3 text-fg-muted transition-transform ${expandedSubcategories.map(String).includes(String(sub.id)) ? "" : "-rotate-90"}`} />
                                </button>
                              )}
                            </div>
                            
                            {/* Child Categories */}
                            {expandedSubcategories.map(String).includes(String(sub.id)) && hasChildren && (
                              <div className="mt-1">
                                {children.map((child) => (
                                  <Row 
                                    key={child.id}
                                    checked={String(filters.selectedChildCategoryId) === String(child.id)}
                                    onClick={(e) => handleChildCategoryClick(cat.id, sub.id, child.id, e)}
                                    isChild
                                    isActive={String(filters.selectedChildCategoryId) === String(child.id)}
                                  >
                                    {child.name}
                                  </Row>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Section>

      {/* Price */}
      <Section title="Price range">
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={10}
          value={filters.maxPrice}
          onChange={(e) => set({ maxPrice: Number(e.target.value) })}
          className="range-orange w-full"
        />
        <div className="mt-2 flex items-center justify-between text-[12.5px]">
          <span className="text-fg-muted">{price(priceBounds.min)}</span>
          <span className="font-semibold text-navy">Up to {price(filters.maxPrice)}</span>
        </div>
        {/* discrete range checkboxes */}
        <div className="mt-4 space-y-0.5 border-t border-line pt-3">
          <div className="mb-1 text-[11.5px] font-semibold uppercase tracking-wide text-fg-subtle">Or pick a range</div>
          {priceBrackets.map((b) => {
            const label = b.max === Infinity ? `${price(b.min)} & above` : `${price(b.min)} – ${price(b.max)}`;
            return (
              <Row key={b.id} checked={filters.priceRanges.includes(b.id)} onClick={() => set({ priceRanges: filters.priceRanges.includes(b.id) ? filters.priceRanges.filter(id => id !== b.id) : [...filters.priceRanges, b.id] })}>
                {label}
              </Row>
            );
          })}
        </div>
      </Section>

      {/* Availability & shipping */}
      <Section title="Availability & delivery">
        <div className="space-y-0.5">
          <Row checked={filters.inStock} onClick={() => set({ inStock: !filters.inStock })}>
            <span className="flex items-center gap-1.5"><PackageCheck className="h-4 w-4 text-fg-subtle" strokeWidth={1.75} /> In stock only</span>
          </Row>
          <Row checked={filters.freeShipping} onClick={() => set({ freeShipping: !filters.freeShipping })}>
            <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-fg-subtle" strokeWidth={1.75} /> Free shipping</span>
          </Row>
          <Row checked={filters.express} onClick={() => set({ express: !filters.express })}>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-fg-subtle" strokeWidth={1.75} /> Express delivery</span>
          </Row>
        </div>
      </Section>
    </div>
  );
}
