'use client'

import { useState } from "react";
import { Home, LayoutGrid, Heart, ShoppingCart, User } from "lucide-react";

const items = [
  { icon: Home, label: "Home" },
  { icon: LayoutGrid, label: "Categories" },
  { icon: Heart, label: "Favourites" },
  { icon: ShoppingCart, label: "Cart", badge: 5 },
  { icon: User, label: "Account" },
];

export function BottomNav() {
  const [active, setActive] = useState("Home");

  return (
    <nav className="sticky bottom-0 z-30 border-t border-line bg-surface pb-1">
      <div className="flex items-stretch">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.label;
          return (
            <button
              key={it.label}
              onClick={() => setActive(it.label)}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              <span className="relative">
                <Icon
                  className={`h-6 w-6 transition-colors ${isActive ? "text-orange-deep" : "text-fg-subtle"}`}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
                {it.badge && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-orange px-1 text-[10px] font-bold text-white">
                    {it.badge}
                  </span>
                )}
              </span>
              <span className={`text-[11px] font-medium ${isActive ? "text-orange-deep" : "text-fg-subtle"}`}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
