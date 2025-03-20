import React, { useState } from "react";
import Select, { components, StylesConfig } from "react-select";
import Image from "next/image";

interface Option {
    value: string;
    label: string;
}

interface SearchFieldProps {
    label: string;
    value: string | null;
    onChange: (selectedOption: Option | string | null) => void;
    placeholder?: string;
    type?: "text" | "dropdown";
    options?: Option[];
    error?: string;
    isDisabled?: boolean;
    required?: boolean;
    customWidth?: string;
}

const getCustomStyles = (): StylesConfig<Option, false> => ({
    control: (provided, state) => ({
        ...provided,
        minHeight: "35px",
        height: "35px",
        width: "100%",
        fontSize: "16px",
        paddingLeft: "40px",
        padding: "0px 8px",
        backgroundColor: state.isDisabled ? "#F5F5F5" : "#FFFFFF",
        borderColor: state.isDisabled ? "#A0A0A0" : "#C4C4C4",
        cursor: state.isDisabled ? "not-allowed" : "pointer",
        opacity: 1,
        color: state.isDisabled ? "#6D6D6D" : "#565656",
        borderRadius: "10px",
        boxShadow: "none",
        display: "flex",
        alignItems: "center",
        "&:hover": { borderColor: "#A0A0A0" },
    }),
    menu: (provided) => ({
        ...provided,
        width: "100%",
        zIndex: 10,
    }),
    menuList: (provided) => ({
        ...provided,
        width: "100%",
    }),
    placeholder: (provided, state) => ({
        ...provided,
        paddingLeft: "15px",
        color: state.isDisabled ? "#6D6D6D" : "#A0A0A0",
    }),
    valueContainer: (provided) => ({
        ...provided,
        paddingLeft: "15px",
        height: "32px",
        display: "flex",
        alignItems: "center",
    }),
    input: (provided) => ({
        ...provided,
        margin: "0px",
        height: "32px",
        paddingLeft: "10px",
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        height: "32px",
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        padding: "4px",
    }),
    clearIndicator: (provided) => ({
        ...provided,
        padding: "4px",
        cursor: "pointer",
    }),
});

const SearchField: React.FC<SearchFieldProps> = ({
    label,
    value,
    onChange,
    placeholder = "",
    type = "text",
    options = [],
    error,
    isDisabled = false,
    required = false,
    customWidth,
}) => {
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    const CustomIndicator = (props: any) => (
        menuIsOpen && value ? (
            <components.ClearIndicator {...props}>
                <button
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onChange(null);
                    }}
                    className="p-1"
                >
                    <Image src="/images/clear_icon.svg" alt="Clear" width={16} height={16} />
                </button>
            </components.ClearIndicator>
        ) : (
            <components.DropdownIndicator {...props}>
                <Image src="/images/dropdown_button.svg" alt="Dropdown" width={16} height={16} />
            </components.DropdownIndicator>
        )
    );
    const CustomSingleValue = (props: any) => (
        <components.SingleValue {...props}>
            <div style={{ paddingLeft: "20px" }}>{props.children}</div>
        </components.SingleValue>
    );

    return (
        <div className="relative" style={{ width: customWidth || "100%" }}>
            <label className="block text-[#565656] font-bold mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="relative">
                {type === "dropdown" && (
                    <Image
                        src="/images/admin/search_icon.svg"
                        alt="Search Icon"
                        width={16}
                        height={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                    />
                )}
                {type === "dropdown" ? (
                    <Select
                        instanceId={`select-${label.replace(/\s+/g, "-").toLowerCase()}`}
                        options={options}
                        value={
                            value && typeof value === "string"
                                ? options.find((option) => option.value === value) || null
                                : value
                        }
                        onChange={(selectedOption) => onChange(selectedOption)}
                        placeholder={placeholder}
                        isSearchable
                        styles={getCustomStyles()}
                        classNamePrefix="react-select"
                        isClearable
                        isDisabled={isDisabled}
                        onMenuOpen={() => setMenuIsOpen(true)}
                        onMenuClose={() => setMenuIsOpen(false)}
                        components={{ DropdownIndicator: CustomIndicator, ClearIndicator: () => null, SingleValue: CustomSingleValue }}
                    />

                ) : (
                    <div className="relative z-10 overflow-visible">
                        <input
                            type="text"
                            value={value as string}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className={`w-full px-3 py-2 pr-10 border-[1px] rounded-[10px] text-[#565656] caret-[#565656] placeholder:text-[#C4C4C4] 
        focus:outline-none focus:border-[#C4C4C4] 
        ${error ? "border-red-500" : "border-[#C4C4C4]"}`}
                            disabled={isDisabled}
                        />
                    </div>

                )}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );

};

export default SearchField;
