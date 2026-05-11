import React from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";
import InputMask from "react-input-mask";

type TextInputProps = {
  name: string;
  label: string;
  mask?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  type?: "text" | "password" | "email" | "tel" | "number";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  mask,
  placeholder,
  rules,
  type = "text",
  onChange,
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
      {mask ? (
        <InputMask
          mask={mask}
          id={name}
          placeholder={placeholder}
          className={`input-base ${error ? "border-red-500 focus:ring-red-300" : ""}`}
          type={type}
          {...register(name, rules)}
          onChange={(e) => {
            register(name, rules).onChange(e);
            if (onChange) onChange(e);
          }}
        />
      ) : (
        <input
          {...register(name, rules)}
          id={name}
          placeholder={placeholder}
          className={`input-base ${error ? "border-red-500 focus:ring-red-300" : ""}`}
          type={type}
          onChange={(e) => {
            register(name, rules).onChange(e);
            if (onChange) onChange(e);
          }}
        />
      )}
      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};