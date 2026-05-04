import React from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";

type Option = {
  value: string | number;
  label: string;
};

type RadioInputProps = {
  name: string;
  label: string;
  options: Option[];
  rules?: RegisterOptions;
};

export const RadioInput: React.FC<RadioInputProps> = ({
  name,
  label,
  options,
  rules,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-sm">{label}</span>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="inline-flex items-center gap-2">
            <input
              type="radio"
              value={opt.value}
              {...register(name, rules)}
              className={`radio-base ${error ? "border-red-500" : ""}`}
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};