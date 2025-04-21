import React, { useEffect, useState } from "react";
import Image from "next/image";
import { InterviewCommitteeMember } from "@components/types/roomDetails";

const PopupEditInterviewRoom = ({
    roomData,
    onCancel,
    onSave,
    allInterviewers
}: {
    roomData: {
        interviewRoundId?: string;
        interviewDate?: string;
        interviewStartTime?: string;
        interviewEndTime?: string;
        admissionProgram?: string;
        admissionRoundName?: string;
        interviewRoomId?: string;
        interviewRoom?: string;
        interviewType?: string;
        interviewComs: InterviewCommitteeMember[];
    };
    onCancel: () => void;
    onSave: (updatedData: typeof roomData) => void;
    allInterviewers: {
        firstName: string;
        interviewComId: string;
        lastName: string;
        prefix: string;
    }[];
}) => {
    const [room, setRoom] = useState(roomData.interviewRoom || "");
    const [mode, setMode] = useState<string>("");
    const [interviewers, setInterviewers] = useState<InterviewCommitteeMember[]>(roomData.interviewComs || []);
    const [showDropdown, setShowDropdown] = useState(false);
    const combineInterviewers = [...roomData.interviewComs, ...allInterviewers]
    useEffect(() => {
        if (roomData?.interviewType) {
            setMode(roomData.interviewType);
        }
    }, [roomData?.interviewType]);

    const toggleInterviewer = (person: InterviewCommitteeMember) => {
        const exists = interviewers.find((i) => i.interviewComId === person.interviewComId);
        if (exists) {
            setInterviewers(interviewers.filter((i) => i.interviewComId !== person.interviewComId));
        } else {
            setInterviewers([...interviewers, person]);
        }
    };

    const handleSave = () => {
        onSave({
            ...roomData,
            interviewRoom: room,
            interviewType: mode,
            interviewComs: interviewers
        });
    };

    function renderRadioButton(value: string, label: string) {
        return (
            <label className="flex items-center cursor-pointer">
                <input
                    type="radio"
                    name="mode"
                    value={value}
                    checked={mode === value}
                    onChange={() => setMode(value)}
                    className="hidden"
                />
                <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === value ? "border-[#008A90] bg-[#008A90]" : "border-gray-400 bg-white"
                        }`}
                >
                    {mode === value && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
                <span className="ml-2 text-[#565656]">{label}</span>
            </label>
        );
    }
    
    console.log('edit coms', interviewers)
    console.log('edit room', room),
    console.log('edit type', mode)
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-[800px] w-full shadow-lg relative">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[20px] font-semibold text-[#565656]">แก้ไขข้อมูลการสัมภาษณ์</h2>
                    <button
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition z-50"
                        onClick={onCancel}
                    >
                        <Image src="/images/close_icon.svg" alt="Close" width={24} height={24} className="w-[20px] h-[20px]" />
                    </button>
                </div>

                <hr className="border-gray-300 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block font-medium text-[#565656] mb-1">หลักสูตร</label>
                        <div className=" px-3 py-2 ">{roomData.admissionProgram}</div>
                    </div>
                    <div>
                        <label className="block font-medium text-[#565656] mb-1">รอบรับสมัคร</label>
                        <div className="px-3 py-2">{roomData.admissionRoundName}</div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block font-medium text-[#565656] mb-1">รูปแบบการสัมภาษณ์</label>
                    <div className="flex items-center gap-6">
                        {renderRadioButton("On-site", "ออนไซต์ (On-site)")}
                        {renderRadioButton("Online", "ออนไลน์ (Online)")}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-[#565656] mb-1">ห้องสัมภาษณ์</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-4 w-full relative">
                    <label className="block font-medium text-[#565656] mb-1">ผู้สัมภาษณ์</label>
                    <div
                        className="w-full min-h-[44px] border border-gray-300 rounded-[8px] px-3 py-0.5 pr-10 flex items-center flex-wrap gap-2 relative cursor-pointer"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {interviewers.length === 0 ? (
                            <span className="text-[#C4C4C4]">กรุณาเลือกผู้สัมภาษณ์</span>
                        ) : (
                            interviewers.map((item) => (
                                <div
                                    key={item.interviewComId}
                                    className="flex items-center bg-gray-100 text-[#565656] rounded-xl px-3 py-0.5"
                                >
                                    {item.prefix} {item.firstName}
                                    <button
                                        className="ml-2 text-[#565656] hover:text-gray-700 text-2xl"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleInterviewer(item);
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        )}

                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {showDropdown && interviewers.length > 0 ? (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setInterviewers([]);
                                    }}
                                >
                                    <Image src="/images/clear_icon.svg" alt="Clear" width={18} height={18} />
                                </button>
                            ) : (
                                <Image src="/images/dropdown_button.svg" alt="Dropdown" width={16} height={16} />
                            )}
                        </div>
                    </div>

                    {showDropdown && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-[200px] overflow-y-auto shadow-md">
                            {combineInterviewers
                                .filter((item) => !interviewers.find((i) => i.interviewComId === item.interviewComId))
                                .map((item) => (
                                    <div
                                        key={item.interviewComId}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#565656]"
                                        onClick={() => toggleInterviewer(item)}
                                    >
                                        {item.prefix} {item.firstName} {item.lastName}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        className="w-[120px] px-6 py-2 border border-[#B3B3B3] rounded-lg text-[#565656] bg-white"
                        onClick={onCancel}
                    >
                        ยกเลิก
                    </button>

                    <button
                        className="w-[120px] px-6 py-2 bg-[#008A90] text-white rounded-lg flex items-center gap-2"
                        onClick={handleSave}
                    >
                        <Image src="/images/admin/save_icon.svg" alt="Save" width={18} height={18} />
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupEditInterviewRoom;
