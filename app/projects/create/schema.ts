import { z } from "zod";

export const CATEGORIES = ["SaaS", "Ecommerce", "App", "AI", "Otro"] as const;
export const AMBITION_LEVELS = [
  "Side project",
  "Startup",
  "Escalable",
] as const;

export const projectCreateSchema = z.object({
  // Step 1
  name: z.string().min(1, "El nombre es obligatorio").max(120),
  description: z.string().min(1, "La descripción es obligatoria").max(500),
  category: z.enum(CATEGORIES),
  targetAudience: z.string().max(300).optional().or(z.literal("")),
  businessModel: z.string().max(300).optional().or(z.literal("")),
  ambitionLevel: z.enum(AMBITION_LEVELS),

  // Step 2
  problem: z.string().max(800).optional().or(z.literal("")),
  valueProposition: z.string().max(800).optional().or(z.literal("")),
  goal30Days: z.string().max(400).optional().or(z.literal("")),
  mainMetric: z.string().max(200).optional().or(z.literal("")),
  isPublic: z.boolean(),

  // Step 3
  durationDays: z.coerce.number().min(1).max(365),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
  buildInPublic: z.boolean(),
  aiAssistantEnabled: z.boolean(),
});

export type ProjectCreateForm = z.infer<typeof projectCreateSchema>;

export const step1Schema = projectCreateSchema.pick({
  name: true,
  description: true,
  category: true,
  targetAudience: true,
  businessModel: true,
  ambitionLevel: true,
});

export const step2Schema = projectCreateSchema.pick({
  problem: true,
  valueProposition: true,
  goal30Days: true,
  mainMetric: true,
  isPublic: true,
});

export const step3Schema = projectCreateSchema.pick({
  durationDays: true,
  startDate: true,
  buildInPublic: true,
  aiAssistantEnabled: true,
});

export type ParseDocumentResponse = {
  name: string;
  description: string;
  problem?: string;
  valueProposition?: string;
  targetAudience?: string;
  businessModel?: string;
  goal30Days?: string;
};
