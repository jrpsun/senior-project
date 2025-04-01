// hooks/admin/groupingInterview/useEditInterviewGrouping.ts
// ถ้ายังไม่ได้แยก ให้ใส่ไว้ด้านบน hook
export interface Applicant {
  applicantId: string;
  round: string;
  name: string;
  course: string;
  admitStatus: string;
  docStatus: string;
  interviewRoom?: string;
  interviewDateTime?: string;
  grouping?: string;
  committee?: string[]; // เป็น array!
  paymentStatus: string;
}

interface UseEditInterviewGroupingProps {
  applicantData: Applicant[];
  setApplicantData: React.Dispatch<React.SetStateAction<Applicant[]>>;
  interviewSchedules: {
    room: string;
    committee: string;
    duration: number;
  }[];
}

  
  export const useEditInterviewGrouping = ({
    applicantData,
    setApplicantData,
    interviewSchedules,
  }: UseEditInterviewGroupingProps) => {
    const handleEditSave = (
      editingInterview: { round: string; applicantId: string },
      room: string,
      startTime: string,
      endTime: string
    ) => {
      const updatedData = [...applicantData];
      const currentIndex = updatedData.findIndex(
        (a) => a.round === editingInterview.round && a.applicantId === editingInterview.applicantId
      );
  
      if (currentIndex !== -1) {
        const oldInterview = updatedData[currentIndex];
        const oldRoom = oldInterview.interviewRoom;
        const oldTime = oldInterview.interviewDateTime?.split(" ").slice(3).join(" ").replace("น.", "").trim();
  
        const parts = (oldInterview.interviewDateTime || "").split(" ");
        const datePart = parts.length >= 3 ? parts.slice(0, 3).join(" ") : "";
  
        // 1. เคลียร์ slot เดิมของผู้สมัคร
        updatedData[currentIndex] = {
          ...updatedData[currentIndex],
          interviewRoom: '',
          interviewDateTime: '',
          committee: [],
        };
  
        // 2. หา schedule ของห้องเดิม
        const schedule = interviewSchedules.find((s) => s.room === oldRoom);
        if (schedule && oldRoom && oldTime) {
          const [oldStart, oldEnd] = oldTime.split(" - ");
          const slotToRemove = `${datePart} ${oldStart} - ${oldEnd} น.`;
  
          const affectedApplicants = updatedData
            .filter(
              (a) =>
                a.interviewRoom === oldRoom &&
                a.interviewDateTime &&
                a.interviewDateTime > slotToRemove
            )
            .sort((a, b) => (a.interviewDateTime || "").localeCompare(b.interviewDateTime || ""));
  
          affectedApplicants.forEach((app) => {
            const appIndex = updatedData.findIndex((a) => a === app);
            const extractTimeRange = (dateTimeStr: string) => {
              const match = dateTimeStr.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
              return match ? [match[1], match[2]] : [null, null];
            };
  
            const [startStr, endStr] = extractTimeRange(app.interviewDateTime!);
            if (!startStr || !endStr) return;
  
            const startTimeDate = new Date(`2025-04-10T${startStr}:00`);
            const endTimeDate = new Date(`2025-04-10T${endStr}:00`);
  
            const newStart = new Date(startTimeDate.getTime() - schedule.duration * 60000);
            const newEnd = new Date(endTimeDate.getTime() - schedule.duration * 60000);
            const formatTime = (d: Date) =>
              d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false });
  
            updatedData[appIndex] = {
              ...updatedData[appIndex],
              interviewDateTime: `${datePart} ${formatTime(newStart)} - ${formatTime(newEnd)} น.`,
              interviewRoom: updatedData[appIndex].interviewRoom || "",
              committee: updatedData[appIndex].committee ?? undefined,

            };
          });
        }
  
        // 3. ตั้งค่าห้องใหม่ + อัปเดตกรรมการ
        const newCommittee = interviewSchedules.find((s) => s.room === room)?.committee || "";
  
        updatedData[currentIndex] = {
          ...updatedData[currentIndex],
          interviewRoom: room,
          interviewDateTime: `${datePart} ${startTime} - ${endTime} น.`,
          committee: [newCommittee],

        };
  
        setApplicantData(updatedData);
      }
    };
  
    return { handleEditSave };
  };