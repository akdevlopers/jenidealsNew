"use client";

import { useState, useRef, useEffect } from "react";
import { Check, MapPin, ChevronDown } from "lucide-react";
import { countries, flagUrl, useCountry } from "../../context/CountryContext";

export function CountrySelector() {
  const { country, setCountry, isLoading } = useCountry();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Header Flag Trigger Button (Seamless, no ugly border box) */}
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isLoading || !country}
        aria-label={country ? `Ship to ${country.name}` : "Select country"}
        className="group flex items-center gap-1 h-9 px-2 rounded-full text-on-navy hover:bg-navy-soft transition-colors disabled:opacity-50 cursor-pointer"
      >
        {isLoading || !country ? (
          <div className="h-3.5 w-5 rounded bg-white/20 animate-pulse" />
        ) : (
          <>
            <img 
              src={flagUrl(country.code)} 
              alt={country.name} 
              className="h-3.5 w-5 object-cover ring-1 ring-white/20 shadow-xs" 
            />
            <ChevronDown 
              className={`h-3 w-3 text-white/70 group-hover:text-white transition-transform duration-200 ${
                open ? "rotate-180 text-orange" : ""
              }`} 
              strokeWidth={2} 
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {open && country && (
        <div
          className="anim-fade absolute right-0 top-[calc(100%+4px)] z-[100] w-64 overflow-hidden rounded-xl border border-line bg-surface shadow-xl"
        >
          <div className="border-b border-line px-4 py-2.5 bg-surface">
            <div className="text-xs font-bold text-navy uppercase tracking-wider">Ship to</div>
            <div className="text-[11px] text-fg-muted">Select your delivery country</div>
          </div>
          <div className="max-h-72 overflow-y-auto py-1 bg-surface">
            {countries.map((c) => {
              const selected = c.code === country.code;
              return (
                <button
                  key={c.code}
                  onClick={() => { setCountry(c); setOpen(false); }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-2 transition-colors ${selected ? "bg-orange-tint" : ""}`}
                >
                  <img src={flagUrl(c.code)} alt={c.name} className="h-3.5 w-5 shrink-0 object-cover ring-1 ring-line shadow-xs" />
                  <span className="flex-1">
                    <span className="block text-[13px] font-semibold text-navy">{c.name}</span>
                    <span className="flex items-center gap-1 text-[11px] text-fg-muted">
                      <MapPin className="h-3 w-3" strokeWidth={2} /> {c.city}
                    </span>
                  </span>
                  {selected && (
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-orange">
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
