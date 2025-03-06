import React from "react";
import Image from "next/image";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "next";
  icon?: string; // เพิ่ม prop สำหรับไอคอน
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", icon, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md text-white font-medium transition flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700",
    secondary: "bg-gray-500 hover:bg-gray-600",
    outline: "border border-gray-500 text-gray-700 hover:bg-gray-100",
    next: "bg-[#008A90] text-white w-[175px] h-[60px] rounded-[10px] hover:bg-[#00737A]", // สไตล์ของปุ่มถัดไป
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {children}
      {icon && <Image src={icon} alt="button icon" width={12} height={12} />} {/* รองรับไอคอน */}
    </button>
  );
};

export default Button;
