'use client'

import { useState } from "react";
import { X, Search, ChevronRight } from "lucide-react";
import { categories, categoryTiles } from "@/data";

function catImage(label) {
  return categoryTiles.find((t) => t.label === label)?.image;
}

// tint / accent per category id (mirrors category identity colors)
function catTint(id) {
  const map = {
    electronics: "#EEF2FF", fashion: "#FEF3F2", home: "#F0FDF4", beauty: "#FDF4FF",
    sports: "#ECFEFF", kids: "#FEFCE8", gaming: "#FEF2F2", books: "#FFF7ED",
  };
  return map[id] ?? "#F1F5F9";
}

function catAccent(id) {
  const map = {
    electronics: "#6366F1", fashion: "#F97316", home: "#16A34A", beauty: "#A855F7",
    sports: "#0891B2", kids: "#CA8A04", gaming: "#DC2626", books: "#EA580C",
  };
  return map[id] ?? "#64748B";
}

export function MenuDrawer({ open, onClose }) {
  const [selected, setSelected] = useState(categories[0].id);
  if (!open) return null;

  const active = categories.find((c) => c.id === selected);
  const ActiveIcon = active.icon;
  const banner = catImage(active.label);

  return (
    <div className="anim-drawer fixed inset-0 z-50 flex flex-col bg-bg">
      {/* Top bar */}
      <div className="flex shrink-0 items-center gap-2 bg-navy px-3 py-3">
        <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-white active:bg-white/10">
          <X className="h-5 w-5" strokeWidth={2.25} />
        </button>
        <h2 className="flex-1 font-display text-lg font-bold tracking-tight text-white">Shop by Category</h2>
        <button className="grid h-9 w-9 place-items-center rounded-lg text-white active:bg-white/10">
          <Search className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      {/* Two-pane body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left rail */}
        <div className="w-[88px] shrink-0 overflow-y-auto no-scrollbar bg-surface-2">
          {categories.map((c) => {
            const Icon = c.icon;
            const isActive = c.id === selected;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`relative flex w-full flex-col items-center gap-1.5 px-1 py-3.5 ${isActive ? "bg-bg" : "active:bg-surface-3"}`}
              >
                {isActive && <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-orange" />}
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl ${isActive ? "bg-orange-tint" : "bg-surface"}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} style={{ color: isActive ? "var(--orange-deep)" : "var(--fg-muted)" }} />
                </span>
                <span className={`text-center text-[10.5px] leading-tight ${isActive ? "font-semibold text-navy" : "text-fg-muted"}`}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right pane */}
        <div className="flex-1 overflow-y-auto bg-bg p-4">
          {/* Category banner */}
          <div className="relative mb-5 h-28 overflow-hidden rounded-lg bg-navy">
            {banner && <img src={banner} alt="" className="absolute inset-0 h-full w-full object-cover" />}
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.55) 60%, rgba(15,23,42,0.15) 100%)" }} />
            <div className="relative flex h-full flex-col justify-center px-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
                  <ActiveIcon className="h-4 w-4 text-white" strokeWidth={2} />
                </span>
                <h3 className="font-display text-lg font-bold tracking-tight text-white">{active.label}</h3>
              </div>
              <p className="mt-1 text-[12px] text-on-navy">{active.featured.deal}</p>
              <button className="mt-2 inline-flex w-fit items-center gap-1 rounded-md bg-orange px-3 py-1.5 text-[12px] font-semibold text-white active:bg-orange-deep">
                Shop all <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.25} />
              </button>
            </div>
          </div>

          {/* Subcategory groups */}
          {active.columns.map((col) => (
            <div key={col.title} className="mb-5">
              <div className="mb-2.5 flex items-center justify-between">
                <h4 className="text-[13px] font-bold text-fg">{col.title}</h4>
                <button className="text-[12px] font-semibold text-orange-deep active:opacity-70">See all</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {col.links.map((link) => {
                  const Icon = active.icon;
                  return (
                    <button key={link} className="flex flex-col items-center gap-1.5 active:opacity-70">
                      <span className="grid aspect-square w-full place-items-center rounded-lg border border-line" style={{ background: catTint(active.id) }}>
                        <Icon className="h-6 w-6" strokeWidth={1.5} style={{ color: catAccent(active.id) }} />
                      </span>
                      <span className="text-center text-[11px] leading-tight text-fg">{link}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
