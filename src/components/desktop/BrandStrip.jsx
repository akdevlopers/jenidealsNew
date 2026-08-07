"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCountry } from "../../context/CountryContext";
import { getBrandList } from "../../services/homeService";

export function BrandStrip({ brands: apiBrands }) {
  const router = useRouter();
  const { country, isLoading: isCountryLoading } = useCountry();
  const [brands, setBrands] = useState(apiBrands || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (apiBrands && apiBrands.length > 0) {
      setBrands(apiBrands);
    } else if (!isCountryLoading && country) {
      const fetchBrands = async () => {
        try {
          setLoading(true);
          // Fetch all brands fallback if no brands in homepage data
          const brandData = await getBrandList('', country.id);
          if (brandData && brandData.length > 0) {
            setBrands(brandData);
          }
        } catch (error) {
          if (apiBrands && apiBrands.length > 0) {
            setBrands(apiBrands);
          }
        } finally {
          setLoading(false);
        }
      };

      if (!apiBrands || apiBrands.length === 0) {
        fetchBrands();
      }
    }
  }, [country?.id, apiBrands, isCountryLoading]);

  if (loading || !brands || brands.length === 0) return null;

  const handleItemClick = (b) => {
    const item = b?.raw || b;
    if (!item) return;

    if (typeof item === 'object') {
      if (item.link) {
        router.push(item.link);
        return;
      }

      const categoryId = item.category_id || item.category || item.categoryId;
      const subcategoryId = item.parent_id !== undefined && item.parent_id !== null ? item.parent_id : (item.subcategory || item.subcategory_id || item.subcategoryId);
      const childCategoryId = item.id !== undefined && item.id !== null ? item.id : (item.childcategoryid || item.child_category_id || item.childCategoryId);
      const countryVal = (item.country !== undefined && item.country !== null && item.country !== '') ? item.country : (country?.id || '');
      const nameVal = item.name || item.brand_name || item.brandName || '';

      if (categoryId) {
        const query = new URLSearchParams();
        query.set('category', String(categoryId));
        if (subcategoryId !== undefined && subcategoryId !== null && subcategoryId !== '') {
          query.set('subcategory', String(subcategoryId));
        }
        if (childCategoryId !== undefined && childCategoryId !== null && childCategoryId !== '') {
          query.set('childcategoryid', String(childCategoryId));
        }
        if (countryVal) {
          query.set('country', String(countryVal));
        }
        if (nameVal) {
          query.set('name', String(nameVal));
        }
        router.push(`/products?${query.toString()}`);
        return;
      }

      const brandId = item.brand_id || item.id || item.brand_name || item.name;
      if (brandId) {
        router.push(`/products?brand=${encodeURIComponent(brandId)}`);
        return;
      }
    } else {
      router.push(`/products?brand=${encodeURIComponent(item)}`);
    }
  };

  const displayBrands = brands.map(b => {
    const brandName = typeof b === "string" ? b : (b.brand_name || b.name || "");
    const initials = typeof brandName === "string" && brandName.trim()
      ? brandName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
      : "JD";
    const imageUrl = typeof b === "object" && b !== null 
      ? (b.image_url || b.brand_img || b.logo_url || b.brand_image || b.icon_image || b.subcategory_image || b.image) 
      : null;
    const brandId = typeof b === "object" && b !== null ? (b.id || b.brand_id || brandName) : brandName;
    return {
      name: brandName,
      initials,
      image: imageUrl,
      id: brandId,
      raw: b
    };
  });

  return (
    <section className="mx-auto max-w-shell px-4 md:px-6 pt-8">
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold tracking-tight text-fg">Featured stores &amp; brands</h2>
        <p className="mt-0.5 text-[13px] text-fg-muted">Verified sellers trusted by millions of shoppers</p>
      </div>

      {/* Desktop - Horizontal Scroll */}
      <div className="hidden md:flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth">
        {displayBrands.map((b) => {
          if (!b || !b.name) return null;
          return (
            <button
              key={b.id || b.name}
              onClick={() => handleItemClick(b)}
              className="group flex flex-col items-center gap-3 rounded-xl border border-line bg-surface p-4 transition-all hover:border-orange-ring hover:shadow-md cursor-pointer text-center w-[120px] shrink-0"
              style={{ boxShadow: "var(--shadow-xs)" }}
            >
              {b.image ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-full border border-line bg-white p-1">
                  <img src={b.image} alt={b.name} className="h-full w-full object-contain rounded-full" />
                </div>
              ) : (
                <span className="grid h-16 w-16 place-items-center rounded-full bg-surface-2 font-display text-[15px] font-bold text-navy group-hover:bg-orange-tint group-hover:text-orange-deep transition-colors">
                  {b.initials}
                </span>
              )}
              <span className="truncate w-full text-[12.5px] font-semibold text-fg">{b.name}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile - 2 Rows with Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex flex-col gap-3">
          {/* First Row */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 scroll-smooth">
            {displayBrands.slice(0, Math.ceil(displayBrands.length / 2)).map((b) => {
              if (!b || !b.name) return null;
              return (
                <button
                  key={b.id || b.name}
                  onClick={() => handleItemClick(b)}
                  className="flex w-[96px] shrink-0 flex-col items-center gap-2 rounded-lg border border-line bg-surface p-3 active:opacity-80 text-center cursor-pointer"
                  style={{ boxShadow: "var(--shadow-xs)" }}
                >
                  {b.image ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-line bg-white p-1">
                      <img src={b.image} alt={b.name} className="h-full w-full object-contain rounded-full" />
                    </div>
                  ) : (
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 font-display text-[13px] font-bold text-navy">
                      {b.initials}
                    </span>
                  )}
                  <span className="truncate w-full text-[11px] font-semibold text-fg">{b.name}</span>
                </button>
              );
            })}
          </div>

          {/* Second Row */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 scroll-smooth">
            {displayBrands.slice(Math.ceil(displayBrands.length / 2)).map((b) => {
              if (!b || !b.name) return null;
              return (
                <button
                  key={b.id || b.name}
                  onClick={() => handleItemClick(b)}
                  className="flex w-[96px] shrink-0 flex-col items-center gap-2 rounded-lg border border-line bg-surface p-3 active:opacity-80 text-center cursor-pointer"
                  style={{ boxShadow: "var(--shadow-xs)" }}
                >
                  {b.image ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-line bg-white p-1">
                      <img src={b.image} alt={b.name} className="h-full w-full object-contain rounded-full" />
                    </div>
                  ) : (
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-2 font-display text-[13px] font-bold text-navy">
                      {b.initials}
                    </span>
                  )}
                  <span className="truncate w-full text-[11px] font-semibold text-fg">{b.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

