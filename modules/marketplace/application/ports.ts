import type { Product } from "../domain";

/**
 * Port: abstraction for marketplace data.
 * Implemented by adapters (mock, API).
 */
export interface MarketplaceCatalogPort {
  listProducts(): Product[];
  getProductById(id: string): Product | null;
}
