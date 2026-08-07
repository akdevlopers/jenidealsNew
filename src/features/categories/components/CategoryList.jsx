'use client'

import { useState } from "react";
import Image from "next/image";
import { categoryTiles } from "@/data";

function CategoryCircle({ category }) {
  const Icon = category.icon;
  const [imgOk, setImgOk] = useState(true);
  return (
    <button className="flex w-[68px] shrink-0 flex-col items-center gap-1.5 active:opacity-70">
      <span className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-full ring-1 ring-line" style={{ background: category.tint }}>
        {imgOk && category.image ? (
          <Image src={category.image} alt={category.label} fill loading="lazy" onError={() => setImgOk(false)} className="object-cover" />
        ) : Icon ? (
          <Icon className="h-7 w-7" strokeWidth={1.5} style={{ color: category.accent }} />
        ) : null}
      </span>
      <span className="text-center text-[11px] font-medium leading-tight text-fg">{category.label}</span>
    </button>
  );
}

export function CategoryList() {
  return (
    <section className="bg-surface pt-4 pb-3">
      <div className="flex items-center justify-between px-4 pb-2.5">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-fg">Categories</h2>
        <button className="text-[12px] font-semibold text-orange-deep active:opacity-70">See all</button>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4">
        {categoryTiles.map((c) => (
          <CategoryCircle key={c.label} category={c} />
        ))}
      </div>
    </section>
  );
}
