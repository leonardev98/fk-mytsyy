import type { Idea } from "../domain";

export interface IdeasCatalogPort {
  listIdeas(): Idea[];
}
