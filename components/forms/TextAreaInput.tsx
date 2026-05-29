"use client";
import React from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";

type TextAreaInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  rules?: RegisterOptions;
};

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  name,
  label,
  placeholder,
  rows = 4,
  rules,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-sm text-[#0A1F30]">
        {label}
      </label>
      <textarea
        {...register(name, rules)}
        id={name}
        rows={rows}
        placeholder={placeholder}
        className={`input-base resize-none ${error ? "border-red-500 focus:ring-red-300" : ""}`}
      />
      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};
