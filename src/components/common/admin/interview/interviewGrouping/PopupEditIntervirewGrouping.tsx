"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CustomSelect from "@components/components/form/CustomSelect";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    currentData: {
        room: string;
        startTime: string;
        endTime: string;
    };
    existingSchedules: {
        room: string;
        startTime: string;
        endTime: string;
    }[];
    interviewSchedules: {
        room: string;
        date: string;
        startTime: string;
        endTime: string;
        duration: number;
        committee: string;
    }[];
    roomOptions: { label: string; value: string }[];
    onSave: ({ room, startTime, endTime }: { room: string; startTime: string; endTime: string }) => void;
}
const PopupEditInterviewGrouping: React.FC<Props> = ({
    isOpen,
    onClose,
    onSave,
    existingSchedules,
    currentData,
    roomOptions,
    interviewSchedules, 

}) => {
    const [room, setRoom] = useState(currentData.room);
    const [startTime, setStartTime] = useState(currentData.startTime);
    const [endTime, setEndTime] = useState(currentData.endTime);
    const [error, setError] = useState("");

    const filteredRoomOptions = roomOptions.filter((roomOpt) => {
        const roomName = roomOpt.value;
    
        // ถ้าเป็นห้องเดิมที่ผู้สมัครเคยอยู่ ให้แสดงเสมอ
        if (roomName === currentData.room) return true;
    
        // ตรวจสอบว่าห้องนี้เต็มหรือยัง (ใน existingSchedules)
        const countInRoom = existingSchedules.filter(s => s.room === roomName).length;
    
        // หา schedule ของห้องเพื่อดูจำนวน slot สูงสุด
        const schedule = interviewSchedules.find(s => s.room === roomName);
        if (!schedule) return false;
    
        const start = new Date(`2025-04-10T${schedule.startTime}:00`);
        const end = new Date(`2025-04-10T${schedule.endTime}:00`);
        const maxSlot = Math.floor((end.getTime() - start.getTime()) / (schedule.duration * 60000));
    
        return countInRoom < maxSlot;
    });
    


    useEffect(() => {
        setRoom(currentData.room);
        setStartTime(currentData.startTime);
        setEndTime(currentData.endTime);
        setError("");
    }, [currentData]);

    const checkConflict = React.useCallback(() => {
        const selectedStart = new Date(`1970-01-01T${startTime}:00`);
        const selectedEnd = new Date(`1970-01-01T${endTime}:00`);

        if (selectedStart >= selectedEnd) {
            return "เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด";
        }

        for (const schedule of existingSchedules) {
            if (schedule.room !== room) continue;

            const existStart = new Date(`1970-01-01T${schedule.startTime}:00`);
            const existEnd = new Date(`1970-01-01T${schedule.endTime}:00`);

            const overlap =
                (selectedStart >= existStart && selectedStart < existEnd) ||
                (selectedEnd > existStart && selectedEnd <= existEnd) ||
                (selectedStart <= existStart && selectedEnd >= existEnd);

            const isSameTime =
                schedule.startTime === currentData.startTime &&
                schedule.endTime === currentData.endTime &&
                schedule.room === currentData.room;

            // ❗ ต้องเทียบกับ currentData ไม่ใช่ schedule
            if (overlap && !isSameTime) {
                return "เวลาที่เลือกตรงกับกำหนดการที่มีอยู่ กรุณาเลือกเวลาใหม่";
            }
        }

        return "";
    }, [room, startTime, endTime, existingSchedules, currentData]);


    useEffect(() => {
        setError(checkConflict());
    }, [room, startTime, endTime, checkConflict]);

    const handleSave = () => {
        if (!error) {
            onSave({ room, startTime, endTime });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <button className="absolute top-4 right-4" onClick={onClose}>
                    <Image src="/images/close_icon.svg" alt="Close" width={16} height={16} />
                </button>

                <h2 className="text-xl font-semibold text-[#333333] mb-4">แก้ไขรายละเอียดการสัมภาษณ์</h2>

                <div className="mb-4">
                    <CustomSelect
                        label="ห้องสัมภาษณ์"
                        options={filteredRoomOptions}
                        value={room} // ส่งเป็น string ไปเลย
                        onChange={(option) => setRoom(option?.value || "")}
                        width="100%"
                        placeholder="เลือกห้องสัมภาษณ์"
                        required={false}
                    />

                </div>

                <div className="flex gap-4">
                    <div className="flex-1 rounded-lg">
                        <label className="block mb-1 text-[#565656]">เวลาเริ่มต้น</label>
                        <input
                            type="time"
                            className={`w-full border rounded-[10px] px-3 py-2 ${error ? "border-red-500" : "border-gray-300"}`}
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 rounded-lg">
                        <label className="block mb-1 text-[#565656]">เวลาสิ้นสุด</label>
                        <input
                            type="time"
                            className={`w-full border rounded-[10px] px-3 py-2 ${error ? "border-red-500" : "border-gray-300"}`}
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <p className="mt-2 text-red-500 text-sm">
                        {error}
                    </p>
                )}

                <div className="flex justify-center gap-2 mt-6">
                    <button
                        className="w-[120px] px-6 py-2 border border-[#B3B3B3] rounded-lg text-[#565656] bg-white"
                        onClick={onClose}
                    >
                        ยกเลิก
                    </button>

                    <button
                        className={`w-[120px] px-6 py-2 bg-[#008A90] text-white rounded-lg flex items-center gap-2 ${error ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={handleSave}
                        disabled={!!error}
                    >
                        <Image src="/images/admin/save_icon.svg" alt="Save" width={18} height={18} />
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupEditInterviewGrouping;
