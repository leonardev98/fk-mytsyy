"use client";

import { useState, useEffect } from "react";
import { useAuthSession } from "@/modules/auth";
import { useProjectsCatalog } from "@/app/hooks/useProjectsCatalog";
import { getMockUser } from "@/lib/mock-users";
import type { ProfileProjectItem } from "./profile/ProfileProjects";
import { ProfileHeader } from "./profile/ProfileHeader";
import { ProfileStats } from "./profile/ProfileStats";
import { ProfileProjects } from "./profile/ProfileProjects";
import { ProfileIdeas } from "./profile/ProfileIdeas";
import { ProfileActivity } from "./profile/ProfileActivity";
import { ProfileAchievements } from "./profile/ProfileAchievements";

type ProfilePublicSceneProps = {
  username: string;
};

type TabId = "projects" | "ideas" | "activity" | "achievements";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "projects", label: "Proyectos", icon: "🧠" },
  { id: "ideas", label: "Ideas", icon: "💡" },
  { id: "activity", label: "Actividad", icon: "📊" },
  { id: "achievements", label: "Logros", icon: "🏆" },
];

function mapApiProjectToProfileItem(
  p: { id: string; title: string; description?: string; createdAt: string; lastProgress?: { progressPercent?: number } }
): ProfileProjectItem {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    tags: [],
    date: p.createdAt.slice(0, 10),
    progressPercent: p.lastProgress?.progressPercent ?? 0,
  };
}

export function ProfilePublicScene({ username }: ProfilePublicSceneProps) {
  const { user, isAuthenticated } = useAuthSession();
  const catalog = useProjectsCatalog();
  const [activeTab, setActiveTab] = useState<TabId>("projects");
  const [ownProjects, setOwnProjects] = useState<ProfileProjectItem[] | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const mockUser = getMockUser(username);
  const isOwnProfile =
    isAuthenticated &&
    user &&
    (user.name?.toLowerCase().replace(/\s+/g, "-") === username ||
     (user as { username?: string }).username === username);

  useEffect(() => {
    if (!isOwnProfile || !isAuthenticated) {
      setOwnProjects(null);
      setProjectsLoading(false);
      return;
    }
    setProjectsLoading(true);
    catalog
      .listProjects()
      .then((list) => setOwnProjects(list.map(mapApiProjectToProfileItem)))
      .catch(() => setOwnProjects([]))
      .finally(() => setProjectsLoading(false));
  }, [isOwnProfile, isAuthenticated, catalog]);

  const displayProjects: ProfileProjectItem[] = isOwnProfile && ownProjects !== null
    ? ownProjects
    : mockUser.projects;

  return (
    <div className="dashboard-in mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ProfileHeader user={mockUser} isOwnProfile={!!isOwnProfile} />

      <section className="mt-6">
        <ProfileStats stats={mockUser.stats} />
      </section>

      <section className="mt-8">
        <div
          className="flex gap-1 overflow-x-auto border-b border-border pb-px"
          role="tablist"
          aria-label="Secciones del perfil"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-t-xl px-4 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "border-b-2 border-primary bg-surface text-primary"
                  : "text-text-secondary hover:bg-surface/50 hover:text-text-primary"
              }`}
            >
              <span className="mr-1.5" aria-hidden>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        <div
          id="panel-projects"
          role="tabpanel"
          aria-labelledby="tab-projects"
          hidden={activeTab !== "projects"}
          className="mt-6"
        >
          {activeTab === "projects" && (
            projectsLoading ? (
              <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-secondary">
                Cargando proyectos…
              </div>
            ) : (
              <ProfileProjects projects={displayProjects} />
            )
          )}
        </div>
        <div
          id="panel-ideas"
          role="tabpanel"
          aria-labelledby="tab-ideas"
          hidden={activeTab !== "ideas"}
          className="mt-6"
        >
          {activeTab === "ideas" && <ProfileIdeas ideas={mockUser.ideas} />}
        </div>
        <div
          id="panel-activity"
          role="tabpanel"
          aria-labelledby="tab-activity"
          hidden={activeTab !== "activity"}
          className="mt-6"
        >
          {activeTab === "activity" && (
            <ProfileActivity activity={mockUser.activity} />
          )}
        </div>
        <div
          id="panel-achievements"
          role="tabpanel"
          aria-labelledby="tab-achievements"
          hidden={activeTab !== "achievements"}
          className="mt-6"
        >
          {activeTab === "achievements" && (
            <ProfileAchievements achievements={mockUser.achievements} />
          )}
        </div>
      </section>
    </div>
  );
}
