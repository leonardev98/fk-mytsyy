"use client";

import type { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

type TextAreaFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
  rows?: number;
};

export function TextAreaField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  placeholder,
  required,
  rows = 3,
}: TextAreaFieldProps<T>) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-text-primary"
      >
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary transition-colors duration-[250ms] focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        {...register(name)}
      />
      {error?.message && (
        <p className="text-xs text-accent" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
