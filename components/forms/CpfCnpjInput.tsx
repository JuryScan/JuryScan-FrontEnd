import React, { useState } from "react";
import { TextInput } from "./TextInput";

interface CpfCnpjInputProps {
  name: string;
  label: string;
  rules?: any;
}

export const CpfCnpjInput: React.FC<CpfCnpjInputProps> = ({ name, label, rules }) => {
  const [mask, setMask] = useState("999.999.999-99");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setMask(value.length > 11 ? "99.999.999/9999-99" : "999.999.999-99");
  };

  return (
    <TextInput
      name={name}
      label={label}
      mask={mask}
      rules={rules}
      placeholder={mask === "999.999.999-99" ? "000.000.000-00" : "00.000.000/0000-00"}
      onChange={handleChange}
    />
  );
};
