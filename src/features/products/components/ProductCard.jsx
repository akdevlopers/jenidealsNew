'use client'

import { useState } from "react";
import { Star, Plus, BadgeCheck, Heart } from "lucide-react";
import { formatDiscountLabel } from "../../../utils/formatters";

export function ProductCard({ product, width }) {
  const Icon = product.icon;
  const [imgOk, setImgOk] = useState(true);
  const [liked, setLiked] = useState(false);
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border border-line bg-surface active:opacity-95 ${width ?? ""}`}
      style={{ boxShadow: "var(--shadow-xs)" }}
    >
      <div className="relative aspect-square" style={{ background: product.tint }}>
        {imgOk && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgOk(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : Icon ? (
          <div className="absolute inset-0 grid place-items-center">
            <Icon className="h-14 w-14" strokeWidth={1.25} style={{ color: product.accent }} />
          </div>
        ) : null}
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-sale px-1.5 py-0.5 text-[10px] font-bold text-white">
            {formatDiscountLabel(`${off}%`)}
          </span>
        )}
        {product.badge && (
          <span className="absolute right-2 top-2 rounded-md bg-navy px-1.5 py-0.5 text-[10px] font-semibold text-white">{product.badge}</span>
        )}
        <button
          onClick={() => setLiked((v) => !v)}
          className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-white/95 shadow-sm active:scale-95"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-sale text-sale" : "text-fg-muted"}`} strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-2.5">
        <div className="flex items-center gap-1 text-[11px] text-fg-muted">
          <BadgeCheck className="h-3 w-3 shrink-0 text-success" strokeWidth={2} />
          <span className="truncate">{product.seller}</span>
        </div>
        <h3 className="mt-1 line-clamp-2 min-h-[34px] text-[12.5px] font-medium leading-snug text-fg">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1">
          <span className="inline-flex items-center gap-0.5 rounded bg-success-tint px-1 py-0.5 text-[11px] font-semibold text-success">
            <Star className="h-2.5 w-2.5 fill-success" strokeWidth={0} />{product.rating}
          </span>
          <span className="text-[11px] text-fg-subtle">({product.reviews > 999 ? (product.reviews / 1000).toFixed(1) + "k" : product.reviews})</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-base font-bold text-fg">${product.price}</span>
            <span className="text-[11px] text-fg-subtle line-through">${product.mrp}</span>
          </div>
          <button className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy text-white active:bg-orange-deep">
            <Plus className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </div>
  );
}
