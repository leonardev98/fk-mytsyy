"use client";

import type { ReactNode } from "react";

type DashboardLayoutProps = {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
};

/**
 * 3-column dashboard layout (LinkedIn-style).
 * On mobile: vertical stack (left → center → right).
 */
export function DashboardLayout({ left, center, right }: DashboardLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-3 xl:col-span-3">
          <div className="dashboard-in">{left}</div>
        </aside>
        <main className="lg:col-span-6 xl:col-span-6">
          <div className="dashboard-in [animation-delay:50ms]">{center}</div>
        </main>
        <aside className="lg:col-span-3 xl:col-span-3">
          <div className="dashboard-in [animation-delay:100ms]">{right}</div>
        </aside>
      </div>
    </div>
  );
}
