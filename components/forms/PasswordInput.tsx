import React, { useState } from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";

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
      <label htmlFor={name} className="font-medium text-sm">
        {label}
      </label>
      <div className="relative">
        <input
          {...register(name, rules)}
          id={name}
          placeholder={placeholder}
          className={`input-base pr-10 ${error ? "border-red-500" : ""}`}
          type={show ? "text" : "password"}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};