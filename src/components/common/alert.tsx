import React, { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface AlertProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // หายไปอัตโนมัติใน 3 วินาที

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 bg-white border px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-[90%] md:max-w-[600px] ${
        type === "success" ? "border-green-500" : "border-red-500"
      }`}
    >
      {/* ไอคอนแจ้งเตือน */}
      {type === "success" ? (
        <CheckCircle className="text-[#166534" size={25} />
      ) : (
        <img src="/images/error-icon.svg" alt="Error Icon" width={25} height={25} />
      )}

      {/* ข้อความแจ้งเตือน (กำหนดความกว้าง 600px เมื่อหน้าจอใหญ่) */}
      <span
        className={`text-sm font-medium break-words ${
          type === "success" ? "text-[#008A90]" : "text-[#D92D20]"
        }`}
      >
        {message}
      </span>

      {/* ปุ่มปิด */}
      <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-700">
        <X size={18} />
      </button>
    </div>
  );
};

export default Alert;
