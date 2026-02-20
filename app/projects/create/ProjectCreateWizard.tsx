"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import {
  projectCreateSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  CATEGORIES,
  AMBITION_LEVELS,
  type ProjectCreateForm,
  type ParseDocumentResponse,
} from "./schema";
import { parseDocument, createProject } from "./api";
import { ProjectFormLayout } from "./components/ProjectFormLayout";
import { FormSection } from "./components/FormSection";
import { InputField } from "./components/InputField";
import { TextAreaField } from "./components/TextAreaField";
import { ToggleField } from "./components/ToggleField";
import { UploadDropzone } from "./components/UploadDropzone";

const DEFAULT_VALUES: ProjectCreateForm = {
  name: "",
  description: "",
  category: "Otro",
  targetAudience: "",
  businessModel: "",
  ambitionLevel: "Side project",
  problem: "",
  valueProposition: "",
  goal30Days: "",
  mainMetric: "",
  isPublic: true,
  durationDays: 30,
  startDate: new Date().toISOString().slice(0, 10),
  buildInPublic: true,
  aiAssistantEnabled: true,
};

export function ProjectCreateWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"manual" | "document">("manual");
  const [documentLoading, setDocumentLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useForm<ProjectCreateForm>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

  const applyParsedDocument = useCallback(
    (data: ParseDocumentResponse) => {
      form.setValue("name", data.name);
      form.setValue("description", data.description);
      if (data.problem != null) form.setValue("problem", data.problem);
      if (data.valueProposition != null)
        form.setValue("valueProposition", data.valueProposition);
      if (data.targetAudience != null)
        form.setValue("targetAudience", data.targetAudience);
      if (data.businessModel != null)
        form.setValue("businessModel", data.businessModel);
      if (data.goal30Days != null) form.setValue("goal30Days", data.goal30Days);
    },
    [form]
  );

  const handleFileAccepted = useCallback(
    async (file: File) => {
      setDocumentLoading(true);
      try {
        const result = await parseDocument(file);
        applyParsedDocument(result);
        setMode("manual");
      } finally {
        setDocumentLoading(false);
      }
    },
    [applyParsedDocument]
  );

  const stepSchemas = [step1Schema, step2Schema, step3Schema];
  const currentSchema = stepSchemas[step - 1];

  const goNext = useCallback(async () => {
    const valid = await form.trigger(
      Object.keys(currentSchema.shape) as (keyof ProjectCreateForm)[]
    );
    if (!valid) return;
    if (step < 3) setStep((s) => s + 1);
  }, [form, step, currentSchema]);

  const goBack = useCallback(() => {
    if (step > 1) setStep((s) => s - 1);
  }, [step]);

  const onSubmit = useCallback(
    async (data: ProjectCreateForm) => {
      setSubmitLoading(true);
      try {
        const result = await createProject(data);
        router.push(`/proyectos/${result.id}`);
      } finally {
        setSubmitLoading(false);
      }
    },
    [router]
  );

  return (
    <ProjectFormLayout currentStep={step}>
      {/* Mode switcher */}
      <div className="mb-10">
        <div className="flex rounded-xl border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
              mode === "manual"
                ? "bg-primary text-on-primary"
                : "text-text-secondary hover:bg-background hover:text-text-primary"
            }`}
          >
            Crear manualmente
          </button>
          <button
            type="button"
            onClick={() => setMode("document")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
              mode === "document"
                ? "bg-primary text-on-primary"
                : "text-text-secondary hover:bg-background hover:text-text-primary"
            }`}
          >
            Generar desde documento
          </button>
        </div>
      </div>

      {mode === "document" && (
        <div className="mb-10">
          <UploadDropzone
            onFileAccepted={handleFileAccepted}
            loading={documentLoading}
          />
          <p className="mt-3 text-center text-xs text-text-secondary">
            Endpoint preparado: POST /api/projects/parse-document
          </p>
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10"
      >
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-8">
            <FormSection
              title="Información base"
              description="Datos esenciales del proyecto."
            >
              <InputField
                label="Nombre del proyecto"
                name="name"
                register={form.register}
                error={form.formState.errors.name}
                placeholder="Ej: Mi SaaS de reservas"
                required
              />
              <TextAreaField
                label="Descripción corta"
                name="description"
                register={form.register}
                error={form.formState.errors.description}
                placeholder="En una o dos frases, ¿qué es este proyecto?"
                required
                rows={2}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">
                  Categoría
                </label>
                <select
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-primary transition-colors duration-[250ms] focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  {...form.register("category")}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <InputField
                label="Público objetivo"
                name="targetAudience"
                register={form.register}
                error={form.formState.errors.targetAudience}
                placeholder="Ej: Pequeñas peluquerías"
              />
              <InputField
                label="Modelo de negocio"
                name="businessModel"
                register={form.register}
                error={form.formState.errors.businessModel}
                placeholder="Ej: Suscripción mensual"
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">
                  Nivel de ambición
                </label>
                <select
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-primary transition-colors duration-[250ms] focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  {...form.register("ambitionLevel")}
                >
                  {AMBITION_LEVELS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </FormSection>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <FormSection
            title="Visión estratégica"
            description="Problema, valor y objetivo a 30 días."
          >
            <TextAreaField
              label="Problema que resuelve"
              name="problem"
              register={form.register}
              error={form.formState.errors.problem}
              placeholder="¿Qué dolor o necesidad abordas?"
              rows={3}
            />
            <TextAreaField
              label="Propuesta de valor"
              name="valueProposition"
              register={form.register}
              error={form.formState.errors.valueProposition}
              placeholder="¿Por qué tu solución es única?"
              rows={3}
            />
            <TextAreaField
              label="Objetivo en 30 días"
              name="goal30Days"
              register={form.register}
              error={form.formState.errors.goal30Days}
              placeholder="Ej: Tener 10 usuarios activos"
              rows={2}
            />
            <InputField
              label="Métrica principal"
              name="mainMetric"
              register={form.register}
              error={form.formState.errors.mainMetric}
              placeholder="Ej: Conseguir 10 clientes"
            />
            <div className="rounded-xl border border-border bg-surface p-4">
              <Controller
                name="isPublic"
                control={form.control}
                render={({ field, fieldState }) => (
                  <ToggleField
                    label="Proyecto público"
                    description="Visible en Explorar y en tu perfil."
                    field={field}
                    fieldState={fieldState}
                  />
                )}
              />
            </div>
          </FormSection>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <FormSection
            title="Configuración de ejecución"
            description="Duración, fechas y opciones."
          >
            <InputField
              label="Duración (días)"
              name="durationDays"
              register={form.register}
              error={form.formState.errors.durationDays}
              type="number"
              required
            />
            <InputField
              label="Fecha de inicio"
              name="startDate"
              register={form.register}
              error={form.formState.errors.startDate}
              type="date"
              required
            />
            <div className="space-y-4 rounded-xl border border-border bg-surface p-4">
              <Controller
                name="buildInPublic"
                control={form.control}
                render={({ field, fieldState }) => (
                  <ToggleField
                    label="Build in public"
                    description="Compartir avances en el feed."
                    field={field}
                    fieldState={fieldState}
                  />
                )}
              />
              <Controller
                name="aiAssistantEnabled"
                control={form.control}
                render={({ field, fieldState }) => (
                  <ToggleField
                    label="Asistente IA"
                    description="Chat de IA dentro del proyecto."
                    field={field}
                    fieldState={fieldState}
                  />
                )}
              />
            </div>
          </FormSection>
        )}

        {/* Navigation */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-background"
              >
                Atrás
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-hover"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitLoading}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-hover disabled:opacity-70"
              >
                {submitLoading ? "Creando…" : "Crear proyecto"}
              </button>
            )}
          </div>
        </div>
      </form>

      <p className="mt-8 text-center text-xs text-text-secondary">
        Endpoint preparado: POST /api/projects
      </p>
    </ProjectFormLayout>
  );
}
