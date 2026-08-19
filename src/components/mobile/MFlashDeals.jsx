'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { MProductCard } from "./MProductCard";

function pad(n) {
  return n.toString().padStart(2, "0");
}

export function MFlashDeals({ products = [], remainingSeconds }) {
  const [left, setLeft] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (remainingSeconds !== undefined && remainingSeconds !== null) {
      setLeft(Number(remainingSeconds));
    } else {
      setLeft(26 * 3600 + 37 * 60 + 5);
    }
  }, [remainingSeconds]);

  useEffect(() => {
    const t = setInterval(() => setLeft((p) => (p <= 0 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  if (!products || products.length === 0) {
    return null;
  }

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;

  return (
    <section className="mt-3 bg-navy py-3.5">
      <div className="flex items-center justify-between px-3.5 sm:px-4">
        {/* Left Section: Icon + Title & Timer */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Orange Icon */}
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-orange shadow-xs">
            <Zap className="h-4.5 w-4.5 fill-white text-white" strokeWidth={0} />
          </div>

          {/* Title & "ENDS IN:" */}
          <div className="flex flex-col justify-center shrink-0">
            <h2 className="text-[14px] sm:text-[15px] font-bold text-white leading-tight">
              Flash Sale
            </h2>
            <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase leading-none mt-1">
              ENDS IN:
            </span>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-1 sm:gap-1.5 ml-1">
            {/* HRS */}
            <div className="flex min-w-[34px] sm:min-w-[38px] flex-col items-center justify-center rounded-md bg-white px-1.5 py-1 shadow-sm ring-1 ring-black/5">
              <span className="text-[14px] sm:text-[15px] font-black leading-none tabular-nums text-[#FF4500]">
                {pad(h)}
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-black tracking-wider uppercase text-slate-900 leading-none mt-0.5">
                HRS
              </span>
            </div>

            <span className="text-white font-black text-xs select-none">:</span>

            {/* MIN */}
            <div className="flex min-w-[34px] sm:min-w-[38px] flex-col items-center justify-center rounded-md bg-white px-1.5 py-1 shadow-sm ring-1 ring-black/5">
              <span className="text-[14px] sm:text-[15px] font-black leading-none tabular-nums text-[#FF4500]">
                {pad(m)}
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-black tracking-wider uppercase text-slate-900 leading-none mt-0.5">
                MIN
              </span>
            </div>

            <span className="text-white font-black text-xs select-none">:</span>

            {/* SEC */}
            <div className="flex min-w-[34px] sm:min-w-[38px] flex-col items-center justify-center rounded-md bg-white px-1.5 py-1 shadow-sm ring-1 ring-black/5">
              <span className="text-[14px] sm:text-[15px] font-black leading-none tabular-nums text-[#FF4500]">
                {pad(s)}
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-black tracking-wider uppercase text-slate-900 leading-none mt-0.5">
                SEC
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: See all */}
        <button 
          onClick={() => router.push('/flash-deals')}
          className="text-[13px] sm:text-[14px] font-semibold text-orange hover:underline active:opacity-75 transition-opacity shrink-0 ml-2"
        >
          See all
        </button>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar px-4">
        {products.map((p) => (
          <MProductCard key={p.id} product={p} width="w-[144px] shrink-0" />
        ))}
      </div>
    </section>
  );
}
