import React from "react";
import Image from "next/image";

interface Applicant {
  round: string;
  applicantId: string;
  name: string;
  course: string;
  admitStatus?: string;
  docStatus?: string;
  interviewRoom?: string;
  interviewDateTime?: string;
  committee?: string[];
  grouping?: string;
}

interface InterviewTableProps {
  applicants: Applicant[];
  selectedApplicants: string[];
  setSelectedApplicants: (ids: string[]) => void;
  isGroupingMode: boolean;
  setShowEditInterviewPopup: (show: boolean) => void;
  setEditingInterview: (applicant: Applicant) => void;
  currentPage: number;
  itemsPerPage: number;
}

const InterviewTable: React.FC<InterviewTableProps> = ({
  applicants,
  selectedApplicants,
  setSelectedApplicants,
  isGroupingMode,
  setShowEditInterviewPopup,
  setEditingInterview,
  currentPage,
  itemsPerPage,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplicants = applicants.slice(startIndex, endIndex);

  const isAllSelected = paginatedApplicants
    .filter(app => app.grouping !== "grouped")
    .every(app => selectedApplicants.includes(`${app.round}-${app.applicantId}`));

  const hasSelectableApplicants = paginatedApplicants.some(app => app.grouping !== "grouped");

  const toggleSelectAll = () => {
    const ungroupedKeys = paginatedApplicants
      .filter(app => app.grouping !== "grouped")
      .map(app => `${app.round}-${app.applicantId}`);

    const isAllUngroupedSelected = ungroupedKeys.every(id => selectedApplicants.includes(id));

    if (isAllUngroupedSelected) {
      setSelectedApplicants(selectedApplicants.filter(id => !ungroupedKeys.includes(id)));
    } else {
      const newSelections = ungroupedKeys.filter(id => !selectedApplicants.includes(id));
      setSelectedApplicants([...selectedApplicants, ...newSelections]);
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-[#F3F5F6] text-[#565656]">
            {isGroupingMode && (
              <th className="px-2 py-4 text-center whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  disabled={!hasSelectableApplicants}
                  className={`w-5 h-5 accent-[#008A90] text-white rounded-md border-2 ${!hasSelectableApplicants ? "border-gray-300 cursor-not-allowed" : "border-[#008A90]"}`}
                  title={!hasSelectableApplicants ? "ไม่มีผู้สมัครที่สามารถเลือกได้" : ""}
                />
              </th>
            )}
            <th className="px-2 py-4 whitespace-nowrap">No</th>
            <th className="px-2 py-4 whitespace-nowrap">รอบ</th>
            <th className="px-2 py-4 whitespace-nowrap">เลขที่สมัคร</th>
            <th className="px-2 py-4 whitespace-nowrap">ชื่อ - นามสกุล ผู้สมัคร</th>
            <th className="px-2 py-4 whitespace-nowrap">หลักสูตร</th>
            <th className="px-2 py-4 whitespace-nowrap">สถานะการสมัคร</th>
            <th className="px-2 py-4 whitespace-nowrap">สถานะเอกสาร</th>
            <th className="px-2 py-4 whitespace-nowrap">ห้องสัมภาษณ์</th>
            <th className="px-2 py-4 whitespace-nowrap">กรรมการสัมภาษณ์</th>
            <th className="px-2 py-4 whitespace-nowrap">วัน-เวลา สัมภาษณ์</th>
            {isGroupingMode && applicants.some(app => app.grouping === "grouped") && <th className="px-2 py-4 whitespace-nowrap"></th>}
          </tr>
        </thead>
        <tbody>
          {paginatedApplicants.map((app, index) => {
            const uniqueKey = `${app.round}-${app.applicantId}`;
            const isSelected = selectedApplicants.includes(uniqueKey);

            const handleCheckboxChange = () => {
              if (isSelected) {
                setSelectedApplicants(selectedApplicants.filter(id => id !== uniqueKey));
              } else {
                setSelectedApplicants([...selectedApplicants, uniqueKey]);
              }
            };

            return (
              <tr
                key={index}
                className={`text-[#565656] h-[50px] items-center ${app.admitStatus === "09 - ยกเลิกการสมัคร" ? "bg-[#FFE8E8]" : "hover:bg-gray-50"}`}
              >
                {isGroupingMode && (
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={handleCheckboxChange}
                      disabled={app.grouping === "grouped"}
                      className={`w-5 h-5 accent-[#008A90] text-white rounded-md border-2 ${app.grouping === "grouped" ? "border-gray-300 cursor-not-allowed" : "border-[#008A90]"}`}
                    />
                  </td>
                )}
                <td className="text-center whitespace-nowrap">{startIndex + index + 1}</td>
                <td className="text-center whitespace-nowrap">{app.round}</td>
                <td className="text-center whitespace-nowrap">{app.applicantId}</td>
                <td className="whitespace-nowrap">{app.name}</td>
                <td className="text-center whitespace-nowrap">{app.course}</td>
                <td>
                  <div className={`mr-4 whitespace-nowrap ${app.admitStatus === "04 - ผ่านการพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#166534]" : app.admitStatus === "06 - รอสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-[#FFF4E2] text-[#DAA520]" : ""}`}>{app.admitStatus}</div>
                </td>
                <td>
                  <div className={`mr-4 whitespace-nowrap ${app.docStatus === "03 - เอกสารครบถ้วน" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#13522B]" : ""}`}>{app.docStatus}</div>
                </td>
                <td className="text-center whitespace-nowrap text-[#565656]">
                  {app.interviewRoom ? app.interviewRoom : (
                    <div className="flex items-center justify-center gap-1 text-[#B9B9B9]">
                      <Image src="/images/admin/interview/waiting_icon.svg" alt="ยังไม่เลือกห้องสัมภาษณ์" width={16} height={16} />
                      <span>ยังไม่เลือกห้องสัมภาษณ์</span>
                    </div>
                  )}
                </td>
                <td className="text-center whitespace-nowrap text-[#565656]">
                  {app.committee ? app.committee : (
                    <div className="flex items-center justify-center gap-1 text-[#B9B9B9]">
                      <Image src="/images/admin/interview/waiting_icon.svg" alt="ยังไม่ได้เลือกกรรมการ" width={16} height={16} />
                      <span>ยังไม่ได้เลือกกรรมการ</span>
                    </div>
                  )}
                </td>
                <td className="text-center whitespace-nowrap text-[#565656]">
                  {app.interviewDateTime ? (() => {
                    const parts = app.interviewDateTime.split(" ");
                    const date = parts.slice(0, 3).join(" ");
                    const time = parts.slice(3).join(" ");
                    return (
                      <>
                        <div className="text-[15px]">{date}</div>
                        <div className="text-[15px] text-[#6B7280]">{time}</div>
                      </>
                    );
                  })() : (
                    <div className="flex items-center justify-center gap-1 text-[#B9B9B9]">
                      <Image src="/images/admin/interview/waiting_icon.svg" alt="ยังไม่กำหนดวันเวลา" width={16} height={16} />
                      <span>ยังไม่กำหนดวัน-เวลา</span>
                    </div>
                  )}
                </td>
                {isGroupingMode && app.grouping === "grouped" && (
                  <td className="text-center whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditingInterview(app);
                        setShowEditInterviewPopup(true);
                      }}
                      className="text-[#F59E0B] border border-[#DAA520] hover:bg-[#FFF7E6] px-4 py-1 rounded-[10px] flex items-center gap-1"
                    >
                      <Image src="/images/admin/interview/edit_icon.svg" alt="แก้ไขการจัดกลุ่มสัมภาษณ์" width={24} height={24} />
                      แก้ไข
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InterviewTable;
