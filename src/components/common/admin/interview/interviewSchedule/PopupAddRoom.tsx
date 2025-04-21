import React, { useState } from "react";
import Image from "next/image";

const PopupAddRoom = ({
    onCancel,
    onSaveRoom,
    interviewDetail,
    allInterviewers
}: {
    onCancel: () => void;
    onSaveRoom: (data: {
        mode: "On-site" | "Online";
        room: string;
        duration: number;
        interviewers: string; // comma-separated interviewComIds
        interviewRoundIndex?: number;
    }) => void;
    allInterviewers: {
        firstName: string;
        interviewComId: string;
        lastName: string;
        prefix: string;
    }[];
    interviewDetail: {
        date: string;
        startTime: string;
        endTime: string;
        course: string;
        round: string;
        duration: number;
        interviewRoundIndex?: number;
    };
}) => {
    const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [interviewMode, setInterviewMode] = useState<"On-site" | "Online">("On-site");
    const [room, setRoom] = useState("");

    const toggleInterviewer = (id: string) => {
        setSelectedInterviewers((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const getFullNameById = (id: string) => {
        const interviewer = allInterviewers.find((i) => i.interviewComId === id);
        return interviewer ? `${interviewer.prefix} ${interviewer.firstName} ${interviewer.lastName}` : "";
    };

    const renderRadioButton = (value: "On-site" | "Online", label: string) => (
        <label className="flex items-center cursor-pointer">
            <input
                type="radio"
                name="mode"
                value={value}
                checked={interviewMode === value}
                onChange={() => setInterviewMode(value)}
                className="hidden"
            />
            <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
          ${interviewMode === value ? "border-[#008A90] bg-[#008A90]" : "border-gray-400 bg-white"}`}
            >
                {interviewMode === value && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
            <span className="ml-2 text-[#565656]">{label}</span>
        </label>
    );

    const handleSaveRoom = () => {
        const fullData = {
            mode: interviewMode,
            room,
            interviewers: selectedInterviewers.join(", ")
        };

        onSaveRoom(fullData);
        onCancel();
    };

    console.log('room', room)
    console.log('type', interviewMode)
    console.log('selected user', selectedInterviewers)
    console.log("allInterviewers:", allInterviewers);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-[600px] w-full shadow-lg relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[20px] font-semibold text-[#565656]">เพิ่มข้อมูลห้องสัมภาษณ์</h2>
                    <button
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition z-50"
                        onClick={onCancel}
                    >
                        <Image src="/images/close_icon.svg" alt="Close" width={24} height={24} className="w-[20px] h-[20px]" />
                    </button>
                </div>

                <hr className="border-gray-300 mb-4" />

                {/* Interview Mode */}
                <div className="mb-4">
                    <label className="block text-[#565656] font-bold mb-2">รูปแบบการสัมภาษณ์</label>
                    <div className="flex items-center gap-6">
                        {renderRadioButton("On-site", "On-site (ออนไซต์)")}
                        {renderRadioButton("Online", "Online (ออนไลน์)")}
                    </div>
                </div>

                {/* Room */}
                <div className="mb-4">
                    <label className="block text-[#565656] font-bold mb-1">ห้องสัมภาษณ์</label>
                    <input
                        type="text"
                        placeholder="ระบุห้องสัมภาษณ์"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none placeholder-gray-400"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                    />
                </div>

                {/* Interviewers */}
                <div className="mb-4 relative">
                    <label className="block text-[#565656] font-bold mb-1">ผู้สัมภาษณ์</label>

                    <div
                        className="w-full min-h-[44px] border border-gray-300 rounded-[8px] px-3 py-0.5 pr-10 flex items-center flex-wrap gap-2 relative cursor-pointer"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {selectedInterviewers.length === 0 ? (
                            <span className="text-[#C4C4C4]">กรุณาเลือกผู้สัมภาษณ์</span>
                        ) : (
                            selectedInterviewers.map((id) => (
                                <div
                                    key={id}
                                    className="flex items-center bg-gray-100 text-[#565656] rounded-xl px-3 py-0.5"
                                >
                                    {getFullNameById(id)}
                                    <button
                                        className="ml-2 text-[#565656] hover:text-gray-700 text-2xl"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleInterviewer(id);
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        )}

                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {showDropdown && selectedInterviewers.length > 0 ? (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedInterviewers([]);
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
                            {allInterviewers
                                .filter((i) => !selectedInterviewers.includes(i.interviewComId))
                                .map((i) => (
                                    <div
                                        key={i.interviewComId}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#565656]"
                                        onClick={() => toggleInterviewer(i.interviewComId)}
                                    >
                                        {`${i.prefix} ${i.firstName} ${i.lastName}`}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        className="w-[120px] px-6 py-2 border border-[#B3B3B3] rounded-lg text-[#565656] bg-white"
                        onClick={onCancel}
                    >
                        ยกเลิก
                    </button>

                    <button
                        className="w-[120px] px-6 py-2 bg-[#008A90] text-white rounded-lg flex items-center gap-2"
                        onClick={handleSaveRoom}
                    >
                        <Image src="/images/admin/save_icon.svg" alt="Save" width={18} height={18} />
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupAddRoom;
