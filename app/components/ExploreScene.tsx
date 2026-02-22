"use client";

import { HeroSection } from "@/app/explore/components/HeroSection";
import { FilterChips } from "@/app/explore/components/FilterChips";
import { TrendingProjectsGrid } from "@/app/explore/components/TrendingProjectsGrid";
import { BuildersSpotlight } from "@/app/explore/components/BuildersSpotlight";
import { MOCK_PROJECTS, MOCK_BUILDERS_SPOTLIGHT } from "@/app/explore/lib/mock-explore";

export function ExploreScene() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-12">
        <HeroSection />
      </div>

      {/* Filter Chips */}
      <div className="mb-10">
        <FilterChips />
      </div>

      {/* Trending Projects Grid (masonry) */}
      <section className="mb-16">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-secondary">
          Proyectos en ejecución
        </h2>
        <TrendingProjectsGrid projects={MOCK_PROJECTS} />
      </section>

      {/* Builders Spotlight */}
      <div className="dashboard-in">
        <BuildersSpotlight builders={MOCK_BUILDERS_SPOTLIGHT} />
      </div>
    </div>
  );
}
