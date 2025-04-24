'use client'

interface OCRLoadingModalProps {
  open: boolean;
}

export const OCRLoadingModal: React.FC<OCRLoadingModalProps> = ({ open }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-8 shadow-lg flex flex-col items-center gap-4 w-[300px]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <h2 className="text-lg font-semibold text-gray-800">กำลังประมวลผล OCR</h2>
        <p className="text-sm text-gray-500 text-center">
          ระบบกำลังโหลดข้อมูลจากไฟล์ กรุณารอสักครู่...
        </p>
      </div>
    </div>
  );
};