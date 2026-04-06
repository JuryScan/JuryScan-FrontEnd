import React from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";
import { NumericFormat, NumericFormatProps } from "react-number-format";

type CurrencyInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions;
};

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  name,
  label,
  placeholder = "R$ 0,00",
  rules,
}) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-sm">
        {label}
      </label>
      <NumericFormat
        id={name}
        placeholder={placeholder}
        className={`input-base ${error ? "border-red-500" : ""}`}
        thousandSeparator="."
        decimalSeparator="," 
        prefix="R$ "
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        onValueChange={(values: { value: string }) => setValue(name, values.value)}
        // Integração manual com React Hook Form
        {...register(name, rules)}
      />
      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};