'use client'

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { heroSlides } from "@/data";

export function HeroBanner() {
  const [i, setI] = useState(0);
  const s = heroSlides[i];

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="px-4 pt-3">
      <div className="relative h-44 overflow-hidden rounded-lg bg-navy">
        {/* Photo */}
        <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        {/* Navy gradient scrim for text legibility */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(15,23,42,0.94) 0%, rgba(15,23,42,0.78) 45%, rgba(15,23,42,0.25) 100%)" }} />
        <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full opacity-40 blur-2xl" style={{ background: s.glow }} />

        <div className="relative flex h-full flex-col justify-center px-5">
          <span className="inline-flex w-fit rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-orange-ring ring-1 ring-white/20">
            {s.eyebrow}
          </span>
          <h2 className="mt-2 font-display text-[23px] font-bold leading-tight tracking-tight text-white whitespace-pre-line">
            {s.title}
          </h2>
          <button className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg bg-orange px-4 py-2 text-[13px] font-semibold text-white active:bg-orange-deep">
            {s.cta} <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
          </button>
        </div>

        <div className="absolute bottom-3 right-5 flex items-center gap-1.5">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-orange" : "w-1.5 bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
