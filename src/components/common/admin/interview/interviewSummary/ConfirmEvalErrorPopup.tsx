// components/admin/interview/summary/ConfirmEvalErrorPopup.tsx
import React from "react";
import Image from "next/image";

interface Props {
    onClose: () => void;
}

const ConfirmEvalErrorPopup: React.FC<Props> = ({ onClose }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black/20">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-[575px] w-full min-h-[100px] text-[#565656]">
                <div className="flex items-center justify-start mb-2">
                    <Image
                        src="/images/admin/preliminaryResult/warning_export_icon.svg"
                        alt="warning"
                        width={32}
                        height={32}
                    />
                    <h3 className="text-xl font-semibold ml-2">ไม่สามารถยืนยันผลสัมภาษณ์ได้</h3>
                </div>
                <p>
                    ยังมีผู้สมัครที่อยู่ในสถานะ <strong>&quot;รอพิจารณาเพิ่มเติม&quot;</strong> หรือ{" "}
                    <strong>&quot;รอผลการประเมินเพิ่มเติม&quot;</strong> กรุณาตรวจสอบและดำเนินการให้เรียบร้อย
                </p>
                
                <div className="mt-6 flex justify-center gap-2">
                    <button
                        className="min-w-[110px] px-6 py-2 bg-white text-[#565656] rounded-md border border-[#B3B3B3]"
                        onClick={onClose}
                    >
                        ปิด
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmEvalErrorPopup;
