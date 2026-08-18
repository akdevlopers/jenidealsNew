'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getCategoryList, getCategoriesWithSubAndChild, sortCategoriesByOrderBy, getFlashSaleProducts } from "../services/homeService";

export const countries = [
  { code: "in", name: "India", city: "Mumbai", currency: "₹", rate: 83, zipFormat: "400001", id: "1", phoneCode: "+91" },
  { code: "ae", name: "UAE", city: "Dubai", currency: "AED", rate: 3.67, zipFormat: "00000", id: "2", phoneCode: "+971" },
];

const CountryCtx = createContext(null);

export function flagUrl(code) {
  if (!code) return '';
  return `https://flagcdn.com/${code}.svg`;
}

export function CountryProvider({ children }) {
  const [country, setCountry] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCountryCode = localStorage.getItem('selectedCountry');
      if (savedCountryCode) {
        const saved = countries.find(c => c.code === savedCountryCode);
        if (saved) return saved;
      }
    }
    return countries[1]; // Default to UAE (Dubai)
  });
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [hasFlashDeals, setHasFlashDeals] = useState(false);
  const [flashDealsCount, setFlashDealsCount] = useState(0);
  const { logout } = useAuth();

  // First, determine the user's country from localStorage or IP detection or default
  useEffect(() => {
    const determineCountry = async () => {
      // Check if user has previously selected a country
      const savedCountryCode = localStorage.getItem('selectedCountry');

      if (savedCountryCode) {
        const savedCountry = countries.find(c => c.code === savedCountryCode);
        if (savedCountry) {
          setCountry(savedCountry);
          setIsLoading(false);
          return;
        }
      }

      // If no saved country, detect from IP
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const detectedCountryCode = data.country_code?.toLowerCase();
        
        if (detectedCountryCode) {
          const detectedCountry = countries.find(c => c.code === detectedCountryCode);
          if (detectedCountry) {
            setCountry(detectedCountry);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
      }

      // If IP detection fails or country not in list, default to UAE (Dubai)
      setCountry(countries[1]);
      setIsLoading(false);
    };

    determineCountry();
  }, []);

  // Fetch categories & flash sale products only after country is set
  useEffect(() => {
    if (!country) return; // Don't fetch until country is determined

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getCategoryList(country.id);
        setCategories(sortCategoriesByOrderBy(data));
      } catch (error) {
      } finally {
        setCategoriesLoading(false);
      }
    };

    const fetchFlashDeals = async () => {
      try {
        const data = await getFlashSaleProducts(country.id);
        const products = data?.products || [];
        const count = products.length;
        setFlashDealsCount(count);
        setHasFlashDeals(count > 0);
      } catch (error) {
        setFlashDealsCount(0);
        setHasFlashDeals(false);
      }
    };

    fetchCategories();
    fetchFlashDeals();
  }, [country?.id]); // Only re-run if country.id changes

  const changeCountry = (newCountry) => {
    // Get current pathname
    const currentPath = window.location.pathname;
    
    // Check if current page is login, register, verify-otp, or forgot-password
    const authPages = ['/user/login', '/user/register', '/user/verify-otp', '/user/forgot-password'];
    const isAuthPage = authPages.some(page => currentPath.includes(page));
    
    // Save the new country code first
    localStorage.setItem('selectedCountry', newCountry.code);
    
    // Clear all other localStorage items except selectedCountry
    const countryCode = localStorage.getItem('selectedCountry');
    localStorage.clear();
    localStorage.setItem('selectedCountry', countryCode);
    
    // Logout the user
    logout();
    
    // Update country state
    setCountry(newCountry);
    
    // Redirect to home page to clear all cached data and state
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
