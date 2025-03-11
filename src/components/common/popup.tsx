import { useMemo } from "react";
import popupTexts from "../../translation/popup"; 
import { useLanguage } from "../../hooks/LanguageContext"; 
import Image from "next/image";

interface PopupProps {
  type: "success" | "error" | "confirmation" | "successInfo" | "errorPasswordInfo";
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function Popup({ type, isOpen, onClose, onConfirm }: PopupProps) {
  const { language } = useLanguage();
  const currentLanguage = (language.toUpperCase() as "TH" | "ENG") || "ENG";

  // ใช้ useMemo เพื่อป้องกันการคำนวณซ้ำ
  const popupData = useMemo(() => {
    return popupTexts[currentLanguage]?.[type] ?? popupTexts["ENG"]["error"];
  }, [currentLanguage, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[550px] h-[300px] p-6 rounded-lg shadow-lg text-center border border-gray-300 flex flex-col justify-center">
        {/* แสดงไอคอนของ Popup */}
        <div className="flex justify-center mb-4">
          <Image src={popupData.image} alt={type} width={80} height={80} />
        </div>

        {/* หัวข้อและข้อความ */}
        <h2 className="text-2xl font-bold text-[#008A90]">{popupData.title}</h2>
        <p className="text-[#565656] mt-2 whitespace-pre-line">{popupData.message}</p>

        {/* ปุ่มกด */}
        <div className="flex justify-center mt-4 gap-4">
          {type === "confirmation" ? (
            <>
              <button
                onClick={onClose}
                className="w-[110px] h-[56px] border border-gray-400 rounded-lg text-gray-600 bg-white"
              >
                {currentLanguage === "TH" ? "ยกเลิก" : "Cancel"}
              </button>
              <button
                onClick={onConfirm}
                className="w-[110px] h-[56px] bg-[#008A90] text-white rounded-lg"
              >
                {popupData.buttonText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-[110px] h-[56px] border border-gray-400 rounded-lg text-gray-600 bg-white hover:bg-gray-100 transition"
            >
              {popupData.buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
