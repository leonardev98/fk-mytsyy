"use client";

import { createContext, useContext } from "react";
import type { MarketplaceCatalogPort } from "../application/ports";

const MarketplaceCatalogContext = createContext<MarketplaceCatalogPort | null>(
  null
);

export function MarketplaceCatalogProvider({
  children,
  catalog,
}: {
  children: React.ReactNode;
  catalog: MarketplaceCatalogPort;
}) {
  return (
    <MarketplaceCatalogContext.Provider value={catalog}>
      {children}
    </MarketplaceCatalogContext.Provider>
  );
}

export function useMarketplaceCatalog(): MarketplaceCatalogPort {
  const catalog = useContext(MarketplaceCatalogContext);
  if (!catalog) {
    throw new Error(
      "useMarketplaceCatalog must be used within MarketplaceCatalogProvider"
    );
  }
  return catalog;
}
