import React from "react";
import Image from "next/image";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmEvaluationPopup: React.FC<Props> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black/20">
      <div className="bg-white px-8 py-6 rounded-xl shadow-xl max-w-[480px] w-full text-center text-[#007B82]">
        
        <div className="flex justify-center mb-4">
          <Image
            src="/images/warning-icon.svg" // ใช้ไอคอนจากภาพ (หรือใช้ warning icon เดิมก็ได้)
            alt="confirm"
            width={70}
            height={70}
          />
        </div>
        <h2 className="text-[24px] font-bold mb-4">ต้องการยืนยันยืนยันผลสัมภาษณ์หรือไม่ ?</h2>

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="min-w-[100px] px-5 py-2 border border-gray-300 rounded-lg text-[#565656] "
            onClick={onCancel}
          >
            ยกเลิก
          </button>
          <button
            className="min-w-[100px] px-5 py-2 bg-[#008A90] text-white rounded-lg "
            onClick={onConfirm}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEvaluationPopup;
