'use client'

import { Menu, MapPin, ChevronDown, Search, Bell, Camera } from "lucide-react";

export function Header({ onOpenMenu }) {
  return (
    <header className="sticky top-0 z-30 bg-navy">
      {/* Top row: menu · location · notify */}
      <div className="flex items-center gap-2.5 px-4 pt-3 pb-2.5">
        <button onClick={onOpenMenu} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white active:bg-white/10">
          <Menu className="h-6 w-6" strokeWidth={2} />
        </button>

        <button className="flex flex-1 items-center gap-1.5 text-left">
          <MapPin className="h-4 w-4 shrink-0 text-orange-ring" strokeWidth={2} />
          <span className="leading-tight">
            <span className="block text-[11px] text-on-navy-muted">Deliver to</span>
            <span className="flex items-center gap-1 text-[13px] font-semibold text-white">
              New York 10001 <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.25} />
            </span>
          </span>
        </button>

        <button className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white active:bg-white/10">
          <Bell className="h-[22px] w-[22px]" strokeWidth={1.75} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange ring-2 ring-navy" />
        </button>
      </div>

      {/* Search row */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-lg bg-white px-3.5 h-11 shadow-sm">
          <Search className="h-5 w-5 shrink-0 text-fg-subtle" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search products & stores…"
            className="flex-1 bg-transparent text-[14px] text-fg placeholder:text-fg-subtle focus:outline-none"
          />
          <span className="h-5 w-px bg-line" />
          <button className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-orange-deep active:bg-surface-2">
            <Camera className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
}
