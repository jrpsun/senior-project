export const statusStyles: Record<string, string> = {
  pending: "bg-[#FFF4E2] text-[#DAA520] border text-sm font-medium rounded-full px-1 py-0.5 inline-block",
  success: "bg-[#E2F5E2] text-[#13522B] border text-sm font-medium rounded-full px-1 py-0.5 inline-block",
  error: "bg-[#FEE2E2] text-[#991B1B] border text-sm font-medium rounded-full px-1 py-0.5 inline-block",
  default: "bg-white text-[#565656] text-sm font-medium rounded-full px-1 py-0.5 inline-block",
  info: "bg-[#E2E8F0] text-[#1E40AF] border border-[#1E40AF] text-sm font-medium rounded-full px-1 py-0.5 inline-block",
};


// ใส่ style เข้าไปในแต่ละสถานะ
export const statuses = {
  application: [
    { id: "01", labelTH: "01 - ยังไม่ได้ยื่นใบสมัคร", labelEN: "01-Not Submitted", type: "default", style: statusStyles.default },
    { id: "02", labelTH: "02 - ยื่นใบสมัครแล้ว", labelEN: "02-Submitted", type: "success", style: statusStyles.success },
    { id: "03", labelTH: "03 - รอพิจารณา", labelEN: "03-Pending Review", type: "pending", style: statusStyles.pending },
    { id: "04", labelTH: "04 - ผ่านการพิจารณา", labelEN: "04-Accepted", type: "success", style: statusStyles.success },
    { id: "05", labelTH: "05 - ไม่ผ่านการพิจารณา", labelEN: "05-Rejected", type: "error", style: statusStyles.error },
    { id: "06", labelTH: "06 - รอสัมภาษณ์", labelEN: "06-Pending Interview", type: "pending", style: statusStyles.pending },
    { id: "07", labelTH: "07 - ผ่านการสอบสัมภาษณ์", labelEN: "07-Interview Passed", type: "success", style: statusStyles.success },
    { id: "08", labelTH: "08 - ไม่ผ่านการสอบสัมภาษณ์", labelEN: "08-Interview Failed", type: "error", style: statusStyles.error },
    { id: "09", labelTH: "09 - ยกเลิกการสมัคร", labelEN: "09-Application Cancelled", type: "error", style: statusStyles.error },
  ],
  documents: [
    { id: "01", labelTH: "01 - ยังไม่มีเอกสาร", labelEN: "01-No Documents", type: "default", style: statusStyles.default },
    { id: "02", labelTH: "02 - รอตรวจสอบเอกสาร", labelEN: "02-Under Review", type: "pending", style: statusStyles.pending },
    { id: "03", labelTH: "03 - เอกสารครบถ้วน", labelEN: "03-Complete", type: "success", style: statusStyles.success },
    { id: "04", labelTH: "04 - เอกสารไม่ครบถ้วน", labelEN: "04-Incomplete", type: "error", style: statusStyles.error },
  ],
  payment: [
    { id: "01", labelTH: "01 - ยังไม่ได้ชำระเงิน", labelEN: "01-Unpaid", type: "default", style: statusStyles.default },
    { id: "02", labelTH: "02 - รอตรวจการชำระเงิน", labelEN: "02-Reviewing", type: "pending", style: statusStyles.pending },
    { id: "03", labelTH: "03 - ชำระเงินเรียบร้อย", labelEN: "03-Paid", type: "success", style: statusStyles.success },
    { id: "04", labelTH: "04 - ชำระเงินไม่สำเร็จ", labelEN: "04-Failed", type: "error", style: statusStyles.error },
  ],
  interview: [
    { id: "01", labelTH: "01 - รอสัมภาษณ์", labelEN: "01-Pending Interview", type: "pending", style: statusStyles.pending },
    { id: "02", labelTH: "02 - ไม่มาสัมภาษณ์", labelEN: "02-No Show", type: "error", style: statusStyles.error },
    { id: "03", labelTH: "03 - รอพิจารณาเพิ่มเติม", labelEN: "03-Under Further Review", type: "pending", style: statusStyles.pending },
    { id: "04", labelTH: "04 - ผ่านการสัมภาษณ์", labelEN: "04-Interview Passed", type: "success", style: statusStyles.success },
    { id: "05", labelTH: "05 - ไม่ผ่านการสัมภาษณ์", labelEN: "05-Interview Failed", type: "error", style: statusStyles.error },
    { id: "06", labelTH: "06 - รอผลการประเมินเพิ่มเติม", labelEN: "06-Awaiting Additional Evaluation", type: "info", style: statusStyles.info },
  ],
};

// ฟังก์ชันสำหรับดึงสถานะตาม category และ id
export const getStatusById = (category: keyof typeof statuses, id: string) => {
  if (!statuses[category]) return null; 
  return statuses[category].find(status => status.id === id) || null;
};

export const getStatusByLabel = (category: keyof typeof statuses, id: string) => {
  if (!statuses[category]) return null; 
  return statuses[category].find(status => status.labelTH === id) || null;
};
