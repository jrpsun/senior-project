import { useState } from "react";

type UseInterviewGroupingProps = {
  applicantData: Array<{
    round: string;
    applicantId: string;
    name: string;
    course: string;
    admitStatus: string;
    docStatus: string;
    paymentStatus: string;
    grouping: string;
    interviewRoom: string;
    interviewDateTime: string;
    committee?: string[];
  }>;
  selectedApplicants: string[];
  selectedRooms: string[];
  interviewSchedules: Array<{
    room: string;
    startTime: string;
    endTime: string;
    duration: number;
    date: string;
    committee: string[];
  }>;
  onUpdate: (updatedData: Array<{
    round: string;
    applicantId: string;
    grouping?: string;
    interviewRoom?: string;
    interviewDateTime?: string;
    admitStatus?: string;
    committee?: string[];
  }>) => void;
};
// ด้านบนสุดของไฟล์ useInterviewGrouping.ts

export const getAvailableRooms = (
  applicantData: UseInterviewGroupingProps["applicantData"],
  interviewSchedules: UseInterviewGroupingProps["interviewSchedules"],
  editingInterview?: { round: string; applicantId: string }
) => {
  return interviewSchedules
    .filter((room) => {
      const maxSlot = Math.floor(
        (new Date(`2025-04-10T${room.endTime}:00`).getTime() -
          new Date(`2025-04-10T${room.startTime}:00`).getTime()) /
          (room.duration * 60000)
      );

      const usedByThisRoom = applicantData.filter(
        (a) =>
          a.grouping === "grouped" &&
          a.interviewRoom === room.room &&
          (!editingInterview ||
            `${a.round}-${a.applicantId}` !== `${editingInterview.round}-${editingInterview.applicantId}`)
      );

      return usedByThisRoom.length < maxSlot;
    });
};


export const useInterviewGrouping = ({
  applicantData,
  selectedApplicants,
  selectedRooms,
  interviewSchedules,
  onUpdate
}: UseInterviewGroupingProps) => {
  const [isGrouped, setIsGrouped] = useState(false);
  const [isGroupingMode, setIsGroupingMode] = useState(false);
  const [internalSelectedApplicants, setSelectedApplicants] = useState<string[]>(selectedApplicants);
  const [internalSelectedRooms, setSelectedRooms] = useState<string[]>(selectedRooms);

  const handleEnterGroupingMode = () => {
    setIsGroupingMode(true);

    if (internalSelectedApplicants.length > 0 && internalSelectedRooms.length > 0) {
      const updatedData = [...applicantData];
      const totalRooms = internalSelectedRooms.length;
      const lastSlotEndTimes: Record<string, Date> = {};

      // เตรียมเวลาสุดท้ายของแต่ละห้อง
      internalSelectedRooms.forEach(roomName => {
        const roomSchedule = interviewSchedules.find(s => s.room === roomName);
        const applicantsInRoom = updatedData
          .filter(app => app.grouping === "grouped" && app.interviewRoom === roomName && app.interviewDateTime)
          .sort((a, b) => (a.interviewDateTime || "").localeCompare(b.interviewDateTime || ""));

        if (applicantsInRoom.length > 0) {
          const last = applicantsInRoom[applicantsInRoom.length - 1];
          const endTimeStr = last.interviewDateTime?.split(" ")[5];
          if (endTimeStr) {
            lastSlotEndTimes[roomName] = new Date(`2025-04-10T${endTimeStr}:00`);
          }
        } else if (roomSchedule) {
          lastSlotEndTimes[roomName] = new Date(`2025-04-10T${roomSchedule.startTime}:00`);
        }
      });

      // ตรวจสอบจำนวน slot ที่เหลือในแต่ละห้อง
      const availableSlots: Record<string, number> = {};
      internalSelectedRooms.forEach(room => {
        const schedule = interviewSchedules.find(s => s.room === room);
        if (!schedule) return;

        const maxSlots = Math.floor(
          (new Date(`2025-04-10T${schedule.endTime}:00`).getTime() - new Date(`2025-04-10T${schedule.startTime}:00`).getTime())
          / (schedule.duration * 60000)
        );

        const used = updatedData.filter(app => app.interviewRoom === room && app.grouping === "grouped").length;
        availableSlots[room] = maxSlots - used;
      });

      // คัดกรองห้องที่ยังมี slot เหลือเท่านั้น
      const usableRooms = internalSelectedRooms.filter(r => availableSlots[r] > 0);
      const usableRoomCount = usableRooms.length;

      internalSelectedApplicants.forEach((id, index) => {
        const roomIndex = index % usableRoomCount;
        const assignedRoom = usableRooms[roomIndex];
        const schedule = interviewSchedules.find(s => s.room === assignedRoom);
        const targetIndex = updatedData.findIndex(app => `${app.round}-${app.applicantId}` === id);

        if (targetIndex !== -1 && schedule && availableSlots[assignedRoom] > 0) {
          const interviewEnd = new Date(`2025-04-10T${schedule.endTime}:00`);
          const slotStart = new Date(lastSlotEndTimes[assignedRoom]?.getTime() || new Date(`2025-04-10T${schedule.startTime}:00`).getTime());
          const slotEnd = new Date(slotStart.getTime() + schedule.duration * 60000);

          if (slotEnd > interviewEnd) return;

          const formatTime = (d: Date) =>
            d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false });

          updatedData[targetIndex] = {
            ...updatedData[targetIndex],
            interviewRoom: assignedRoom,
            grouping: "grouped",
            committee: schedule.committee,
            interviewDateTime: `${schedule.date} ${formatTime(slotStart)} - ${formatTime(slotEnd)} น.`,
          };

          lastSlotEndTimes[assignedRoom] = slotEnd;
          availableSlots[assignedRoom]--;
        }
      });

      onUpdate(updatedData);
      setIsGrouped(true);
    }
  };

  const handleSaveGrouping = () => {
    const updatedData = applicantData.map((app) => {
      if (app.grouping === "grouped") {
        return {
          ...app,
          admitStatus: "06 - รอสัมภาษณ์",
        };
      }
      return app;
    });

    onUpdate(updatedData);
    setIsGrouped(true);
    setIsGroupingMode(false);
    setSelectedApplicants([]);
    setSelectedRooms([]);
  };

  const canSaveGrouping = isGrouped;

  return {
    isGrouped,
    isGroupingMode,
    setIsGroupingMode,
    handleEnterGroupingMode,
    handleSaveGrouping,
    canSaveGrouping,
    selectedApplicants: internalSelectedApplicants,
    setSelectedApplicants,
    selectedRooms: internalSelectedRooms,
    setSelectedRooms,
  };
};