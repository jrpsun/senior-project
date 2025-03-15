"use client";

import { useState, useRef, useEffect } from "react";
import FormField from "../form/FormField";
import Image from "next/image";

interface CheckboxDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[], otherValue?: string) => void;
  placeholder?: string; //เพิ่ม placeholder ที่รับค่าจาก SubscriptionForm
  otherPlaceholder?: string;
}

const CheckboxDropdown: React.FC<CheckboxDropdownProps> = ({ label, options, selected, onChange, placeholder, otherPlaceholder }) => {
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
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    onChange(newSelected, otherInput);
  };

  const clearSelection = () => {
    setOtherInput("");
    onChange([], "");
  };

  return (
    <div className="relative w-full max-w-7xl" ref={dropdownRef}>
      <div className="relative w-full">
        <label className="block text-[#565656] mb-2">{label}</label>
        <div className="flex flex-col xl:flex-row xl:items-center gap-3 xl:gap-6">
          <div className="w-full md:w-[625px] relative">
            <button
              type="button"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full flex justify-between items-center font-medium"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className={`truncate flex-grow text-left ${selected.length > 0 ? "text-[#565656]" : "text-[#C4C4C4]"}`}>
                {selected.length > 0
                  ? options.filter((opt) => selected.includes(opt.value)).map((opt) => opt.label).join(", ")
                  : placeholder || "เลือกช่องทาง"}
              </span>
              
              <div className="w-[18px] h-[18px] flex items-center justify-center">
                {selected.length > 0 && isOpen ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                    className="cursor-pointer w-[18px] h-[18px] flex items-center justify-center"
                  >
                    <Image src="/images/clear_icon.svg" alt="Clear Icon" width={18} height={18} />
                  </div>
                ) : (
                  <div className="w-[18px] h-[18px] flex items-center justify-center">
                    <Image src="/images/dropdown_button.svg" alt="Dropdown Icon" width={18} height={18} />
                  </div>
                )}
              </div>
            </button>
            {/* Dropdown Content */}
{/* Dropdown Content */}
{isOpen && (
  <div
    className="absolute top-full left-0 right-0 w-full max-w-sm 
               bg-white border border-gray-300 rounded-lg shadow-lg p-1 z-50 
               max-h-[200px] overflow-y-auto overflow-x-hidden"
  >
    {options.map((option) => (
      <label
        key={option.value}
        className="checkbox-label flex items-center w-full p-2 rounded cursor-pointer hover:bg-gray-100 text-[#565656]"
      >
        <input
          type="checkbox"
          id={option.value}
          checked={selected.includes(option.value)}
          onChange={() => handleCheckboxChange(option.value)}
          className="custom-checkbox mr-2"
        />
        {option.label}
      </label>
    ))}
  </div>
)}


          </div>

          {/* Input โปรดระบุ */}
                  {/* Input โปรดระบุ (แยกแถวสำหรับ Tablet) */}
          {selected.includes("other") && (
        <div className="w-full xl:w-[300px] flex-shrink-0 mt-3 xl:mt-0">
              <FormField
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder={otherInput ? otherInput : otherPlaceholder || "กรุณาระบุช่องทาง"}
                value={otherInput}
                onChange={(val) => {
                  setOtherInput(val);
                  onChange(selected, val);
                }}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CheckboxDropdown;
