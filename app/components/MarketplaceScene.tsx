"use client";

import { useMemo } from "react";
import {
  MarketplaceView,
  MarketplaceCatalogProvider,
  MarketplaceMockAdapter,
} from "@/modules/marketplace";

/**
 * Client-only: instancia el adapter aquí para no pasar clases Server → Client.
 */
export function MarketplaceScene() {
  const catalog = useMemo(() => new MarketplaceMockAdapter(), []);

  return (
    <MarketplaceCatalogProvider catalog={catalog}>
      <MarketplaceView />
    </MarketplaceCatalogProvider>
  );
}
