"use client";

import { MarketplaceHero } from "./MarketplaceHero";
import { ProductGrid } from "./ProductGrid";
import { MarketplaceAuthBanner } from "@/modules/auth";

export function MarketplaceView() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <MarketplaceHero />
      <MarketplaceAuthBanner />
      <section className="mt-10">
        <h2 className="mb-6 text-lg font-medium text-text-secondary">
          Productos y servicios
        </h2>
        <ProductGrid />
      </section>
    </div>
  );
}
