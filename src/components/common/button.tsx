import React from "react";
import Image from "next/image";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "next" | "back" | "viewDetail" | "payment" | "interviewInfo";
  icon?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", icon, children, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition flex items-center justify-center gap-2";

  const variants = {
    
    // Button//
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    outline: "border border-gray-500 text-gray-700 hover:bg-gray-100",
    next: "bg-[#008A90] text-white w-[120px] h-10 rounded-md",
    back: "border border-[#008A90] text-[#008A90] w-[120px] h-10 rounded-md bg-white",
    viewDetail: "bg-[#008A90] text-white text-xs px-2 py-2 rounded-md flex items-center gap-1",  // ลดขนาดอักษร
    payment: "bg-green-500 text-white text-xs px-3 py-1 rounded-md flex items-center gap-1 hover:bg-green-600", // ลดขนาดอักษร
    interviewInfo: "bg-[#40A8AC] text-white text-xs px-3 py-1 rounded-md flex items-center gap-1 hover:bg-[#00757a]", // ลดขนาดอักษร
  };
  

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {(variant !== "interviewInfo" && variant !== "viewDetail" && variant !== "payment" && icon) && <Image src={icon} alt="button icon" width={12} height={20} />} 
      {(variant === "viewDetail") && <Image src="/images/application-status/view_icon.svg" alt="view icon" width={20} height={20} />} 
      {(variant === "payment") && <Image src="/images/application-status/payment_icon.svg" alt="payment icon" width={20} height={20} />} 
      {children}
      {variant === "interviewInfo" && <Image src="/images/application-status/interview_icon.svg" alt="interview icon" width={20} height={20} />} 
    </button>
  );
};

const BackButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Button variant="back" icon="/images/back_arrow.svg">{children}</Button>;
};

const NextButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Button variant="next" icon="/images/next_arrow.svg">{children}</Button>;
};

const ViewDetailButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Button variant="viewDetail">{children}</Button>;
};

const PaymentButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Button variant="payment">{children}</Button>;
};

const InterviewInfoButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Button variant="interviewInfo">{children}</Button>;
};

export { Button, BackButton, NextButton, ViewDetailButton, PaymentButton, InterviewInfoButton };
