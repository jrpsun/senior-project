import React, { useEffect } from "react";
import { X } from "lucide-react";

interface AlertProps {
  message: string;
  onClose: () => void;
}

const AlertAdmin: React.FC<AlertProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-[#166534] px-4 py-3 rounded-lg shadow-lg w-full max-w-[450px] md:right-8 md:top-6">
      {/* ปุ่มปิดที่มุมขวาบน */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X size={18} />
      </button>

      <div className="flex items-center gap-3 pr-6">
        {/* ไอคอนแจ้งเตือน */}
        <img src="/images/alertSuccess_icon.svg" alt="Success Icon" width={30} height={30} />

        {/* ข้อความแจ้งเตือน */}
        <span className="text-sm font-medium text-[#166534] break-words">
          {message}
        </span>
      </div>
    </div>
  );
};

export default AlertAdmin;
