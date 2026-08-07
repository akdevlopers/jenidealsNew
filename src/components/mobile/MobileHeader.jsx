'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, ChevronDown, Search, Bell, MapPin, X, ChevronLeft } from "lucide-react";
import { useCountry, flagUrl } from "../../context/CountryContext";
import { useState, useEffect, useRef } from "react";
import { CountrySheet } from "./CountrySheet";
import { searchProducts } from "../../services/homeService";
import { useAuth } from "../../context/AuthContext";
import { addressService } from "../../services/addressService";

export function MobileHeader({ onOpenMenu, showSearch = true, showBack = false, backPath = "" }) {
  const { country, price, isLoading: isCountryLoading } = useCountry();
  const { isAuthenticated, user } = useAuth();
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [countrySheetOpen, setCountrySheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleNotificationClick = () => {
    router.push('/notifications');
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user's default address when authenticated or country changes
  useEffect(() => {
    if (isCountryLoading || !country) return;
    const fetchDefaultAddress = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const response = await addressService.getAddresses(user.id, country.id);
          if (response.status && response.Data?.addressList) {
            const defaultAddr = response.Data.addressList.find(
              (addr) => addr.make_default == 1 || addr.isDefaultAddress == 1 || addr.is_default_address == 1
            );
            setDefaultAddress(defaultAddr || null);
          } else {
            setDefaultAddress(null);
          }
        } catch (error) {
          setDefaultAddress(null);
        }
      } else {
        setDefaultAddress(null);
      }
    };
    fetchDefaultAddress();
  }, [isAuthenticated, user, country?.id, isCountryLoading]);

  // Fetch suggestions as user types (debounced)
  useEffect(() => {
    if (isCountryLoading || !country) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      setLoading(true);
      timeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchProducts(searchQuery.trim(), country.id);
          setSuggestions(results.slice(0, 5)); // Show top 5 suggestions
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
  }, [searchQuery, country?.id, isCountryLoading]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (product) => {
    setShowSuggestions(false);
    setSearchQuery("");
    router.push(`/product/${product.id}`);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-navy">
        {/* Top row: menu · location · notify */}
        <div className="flex items-center gap-2.5 px-4 pt-3 pb-2.5">
          {showBack ? (
            <button 
              onClick={() => {
                if (backPath) {
                  router.push(backPath);
                } else {
                  router.back();
                }
              }} 
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white active:bg-white/10"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
            </button>
          ) : (
            <button onClick={onOpenMenu} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white active:bg-white/10">
              <Menu className="h-6 w-6" strokeWidth={2} />
            </button>
          )}

          <button 
            onClick={() => setCountrySheetOpen(true)}
            disabled={isCountryLoading || !country}
            className="flex flex-1 items-center gap-2 text-left disabled:opacity-50"
          >
            {/* Country flag icon */}
            <div className="relative shrink-0 mr-1">
              {isCountryLoading || !country ? (
                <div className="h-3 w-5 rounded bg-white/20 animate-pulse" />
              ) : (
                <img 
                  src={flagUrl(country.code)} 
                  alt={country.name} 
                  className="h-3 w-5 object-cover ring-2 ring-white/30 shadow-sm"
                />
              )}
              <span className="absolute -bottom-1.5 -right-1.5 grid h-4 w-4 place-items-center rounded-full bg-navy ring-2 ring-navy">
                <MapPin className="h-2.5 w-2.5 text-orange" strokeWidth={2.5} />
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[11px] text-white/70">Deliver to</span>
              <span className="flex items-center gap-1 text-[13px] font-semibold leading-none text-white mt-0.5">
                {isCountryLoading || !country ? (
                  "Loading..."
                ) : defaultAddress ? (
                  `${defaultAddress.city || defaultAddress.area || defaultAddress.state || country.city}, ${country.name}`
                ) : (
                  `${country.city}, ${country.name}`
                )}
                <ChevronDown className="h-3 w-3 text-white/70" strokeWidth={2.25} />
              </span>
            </div>
          </button>

          <button 
            onClick={handleNotificationClick}
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white active:bg-white/10"
          >
            <Bell className="h-[22px] w-[22px]" strokeWidth={1.75} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange ring-2 ring-navy" />
          </button>
        </div>

        {/* Search row - only show on homepage */}
        {showSearch && (
          <div ref={searchRef} className="relative px-4 pb-3">
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-2 rounded-lg bg-white pl-3.5 pr-1.5 h-11 shadow-sm">
                <Search className="h-5 w-5 shrink-0 text-fg-subtle" strokeWidth={2} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  placeholder="Search products & stores…"
                  className="flex-1 bg-transparent text-[14px] text-fg placeholder:text-fg-subtle focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-md hover:bg-surface-2 mr-1"
                  >
                    <X className="h-4 w-4 text-fg-subtle" strokeWidth={2} />
                  </button>
                )}
                <button 
                  type="submit"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange text-white active:bg-orange-deep transition-colors shadow-xs"
                >
                  <Search className="h-4 w-4 text-white" strokeWidth={2.5} />
                </button>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (searchQuery.trim().length >= 2) && (
              <div className="absolute left-4 right-4 top-[calc(100%-8px)] bg-white rounded-b-lg shadow-lg border border-t-0 border-line max-h-[400px] overflow-y-auto z-40">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange border-t-transparent" />
                  </div>
                ) : suggestions.length > 0 ? (
                  <div>
                    {/* Category/Brand Header */}
                    {suggestions[0]?.brand && (
                      <div className="px-3 py-2 border-b border-line bg-surface-2/50">
                        <p className="text-[11px] font-bold text-fg-muted uppercase tracking-wide">
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
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-2 active:bg-surface-2 text-left border-b border-line/50 last:border-0"
                        >
                          <div className="h-12 w-12 shrink-0 rounded-lg bg-surface-2 overflow-hidden flex items-center justify-center">
                            {product.product_img_url ? (
                              <Image 
                                src={product.product_img_url} 
                                alt={product.product_name}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Search className="h-5 w-5 text-fg-subtle" strokeWidth={2} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-fg line-clamp-2 leading-tight mb-0.5">
                              {product.product_name}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-6 text-center">
                    <p className="text-sm font-medium text-fg mb-1">No products found</p>
                    <p className="text-xs text-fg-muted">Try different keywords</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      <CountrySheet open={countrySheetOpen} onClose={() => setCountrySheetOpen(false)} />
    </>
  );
}
