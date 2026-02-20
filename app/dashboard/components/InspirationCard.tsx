"use client";

import type { ReactNode } from "react";

type InspirationCardProps = {
  title: string;
  children: ReactNode;
};

export function InspirationCard({ title, children }: InspirationCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 transition-colors duration-[250ms]">
      <h3 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
        {title}
      </h3>
      <div className="mt-3 text-sm text-text-primary">{children}</div>
    </div>
  );
}
