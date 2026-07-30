"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ClickPosition } from "@/lib/events";
import { priceOf, type PriceVariant, type Tier } from "@/lib/pricing";
import { DEFAULT_FLAVOR, type Flavor } from "@/lib/product";
import { track } from "@/lib/track";

export type PurchaseContext = {
  flavor: Flavor;
  tier: Tier;
  priceShown: number;
  position: ClickPosition;
};

type StoreValue = {
  variant: PriceVariant;
  flavor: Flavor;
  selectFlavor: (flavor: Flavor) => void;
  purchase: PurchaseContext | null;
  /** Registra el clic de intención de compra y abre el modal de waitlist. */
  openWaitlist: (input: { tier: Tier; position: ClickPosition; ui?: string }) => void;
  closeWaitlist: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({
  variant,
  children,
}: {
  variant: PriceVariant;
  children: React.ReactNode;
}) {
  const [flavor, setFlavor] = useState<Flavor>(DEFAULT_FLAVOR);
  const [purchase, setPurchase] = useState<PurchaseContext | null>(null);

  const selectFlavor = useCallback((next: Flavor) => {
    setFlavor((current) => {
      if (current === next) return current;
      track("sku_toggle", { to: next });
      return next;
    });
  }, []);

  const openWaitlist = useCallback(
    ({ tier, position, ui }: { tier: Tier; position: ClickPosition; ui?: string }) => {
      const priceShown = priceOf(tier, variant);
      setPurchase({ flavor, tier, priceShown, position });
      track("purchase_intent_click", {
        sku: flavor,
        tier,
        price_shown: priceShown,
        position,
        // `sticky_bar` existe en dos superficies: header en desktop, barra inferior en móvil.
        ...(ui ? { ui } : {}),
      });
    },
    [flavor, variant],
  );

  const closeWaitlist = useCallback(() => setPurchase(null), []);

  const value = useMemo<StoreValue>(
    () => ({ variant, flavor, selectFlavor, purchase, openWaitlist, closeWaitlist }),
    [variant, flavor, selectFlavor, purchase, openWaitlist, closeWaitlist],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore debe usarse dentro de <StoreProvider>");
  return value;
}
