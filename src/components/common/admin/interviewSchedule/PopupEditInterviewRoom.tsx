import React, { useState } from "react";
import Image from "next/image";

const PopupEditInterviewRoom = ({
    roomData,
    onCancel,
    onSave,
}: {
    roomData: {
        date: string;
        time: string;
        course: string;
        round: string;
        mode: string;
        room: string;
        duration: number;
        interviewers: string;
    };
    onCancel: () => void;
    onSave: (updatedData: typeof roomData) => void;
}) => {
    const [room, setRoom] = useState(roomData.room);
    const [mode, setMode] = useState(roomData.mode);
    const [duration, setDuration] = useState(roomData.duration);
    const [interviewers, setInterviewers] = useState<string[]>(roomData.interviewers.split(", "));
    const allInterviewers = ["อ. พิสุทธิ์ธร", "อ. อารดา", "อ. จินต์พิชชา", "อ. คธากร"];
    const [showDropdown, setShowDropdown] = useState(false);
    const [startTime, setStartTime] = useState(roomData.time.split(" - ")[0]);
    const [endTime, setEndTime] = useState(roomData.time.split(" - ")[1]);
    const [date, setDate] = useState(roomData.date);



    const toggleInterviewer = (name: string) => {
        if (interviewers.includes(name)) {
            setInterviewers(interviewers.filter((n) => n !== name));
        } else {
            setInterviewers([...interviewers, name]);
        }
    };

    const handleSave = () => {
        onSave({
            ...roomData,
            room,
            mode,
            duration,
            date,
            time: `${startTime} - ${endTime}`,
            interviewers: interviewers.join(", "),
        });
    };
    

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
                        <div className=" px-3 py-2 ">{roomData.course}</div>
                    </div>
                    <div>
                        <label className="block font-medium text-[#565656] mb-1">รอบรับสมัคร</label>
                        <div className="px-3 py-2">{roomData.round}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block font-medium text-[#565656] mb-1">วันที่สัมภาษณ์</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-[#565656] mb-1">เวลาเริ่มต้น</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#565656] mb-1">เวลาสิ้นสุด</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block font-medium text-[#565656] mb-1">รูปแบบการสัมภาษณ์</label>
                    <div className="flex items-center gap-6">
                        {renderRadioButton("on-site", "ออนไซต์ (On-site)")}
                        {renderRadioButton("online", "ออนไลน์ (Online)")}
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
                    <div className="max-w-[200px]">
                        <label className="block font-medium text-[#565656] mb-1">ระยะเวลาสัมภาษณ์ (ต่อคน)</label>
                        <div className="flex items-center">
                            <input
                                type="number"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                            />
                            <span className="ml-2">นาที</span>
                        </div>
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
      interviewers.map((name) => (
        <div
          key={name}
          className="flex items-center bg-gray-100 text-[#565656] rounded-xl px-3 py-0.5"
        >
          {name}
          <button
            className="ml-2 text-[#565656] hover:text-gray-700 text-2xl"
            onClick={(e) => {
              e.stopPropagation();
              toggleInterviewer(name);
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
      {allInterviewers
        .filter((name) => !interviewers.includes(name))
        .map((name) => (
          <div
            key={name}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#565656]"
            onClick={() => toggleInterviewer(name)}
          >
            {name}
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
};

export default PopupEditInterviewRoom;
