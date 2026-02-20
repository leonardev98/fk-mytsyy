"use client";

import { useMarketplaceCatalog } from "./MarketplaceCatalogContext";
import { useMarketplace } from "../application/use-marketplace";
import { ProductCard } from "./ProductCard";

export function ProductGrid() {
  const catalog = useMarketplaceCatalog();
  const { products } = useMarketplace(catalog);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
