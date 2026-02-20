"use client";

import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {description != null && description !== "" && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
