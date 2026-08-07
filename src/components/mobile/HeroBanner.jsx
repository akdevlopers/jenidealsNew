'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroBanner({ banners = [], webBanners = [], loading = false }) {
  const [i, setI] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use appropriate banners based on screen size
  const activeBanners = isMobile ? banners : (webBanners.length > 0 ? webBanners : banners);

  useEffect(() => {
    if (activeBanners.length > 0) {
      const t = setInterval(() => setI((p) => (p + 1) % activeBanners.length), 5000);
      return () => clearInterval(t);
    }
  }, [activeBanners.length]);

  if (loading || !activeBanners || activeBanners.length === 0) {
    return (
      <section className="px-4 pt-3 md:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse" style={{ aspectRatio: '1920/540' }} />
      </section>
    );
  }

  const currentBanner = activeBanners[i];

  return (
    <section className="px-4 pt-3 md:px-6 lg:px-8">
      <div className="relative w-full overflow-hidden rounded-xl bg-navy">
        {/* Skeleton while image loads */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />
        )}
        
        {/* Banner Image */}
        <Image 
          src={currentBanner.image_url || currentBanner.banner_image || currentBanner.image} 
          alt="Banner" 
          width={1920}
          height={540}
          className={`w-full h-auto object-cover block rounded-xl transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`} 
          priority
          onLoad={() => setImageLoading(false)}
        />

        {activeBanners.length > 1 && (
          <div className="absolute bottom-2 right-4 flex items-center gap-1.5 z-10">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-orange" : "w-1.5 bg-white/60"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
