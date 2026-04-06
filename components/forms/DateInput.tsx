import React from "react";
import { TextInput } from "./TextInput";
import { RegisterOptions } from "react-hook-form";

interface DateInputProps {
  name: string;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions;
}

export const DateInput: React.FC<DateInputProps> = ({
  name,
  label,
  placeholder = "dd/mm/aaaa",
  rules,
}) => {
  return (
    <TextInput
      name={name}
      label={label}
      mask="99/99/9999"
      placeholder={placeholder}
      rules={rules}
    />
  );
};
