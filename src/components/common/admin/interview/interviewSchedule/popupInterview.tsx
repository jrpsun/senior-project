import React from "react";
import CustomSelect from "@components/components/form/CustomSelect";
import Image from "next/image";



const PopupInterview = ({
    interviewDetail,
    setInterviewDetail,
    handleSave,
    courseOptions,
    roundOptions,
    onCancel,
    isEdit = false,
    isRoundDisabled,

}: {
    interviewDetail: {
        course: string;
        round: string;
        date: string;
        startTime: string;
        endTime: string;
        duration: number;
    };
    setInterviewDetail: (detail: {
        course: string;
        round: string;
        date: string;
        startTime: string;
        endTime: string;
        duration: number;
    }) => void;
    handleSave: () => void;
    courseOptions: { value: string; label: string }[];
    roundOptions: { value: string; label: string }[];
    isRoundDisabled: boolean;
    onCancel: () => void;
    isEdit?: boolean;
}) => {
    return (
        <div className="rounded-xl p-6 max-w-6xl w-full px-2 py-1">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px] font-semibold text-[#565656]">
                    {isEdit ? "แก้ไขข้อมูลรอบสัมภาษณ์" : "กำหนดการสัมภาษณ์"}
                </h2>
                <button
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition z-50"
                    onClick={onCancel}
                >
                    <Image
                        src="/images/close_icon.svg"
                        alt="Close"
                        width={24}
                        height={24}
                        className="w-[20px] h-[20px]"
                    />
                </button>
            </div>


            <hr className="border-gray-300 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                {/* หลักสูตร */}
                <CustomSelect
                    label="หลักสูตร"
                    options={courseOptions}
                    value={interviewDetail.course}
                    onChange={(selectedOption: { value: string; label: string } | null) =>
                        setInterviewDetail({ ...interviewDetail, course: selectedOption?.value || "" })
                    }
                    placeholder="เลือกหลักสูตร"
                    required={false}
                />

                {/* รอบรับสมัคร */}
                <CustomSelect
                    label="รอบรับสมัคร"
                    options={roundOptions}
                    value={interviewDetail.round}
                    onChange={(selectedOption: { value: string; label: string } | null) =>
                        setInterviewDetail({ ...interviewDetail, round: selectedOption?.value || "" })
                    }
                    placeholder="เลือกรอบรับสมัคร"
                    required={false}
                    isDisabled={isRoundDisabled}
                />


                {/* วันที่สัมภาษณ์ */}
                <div>
                    <label className="block text-[#565656] font-medium mb-1">วันที่สัมภาษณ์</label>
                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                        value={interviewDetail.date}
                        onChange={(e) => setInterviewDetail({ ...interviewDetail, date: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-end">
                {/* เวลาเริ่มต้น */}
                <div>
                    <label className="block text-[#565656] font-medium mb-1">เวลาเริ่มต้น</label>
                    <input
                        type="time"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                        value={interviewDetail.startTime}
                        onChange={(e) => setInterviewDetail({ ...interviewDetail, startTime: e.target.value })}
                    />
                </div>

                {/* เวลาสิ้นสุด */}
                <div>
                    <label className="block text-[#565656] font-medium mb-1">เวลาสิ้นสุด</label>
                    <input
                        type="time"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                        value={interviewDetail.endTime}
                        onChange={(e) => setInterviewDetail({ ...interviewDetail, endTime: e.target.value })}
                    />
                </div>

                {/* ระยะเวลา */}
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <label className="block text-[#565656] font-medium mb-1">ระยะเวลาสัมภาษณ์ (ต่อคน)</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                            value={interviewDetail.duration}
                            onChange={(e) =>
                                setInterviewDetail({ ...interviewDetail, duration: Number(e.target.value) })
                            }
                        />
                    </div>
                    <span className="pt-6 text-[#565656]">นาที</span>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    className="w-[120px] px-6 py-2 border border-[#B3B3B3] rounded-lg text-[#565656] bg-white"
                    onClick={onCancel}
                >
                    ยกเลิก
                </button>

                <button
                    onClick={handleSave}
                    className="w-[120px] px-6 py-2 bg-[#008A90] text-white rounded-lg flex items-center gap-2"
                >
                    <Image src="/images/admin/save_icon.svg" alt="Save" width={18} height={18} />
                    บันทึก
                </button>
            </div>
        </div>
    );
};

export default PopupInterview;
