import Select, { components, StylesConfig } from "react-select";
import Image from "next/image";
import { useState } from "react";

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
  width?: string; // ทำให้ width กำหนดเองได้
  height?: string; // ทำให้ height กำหนดเองได้
  isDisabled?: boolean;
}
// ใช้ prop width & height เพื่อกำหนดขนาดได้อิสระ
const getCustomStyles = (width?: string, height?: string): StylesConfig<Option, false> => ({
  control: (provided, state) => ({
    ...provided,
    minHeight: height || "auto",
    height: height || "auto",
    width: width || "100%", // ถ้าไม่มี width ให้ใช้ 100% ของ parent
    fontSize: "16px",
    padding: "0px 8px",
    backgroundColor: state.isDisabled ? "#B3B3B3" : "#ffffff", // สีเทาอ่อนเมื่อ disabled
    borderColor: state.isDisabled ? "#d1d5db" : "#cbd5e1", // ขอบสีเทาเมื่อ disabled
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled ? 0.6 : 1,
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
}: CustomSelectProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const instanceId = `select-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="relative w-full" style={{ maxWidth: width || "100%" }}>
      <label htmlFor={instanceId} className="block text-[#565656]">
        {label} <span className="text-red-500">*</span>
      </label>
      <Select
        instanceId={instanceId}
        inputId={instanceId}
        options={options}
        value={options.find((option) => option.value === value)}
        onChange={onChange}
        placeholder={placeholder}
        isSearchable
        styles={getCustomStyles(width, height)} // ใช้ styles ที่รับค่า width & height
        classNamePrefix="react-select"
        noOptionsMessage={() => "ไม่พบผลลัพธ์ที่ตรงกับคำค้นหา"}
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
