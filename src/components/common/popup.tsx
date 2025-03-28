import { useMemo, useState } from "react";
import popupTexts from "../../translation/popup";
import { useLanguage } from "../../hooks/LanguageContext";
import Image from "next/image";
import CustomSelect from "../form/CustomSelect";
import FormField from "../form/FormField";
interface PopupProps {
  type: "success" | "error" | "confirmation" | "successInfo" | "errorPasswordInfo" | "deleteConfirmation" | "confirmApplication" | "applicationSuccess" | "cancelApplication"| "cancelSuccess" ;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
}

export default function Popup({ type, isOpen, onClose, onConfirm }: PopupProps) {
  const { language } = useLanguage();
  const currentLanguage = (language.toUpperCase() === "EN" ? "ENG" : language.toUpperCase()) || "ENG";

  // ใช้ useMemo เพื่อป้องกันการคำนวณซ้ำ
  const popupData = useMemo(() => {
    return popupTexts[currentLanguage]?.[type] ?? popupTexts["ENG"]["error"];
  }, [currentLanguage, type]);

  // State สำหรับเก็บค่าฟอร์มใน popup cancelApplication
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");

    // ตัวเลือก dropdown สาเหตุการยกเลิก (รองรับหลายภาษา)
  const reasonOptions = currentLanguage === "TH"
    ? [
        { value: "สมัครผิดหลักสูตร", label: "สมัครผิดหลักสูตร" },
        { value: "ต้องการแก้ไขข้อมูลการสมัคร", label: "ต้องการแก้ไขข้อมูลการสมัคร" },
        { value: "สมัครผ่านช่องทางอื่นแล้ว", label: "สมัครผ่านช่องทางอื่นแล้ว (เช่น TCAS รอบอื่น)" },
        { value: "มีปัญหาด้านเอกสาร", label: "มีปัญหาด้านเอกสาร / คุณสมบัติไม่ครบถ้วน" },
        { value: "อื่นๆ", label: "อื่นๆ (โปรดระบุ)" },
      ]
    : [
        { value: "wrong-course", label: "Applied for the wrong program" },
        { value: "edit-info", label: "Need to correct application information" },
        { value: "applied-elsewhere", label: "Already applied through another channel" },
        { value: "document-issue", label: "Issues with documents/qualifications are incomplete" },
        { value: "other", label: "Others (please specify)" },
      ];

  if (!isOpen) return null;

      return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className={`relative bg-white ${type === "cancelApplication" ? "w-[550px] p-6" : "w-[550px] h-[300px]"} rounded-lg shadow-lg text-center border border-gray-300 flex flex-col justify-center`}>

      {/* ปุ่มปิด (X) - แสดงเฉพาะ cancelApplication */}
      {type === "cancelApplication" && (
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer">
          <Image src="/images/close_icon.svg" alt="close" width={15} height={15} />
        </button>
      )}

      {/* Popup ยืนยันการยกเลิกสมัคร */}
      {type === "cancelApplication" ? (
        <>
          {/* หัวข้อ */}
          <h2 className="text-2xl font-bold text-[#565656] text-left">{popupData.title}</h2>

          {/* ข้อความแจ้งเตือน */}
          <div className="flex items-start gap-2 mt-3">
            <Image src="/images/Info_Message.svg" alt="info" width={24} height={24} />
            <p className="text-sm text-[#B3B3B3] text-left">
            {popupData.message}
            </p>
          </div>

          {/* ฟอร์มเลือกเหตุผล */}
          <div className="w-full flex flex-col items-start text-left mt-4">
            <div className="w-full max-w-[400px]">
              <CustomSelect
                label={popupData.reasonLabel}
                options={reasonOptions}
                value={reason}
                onChange={(selectedOption) => setReason(selectedOption ? selectedOption.value : null)}
                placeholder={popupData.selectReasonPlaceholder}
                width="100%"
                required
              />
            </div>

            {/* ฟิลด์รายละเอียดเพิ่มเติม */}
            <div className="w-full mt-4">
              <FormField
                label={<span>{popupData.additionalDetailsLabel} <span className="text-red-500">*</span></span>}
                value={details}
                onChange={(value) => setDetails(value)}
                placeholder={popupData.additionalDetailsPlaceholder}
                type="textarea"
              />
            </div>
          </div>

          {/* ปุ่มกด */}
          <div className="flex justify-center mt-6 gap-2">
            <button className="border border-[#B3B3B3] px-4 py-2 rounded-md text-[#565656]" onClick={onClose}>
            {popupData.cancelButton}
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                console.log("ยืนยันการยกเลิกสมัคร", { reason, details });
                if (onConfirm) {
                  onConfirm();
                }
              }}
              disabled={!reason || !details}
            >
            {popupData.buttonText}
            </button>
          </div>
        </>
      ) : (
        <>
        {/* Popup อื่นๆ */}
        <div className="flex justify-center mb-4">
          <Image src={popupData.image} alt={type} width={80} height={80} />
        </div>
      
        {/* หัวข้อและข้อความ */}
        <h2 className="text-2xl font-bold text-[#008A90]">{popupData.title}</h2>
        <p className="text-[#565656] mt-2 whitespace-pre-line">{popupData.message}</p>
      
        <div className="flex justify-center mt-4 gap-4">
          {type === "cancelSuccess" ? (
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-400 rounded-lg text-gray-600 bg-white hover:bg-gray-100 transition"
            >
              {popupData.buttonText}
            </button>
          ) : type === "deleteConfirmation" ? (
            <>
              <button
                onClick={onClose}
                className="w-[110px] h-[56px] border border-gray-400 rounded-lg text-gray-600 bg-white flex items-center justify-center"
              >
                {currentLanguage === "TH" ? "ไม่ใช่" : "Cancel"}
              </button>
              <button
                onClick={onConfirm}
                className="w-[110px] h-[56px] bg-[#008A90] text-white rounded-lg flex items-center justify-center"
              >
                {currentLanguage === "TH" ? "ใช่" : "Yes"}
              </button>
            </>
          ) : type === "confirmation" || type === "confirmApplication" ? (
            <>
              <button
                onClick={onClose}
                className="w-[110px] h-[56px] border border-gray-400 rounded-lg text-gray-600 bg-white flex items-center justify-center"
              >
                {currentLanguage === "TH" ? "ยกเลิก" : "Cancel"}
              </button>
              <button
                onClick={onConfirm}
                className="w-[110px] h-[56px] bg-[#008A90] text-white rounded-lg flex items-center justify-center"
              >
                {popupData.buttonText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-[110px] h-[56px] border border-gray-400 rounded-lg text-gray-600 bg-white hover:bg-gray-100 transition flex items-center justify-center"
            >
              {popupData.buttonText}
            </button>
          )}
        </div>
      </>
      )}
    </div>
  </div>
);
}
