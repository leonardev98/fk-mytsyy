"use client";

import { useState } from "react";

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "saas", label: "SaaS" },
  { id: "ai", label: "AI" },
  { id: "marketplace", label: "Marketplace" },
  { id: "fintech", label: "Fintech" },
  { id: "validacion", label: "En validación" },
  { id: "lanzamiento", label: "En lanzamiento" },
  { id: "trending", label: "Trending" },
];

type FilterChipsProps = {
  activeFilter?: string;
  onFilterChange?: (filterId: string) => void;
};

export function FilterChips({ activeFilter = "all", onFilterChange }: FilterChipsProps) {
  const [active, setActive] = useState(activeFilter);

  function handleClick(id: string) {
    setActive(id);
    onFilterChange?.(id);
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {FILTERS.map((f) => {
        const isActive = active === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => handleClick(f.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-primary text-on-primary shadow-sm"
                : "border border-border bg-surface text-text-secondary hover:bg-surface/80 hover:text-text-primary"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
