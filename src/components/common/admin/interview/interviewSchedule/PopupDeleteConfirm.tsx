import React from "react";
import Image from "next/image";

interface PopupDeleteConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const PopupDeleteConfirm: React.FC<PopupDeleteConfirmProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-[525px] w-full shadow-lg relative">
        <div className="flex items-start gap-3 mb-4">
          <Image src="/images/admin/permission/warning_icon.svg" alt="Warning" width={32} height={32} />
          <div>
            <h2 className="text-[20px] font-semibold text-[#565656] mb-1">
              ยืนยันการลบข้อมูลการสัมภาษณ์?
            </h2>
            <button
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition z-50"
              onClick={onCancel}
            >
              <Image src="/images/close_icon.svg" alt="Close" width={24} height={24} className="w-[20px] h-[20px]" />
            </button>
            <p className="text-[#565656]">
              หากคุณลบข้อมูลการสัมภาษณ์ รายการนี้จะไม่สามารถกู้คืนได้
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 border border-[#B3B3B3] rounded-[8px] text-[15px] text-[#565656] w-full md:w-auto min-w-[100px] text-center"
            onClick={onCancel}
          >
            ยกเลิก
          </button>

          <button
            className="px-4 py-2 bg-[#D92D20] text-[15px] text-white rounded-[8px] flex items-center gap-2 w-full md:w-auto min-w-[110px] justify-center"
            onClick={onConfirm}
          >
            <Image src="/images/admin/permission/confirm_delete_user.svg" alt="Delete" width={18} height={18} />
            ยืนยันการลบ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupDeleteConfirm;