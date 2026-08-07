"use client";

import { ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { LogoMark, Wordmark } from "./Logo";

const cols = [
  { title: "Shop", links: ["All Categories", "Today's Deals", "New Arrivals", "Best Sellers", "Travel Deals"] },
  { title: "Sell", links: ["Become a Seller", "Seller Central", "Pricing & Fees"] },
  { title: "Support", links: ["Help Center", "Track Order", "Returns & Refunds", "Shipping Info", "Contact Us"] },
  { title: "Company", links: ["About Jenideals", "Careers"] },
];

const getLinkHref = (label) => {
  switch (label.toLowerCase()) {
    // Shop links
    case "all categories":
      return "/categories";
    case "today's deals":
      return "/flash-deals";
    case "new arrivals":
      return "/products?sort=new";
    case "best sellers":
      return "/products?sort=rating";
    case "travel deals":
      return process.env.NEXT_PUBLIC_HOLIDAYS_URL || "https://jenideals.com/jeniNewVersion/holidays";
    case "gift cards":
      return "/products?category=gift-cards";
    case "coupons":
      return "/flash-deals";

    // Sell links - All redirect to external vendor portal
    case "become a seller":
      return "https://jenideals.com/vendor/login";
    case "seller central":
      return "https://jenideals.com/vendor/login";
    case "pricing & fees":
      return "https://jenideals.com/vendor/login";
    case "seller handbook":
      return "https://jenideals.com/vendor/login";
    case "fulfilment":
      return "https://jenideals.com/vendor/login";
    case "success stories":
      return "https://jenideals.com/vendor/login";

    // Support links
    case "help center":
      return "/help-support";
    case "track order":
      return "/orders";
    case "returns & refunds":
      return "/refund-policy";
    case "shipping info":
      return "/shipping-policy";
    case "report an issue":
      return "/contact";
    case "contact us":
      return "/contact";

    // Company links
    case "about jenideals":
      return "/about";
    case "careers":
      return "/careers";
    case "press":
      return "/about";
    case "sustainability":
      return "/about";
    case "affiliates":
      return "/contact";
    case "investors":
      return "/contact";

    // Legal links
    case "privacy":
      return "/privacy-policy";
    case "terms":
      return "/terms";

    default:
      return "#";
  }
};

const socialIcons = [
  {
    name: "Facebook",
    icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    link: "https://www.facebook.com/profile.php?id=61582418785919"
  },
  {
    name: "Instagram",
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    link: "https://www.instagram.com/jeni.deals/"
  }
];

export function Footer() {
  return (
    <footer className="mt-12 bg-navy text-on-navy">
      <div className="mx-auto max-w-shell px-4 md:px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LogoMark size={32} rounded={10} />
              <Wordmark size={21} first="#FFFFFF" second="var(--orange)" />
            </div>
            <p className="mt-3.5 max-w-xs text-[12.5px] leading-relaxed text-on-navy-muted">
              The multi-seller marketplace where independent stores and millions of shoppers meet. One cart, one checkout, endless discovery.
            </p>
            <div className="mt-4.5 flex items-center gap-1.5">
              {socialIcons.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-on-navy hover:bg-orange hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-white">{col.title}</div>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => {
                  const href = getLinkHref(l);
                  const isExternal = href.startsWith('http');

                  return (
                    <li key={l}>
                      {href !== "#" ? (
                        isExternal ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12.5px] text-on-navy-muted hover:text-white transition-colors text-left block"
                          >
                            {l}
                          </a>
                        ) : (
                          <Link href={href} className="text-[12.5px] text-on-navy-muted hover:text-white transition-colors text-left block">
                            {l}
                          </Link>
                        )
                      ) : (
                        <button className="text-[12.5px] text-on-navy-muted hover:text-white transition-colors text-left">
                          {l}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-navy-line/40 pt-5 md:flex-row">
          <p className="text-[12px] text-on-navy-muted">© 2026 Jenideals Marketplace, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[12px] text-on-navy-muted">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
          <div className="flex items-center gap-2 text-on-navy-muted">
            <ShieldCheck className="h-4 w-4 text-success" strokeWidth={1.5} />
            <span className="text-[11.5px]">Secure checkout</span>
            <CreditCard className="h-4 w-4 ml-1" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </footer>
  );
}
