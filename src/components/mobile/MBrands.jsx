'use client'

import { useRouter } from "next/navigation";
import { useCountry } from "../../context/CountryContext";

export function MBrands({ brands = [] }) {
  const router = useRouter();
  const { country } = useCountry();

  if (!brands || brands.length === 0) {
    return null;
  }

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

  // Split brands into two rows
  const halfLength = Math.ceil(brands.length / 2);
  const firstRow = brands.slice(0, halfLength);
  const secondRow = brands.slice(halfLength);

  const BrandCard = ({ b }) => {
    const brandName = typeof b === "string" ? b : (b.brand_name || b.name || "");
    const initials = typeof brandName === "string" && brandName.trim()
      ? brandName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
      : "JD";
    const imageUrl = typeof b === "object" && b !== null ? (b.image_url || b.brand_img || b.logo_url || b.brand_image || b.icon_image || b.subcategory_image || b.image) : null;
    const brandId = typeof b === "object" && b !== null ? (b.id || b.brand_id || brandName) : brandName;
    
    return (
      <button 
        key={brandId} 
        onClick={() => handleItemClick(b)}
        className="flex w-[92px] shrink-0 flex-col items-center gap-2 rounded-lg border border-line bg-surface p-3 active:opacity-80 cursor-pointer text-center" 
        style={{ boxShadow: "var(--shadow-xs)" }}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={brandName}
            className="h-12 w-12 rounded-full object-contain p-1 border border-line-soft bg-white"
          />
        ) : (
          <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 font-display text-[14px] font-bold text-navy">
            {initials}
          </span>
        )}
        <span className="truncate w-full text-center text-[11px] font-semibold text-fg">{brandName}</span>
      </button>
    );
  };

  return (
    <section className="pt-5">
      <div className="px-4 mb-3">
        <h2 className="font-display text-lg font-bold tracking-tight text-fg">Brands</h2>
      </div>
      
      {/* Two rows of brands */}
      <div className="flex flex-col gap-3">
        {/* First Row */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
          {firstRow.map((b, index) => (
            <BrandCard key={b.id || b.brand_name || b.name || index} b={b} />
          ))}
        </div>
        
        {/* Second Row */}
        {secondRow.length > 0 && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
            {secondRow.map((b, index) => (
              <BrandCard key={b.id || b.brand_name || b.name || index} b={b} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

