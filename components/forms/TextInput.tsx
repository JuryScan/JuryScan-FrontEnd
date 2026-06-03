"use client";
import React, { useRef, useEffect } from "react";
import { useFormContext, RegisterOptions, Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";

type TextInputProps = {
  name: string;
  label: string;
  mask?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  type?: "text" | "password" | "email" | "tel" | "number";
  icon?: React.ReactNode;
  disabled?: boolean;
};

export const TextInput: React.FC<TextInputProps> = ({
  name, label, mask, placeholder, rules, type = "text", icon, disabled,
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  const inputRef = useRef<any>(null);

  const inputClassName = `input-base w-full ${icon ? "pl-9" : ""} ${error ? "border-red-500 focus:ring-red-300" : ""} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-sm text-[#0A1F30]">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        )}
        
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            mask ? (
              <PatternFormat
                {...field}
                getInputRef={inputRef}
                format={mask.replace(/9/g, "#")}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                className={inputClassName}
                onBlur={() => {
                  field.onBlur()
                }}
                onValueChange={(values) => {
                  field.onChange(values.value)
                }}
              />
            ) : (
              <input
                {...field}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                className={inputClassName}
                type={type}
                onBlur={() => {
                  field.onBlur()
                }}
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
              />
            )
          )}
        />
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};
