import React from "react";
import Image from "next/image";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "next" | "back" | "viewDetail" | "payment" | "interviewInfo" | "confirmApplication" | "printDocument" | "cancelApplication";
  icon?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", icon, children, ...props }) => {
  const baseStyles = "px-4 py-3 rounded-md font-medium transition flex items-center justify-center gap-2";

  const variants = {
    // Button Variants
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    outline: "border border-gray-500 text-gray-700 hover:bg-gray-100",
    next: "bg-[#008A90] text-white w-[140px] h-12 rounded-md",
    back: "border border-[#008A90] text-[#008A90] w-[140px] h-12 rounded-md bg-white",
    viewDetail: "bg-[#008A90] text-white text-xs px-2 py-3 rounded-md flex items-center gap-1",
    payment: "bg-green-500 text-white text-xs px-3 py-3 rounded-md flex items-center gap-1 hover:bg-green-600",
    interviewInfo: "bg-[#40A8AC] text-white text-xs px-3 py-3 rounded-md flex items-center gap-1 hover:bg-[#00757a]",
    confirmApplication: "bg-[#008A90] text-white w-[140px] h-12 rounded-md",
    printDocument: "border border-[#008A90] text-[#008A90] px-2 py-2 rounded-md flex items-center gap-2",
    cancelApplication: "border border-red-500 text-red-500 px-2 py-2 rounded-md flex items-center gap-2",
  }

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {/* ไอคอนแสดงด้านหน้า ยกเว้นปุ่ม next */}
      {(variant !== "interviewInfo" && variant !== "viewDetail" && variant !== "payment" && variant !== "confirmApplication" && variant !== "next" && icon) && (
        <Image src={icon} alt="button icon" width={12} height={20} />
      )}
      {variant === "cancelApplication" && (
        <Image src="/images/cancel_icon.svg" alt="cancel icon" width={18} height={18} />
      )}
            {variant === "printDocument" && (
        <Image src="/images/print_icon.svg" alt="cancel icon" width={18} height={18} />
      )}


      {children} {/* ข้อความปุ่ม */}

      {/* แสดงไอคอนด้านหลังเฉพาะปุ่ม next */}
      {variant === "next" && <Image src="/images/next_arrow.svg" alt="next icon" width={12} height={20} />}
      
      {(variant === "viewDetail") && <Image src="/images/application-status/view_icon.svg" alt="view icon" width={20} height={20} />}
      {(variant === "payment") && <Image src="/images/application-status/payment_icon.svg" alt="payment icon" width={20} height={20} />}
      {(variant === "interviewInfo") && <Image src="/images/application-status/interview_icon.svg" alt="interview icon" width={20} height={20} />}
    </button>
  );
};

// ปุ่มต่าง ๆ ที่ใช้ในระบบ
const BackButton: React.FC<{ children: React.ReactNode; onClick?: () => void }>= ({ children, onClick }) => {
  return <Button variant="back" onClick={onClick} icon="/images/back_arrow.svg">{children}</Button>;
};

const NextButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  return <Button variant="next" onClick={onClick}>{children}</Button>;
};


const ViewDetailButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  return <Button variant="viewDetail" onClick={onClick}>{children}</Button>;
};

const PaymentButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children }) => {
  return <Button variant="payment">{children}</Button>;
};

const InterviewInfoButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children }) => {
  return <Button variant="interviewInfo">{children}</Button>;
};

const ConfirmApplicationButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children }) => {
  return <Button variant="confirmApplication">{children}</Button>;
};

// ปุ่มพิมพ์เอกสาร
const PrintDocumentButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children }) => {
  return <Button variant="printDocument">{children}</Button>;
};

// ปุ่มยกเลิกการสมัคร
const CancelApplicationButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  return <Button variant="cancelApplication" onClick={onClick}>{children}</Button>;
};

export {
  Button,
  BackButton,
  NextButton,
  ViewDetailButton,
  PaymentButton,
  InterviewInfoButton,
  ConfirmApplicationButton,
  PrintDocumentButton,
  CancelApplicationButton,
};
