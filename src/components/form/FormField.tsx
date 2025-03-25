// src/components/form/FormField.tsx
import React from "react";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  boldLabel?: boolean;
  height?: string; 
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  type = "text",
  placeholder = "",
  boldLabel = false,
  height
}) => (
  <div className="w-full">
    <label className={`block text-[#565656] ${boldLabel ? "font-bold" : ""}`}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    {type === "textarea" ? (
     <textarea
     value={value}
     onChange={(e) => onChange(e.target.value)}
     onBlur={onBlur}
     placeholder={placeholder}
     className={`w-full px-3 py-2 border-[1px] rounded-lg p-2 focus:outline-none focus:border-[#C4C4C4] 
       text-[#565656] caret-[#565656] placeholder:text-[#C4C4C4] 
       ${error ? "border-red-500" : "border-[#C4C4C4]"} ${height ?? "h-[100px]"} resize-none`}
   />
   

    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full px-3 py-2 border rounded-[10px] text-[#565656] ${
          error ? "border-red-500" : "border-[#C4C4C4]"
        }`}
        placeholder={placeholder}
      />
    )}

    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default FormField;
