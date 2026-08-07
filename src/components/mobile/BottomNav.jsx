'use client'

import { useEffect } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, ShoppingCart, User } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const items = [
  { icon: Home, label: "Home", path: "/" },
  { icon: LayoutGrid, label: "Categories", path: "/categories" },
  { icon: Heart, label: "Favourites", path: "/favourites" },
  { icon: ShoppingCart, label: "Cart", path: "/cart" },
  { icon: User, label: "Account", path: "/account" },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const isActive = (itemPath) => {
    if (itemPath === '/') return pathname === '/';
    return pathname.startsWith(itemPath);
  };

  const getBadgeCount = (label) => {
    if (label === "Cart") return getCartCount();
    if (label === "Favourites") return getWishlistCount();
    return 0;
  };

  return (
    <nav className="sticky bottom-0 z-30 border-t border-line bg-surface pb-1">
      <div className="flex items-stretch">
        {items.map((it) => {
          const Icon = it.icon;
          const active = isActive(it.path);
          const badgeCount = getBadgeCount(it.label);
          
          return (
            <button
              key={it.label}
              onClick={() => handleNavigation(it.path)}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              <span className="relative">
                <Icon
                  className={`h-6 w-6 transition-colors ${active ? "text-orange-deep" : "text-fg-subtle"}`}
                  strokeWidth={active ? 2.25 : 1.75}
                />
                {badgeCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-orange px-1 text-[10px] font-bold text-white">
                    {badgeCount}
                  </span>
                )}
              </span>
              <span className={`text-[11px] font-medium ${active ? "text-orange-deep" : "text-fg-subtle"}`}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
