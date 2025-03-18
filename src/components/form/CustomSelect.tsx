import Select, { components, StylesConfig } from "react-select";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "../../hooks/LanguageContext";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  options: Option[];
  value: string | null;
  onChange: (selectedOption: Option | null) => void;
  error?: string;
  placeholder?: string;
  width?: string;
  height?: string;
  isDisabled?: boolean;
  required?: boolean;
  boldLabel?: boolean;
}

const getCustomStyles = (width?: string, height?: string): StylesConfig<Option, false> => ({
  control: (provided, state) => ({
    ...provided,
    minHeight: height || "auto",
    height: height || "auto",
    width: width || "100%",
    fontSize: "16px",
    padding: "0px 8px",
    backgroundColor: state.isDisabled ? "F5F5F5" : "ffffff",
    borderColor: state.isDisabled ? "#A0A0A0" : "#cbd5e1",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: 1,
    color: state.isDisabled ? "#6D6D6D" : "#565656",
  }),
  menu: (provided) => ({
    ...provided,
    width: "100%",
  }),
  menuList: (provided) => ({
    ...provided,
    width: "100%",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? "#6D6D6D" : "#A0A0A0",
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: height || "auto",
    padding: "0px 8px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0px",
    height: height || "auto",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: height || "auto",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "4px",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: "4px",
  }),
});

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  error,
  placeholder,
  width,
  height,
  isDisabled = false,
  required = true,
  boldLabel = false,
}: CustomSelectProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { language } = useLanguage();
  const instanceId = `select-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const noOptionsText = language === "TH" ? "ไม่พบผลลัพธ์ที่ตรงกับคำค้นหา" : "No matching results found";

  return (
    <div className="relative w-full" style={{ maxWidth: width || "100%" }}>
            <label
        htmlFor={instanceId}
        className={`block text-[#565656] ${boldLabel ? "font-bold" : ""}`} 
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Select
        instanceId={instanceId}
        inputId={instanceId}
        options={options}
        value={options.find((option) => option.value === value) || null}

        onChange={onChange}
        placeholder={placeholder}
        isSearchable
        styles={getCustomStyles(width, height)}
        classNamePrefix="react-select"
        noOptionsMessage={() => noOptionsText}
        menuPlacement="auto"
        menuShouldScrollIntoView={false}
        isClearable
        isDisabled={isDisabled}
        className={`react-select ${error ? "react-select__control--is-invalid" : ""}`}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        components={{
          DropdownIndicator: (props) =>
            !menuIsOpen ? (
              <components.DropdownIndicator {...props}>
                <Image src="/images/dropdown_button.svg" alt="Dropdown Icon" width={16} height={16} />
              </components.DropdownIndicator>
            ) : null,
          ClearIndicator: (props) =>
            menuIsOpen && value ? (
              <components.ClearIndicator {...props}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                >
                  <Image src="/images/clear_icon.svg" alt="Clear Icon" width={18} height={18} />
                </button>
              </components.ClearIndicator>
            ) : null,
        }}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

