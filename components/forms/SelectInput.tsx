import React from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";

type Option = {
  value: string | number;
  label: string;
};

type SelectInputProps = {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  rules?: RegisterOptions;
};

export const SelectInput: React.FC<SelectInputProps> = ({
  name,
  label,
  options,
  placeholder = "Selecione...",
  rules,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-sm">
        {label}
      </label>
      <select
        {...register(name, rules)}
        id={name}
        className={`input-base ${error ? "border-red-500" : ""}`}
        defaultValue=""
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};