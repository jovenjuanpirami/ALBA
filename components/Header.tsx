"use client";

import { useEffect, useState } from "react";
import { HERO_TIER, formatPrice } from "@/lib/pricing";
import { LogoLockup } from "./Logo";
import { useStore } from "./Store";

const LINKS = [
  { href: "#sabores", label: "Sabores" },
  { href: "#panel-nutricional", label: "Los 26 nutrientes" },
];

/**
 * Header pegajoso, compacto. El CTA entra en cuanto el usuario empieza a bajar,
 * para no duplicarse con el CTA del hero pero estar siempre a un clic después.
 */
export function Header() {
  const { variant, openWaitlist } = useStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-paper transition-colors duration-300 ${
        scrolled ? "border-b border-rule" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" aria-label="Alba — inicio" className="shrink-0">
          <LogoLockup markClass="h-[18px] sm:h-5" wordClass="text-[15px] sm:text-base" />
        </a>

        <div className="flex items-center gap-5 sm:gap-7">
          <nav className="hidden items-center gap-6 md:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="label-mono transition-colors duration-150 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => openWaitlist({ tier: HERO_TIER, position: "sticky_bar", ui: "header" })}
            tabIndex={scrolled ? undefined : -1}
            aria-hidden={!scrolled}
            className={`hidden rounded-xs bg-ink px-4 py-2.5 text-[13px] font-medium text-paper transition-all duration-300 hover:bg-amber hover:text-ink sm:inline-flex ${
              scrolled
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-1 opacity-0"
            }`}
          >
            Comprar — {formatPrice(HERO_TIER, variant)}
          </button>
        </div>
      </div>
    </header>
  );
}
