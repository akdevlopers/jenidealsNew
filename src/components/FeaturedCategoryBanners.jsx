"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Zap, Flame } from "lucide-react";
import { useCountry } from "../context/CountryContext";

export function FeaturedCategoryBanners({ categories: categoriesProp }) {
  const router = useRouter();
  const { country, categories: contextCategories } = useCountry();

  // Only render this category banners UI for UAE (code: 'ae' or id: '2')
  const isUAE = country?.code?.toLowerCase() === "ae" || country?.id === "2";
  if (!isUAE) {
    return null;
  }

  const sourceCategories = (contextCategories && contextCategories.length > 0)
    ? contextCategories
    : (categoriesProp && categoriesProp.length > 0 ? categoriesProp : []);

  // Find Electronics category from API data if available
  const electronicsCat = sourceCategories.find(c => {
    if (!c) return false;
    const name = (c.name || c.category_name || "").toLowerCase();
    return name.includes("electronic") || name.includes("gadget");
  });

  // Find Perfumes category from API data if available
  const perfumesCat = sourceCategories.find(c => {
    if (!c) return false;
    const name = (c.name || c.category_name || "").toLowerCase();
    return name.includes("perfume") || name.includes("fragrance") || name.includes("beauty");
  });

  const featuredBanners = [
    {
      id: "electronics",
      title: electronicsCat?.name || electronicsCat?.category_name || "Electronics",
      subtitle: "Smartphones, Laptops & Tech",
      badge: "Popular Tech",
      icon: Zap,
      categoryObj: electronicsCat,
      bgGradient: "from-[#050b1e] via-[#0b1739] to-[#152a5e]",
      accentColor: "bg-cyan-400/15 text-cyan-300 border-cyan-400/30",
      btnBg: "bg-gradient-to-r from-orange via-amber-500 to-orange hover:from-orange-deep hover:to-orange shadow-[0_4px_14px_rgba(249,115,22,0.35)]",
      borderConic: "conic-gradient(from 0deg, transparent 0deg, transparent 220deg, #3b82f6 270deg, #06b6d4 310deg, #ff8c00 360deg)",
      defaultImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop&q=80",
      fallbackRoute: electronicsCat?.id ? `/categories?category=${electronicsCat.id}` : "/categories"
    },
    {
      id: "perfumes",
      title: perfumesCat?.name || perfumesCat?.category_name || "Perfumes",
      subtitle: "Luxury Fragrances & Oud",
      badge: "Best Sellers",
      icon: Sparkles,
      categoryObj: perfumesCat,
      bgGradient: "from-[#170513] via-[#260a20] to-[#401029]",
      accentColor: "bg-amber-400/15 text-amber-300 border-amber-400/30",
      btnBg: "bg-gradient-to-r from-amber-500 via-orange to-rose-600 hover:from-amber-600 hover:to-orange-deep shadow-[0_4px_14px_rgba(245,158,11,0.35)]",
      borderConic: "conic-gradient(from 0deg, transparent 0deg, transparent 220deg, #f59e0b 270deg, #f43f5e 310deg, #ff8c00 360deg)",
      defaultImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&h=500&fit=crop&q=80",
      fallbackRoute: perfumesCat?.id ? `/categories?category=${perfumesCat.id}` : "/categories"
    }
  ];

  const handleCategoryClick = (item) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (item.categoryObj && item.categoryObj.id) {
      if (isMobile) {
        router.push(`/categories?category=${item.categoryObj.id}`);
      } else {
        router.push(`/categories/${item.categoryObj.id}`);
      }
    } else {
      router.push(item.fallbackRoute);
    }
  };

  return (
    <section className="mx-auto max-w-shell px-4 md:px-6 pt-4 sm:pt-6 pb-2">
      {/* Section Header */}
      <div className="mb-3.5 sm:mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-4 sm:h-5 w-4 sm:w-5 text-orange animate-pulse filter drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" strokeWidth={2.5} />
          <h2 className="font-display text-[15px] sm:text-lg font-extrabold uppercase tracking-wider text-navy">
            Featured Collections
          </h2>
        </div>
      </div>

      {/* 2 Banners in a Row Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {featuredBanners.map((item) => {
          const BadgeIcon = item.icon;
          const catImage = item.categoryObj?.icon_url ||
            item.categoryObj?.image_url ||
            item.categoryObj?.category_image ||
            item.categoryObj?.icon_image ||
            item.defaultImage;

          return (
            <div
              key={item.id}
              onClick={() => handleCategoryClick(item)}
              className="group relative p-[2px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-orange/15 transition-all duration-500 hover:-translate-y-1.5 active:scale-[0.99] select-none"
            >
              {/* Outer Neon Glow Halo Behind Border */}
              <div
                className="absolute -inset-[180%] animate-[spin_4.5s_linear_infinite] pointer-events-none opacity-90 blur-xs"
                style={{ background: item.borderConic }}
              />

              {/* Auto Loop Animated Rotating Border Glow */}
              <div
                className="absolute -inset-[180%] animate-[spin_4.5s_linear_infinite] pointer-events-none opacity-100"
                style={{ background: item.borderConic }}
              />

              {/* Inner Card Body */}
              <div className={`relative z-10 w-full h-full flex items-center justify-between p-5 sm:p-7 rounded-[calc(1rem-2px)] sm:rounded-[calc(1.5rem-2px)] bg-gradient-to-br ${item.bgGradient} text-white overflow-hidden`}>
                {/* Decorative ambient background glows */}
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-orange/20 blur-3xl group-hover:bg-orange/35 group-hover:scale-125 transition-all duration-700 pointer-events-none animate-pulse" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-indigo-500/15 blur-2xl group-hover:scale-125 transition-all duration-700 pointer-events-none" />

                {/* Sweeping light sheen beam on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out pointer-events-none" />

                {/* Left Content */}
                <div className="relative z-10 flex flex-col justify-between max-w-[58%] sm:max-w-[55%] space-y-3 sm:space-y-4">
                  {/* Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] sm:text-[11px] font-bold border ${item.accentColor} backdrop-blur-xl w-fit shadow-xs group-hover:border-white/40 transition-colors`}>
                    <BadgeIcon className="h-3 w-3 shrink-0 animate-pulse group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                    <span>{item.badge}</span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-amber-200 transition-colors duration-300 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 mt-1 font-medium line-clamp-1 group-hover:text-white/95 transition-colors">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* CTA Action Button */}
                  <div className="pt-0.5 sm:pt-1">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md ${item.btnBg} transition-all duration-300 group-hover:gap-3 group-hover:scale-[1.02]`}>
                      <span>Explore Now</span>
                      <ArrowRight className="h-3.5 sm:h-4 w-3.5 sm:w-4 transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={2.5} />
                    </span>
                  </div>
                </div>

                {/* Right Floated 3D Product Image with Continuous Floating Loop */}
                <div className="relative z-10 shrink-0 ml-1 max-w-[44%] sm:max-w-[48%] flex items-center justify-center pointer-events-none -mr-2 -mb-2 sm:-mr-4 sm:-mb-4">
                  <div className="absolute w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-orange/20 blur-xl animate-pulse pointer-events-none" />
                  <img
                    src={catImage}
                    alt={item.title}
                    style={{
                      animation: item.id === "electronics"
                        ? "floatBounce 3.5s ease-in-out infinite"
                        : "floatBounce 4.2s ease-in-out infinite 0.6s"
                    }}
                    className="relative z-10 w-28 h-28 xs:w-32 xs:h-32 sm:w-44 sm:h-44 object-contain filter drop-shadow-[0_14px_28px_rgba(0,0,0,0.65)] group-hover:scale-115 group-hover:-rotate-3 transition-all duration-500 ease-out"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded CSS for Continuous Floating Loop Animation */}
      <style>{`
        @keyframes floatBounce {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-9px) rotate(2deg);
          }
        }
      `}</style>
    </section>
  );
}
