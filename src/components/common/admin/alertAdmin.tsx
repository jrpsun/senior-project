import React, { useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface AlertProps {
  message: string;
  onClose: () => void;
  type?: "success" | "warning" | "document";
}

const AlertAdmin: React.FC<AlertProps> = ({
  message,
  onClose,
  type = "success",
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styleMap = {
    success: {
      border: "#166534",
      text: "#166534",
      icon: "/images/alertSuccess_icon.svg",
      alt: "Success Icon",
    },
    warning: {
      border: "#DAA520",
      text: "#DAA520",
      icon: "/images/alertWarning_icon.svg",
      alt: "Warning Icon",
    },
    document: {
      border: "F57C00",
      text: "#F57C00",
      icon: "/images/alertDocument_icon.svg",
      alt: "Warning Icon",
    },
  };

  const { border, text, icon, alt } = styleMap[type];

  return (
    <div
      className="fixed top-4 right-4 z-50 bg-white px-4 py-3 rounded-lg shadow-lg w-full max-w-[450px] md:right-8 md:top-6"
      style={{ border: `1px solid ${border}` }}
    >
      {/* ปุ่มปิดที่มุมขวาบน */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X size={18} />
      </button>

      <div className="flex items-center gap-3 pr-6">
        {/* ไอคอนแจ้งเตือน */}
        <Image src={icon} alt={alt} width={30} height={30} />

        {/* ข้อความแจ้งเตือน */}
        <span
          className="text-sm font-medium break-words whitespace-pre-line"
          style={{ color: text }}
        >
          {message}
        </span>
      </div>
    </div>
  );
};

export default AlertAdmin;
