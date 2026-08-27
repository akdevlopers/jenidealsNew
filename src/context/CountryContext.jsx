'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getCategoryList, sortCategoriesByOrderBy, getFlashSaleProducts, clearApiCache } from "../services/homeService";

export const countries = [
  { code: "in", name: "India", city: "Mumbai", currency: "₹", rate: 83, zipFormat: "400001", id: "1", phoneCode: "+91" },
  { code: "ae", name: "UAE", city: "Dubai", currency: "AED", rate: 3.67, zipFormat: "00000", id: "2", phoneCode: "+971" },
];

const CountryCtx = createContext(null);

export function flagUrl(code) {
  if (!code) return '';
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
}

/**
 * Synchronous client-side hint detection using Timezone and Browser Language
 */
function detectCountryFromClient() {
  if (typeof window === 'undefined') return null;

  // 1. Timezone detection (instant 0ms resolution)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (
      tz.includes('Kolkata') ||
      tz.includes('Calcutta') ||
      tz.includes('India') ||
      tz.includes('Colombo') ||
      tz.includes('Kathmandu') ||
      tz.includes('Dhaka')
    ) {
      return countries[0]; // India
    }
    if (
      tz.includes('Dubai') ||
      tz.includes('Abu_Dhabi') ||
      tz.includes('Muscat') ||
      tz.includes('Riyadh') ||
      tz.includes('Qatar') ||
      tz.includes('Bahrain') ||
      tz.includes('Kuwait')
    ) {
      return countries[1]; // UAE
    }
  } catch (e) {}

  // 2. Browser Locale detection
  try {
    const languages = navigator.languages || [navigator.language || ''];
    for (const lang of languages) {
      const l = (lang || '').toLowerCase();
      if (
        l.includes('-in') ||
        l.startsWith('hi') ||
        l.startsWith('ta') ||
        l.startsWith('te') ||
        l.startsWith('ml') ||
        l.startsWith('kn') ||
        l.startsWith('gu') ||
        l.startsWith('mr') ||
        l.startsWith('pa') ||
        l.startsWith('bn')
      ) {
        return countries[0]; // India
      }
      if (l.includes('-ae') || l.startsWith('ar-ae')) {
        return countries[1]; // UAE
      }
    }
  } catch (e) {}

  return null;
}

export function CountryProvider({ children }) {
  // Read saved country from localStorage synchronously if available on client
  const [country, setCountryState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCode = localStorage.getItem('selectedCountry');
        if (savedCode) {
          const saved = countries.find(c => c.code.toLowerCase() === savedCode.toLowerCase());
          if (saved) return saved;
        }
      } catch (e) {}
    }
    return countries[0]; // Default initial
  });

  // If country was already saved by user in localStorage, no need to wait for IP detection
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCode = localStorage.getItem('selectedCountry');
        if (savedCode) return false;
      } catch (e) {}
    }
    return true; // First time visit: wait for IP detection
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [hasFlashDeals, setHasFlashDeals] = useState(false);
  const [flashDealsCount, setFlashDealsCount] = useState(0);
  const { logout } = useAuth();

  // Determine user's country from localStorage or IP detection API
  useEffect(() => {
    let isCancelled = false;

    const determineCountry = async () => {
      // 1. Check if user already has an explicitly saved country in localStorage
      try {
        const savedCountryCode = localStorage.getItem('selectedCountry');
        if (savedCountryCode) {
          const savedCountry = countries.find(c => c.code.toLowerCase() === savedCountryCode.toLowerCase());
          if (savedCountry) {
            if (!isCancelled) {
              setCountryState(savedCountry);
              setIsLoading(false);
            }
            return;
          }
        }
      } catch (e) {}

      // 2. First-time visitor: detect from Next.js API route (/api/detect-country)
      let detectedCode = null;

      try {
        const res = await fetch('/api/detect-country', { signal: AbortSignal.timeout(2500) });
        if (res.ok) {
          const data = await res.json();
          if (data?.countryCode) {
            detectedCode = data.countryCode.toLowerCase();
          }
        }
      } catch (e) {}

      // 3. Fallback: ipwho.is
      if (!detectedCode) {
        try {
          const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(2500) });
          if (res.ok) {
            const data = await res.json();
            if (data?.country_code) {
              detectedCode = data.country_code.toLowerCase();
            }
          }
        } catch (e) {}
      }

      // 4. Fallback: api.country.is
      if (!detectedCode) {
        try {
          const res = await fetch('https://api.country.is/', { signal: AbortSignal.timeout(2500) });
          if (res.ok) {
            const data = await res.json();
            if (data?.country) {
              detectedCode = data.country.toLowerCase();
            }
          }
        } catch (e) {}
      }

      // 5. Fallback: client timezone hint
      if (!detectedCode) {
        const clientHint = detectCountryFromClient();
        if (clientHint) {
          detectedCode = clientHint.code;
        }
      }

      if (isCancelled) return;

      let matchedCountry = countries[0];
      if (detectedCode) {
        const found = countries.find(c => c.code.toLowerCase() === detectedCode.toLowerCase());
        if (found) matchedCountry = found;
      }

      // Save detected country to localStorage for all future visits
      try {
        localStorage.setItem('selectedCountry', matchedCountry.code);
        localStorage.setItem('selectedCountryId', matchedCountry.id);
      } catch (e) {}

      setCountryState(matchedCountry);
      setIsLoading(false);
    };

    determineCountry();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Fetch categories & flash sale products only after country is set and not loading
  useEffect(() => {
    if (isLoading || !country?.id) return;

    let isCancelled = false;

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getCategoryList(country.id);
        if (!isCancelled) {
          setCategories(sortCategoriesByOrderBy(data));
        }
      } catch (error) {
      } finally {
        if (!isCancelled) {
          setCategoriesLoading(false);
        }
      }
    };

    const fetchFlashDeals = async () => {
      try {
        const data = await getFlashSaleProducts(country.id);
        if (!isCancelled) {
          const products = data?.products || [];
          const count = products.length;
          setFlashDealsCount(count);
          setHasFlashDeals(count > 0);
        }
      } catch (error) {
        if (!isCancelled) {
          setFlashDealsCount(0);
          setHasFlashDeals(false);
        }
      }
    };

    fetchCategories();
    fetchFlashDeals();

    return () => {
      isCancelled = true;
    };
  }, [country?.id, isLoading]);

  const changeCountry = (newCountry) => {
    if (!newCountry) return;

    try {
      // Save the new country code and id in localStorage
      localStorage.setItem('selectedCountry', newCountry.code);
      localStorage.setItem('selectedCountryId', newCountry.id);

      // Clear in-memory API response cache
      clearApiCache();

      // Clear user auth session if switching country
      logout();
    } catch (e) {}

    // Update country state
    setCountryState(newCountry);

    // Reload page to re-fetch all country-specific data fresh
    window.location.href = '/';
  };

  const price = (value) => {
    if (value === null || value === undefined || value === '' || !country) return '';
    const v = Number(value);
    if (isNaN(v)) return '';
    const symbolPrefix = ["$", "£", "₹"].includes(country?.currency);
    const num = v === 0 ? "0.00" : (v % 1 !== 0 ? v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : v.toLocaleString());
    return symbolPrefix ? `${country?.currency}${num}` : `${country?.currency} ${num}`;
  };

  return (
    <CountryCtx.Provider value={{
      country,
      setCountry: changeCountry,
      price,
      isLoading,
      categories,
      categoriesLoading,
      hasFlashDeals,
      flashDealsCount
    }}>
      {children}
    </CountryCtx.Provider>
  );
}

export function useCountry() {
  const ctx = useContext(CountryCtx);
  if (!ctx) throw new Error("useCountry must be used within CountryProvider");
  return ctx;
}
