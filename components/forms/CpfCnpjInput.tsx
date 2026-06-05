"use client";
import React from "react";
import { TextInput } from "./TextInput";

interface CpfCnpjInputProps {
  name: string;
  label: string;
  rules?: any;
}

export const CpfCnpjInput: React.FC<CpfCnpjInputProps> = ({ name, label, rules }) => {
  return (
    <TextInput
      name={name}
      label={label}
      mask="999.999.999-99"
      rules={rules}
      placeholder="000.000.000-00"
    />
  );
};
