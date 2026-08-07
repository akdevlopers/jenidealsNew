'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Package } from "lucide-react";
import { useCountry } from "../../context/CountryContext";

function Circle({ c }) {
  const router = useRouter();
  const label = c.name || c.category_name || c.title || c.label;
  const imgUrl = c.icon_url || c.icon_image || c.category_image;
  
  return (
    <button 
      onClick={() => router.push(`/categories?category=${c.id}`)}
      className="flex w-[68px] shrink-0 flex-col items-center gap-1.5 active:opacity-70"
    >
      <span className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-surface-2 ring-1 ring-line">
        <Image 
          src={imgUrl} 
          alt={label} 
          width={64}
          height={64}
          loading="lazy" 
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'grid';
          }}
        />
        <Package 
          className="h-7 w-7 text-fg-muted" 
          strokeWidth={1.5}
          style={{ display: 'none' }}
        />
      </span>
      <span className="text-center text-[11px] font-medium leading-tight text-fg line-clamp-2">
        {label}
      </span>
    </button>
  );
}

export function CategoryCircles({ categories = [] }) {
  const router = useRouter();
  const { categories: contextCategories } = useCountry();

  const sourceCategories = (contextCategories && contextCategories.length > 0)
    ? contextCategories
    : (categories && categories.length > 0 ? categories : []);
  
  if (!sourceCategories || sourceCategories.length === 0) {
    return null;
  }

  return (
    <section className="bg-surface pt-4 pb-3">
      <div className="flex items-center justify-between px-4 pb-2.5">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-fg">Categories</h2>
        <button 
          onClick={() => router.push('/categories')}
          className="text-[12px] font-semibold text-orange-deep active:opacity-70"
        >
          See all
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4">
        {sourceCategories.map((c) => (
          <Circle key={c.id} c={c} />
        ))}
      </div>
    </section>
  );
}
