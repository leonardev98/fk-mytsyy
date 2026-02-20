"use client";

import Link from "next/link";
import type { Product } from "../domain";

const CATEGORY_LABELS: Record<Product["category"], string> = {
  recurso: "Recurso",
  mentoría: "Mentoría",
  herramienta: "Herramienta",
  plantilla: "Plantilla",
};

export function ProductCard({ product }: { product: Product }) {
  const buyHref = `/login?returnTo=${encodeURIComponent(`/marketplace?buy=${product.id}`)}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-primary/30 hover:bg-surface/80 transition-colors duration-[250ms]">
      {/* Placeholder image */}
      <div className="aspect-[4/3] bg-gradient-to-br from-accent/20 to-background flex items-center justify-center">
        <span className="text-4xl text-text-primary/20">
          {product.category === "mentoría" ? "🎯" : product.category === "plantilla" ? "📄" : "📦"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 text-xs font-medium uppercase tracking-wider text-accent">
          {CATEGORY_LABELS[product.category]}
        </span>
        <h3 className="mb-1 font-semibold text-text-primary line-clamp-2">
          {product.title}
        </h3>
        <p className="mb-3 flex-1 text-sm text-text-secondary line-clamp-2">
          {product.description}
        </p>
        <p className="mb-2 text-xs text-text-secondary">
          por {product.provider.name}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-lg font-semibold text-text-primary">
            {product.currency} {product.price === 0 ? "Gratis" : product.price}
          </span>
          <Link
            href={buyHref}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:bg-primary-hover"
          >
            Comprar
          </Link>
        </div>
      </div>
    </article>
  );
}
