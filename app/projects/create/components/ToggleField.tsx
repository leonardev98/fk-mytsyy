"use client";

import type { ControllerFieldState, ControllerRenderProps, FieldValues, Path } from "react-hook-form";

type ToggleFieldProps<T extends FieldValues> = {
  label: string;
  description?: string;
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
};

export function ToggleField<T extends FieldValues>({
  label,
  description,
  field,
}: ToggleFieldProps<T>) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
        {description != null && description !== "" && (
          <p className="mt-0.5 text-xs text-text-secondary">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={!!field.value}
        onClick={() => field.onChange(!field.value)}
        className="relative h-7 w-12 shrink-0 rounded-full bg-border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background data-[state=checked]:bg-accent"
        style={{ backgroundColor: field.value ? "var(--accent)" : "var(--border)" }}
        data-state={field.value ? "checked" : "unchecked"}
      >
        <span
          className="absolute left-1 top-1 h-5 w-5 rounded-full bg-surface shadow-sm transition-transform duration-200"
          style={{ transform: field.value ? "translateX(20px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}
