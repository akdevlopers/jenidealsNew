'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Search, ChevronRight, Package } from "lucide-react";
import { useCountry } from "../../context/CountryContext";
import { getCategoryList, getSubcategoryList } from "../../services/homeService";

export function MenuDrawer({ open, onClose }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { country, isLoading: isCountryLoading } = useCountry();

  // Fetch categories when drawer opens
  useEffect(() => {
    if (open && !isCountryLoading && country) {
      fetchCategories();
    }
  }, [open, country?.id, isCountryLoading]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategoryId && !isCountryLoading && country) {
      fetchSubcategories(selectedCategoryId);
    }
  }, [selectedCategoryId, country?.id, isCountryLoading]);

  const fetchCategories = async () => {
    if (!country) return;
    try {
      setLoading(true);
      const data = await getCategoryList(country.id);
      
      if (data && data.length > 0) {
        setCategories(data);
        setSelectedCategoryId(data[0].id); // Select first category by default
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!country) return;
    try {
      const data = await getSubcategoryList(categoryId, country.id);
      setSubcategories(data || []);
    } catch (error) {
      setSubcategories([]);
    }
  };

  if (!open) return null;

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="anim-drawer fixed inset-0 z-50 flex flex-col bg-bg">
      {/* Top bar - SMALLER */}
      <div className="flex shrink-0 items-center gap-2 bg-navy px-3 py-2.5">
        <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-white active:bg-white/10">
          <X className="h-4.5 w-4.5" strokeWidth={2.25} />
        </button>
        <h2 className="flex-1 font-display text-base font-bold tracking-tight text-white">Shop by Category</h2>
        <button className="grid h-8 w-8 place-items-center rounded-lg text-white active:bg-white/10">
          <Search className="h-4.5 w-4.5" strokeWidth={2} />
        </button>
      </div>

      {/* Two-pane body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left rail - Categories - SMALLER */}
        <div className="w-[75px] shrink-0 overflow-y-auto no-scrollbar bg-surface-2">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange border-t-transparent" />
            </div>
          ) : (
            categories.map((c) => {
              const isActive = c.id === selectedCategoryId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryId(c.id)}
                  className={`relative flex w-full flex-col items-center gap-1 px-1 py-2.5 ${
                    isActive ? "bg-bg" : "active:bg-surface-3"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-orange" />
                  )}
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-lg overflow-hidden ${
                      isActive ? "bg-orange-tint ring-1 ring-orange/30" : "bg-surface"
                    }`}
                  >
                    {c.icon_url ? (
                      <Image 
                        src={c.icon_url} 
                        alt={c.name}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package 
                        className="h-4 w-4" 
                        strokeWidth={1.75} 
                        style={{ color: isActive ? "var(--orange-deep)" : "var(--fg-muted)" }} 
                      />
                    )}
                  </span>
                  <span
                    className={`text-center text-[9.5px] leading-tight line-clamp-2 font-medium ${
                      isActive ? "text-navy" : "text-fg-muted"
                    }`}
                  >
                    {c.name}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Right pane - Subcategories - SMALLER */}
        <div className="flex-1 overflow-y-auto bg-bg p-3">
          {activeCategory && (
            <>
              {/* Category banner - SMALLER */}
              <div className="relative mb-4 h-24 overflow-hidden rounded-lg bg-navy shadow-sm">
                {activeCategory.image_url && (
                  <Image 
                    src={activeCategory.image_url} 
                    alt={activeCategory.name} 
                    fill
                    className="object-cover" 
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.55) 60%, rgba(15,23,42,0.15) 100%)",
                  }}
                />
                <div className="relative flex h-full flex-col justify-center px-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-md bg-white/15 overflow-hidden">
                      {activeCategory.icon_url ? (
                        <Image 
                          src={activeCategory.icon_url} 
                          alt={activeCategory.name}
                          width={28}
                          height={28}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                      )}
                    </span>
                    <h3 className="font-display text-base font-bold tracking-tight text-white">
                      {activeCategory.name}
                    </h3>
                  </div>
                  <p className="mt-0.5 text-[11px] text-on-navy/90">
                    Explore {activeCategory.name} products
                  </p>
                  <button 
                    onClick={() => {
                      router.push(`/categories/${activeCategory.id}`);
                      onClose();
                    }}
                    className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-md bg-orange px-2.5 py-1 text-[11px] font-semibold text-white active:bg-orange-deep shadow-sm"
                  >
                    Shop all <ChevronRight className="h-3 w-3" strokeWidth={2.25} />
                  </button>
                </div>
              </div>

              {/* Subcategories - SMALLER */}
              {subcategories.length > 0 ? (
                <div className="mb-4 space-y-3">
                  {subcategories.map((sub) => {
                    const children = sub.childsubcategory || [];
                    const hasChildren = children.length > 0;
                    
                    const handleNavigate = (subId, childId = '') => {
                      let url = `/products?category=${activeCategory.id}&subcategory=${subId}`;
                      if (childId) {
                        url += `&childcategoryid=${childId}`;
                      }
                      router.push(url);
                      onClose();
                    };
                    
                    return (
                      <div key={sub.id} className="bg-surface rounded-lg p-2.5 border border-line shadow-xs">
                        <h4 className="text-[12px] font-bold text-navy mb-2 flex items-center justify-between">
                          <span className="font-display">{sub.name}</span>
                          {!hasChildren && (
                            <button 
                              onClick={() => handleNavigate(sub.id)}
                              className="text-[10px] font-semibold text-orange-deep"
                            >
                              View All
                            </button>
                          )}
                        </h4>
                        
                        {hasChildren ? (
                          <div className="grid grid-cols-4 gap-2">
                            {children.map((child) => (
                              <button
                                key={child.id}
                                onClick={() => handleNavigate(sub.id, child.id)}
                                className="flex flex-col items-center gap-1 active:opacity-70"
                              >
                                <span className="grid aspect-square w-full place-items-center rounded-md border border-line bg-bg overflow-hidden">
                                  {(child.image_url || child.subcategory_image || child.icon_image) ? (
                                    <Image
                                      src={child.image_url || child.subcategory_image || child.icon_image}
                                      alt={child.name}
                                      width={80}
                                      height={80}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Package className="h-4 w-4 text-fg-muted" strokeWidth={1.5} />
                                  )}
                                </span>
                                <span className="text-center text-[9px] leading-tight text-fg line-clamp-2 font-medium">
                                  {child.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleNavigate(sub.id)}
                            className="flex items-center gap-2 w-full rounded-md bg-bg border border-line p-2 active:bg-surface-2"
                          >
                            <span className="grid h-10 w-10 place-items-center rounded-md bg-surface overflow-hidden shrink-0">
                              {(sub.image_url || sub.subcategory_image || sub.icon_image) ? (
                                <Image
                                  src={sub.image_url || sub.subcategory_image || sub.icon_image}
                                  alt={sub.name}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-fg-muted" strokeWidth={1.5} />
                              )}
                            </span>
                            <span className="text-left text-[11px] leading-tight text-fg font-medium flex-1">
                              {sub.name}
                            </span>
                            <ChevronRight className="h-4 w-4 text-fg-subtle shrink-0" strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package className="h-10 w-10 text-fg-subtle mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-fg-muted">No subcategories available</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
