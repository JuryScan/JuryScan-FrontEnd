"use client";
import React from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";

type CheckboxInputProps = {
  name: string;
  label: string;
  rules?: RegisterOptions;
};

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  name,
  label,
  rules,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1">
      <label className="inline-flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          {...register(name, rules)}
          className={`checkbox-base ${error ? "border-red-500 focus:ring-red-300" : ""}`}
        />
        <span className="text-sm text-[#0A1F30] font-medium group-hover:text-[#A50064] transition-colors">
          {label}
        </span>
      </label>
      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};