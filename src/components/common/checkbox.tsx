"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import FormField from "../form/FormField";

interface CheckboxDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[], otherValue?: string) => void;
}

const CheckboxDropdown: React.FC<CheckboxDropdownProps> = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [otherInput, setOtherInput] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckboxChange = (value: string) => {
    let newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    onChange(newSelected, otherInput);
  };

  return (
    <div className="relative w-full max-w-2xl" ref={dropdownRef}>
      <label className="block text-[#008A90] font-semibold mb-2">{label} *</label>

      <div className="flex items-center gap-2">
        {/* Dropdown Button */}
        <button
          type="button"
          className="border border-gray-300 rounded-lg p-2 w-full flex justify-between items-center text-[#565656] font-medium overflow-hidden text-ellipsis max-w-[400px]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate max-w-[725px]">
            {selected.length > 0
              ? options.filter(opt => selected.includes(opt.value)).map(opt => opt.label).join(", ")
              : "เลือกช่องทาง"}
          </span>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </button>

        {/* ถ้าเลือก "อื่นๆ" ให้แสดง input ด้านขวา */}
        {selected.includes("other") && (
          <div className="w-full max-w-[250px]">
            <FormField
              label="โปรดระบุ"
              value={otherInput}
              onChange={(val) => {
                setOtherInput(val);
                onChange(selected, val);
              }}
              placeholder="ระบุช่องทาง"
            />
          </div>
        )}
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10">
          {options.map((option) => (
            <label key={option.value} className="checkbox-label flex items-center w-full p-2 rounded cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                id={option.value}
                checked={selected.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
                className="custom-checkbox mr-3"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckboxDropdown;
