import React from "react";
import Image from "next/image";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "next" | "back";
  icon?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", icon, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    outline: "border border-gray-500 text-gray-700 hover:bg-gray-100",
    next: "bg-[#008A90] text-white w-[175px] h-[60px] rounded-[10px]",
    back: "border border-[#008A90] text-[#008A90] font-semibold w-[175px] h-[60px] rounded-[10px] bg-white",
  };

 return (
  <button className={`${baseStyles} ${variants[variant]}`} {...props}>
    {/* ถ้าเป็นปุ่มย้อนกลับ (back) ให้ไอคอนอยู่ข้างหน้า */}
    {variant === "back" && icon && <Image src={icon} alt="button icon" width={12} height={12} />}
    
    {children}

    {/* ถ้าเป็นปุ่มถัดไป (next) ให้ไอคอนอยู่ข้างหลัง */}
    {variant === "next" && icon && <Image src={icon} alt="button icon" width={12} height={12} />}
  </button>
);
};

export default Button;


