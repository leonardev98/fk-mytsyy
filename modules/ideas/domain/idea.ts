/**
 * Ideas domain: idea generada para el emprendedor (según doc).
 */
export type IdeaDifficulty = "low" | "medium" | "high";

export interface Idea {
  id: string;
  title: string;
  description: string;
  whyFitsYou: string;
  difficulty: IdeaDifficulty;
  estimatedCapital: string;
  timeToValidation: string;
}
