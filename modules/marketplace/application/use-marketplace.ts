"use client";

import { useMemo, useCallback } from "react";
import type { MarketplaceCatalogPort } from "./ports";

export function useMarketplace(catalog: MarketplaceCatalogPort) {
  const products = useMemo(() => catalog.listProducts(), [catalog]);

  const getProduct = useCallback(
    (id: string) => catalog.getProductById(id),
    [catalog]
  );

  return { products, getProduct };
}
