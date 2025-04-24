'use client';
import { useEffect, useState } from "react";

interface SaveStatusModalProps {
  open: boolean;
  success: boolean;
  onClose: () => void;
}

export const SaveStatusModal = ({ open, success, onClose }: SaveStatusModalProps) => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
    } else {
      setShowSuccess(false);
    }
  }, [success]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 w-full max-w-sm text-center animate-fade-in">
            {!showSuccess ? (
            <>
                <div className="flex justify-center items-center mb-5">
                <div className="w-12 h-12 border-[3px] border-[#008A90] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-xl font-semibold text-[#008A90]">กำลังบันทึกข้อมูล...</p>
                <p className="text-sm text-gray-500 mt-1">กรุณารอสักครู่</p>
            </>
            ) : (
            <>
                <div className="text-4xl mb-2">✅</div>
                <p className="text-xl font-semibold text-[#008A90]">บันทึกสำเร็จ</p>
                <p className="text-sm text-gray-500 mt-1 mb-4">ข้อมูลของคุณถูกบันทึกแล้วเรียบร้อย</p>
                <button
                onClick={onClose}
                className="mt-2 px-6 py-2 bg-[#008A90] text-white rounded-lg hover:bg-[#00757c] transition font-medium shadow-md"
                >
                ปิดหน้าต่าง
                </button>
            </>
            )}
        </div>
    </div>
  );
};
