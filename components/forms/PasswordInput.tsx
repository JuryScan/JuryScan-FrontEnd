"use client";
import React, { useState } from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions;
};

export const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  label,
  placeholder,
  rules,
}) => {
  const [show, setShow] = useState(false);
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
      <div className="relative">
        <input
          {...register(name, rules)}
          id={name}
          placeholder={placeholder}
          className={`input-base pr-10 ${error ? "border-red-500 focus:ring-red-300" : ""}`}
          type={show ? "text" : "password"}
          aria-invalid={!!error}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#A50064] transition-colors"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};