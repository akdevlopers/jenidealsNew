"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Search, ShoppingCart, Heart, User, ChevronDown, LayoutGrid, X, LogOut, UserCircle, Wallet, Package, Trash2,
} from "lucide-react";

import { BrowseAllMenu } from "./BrowseAllMenu";
import { CountrySelector } from "./CountrySelector";
import { LogoMark, Wordmark } from "./Logo";
import { useCountry } from "../../context/CountryContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { getCategoryList, searchProducts } from "../../services/homeService";

const trendingTerms = [
  "wireless headphones",
  "automatic watches",
  "linen sofas",
  "gaming earbuds",
  "skincare sets",
];

function HeaderSearchParamsSync({ setScope, displayCats }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let currentCatId = null;

    if (pathname && pathname.includes('/categories/')) {
      const parts = pathname.split('/categories/');
      if (parts[1]) {
        currentCatId = parts[1].split('/')[0].split('?')[0];
      }
    } else if (searchParams) {
      const catParam = searchParams.get('category');
      if (catParam) {
        currentCatId = catParam;
      }
    }

    if (currentCatId) {
      const matched = displayCats.find(
        c => String(c.id) === String(currentCatId) || String(c.label).toLowerCase() === String(currentCatId).toLowerCase()
      );
      if (matched) {
        setScope(String(matched.id));
      } else {
        setScope(String(currentCatId));
      }
    } else if (pathname === '/' || pathname === '/categories' || pathname === '/products') {
      setScope("all");
    }
  }, [pathname, searchParams, displayCats, setScope]);

  return null;
}

export function Header() {
  const router = useRouter();
  const { country, price, categories: categoriesList, categoriesLoading } = useCountry();
  const { getWishlistCount } = useWishlist();
  const { getCartCount } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const [browseOpen, setBrowseOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(null);
  const [scope, setScope] = useState("all");
  const [termIdx, setTermIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);
  const accountRef = useRef(null);
  const browseRef = useRef(null);

  // Set initial active category when categories load
  useEffect(() => {
    if (categoriesList.length > 0 && !activeCat) {
      setActiveCat(categoriesList[0].id);
    }
  }, [categoriesList, activeCat]);

  // Map category data dynamically from API only
  const displayCats = categoriesList.length > 0
    ? categoriesList.map((c) => ({
        id: c.id,
        label: c.name || c.category_name || c.title || c.label,
        icon_url: c.icon_url || c.icon_image || c.category_image
      }))
    : [];

  // Sync active category if it becomes null
  useEffect(() => {
    if (displayCats.length > 0 && !activeCat) {
      setActiveCat(displayCats[0].id);
    }
  }, [displayCats, activeCat]);

  useEffect(() => {
    const t = setInterval(() => setTermIdx((p) => (p + 1) % trendingTerms.length), 2800);
    return () => clearInterval(t);
  }, []);

  // Close search suggestions, account menu, and browse menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
      if (browseRef.current && !browseRef.current.contains(event.target)) {
        setBrowseOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Fetch suggestions as user types (debounced)
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchQuery.trim().length >= 2 && country) { // Only fetch if country is set
      setLoading(true);
      timeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchProducts(searchQuery.trim(), country.id);
          setSuggestions(results.slice(0, 6)); // Show top 6 suggestions
          setShowSuggestions(true);
        } catch (error) {
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery, country?.id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear after search
    }
  };

  const handleSuggestionClick = (product) => {
    setShowSuggestions(false);
    setSearchQuery("");
    router.push(`/product/${product.id}`);
  };

  return (
    <header className="sticky top-0 z-50">
      <Suspense fallback={null}>
        <HeaderSearchParamsSync setScope={setScope} displayCats={displayCats} />
      </Suspense>
      {/* thin brand accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-orange via-orange-deep to-navy" />

      {/* Tier 1 — logo · search · account */}
      <div className="bg-navy">
        <div className="mx-auto flex max-w-shell items-center gap-5 px-4 md:px-6 h-[60px]">
          <a href="/" className="flex shrink-0 items-center gap-2">
            <LogoMark size={32} rounded={10} badge="var(--surface)" stroke="var(--orange)" />
            <Wordmark size={21} first="#FFFFFF" second="var(--orange)" />
          </a>

          {/* Roomy pill search */}
          <div ref={searchRef} className="flex-1 relative">
            <form onSubmit={handleSearch}>
              <div className="flex h-[42px] items-center rounded-full bg-white pl-1 pr-1.5 ring-1 ring-transparent focus-within:ring-2 focus-within:ring-orange-ring">
                <div className="relative hidden shrink-0 sm:block">
                  <select
                    value={scope}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      setScope(selectedVal);
                      if (selectedVal === "all" || selectedVal === "All") {
                        router.push('/categories');
                      } else if (selectedVal) {
                        router.push(`/categories/${selectedVal}`);
                      }
                    }}
                    className="h-8 cursor-pointer appearance-none rounded-full bg-surface-2 pl-3 pr-7 text-[12px] font-semibold text-fg-muted focus:outline-none"
                  >
                    <option value="all">All</option>
                    {displayCats.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-fg-subtle" strokeWidth={2.25} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  placeholder={`Search "${trendingTerms[termIdx]}"…`}
                  className="h-full flex-1 bg-transparent px-3 text-[13.5px] text-fg placeholder:text-fg-subtle focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-surface-2 mr-1"
                  >
                    <X className="h-4 w-4 text-fg-subtle" strokeWidth={2} />
                  </button>
                )}
                <button type="submit" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange text-white transition-colors hover:bg-orange-deep">
                  <Search className="h-[15px] w-[15px]" strokeWidth={2.5} />
                </button>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (searchQuery.trim().length >= 2) && (
              <div className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white rounded-lg shadow-xl border border-line max-h-[450px] overflow-y-auto z-50">
                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange border-t-transparent" />
                  </div>
                ) : suggestions.length > 0 ? (
                  <div>
                    {/* Category/Brand Header */}
                    {suggestions[0]?.brand && (
                      <div className="px-4 py-2.5 border-b border-line bg-surface-2/30">
                        <p className="text-xs font-bold text-fg-muted uppercase tracking-wider">
                          {suggestions[0].brand}
                        </p>
                      </div>
                    )}

                    {/* Product List */}
                    <div className="py-1">
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick(product)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-2 transition-colors text-left border-b border-line/30 last:border-0"
                        >
                          <div className="h-14 w-14 shrink-0 rounded-lg bg-surface-2 overflow-hidden flex items-center justify-center">
                            {product.product_img_url ? (
                              <Image
                                src={product.product_img_url}
                                alt={product.product_name}
                                width={56}
                                height={56}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Search className="h-5 w-5 text-fg-subtle" strokeWidth={2} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-fg line-clamp-2 leading-snug mb-1">
                              {product.product_name}
                            </p>
                            <p className="text-xs text-fg-muted">
                              {price(parseFloat(product.offer_price || 0))}
                              {product.orginal_rate && parseFloat(product.orginal_rate) > parseFloat(product.offer_price) && (
                                <span className="ml-2 line-through text-fg-subtle">
                                  {price(parseFloat(product.orginal_rate))}
                                </span>
                              )}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-fg mb-1">No products found</p>
                    <p className="text-xs text-fg-muted">Try different keywords</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right cluster */}
          <div className="flex shrink-0 items-center gap-0.5">
            <CountrySelector />
            <button
              onClick={() => router.push('/favourites')}
              className="relative grid h-9 w-9 place-items-center rounded-full text-on-navy transition-colors hover:bg-navy-soft"
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {getWishlistCount() > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-orange text-[9px] font-bold text-white ring-2 ring-navy">
                  {getWishlistCount()}
                </span>
              )}
            </button>

            {/* Account Dropdown */}
            <div ref={accountRef} className="relative">
              <button
                aria-label="Account"
                onClick={() => setAccountOpen((prev) => !prev)}
                className="grid h-9 w-9 place-items-center rounded-full text-on-navy transition-colors hover:bg-navy-soft"
              >
                <User className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>

              {accountOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+4px)] w-48 bg-white rounded-lg shadow-xl border border-line z-50 overflow-hidden"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-line bg-surface-2/50">
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-8 w-8 text-orange" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-fg truncate">
                              {user?.name || user?.email || 'User'}
                            </p>
                            <p className="text-xs text-fg-muted truncate">
                              {user?.email || ''}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          router.push('/user/dashboard');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-fg hover:bg-surface-2 transition-colors text-left"
                      >
                        <User className="h-4 w-4 text-orange" />
                        My Account
                      </button>

                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          router.push('/orders');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-fg hover:bg-surface-2 transition-colors text-left border-t border-line/50"
                      >
                        <Package className="h-4 w-4 text-orange" />
                        My Orders
                      </button>

                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          router.push('/user/wallet-history');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-fg hover:bg-surface-2 transition-colors text-left border-t border-line/50"
                      >
                        <Wallet className="h-4 w-4 text-orange" />
                        Wallet History
                      </button>

                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          logout();
                          router.push('/');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-fg hover:bg-surface-2 transition-colors text-left border-t border-line"
                      >
                        <LogOut className="h-4 w-4 text-fg-muted" />
                        Logout
                      </button>

                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          if (window.confirm('Are you sure you want to delete your Jeni Deals account? This action will log you out.')) {
                            logout();
                            router.push('/');
                          }
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left border-t border-line/50 font-medium"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                        Delete Account
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          router.push('/user/login');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-fg hover:bg-surface-2 transition-colors text-left"
                      >
                        <User className="h-4 w-4" />
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          router.push('/user/register');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-fg hover:bg-surface-2 transition-colors text-left border-t border-line"
                      >
                        <UserCircle className="h-4 w-4" />
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => router.push('/cart')}
              aria-label="Cart"
              className="relative grid h-9 w-9 place-items-center rounded-full text-on-navy transition-colors hover:bg-navy-soft"
            >
              <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {getCartCount() > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-orange text-[9px] font-bold text-white ring-2 ring-navy">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2 — browse all · category nav */}
      <div
        ref={browseRef}
        className="relative bg-navy-deep border-t border-navy-line/50"
        onMouseLeave={() => setBrowseOpen(false)}
      >
        <div className="mx-auto flex max-w-shell items-center gap-2 px-4 md:px-6 h-[40px] pr-[160px]">
          <button
            onMouseEnter={() => setBrowseOpen(true)}
            onClick={() => {
              setBrowseOpen(false);
              router.push('/categories');
            }}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold transition-colors ${browseOpen ? "bg-orange text-white" : "bg-orange/90 text-white hover:bg-orange"
              }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" strokeWidth={2.25} />
            Browse all
            <ChevronDown className={`h-3 w-3 transition-transform ${browseOpen ? "rotate-180" : ""}`} strokeWidth={2.25} />
          </button>

          <div className="flex flex-1 items-center gap-0.5 overflow-x-auto no-scrollbar">
            {displayCats.map((c) => (
              <button
                key={c.id}
                onMouseEnter={() => { setActiveCat(c.id); setBrowseOpen(true); }}
                onClick={() => {
                  setBrowseOpen(false);
                  router.push(`/categories?category=${c.id}`);
                }}
                className={`relative shrink-0 px-2.5 py-1 text-[12.5px] font-medium transition-colors ${browseOpen && activeCat === c.id ? "text-white" : "text-on-navy hover:text-white"
                  }`}
              >
                {c.label}
                <span
                  className={`absolute inset-x-2.5 -bottom-[1px] h-0.5 rounded-full bg-orange transition-opacity ${browseOpen && activeCat === c.id ? "opacity-100" : "opacity-0"
                    }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Today's Deals - Fixed to the right */}
        <div className="absolute right-8 top-0 h-[40px] flex items-center pointer-events-none">
          <button 
            onClick={() => router.push('/flash-deals')}
            className="pointer-events-auto flex shrink-0 items-center gap-1.5 rounded-full border border-orange/40 bg-navy-deep px-3 py-1 text-[12px] font-semibold text-orange-ring transition-colors hover:bg-orange/10 shadow-lg"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
            </span>
            Today&apos;s Deals
          </button>
        </div>

        {browseOpen && (
          <div
            className="fixed inset-0 top-[102px] z-30 bg-black/10 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setBrowseOpen(false);
            }}
          />
        )}

        {browseOpen && activeCat && (
          <BrowseAllMenu
            activeId={activeCat}
            setActiveId={setActiveCat}
            onClose={() => setBrowseOpen(false)}
            categories={categoriesList}
          />
        )}
      </div>
    </header>
  );
}
