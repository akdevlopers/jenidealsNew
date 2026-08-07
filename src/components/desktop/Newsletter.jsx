"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="mx-auto max-w-shell px-4 md:px-6 pt-8">
      <div className="flex flex-col items-center gap-6 rounded-lg border border-line bg-surface px-5 py-6 text-center md:flex-row md:justify-between md:text-left" style={{ boxShadow: "var(--shadow-xs)" }}>
        <div className="flex items-center gap-3">
          <span className="hidden sm:grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange-tint">
            <Mail className="h-5 w-5 text-orange-deep" strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-fg">Get deals before anyone else</h2>
            <p className="mt-0.5 text-[13px] text-fg-muted">Weekly drops, exclusive coupons and new store alerts.</p>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
          className="flex w-full max-w-md items-center gap-2"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="h-10 flex-1 rounded-lg border border-line-strong bg-surface px-3.5 text-[13px] text-fg placeholder:text-fg-subtle focus:border-orange-ring focus:outline-none focus:ring-2 focus:ring-orange-tint"
          />
          <button
            type="submit"
            className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 text-[13px] font-semibold text-white transition-colors ${done ? "bg-success" : "bg-orange hover:bg-orange-deep"}`}
          >
            {done ? (<><Check className="h-3.5 w-3.5" strokeWidth={2.5} /> Subscribed</>) : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
