const courseData = [
  {
    name: { TH: "หลักสูตร DST (ไทย)", EN: "DST Program (Thai)" },
    status: { TH: "เปิดรับสมัคร", EN: "Open for Application" },
    statusColor: "bg-[#008A91] text-white",
    timeLeft: { TH: "เหลือเวลาอีก 54 วัน", EN: "54 days left" },
    period: { TH: "1 ม.ค. - 31 มี.ค. 2568", EN: "Jan 1 - Mar 31, 2025" },
    round: { TH: "รอบ 1 MU - Portfolio (TCAS 1)", EN: "Round 1 MU - Portfolio (TCAS 1)" },
    canApply: true,
    shadow: "shadow-[0px_4px_4px_rgba(0,0,0,0.05)]",
  },
  {
    name: { TH: "หลักสูตร ICT (นานาชาติ)", EN: "ICT Program (International)" },
    status: { TH: "ปิดรับสมัคร", EN: "Closed for Application" },
    statusColor: "bg-[#E5E7EB] text-[#4B5563]",
    timeLeft: { TH: "ปิดรับสมัคร", EN: "Closed" },
    period: { TH: "ช่วงเวลารับสมัครถัดไป 1 เมษายน - 30 มี.ค. 2568", EN: "Next round: Apr 1 - Mar 30, 2025" },
    round: { TH: "รอบ 1 ICT - Portfolio", EN: "Round 1 ICT - Portfolio" },
    canApply: false,
    shadow: "bg-[#F9FAFB] opacity-75 border-2 border-[#E5E7EB]",
  },
]
export default courseData;