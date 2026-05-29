"use client";
import React from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";
import { PatternFormat } from "react-number-format";

type TextInputProps = {
  name: string;
  label: string;
  mask?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  type?: "text" | "password" | "email" | "tel" | "number";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export const TextInput: React.FC<TextInputProps> = ({
  name, label, mask, placeholder, rules, type = "text", onChange, icon, disabled,
}) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  // Registro unico (evita chamar register() duas vezes) reaproveitado
  // pelos dois ramos (com mascara e sem mascara).
  const field = register(name, rules);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    if (onChange) onChange(e);
  };

  const inputClassName = `input-base w-full ${icon ? "pl-9" : ""} ${error ? "border-red-500 focus:ring-red-300" : ""} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-sm text-[#0A1F30]">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        )}
        {mask ? (
          // react-number-format e compativel com React 18 (forwardRef, sem
          // findDOMNode). As mascaras usam "9" para digito (estilo antigo),
          // convertido para "#" do PatternFormat.
          <PatternFormat
            {...field}
            onChange={handleChange}
            format={mask.replace(/9/g, "#")}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClassName}
          />
        ) : (
          <input
            {...field}
            onChange={handleChange}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClassName}
            type={type}
          />
        )}
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};
