/**
 * Marketplace domain: product and provider types.
 * No external dependencies.
 */

export interface Provider {
  id: string;
  name: string;
  tagline: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  provider: Provider;
  category: "recurso" | "mentoría" | "herramienta" | "plantilla";
  imagePlaceholder?: string;
}
