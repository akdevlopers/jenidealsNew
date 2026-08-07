'use client'

import { X, Check, MapPin } from "lucide-react";
import { countries, flagUrl, useCountry } from "../../context/CountryContext";

export function CountrySheet({ open, onClose }) {
  const { country, setCountry, isLoading } = useCountry();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="anim-fade absolute inset-0 bg-navy-deep/60" onClick={onClose} />
      <div className="anim-sheet absolute inset-x-0 bottom-0 rounded-t-xl bg-surface pb-4">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight text-fg">Choose your country</h3>
            <p className="text-[12.5px] text-fg-muted">Prices &amp; delivery update to your region</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-fg-muted active:bg-surface-2">
            <X className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-3">
          {isLoading ? (
            <div className="space-y-3 py-4">
              {[1,2].map(i => (
                <div key={i} className="flex items-center gap-3 px-2.5 py-3">
                  <div className="h-6 w-9 rounded bg-gray-200 animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                    <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            countries.map((c) => {
              const selected = country && c.code === country.code;
              return (
                <button
                  key={c.code}
                  onClick={() => { setCountry(c); onClose(); }}
                  className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-3 active:bg-surface-2 ${selected ? "bg-orange-tint" : ""}`}
                >
                  <img 
                    src={flagUrl(c.code)} 
                    alt={c.name} 
                    className="h-6 w-9 shrink-0 object-cover ring-1 ring-line shadow-sm" 
                  />
                  <span className="flex-1 text-left">
                    <span className="block text-[14px] font-semibold text-fg">{c.name}</span>
                    <span className="text-[12px] text-fg-muted">
                      {c.currency}
                    </span>
                  </span>
                  {selected && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-orange">
                      <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
