import React from "react";
import Image from "next/image";


interface PopupCancelReasonProps {
    reason: string;
    details: string;
    onClose: () => void;
}

const PopupCancelReason: React.FC<PopupCancelReasonProps> = ({
    reason,
    details,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-[500px] max-w-full text-[#565656]">
                <div className="flex items-center gap-2 mb-4">
                    <Image
                        src="/images/admin/applicant/reason_cancel_icon.svg"
                        alt="Cancel Reason Icon"
                        width={28}
                        height={28}
                    />

                    <h2 className="text-xl font-bold ">เหตุผลการยกเลิกการสมัคร</h2>
                </div>

                <div className="mb-4">
                    <p className="font-semibold ">สาเหตุในการยกเลิก</p>
                    <p className="text-[#555]">{reason}</p>
                </div>

                <div className="mb-6">
                    <p className="font-semibold ">รายละเอียดเพิ่มเติม</p>
                    <p className="text-[#555]">{details}</p>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="w-[110px] px-6 py-2 bg-white border border-gray-400 rounded-lg text-gray-700 "
                    >
                        ปิด
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PopupCancelReason;
