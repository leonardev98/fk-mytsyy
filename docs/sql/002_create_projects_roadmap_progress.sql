-- Projects, roadmaps and progress (run after 001_create_users.sql)
-- One project per user idea; one roadmap per project (4 weeks); progress entries per project.

-- Projects: one row per project
CREATE TABLE IF NOT EXISTS projects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title             VARCHAR(500) NOT NULL,
  description       TEXT,
  source            VARCHAR(20) NOT NULL DEFAULT 'chat' CHECK (source IN ('chat', 'document')),
  pitch             TEXT,
  why_it_wins       TEXT,
  intro_message     TEXT,
  status            VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_user_id_updated_at ON projects(user_id, updated_at DESC);

-- One roadmap per project
CREATE TABLE IF NOT EXISTS roadmaps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_roadmaps_project_id ON roadmaps(project_id);

-- Four weeks per roadmap: goals and actions as JSONB
CREATE TABLE IF NOT EXISTS roadmap_weeks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id  UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  week_number SMALLINT NOT NULL CHECK (week_number >= 1 AND week_number <= 4),
  goals       JSONB NOT NULL DEFAULT '[]',
  actions     JSONB NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(roadmap_id, week_number)
);

CREATE INDEX idx_roadmap_weeks_roadmap_id ON roadmap_weeks(roadmap_id);

-- Progress entries: daily or periodic advances per project
CREATE TABLE IF NOT EXISTS progress_entries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  entry_date       DATE NOT NULL,
  content          TEXT,
  progress_percent SMALLINT CHECK (progress_percent IS NULL OR (progress_percent >= 0 AND progress_percent <= 100)),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_progress_entries_project_id ON progress_entries(project_id);
CREATE INDEX idx_progress_entries_project_id_entry_date ON progress_entries(project_id, entry_date DESC);

-- Optional: trigger to keep projects.updated_at in sync
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();
