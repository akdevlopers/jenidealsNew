"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export function Hero({ banners, loading = false }) {
  const [i, setI] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const router = useRouter();

  const displaySlides = (banners || []).map((b, idx) => ({
    eyebrow: b.eyebrow || b.title || "Featured Offer",
    title: b.title || b.banner_title || "",
    sub: b.subtitle || b.description || "",
    cta: b.cta || "Shop Now",
    image: b.image_url || b.banner_image || b.image,
    link: b.link || b.url,
    bg: "linear-gradient(120deg, #1E293B 0%, #334155 55%, #0F172A 100%)",
    glow: "#F97316",
  }));

  const currentSlides = displaySlides;
  const s = currentSlides[i] || {};

  useEffect(() => {
    if (currentSlides.length <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % currentSlides.length), 6000);
    return () => clearInterval(t);
  }, [currentSlides.length]);

  if (loading || !banners || banners.length === 0) {
    return (
      <section className="mx-auto max-w-shell px-4 md:px-6 pt-5">
        <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse" style={{ aspectRatio: '1920/540' }} />
      </section>
    );
  }

  const handleBannerClick = () => {
    if (s.link) {
      router.push(s.link);
    } else {
      router.push('/');
    }
  };

  return (
    <section className="mx-auto max-w-shell px-4 md:px-6 pt-5">
      {/* Full-width banner */}
      <div className="relative overflow-hidden rounded-lg bg-slate-900 cursor-pointer" onClick={handleBannerClick}>
        {/* Skeleton while image loads */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />
        )}
        
        {s.image && (
          <Image 
            src={s.image} 
            alt={s.title || "Banner"} 
            width={1920} 
            height={540} 
            className={`w-full h-auto object-contain transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`} 
            priority
            onLoad={() => setImageLoading(false)}
          />
        )}

        {/* Only show overlay description overlay elements if title is present */}
        {s.title && (
          <div className="absolute inset-0 bg-black/30 z-5" />
        )}
        
        {s.title ? (
          <div className={`absolute inset-0 flex flex-col justify-center px-8 md:px-14 py-9 z-10 transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-orange-ring ring-1 ring-white/15">
              {s.eyebrow}
            </span>
            <h1 className="mt-4 max-w-2xl font-display text-4xl md:text-[46px] font-bold leading-[1.06] tracking-tight text-white">
              {s.title}
            </h1>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-on-navy">{s.sub}</p>
            <div className="mt-6 flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg bg-orange px-6 py-3 text-[15px] font-semibold text-white hover:bg-orange-deep transition-colors" onClick={(e) => {
                e.stopPropagation();
                handleBannerClick();
              }}>
                {s.cta} <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
              </button>
            </div>
          </div>
        ) : null}

        {currentSlides.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setI((p) => (p - 1 + currentSlides.length) % currentSlides.length);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition-colors z-20"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setI((p) => (p + 1) % currentSlides.length);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition-colors z-20"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </button>
            <div className="absolute bottom-5 right-8 md:right-14 flex items-center gap-2 z-20">
              {currentSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setI(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? "w-7 bg-orange" : "w-2.5 bg-white/30"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
