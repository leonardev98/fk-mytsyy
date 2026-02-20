"use client";

import { useMemo } from "react";
import { IdeasView, IdeasMockAdapter } from "@/modules/ideas";

export function IdeasScene() {
  const catalog = useMemo(() => new IdeasMockAdapter(), []);
  return <IdeasView catalog={catalog} />;
}
