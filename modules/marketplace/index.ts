/**
 * Marketplace module — public API.
 */

export {
  MarketplaceView,
  MarketplaceCatalogProvider,
  useMarketplaceCatalog,
  ProductCard,
  ProductGrid,
  MarketplaceHero,
} from "./ui";
export type { MarketplaceCatalogPort } from "./application";
export type { Product, Provider } from "./domain";
export { MarketplaceMockAdapter } from "./adapters";
