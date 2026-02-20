"use client";

import type { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

type InputFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  type?: "text" | "email" | "number" | "date";
  placeholder?: string;
  required?: boolean;
};

export function InputField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  type = "text",
  placeholder,
  required,
}: InputFieldProps<T>) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-text-primary"
      >
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary transition-colors duration-[250ms] focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
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
