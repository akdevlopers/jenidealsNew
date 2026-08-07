"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, ChevronRight, Store, Tag, Package } from "lucide-react";
import { useCountry } from "../../context/CountryContext";
import { getCategoriesWithSubAndChild } from "../../services/homeService";

export function BrowseAllMenu({
  activeId,
  setActiveId,
  onClose,
  categories = []
}) {
  const router = useRouter();
  const { country } = useCountry();
  const [extraSubMap, setExtraSubMap] = useState({});
  const [loading, setLoading] = useState(false);

  // If subcategories are not embedded in categories prop, fetch all in 1 SINGLE API call
  useEffect(() => {
    if (!country) return;

    // Check if subcategories are already provided inside categories prop
    const hasSubsInProps = categories.some(
      c => (c.subcategory && c.subcategory.length > 0) ||
           (c.subcategories && c.subcategories.length > 0) ||
           (c.sub_categories && c.sub_categories.length > 0)
    );

    if (hasSubsInProps) return; // All data already in memory, 0 API calls needed!

    const fetchAllSubcategoriesOnce = async () => {
      try {
        setLoading(true);
        const allData = await getCategoriesWithSubAndChild(country.id);
        const map = {};
        if (Array.isArray(allData)) {
          allData.forEach(c => {
            map[String(c.id)] = c.subcategory || c.subcategories || c.sub_categories || [];
          });
        }
        setExtraSubMap(map);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchAllSubcategoriesOnce();
  }, [country?.id, categories]);

  // Only use API categories
  const items = categories;
  
  // Find subcategories for active category from props or single-fetched map (ZERO API calls on hover)
  const activeCatFromProps = categories.find(c => String(c.id) === String(activeId));
  const subsFromProps = activeCatFromProps?.subcategory || activeCatFromProps?.subcategories || activeCatFromProps?.sub_categories || [];
  const allSubcategories = subsFromProps.length > 0 ? subsFromProps : (extraSubMap[String(activeId)] || []);

  // Build columns logic:
  // 1) Find subcategories that HAVE Level 3 child subcategories
  // 2) Collect subcategories that DO NOT HAVE Level 3 child subcategories
  const columnsWithChildren = [];
  const subcategoriesWithoutChildren = [];

  allSubcategories.forEach(sub => {
    const childrenFromParent = allSubcategories.filter(s => s.parent_id && String(s.parent_id) === String(sub.id));
    const nestedChildren = sub.childsubcategory || sub.child_subcategory || sub.child || sub.children || sub.subcategories || sub.subcategory || [];
    const combinedChildren = (Array.isArray(nestedChildren) && nestedChildren.length > 0) ? nestedChildren : childrenFromParent;

    if (combinedChildren && combinedChildren.length > 0) {
      columnsWithChildren.push({
        id: sub.id,
        title: sub.name,
        links: combinedChildren.map(child => ({
          id: child.id,
          name: child.name,
          subId: sub.id,
          childId: child.id
        }))
      });
    } else if (!sub.parent_id || Number(sub.parent_id) === 0) {
      subcategoriesWithoutChildren.push(sub);
    }
  });

  const displayColumns = [...columnsWithChildren];

  // If there are top-level subcategories without Level 3 children
  if (subcategoriesWithoutChildren.length > 0) {
    const activeCatObj = categories.find(c => String(c.id) === String(activeId));
    const catName = activeCatObj?.name || activeCatObj?.label || 'Subcategories';
    
    // Chunk items if more than 6 items to balance across 3 grid columns cleanly
    const chunkSize = Math.max(6, Math.ceil(subcategoriesWithoutChildren.length / 3));
    for (let i = 0; i < subcategoriesWithoutChildren.length; i += chunkSize) {
      const chunk = subcategoriesWithoutChildren.slice(i, i + chunkSize);
      const colIndex = Math.floor(i / chunkSize) + 1;
      displayColumns.push({
        id: `all-subs-${activeId}-${colIndex}`,
        title: colIndex === 1 ? catName : `${catName}`,
        isCategoryHeader: true,
        links: chunk.map(sub => ({
          id: sub.id,
          name: sub.name,
          subId: sub.id
        }))
      });
    }
  }

  if (!categories || categories.length === 0) return null;

  return (
    <div className="anim-mega absolute left-0 right-0 top-full z-40 pt-3 pointer-events-none">
      <div
        className="mx-auto max-w-shell overflow-hidden rounded-xl border border-line bg-surface pointer-events-auto"
        style={{ boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-[248px_1fr]">
          {/* Left rail — all categories */}
          <div className="border-r border-line bg-surface-2 py-2 max-h-[480px] overflow-y-auto no-scrollbar">
            {items.map((c) => {
              const label = c.name || c.label;
              const cid = c.id;
              const on = cid === activeId;
              
              return (
                <button
                  key={cid}
                  onMouseEnter={() => setActiveId(cid)}
                  onClick={() => {
                    onClose();
                    router.push(`/categories/${cid}`);
                  }}
                  className={`group relative flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    on ? "bg-surface" : "hover:bg-surface"
                  }`}
                >
                  <span
                    className={`absolute left-0 h-6 w-1 rounded-r-full bg-orange transition-opacity ${
                      on ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors overflow-hidden ${
                      on ? "bg-orange-tint text-orange-deep" : "bg-surface-3 text-fg-muted"
                    }`}
                  >
                    {c.icon_url || c.icon_image || c.category_image ? (
                      <img src={c.icon_url || c.icon_image || c.category_image} alt={label} className="h-full w-full object-contain p-0.5" />
                    ) : (
                      <Package className="h-4 w-4 text-fg-subtle" strokeWidth={1.75} />
                    )}
                  </span>
                  <span className={`flex-1 text-[13.5px] font-medium truncate ${on ? "text-navy" : "text-fg-muted"}`}>
                    {label}
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 transition-all ${on ? "text-orange opacity-100" : "text-fg-subtle opacity-0 group-hover:opacity-60"}`}
                    strokeWidth={2}
                  />
                </button>
              );
            })}
          </div>

          {/* Right — active category detail */}
          <div className="flex min-h-[300px]">
            {/* Subcategories Section - Flexible multi-column layout */}
            <div className="flex-1 p-6 max-h-[480px] overflow-y-auto">
              {loading && displayColumns.length === 0 ? (
                <div className="flex items-center justify-center p-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
                </div>
              ) : displayColumns.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-12">
                  <Package className="h-10 w-10 text-fg-subtle mb-2" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-fg-muted">No subcategories found</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                  {displayColumns.map((col) => (
                    <div key={col.id} className="flex flex-col">
                      <button
                        onClick={() => {
                          onClose();
                          if (col.isCategoryHeader) {
                            router.push(`/categories/${activeId}`);
                          } else {
                            router.push(`/products?category=${activeId}&subcategory=${col.id}`);
                          }
                        }}
                        className="group mb-2.5 flex items-center justify-between border-b border-line-soft pb-1.5 text-left text-[14.5px] font-semibold text-navy hover:text-orange-deep transition-colors cursor-pointer w-full"
                      >
                        <span className="line-clamp-1">{col.title}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-fg-muted group-hover:text-orange transition-colors shrink-0" strokeWidth={1.75} />
                      </button>

                      {col.links && col.links.length > 0 && (
                        <ul className="space-y-2.5 mt-0.5">
                          {col.links.map((link) => (
                            <li key={link.id}>
                              <button
                                onClick={() => {
                                  onClose();
                                  if (link.childId) {
                                    router.push(`/products?category=${activeId}&subcategory=${link.subId}&childcategoryid=${link.childId}`);
                                  } else {
                                    router.push(`/products?category=${activeId}&subcategory=${link.subId}`);
                                  }
                                }}
                                className="text-[13px] text-fg-muted hover:text-orange-deep transition-colors text-left hover:underline line-clamp-1 w-full text-left font-normal"
                              >
                                {link.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Featured store - Fixed width */}
            <div className="w-[260px] flex flex-col bg-navy p-5 text-white shrink-0">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-orange-ring">
                <Tag className="h-3.5 w-3.5" strokeWidth={2} /> Featured store
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-white/10 overflow-hidden">
                  <Package className="h-5 w-5 text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-display text-[15px] font-semibold leading-tight">Official Store</div>
                  <div className="flex items-center gap-1 text-[12px] text-on-navy-muted">
                    <Store className="h-3 w-3" strokeWidth={1.75} /> Verified seller
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-on-navy">Shop best quality items direct from authorized marketplace sellers.</p>
              <button
                onClick={() => {
                  onClose();
                  router.push(`/categories/${activeId}`);
                }}
                className="mt-auto inline-flex items-center gap-1.5 self-start rounded-md bg-orange px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-orange-deep"
              >
                Shop now <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
