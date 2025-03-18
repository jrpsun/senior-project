import React, { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface AlertProps {
  message: string;
  onClose: () => void;
}

const AlertAdmin: React.FC<AlertProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // หายไปอัตโนมัติใน 3 วินาที

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-green-500 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-[90%] md:max-w-[600px]">
      {/* ไอคอนเช็คถูกสีเขียว */}
      <CheckCircle className="text-green-500" size={25} />

      {/* ข้อความแจ้งเตือน */}
      <span className="text-sm font-medium text-[#008A90] break-words">{message}</span>

      {/* ปุ่มปิด */}
      <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-700">
        <X size={18} />
      </button>
    </div>
  );
};

export default AlertAdmin;
