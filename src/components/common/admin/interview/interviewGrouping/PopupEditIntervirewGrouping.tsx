"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CustomSelect from "@components/components/form/CustomSelect";
import { InterviewSlot } from "@components/types/interviewRooms";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    currentData: {
        room: string;
        startTime: string;
        endTime: string;
        roundId: string;
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
    roomOptions: { label: string; value: string; id: string }[];
    onSave: ({ room, roundId, startTime, endTime }: { room: string; roundId: string; startTime: string; endTime: string }) => void;

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
    const [timeSlot, setTimeSlot] = useState<InterviewSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

    async function fetchData() {
        try {
            const [res_slot] = await Promise.all([
                fetch(`${API_BASE_URL}/education-department/get-all-int-slot`)
            ])

            const data_slot = await res_slot.json()
            if (!res_slot.ok) {
                setTimeSlot([]);
            }
            else {
                setTimeSlot(data_slot || []);
            }


        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const [roundId, setRoundId] = useState(currentData.roundId);
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

        const matchingSlot = timeSlot.find(
            (slot) => slot.interviewRoundId === roundId && slot.interviewRoom === room
        );

        if (!matchingSlot) {
            return "ไม่พบข้อมูลช่วงเวลาในการสัมภาษณ์";
        }

        const slotStart = new Date(`1970-01-01T${matchingSlot.startTime}:00`);
        const slotEnd = new Date(`1970-01-01T${matchingSlot.endTime}:00`);
        const requiredDuration = parseInt(matchingSlot.duration, 10);

        if (selectedStart < slotStart || selectedEnd > slotEnd) {
            return "เวลาที่เลือกอยู่นอกช่วงเวลาที่กำหนดไว้";
        }

        const actualDuration = (selectedEnd.getTime() - selectedStart.getTime()) / (1000 * 60);
        if (actualDuration !== requiredDuration) {
            return `ช่วงเวลาที่เลือกต้องมีระยะเวลา ${requiredDuration} นาที`;
        }

        if (matchingSlot) {
            for (const time of matchingSlot.interviewTime) {
                const [slotStartStr, slotEndStr] = time.replace('–', '-').split('-');
                const slotStart = new Date(`1970-01-01T${slotStartStr}:00`);
                const slotEnd = new Date(`1970-01-01T${slotEndStr}:00`);

                const overlap =
                    (selectedStart >= slotStart && selectedStart < slotEnd) ||
                    (selectedEnd > slotStart && selectedEnd <= slotEnd) ||
                    (selectedStart <= slotStart && selectedEnd >= slotEnd);

                if (overlap) {
                    return "เวลาที่เลือกทับซ้อนกับช่วงเวลาที่มีอยู่ในรอบสัมภาษณ์นี้";
                }
            }
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

            if (overlap && !isSameTime) {
                return "เวลาที่เลือกตรงกับกำหนดการที่มีอยู่ กรุณาเลือกเวลาใหม่";
            }
        }

        return "";
    }, [room, roundId, startTime, endTime, existingSchedules, currentData, timeSlot]);




    useEffect(() => {
        setError(checkConflict());
    }, [room, startTime, endTime, checkConflict]);

    const handleSave = () => {
        if (!error) {
            const selectedRoom = roomOptions.find(r => r.value === room);
            const roundId = selectedRoom?.id || "";
            onSave({ room, roundId, startTime, endTime });
        }
    };


    if (!isOpen) return null;

    // debugging
    // console.log('room start end', room)
    // console.log('round id', roundId)
    // console.log("time slot", timeSlot)

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
                        options={roomOptions}
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
