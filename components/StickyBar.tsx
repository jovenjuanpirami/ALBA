"use client";

import { useEffect, useState } from "react";
import { HERO_TIER, formatPerServing, formatPrice } from "@/lib/pricing";
import { scrollPercent } from "@/lib/scroll";
import { BuyButton } from "./BuyButton";
import { SunMark } from "./Logo";
import { useStore } from "./Store";

/** Barra pegajosa de móvil. Aparece después del 50% de scroll. */
export function StickyBar() {
  const { variant } = useStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(scrollPercent() >= 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-card transition-transform duration-300 ease-dawn sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-3">
          <SunMark className="h-4" />
          <div>
            <p className="num text-[13px] leading-none text-ink">
              {formatPrice(HERO_TIER, variant)}
            </p>
            <p className="label-mono mt-1">{formatPerServing(HERO_TIER, variant)}</p>
          </div>
        </div>
        <BuyButton
          tier={HERO_TIER}
          position="sticky_bar"
          ui="bottom_bar"
          label="Comprar"
          size="md"
          tabIndex={visible ? undefined : -1}
        />
      </div>
    </div>
  );
}
