'use client'

import { Ticket, Store } from "lucide-react";

export function PromoCards() {
  return (
    <section className="px-3 sm:px-4 pt-3 pb-1">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Card 1: Extra 15% off */}
        <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 bg-surface border border-line/70 rounded-2xl sm:rounded-[20px] shadow-xs active:scale-[0.98] transition-transform cursor-pointer">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9.5 sm:h-9.5 rounded-full bg-orange/10 shrink-0">
            <Ticket className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-orange" strokeWidth={1.8} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11.5px] xs:text-xs sm:text-[13px] font-bold text-fg leading-tight break-words">
              Extra 15% off
            </span>
            <span className="text-[9.5px] xs:text-[10px] sm:text-[11px] font-medium text-fg-muted leading-tight mt-0.5 break-words">
              Code BAZ15 - 1st order
            </span>
          </div>
        </div>

        {/* Card 2: Store spotlight */}
        <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 bg-surface border border-line/70 rounded-2xl sm:rounded-[20px] shadow-xs active:scale-[0.98] transition-transform cursor-pointer">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9.5 sm:h-9.5 rounded-full bg-indigo-50 shrink-0">
            <Store className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-indigo-600" strokeWidth={1.8} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11.5px] xs:text-xs sm:text-[13px] font-bold text-fg leading-tight break-words">
              Store spotlight
            </span>
            <span className="text-[9.5px] xs:text-[10px] sm:text-[11px] font-medium text-fg-muted leading-tight mt-0.5 break-words">
              Casa Nordic - 4.9★
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
