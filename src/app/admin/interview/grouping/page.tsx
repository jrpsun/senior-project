//สถานะสมัคร มีแค่ ผ่านการพิจารณา และ รอสัมภาษณ์ เท่านั้น
//สถานะเอกสาร มีแค่ เอกสารครบถ้วนเท่านั้น
//สถานะชำระเงิน มีแค่ ชำระเงินเรียบร้อยเท่านั้น

"use client";
import { useState, useMemo } from "react";
import React from 'react';
import Sidebar from "@components/components/SideBar";
import AdminNavbar from "@components/components/adminNavbar";
import Image from 'next/image';
import PopupEditInterviewGrouping from "@components/components/common/admin/interview/interviewGrouping/PopupEditIntervirewGrouping";
import { mockApplicants } from "@components/data/admin/Interview/grouping/mockApplicants";
import { mockInterviewSchedules } from "@components/data/admin/Interview/grouping/mockInterviewSchedules";
import FilterBox from "@components/components/admin/interviewSchedule/FilterBox";
import TopBarActions from "@components/components/admin/interviewSchedule/TopBarActions";
import { PaginationControls } from "@components/components/admin/interviewSchedule/PaginationControls";
import { useFilterApplicants } from "@components/hooks/admin/groupingInterview/useFilterApplicants";
import { useEditInterviewGrouping } from "@components/hooks/admin/groupingInterview/useEditInterviewGrouping";
//import InterviewTable from "@components/components/admin/interviewSchedule/InterviewTable";
//import { useInterviewGrouping } from "@components/hooks/admin/groupingInterview/useInterviewGrouping";

const interviewSchedules = mockInterviewSchedules.map(s => ({
    ...s,
    committee: Array.isArray(s.committee) ? s.committee.join(", ") : s.committee
}));
const courseOptions = ["ITDS/B", "ITCS/B"];
const roundOptions = [
    { label: "1/68 - MU – Portfolio (TCAS 1)", value: "DST01" },
    { label: "1/68 - ICT Portfolio", value: "ICT01" },
];

const admitStatusOptions = ["04 - ผ่านการพิจารณา", "06 - รอสัมภาษณ์"];
const docStatusOptions = ["03 - เอกสารครบถ้วน"];
const paymentStatusOptions = ["03 - ชำระเงินเรียบร้อย"];


const Page = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    interface FilterState {
        course?: string;
        round?: string;
        admitStatus?: string;
        docStatus?: string;
        paymentStatus?: string;
        applicantId?: string;
        name?: string;
        grouping?: string;
        committee?: string;
        interviewRoom?: string;
    }

    const [filters, setFilters] = useState<FilterState>({
        docStatus: "03 - เอกสารครบถ้วน",
        paymentStatus: "03 - ชำระเงินเรียบร้อย",
    });

    const [filterValues, setFilterValues] = useState<FilterState>({
        docStatus: "03 - เอกสารครบถ้วน",
        paymentStatus: "03 - ชำระเงินเรียบร้อย",
    });
    const [isExpanded, setIsExpanded] = useState(false);

    const committeeOptions = [
        { label: "อ. วรพงษ์", value: "วรพงษ์" },
        { label: "อ. อารดา", value: "อารดา" },
        { label: "อ. ชนากานต์", value: "ชนากานต์" },
        { label: "อ. จินต์พิชชา", value: "จินต์พิชชา" },
        { label: "อ. คชาภา", value: "คชาภา" },
        { label: "อ. เจตน์พิภพ", value: " เจตน์พิภพ" },
    ];



    const allRoomOptions = interviewSchedules.map(room => ({
        label: room.room,
        value: room.room
    }));

    const handleSearch = () => {
        setFilters(filterValues);
    };

    const handleReset = () => {
        const defaultFilters = {
            docStatus: "03 - เอกสารครบถ้วน",
            paymentStatus: "03 - ชำระเงินเรียบร้อย",
        };
        setFilterValues(defaultFilters);
        setFilters(defaultFilters);
    };


    //Grouping Applicant
    const [isGroupingMode, setIsGroupingMode] = useState(false);
    const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
    const [isGrouped, setIsGrouped] = useState(false);
    const [showEditInterviewPopup, setShowEditInterviewPopup] = useState(false);
    const [editingInterview, setEditingInterview] = useState<(typeof mockApplicants)[0] | null>(null);
    interface Applicant {
        applicantId: string;
        round: string;
        name: string;
        course: string;
        admitStatus: string;
        docStatus: string;
        interviewRoom?: string;
        interviewDateTime?: string; // Optional property for interview date and time
        grouping?: string; // Added grouping property
        committee?: string[];
        paymentStatus: string; // Added paymentStatus property
    }

    const [applicantData, setApplicantData] = useState<Applicant[]>(
        mockApplicants.map(applicant => ({
          ...applicant,
          grouping: applicant.grouping ?? "ungrouped",
          committee: applicant.committee ? [applicant.committee] : undefined,
          interviewRoom: applicant.interviewRoom ?? "",
          interviewDateTime: applicant.interviewDateTime || "", // ← TypeScript อาจยังไม่มั่นใจว่ามี field นี้
        }))
      );
      
    const handleEnterGroupingMode = () => {
        setIsGroupingMode(true);

        if (selectedApplicants.length > 0 && selectedRooms.length > 0) {
            const updatedData = [...applicantData];
            const totalRooms = selectedRooms.length;

            // เตรียมเก็บเวลาสุดท้ายของแต่ละห้อง
            const lastSlotEndTimes: Record<string, Date> = {};

            selectedRooms.forEach(roomName => {
                const roomSchedule = interviewSchedules.find(s => s.room === roomName);
                const applicantsInRoom = updatedData
                    .filter(app => app.grouping === "grouped" && app.interviewRoom === roomName && app.interviewDateTime)
                    .sort((a, b) => (a.interviewDateTime || "").localeCompare(b.interviewDateTime || ""));

                if (applicantsInRoom.length > 0) {
                    const last = applicantsInRoom[applicantsInRoom.length - 1];
                    const endTimeStr = last.interviewDateTime?.split(" ")[5]; // เช่น "09:40"
                    if (endTimeStr) {
                        lastSlotEndTimes[roomName] = new Date(`2025-04-10T${endTimeStr}:00`);
                    }
                } else if (roomSchedule) {
                    lastSlotEndTimes[roomName] = new Date(`2025-04-10T${roomSchedule.startTime}:00`);
                }
            });

            // กระจายผู้สมัครแบบ round-robin โดยดูเวลาสุดท้ายของแต่ละห้อง
            selectedApplicants.forEach((id, index) => {
                const roomIndex = index % totalRooms;
                const assignedRoom = selectedRooms[roomIndex];
                const schedule = interviewSchedules.find(s => s.room === assignedRoom);
                const targetIndex = updatedData.findIndex(app => `${app.round}-${app.applicantId}` === id);

                if (targetIndex !== -1 && schedule) {
                    const interviewEnd = new Date(`2025-04-10T${schedule.endTime}:00`);

                    // เริ่ม slot จากเวลาสุดท้ายที่ใช้ในห้องนั้น
                    const slotStart = new Date(lastSlotEndTimes[assignedRoom].getTime());
                    const slotEnd = new Date(slotStart.getTime() + schedule.duration * 60000);

                    if (slotEnd > interviewEnd) {
                        console.warn(`Slot เกินเวลาห้อง ${assignedRoom} แล้ว ไม่จัดผู้สมัคร ${id}`);
                        return;
                    }

                    const formatTime = (d: Date) =>
                        d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false });

                    updatedData[targetIndex] = {
                        ...updatedData[targetIndex],
                        interviewRoom: assignedRoom,
                        grouping: "grouped",
                        committee: [schedule.committee],
                        interviewDateTime: `${schedule.date} ${formatTime(slotStart)} - ${formatTime(slotEnd)} น.`,
                    };

                    // อัปเดตเวลาสุดท้ายของห้องนี้
                    lastSlotEndTimes[assignedRoom] = slotEnd;
                }
            });

            setApplicantData(updatedData);
            setIsGrouped(true);
        }
    };

    const canSaveGrouping = isGrouped;
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

        setApplicantData(updatedData);
        setIsGrouped(true);
        setIsGroupingMode(false);
        setSelectedApplicants([]);
        setSelectedRooms([]);
    };

    const filteredApplicants = useFilterApplicants(applicantData, filters);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Show 10 items per page

    const handleExportExcel = () => {
        // export to excel logic หรือ placeholder
        console.log("📥 Export to Excel clicked");
    };

    const roomOptions = useMemo(() => {
        return interviewSchedules
            .filter((room) => {
                const usedByThisRoom = applicantData.filter(
                    a => a.grouping === "grouped" && a.interviewRoom === room.room && (
                        // ไม่รวมผู้ที่กำลังแก้ไขเอง
                        !editingInterview || a.applicantId !== editingInterview.applicantId || a.round !== editingInterview.round
                    )
                );

                const maxSlot = Math.floor(
                    (new Date(`2025-04-10T${room.endTime}:00`).getTime() -
                        new Date(`2025-04-10T${room.startTime}:00`).getTime()
                    ) / (room.duration * 60000)
                );

                const isSlotAvailable = usedByThisRoom.length < maxSlot;

                return isSlotAvailable;
            })
            .map(room => ({ label: room.room, value: room.room }));
    }, [applicantData, editingInterview]);


    const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
    const [showRoomDropdown, setShowRoomDropdown] = useState(false);


    // Calculate indexes
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedApplicants = filteredApplicants.slice(startIndex, endIndex);

    // Pagination Handlers
    const nextPage = () => {
        if (endIndex < filteredApplicants.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value)); // Update items per page
        setCurrentPage(1); // Reset to first page when changing items per page
    };
    const isAllSelected = filteredApplicants
        .filter(app => app.grouping !== "grouped")
        .every(app => selectedApplicants.includes(`${app.round}-${app.applicantId}`));

    const hasSelectableApplicants = filteredApplicants.some(app => app.grouping !== "grouped");


    // ฟังก์ชันเลือก/ไม่เลือกทั้งหมดในหน้า current page
    const toggleSelectAll = () => {
        const ungroupedKeys = filteredApplicants
            .filter(app => app.grouping !== "grouped")
            .map(app => `${app.round}-${app.applicantId}`);

        const isAllUngroupedSelected = ungroupedKeys.every(id => selectedApplicants.includes(id));

        if (isAllUngroupedSelected) {
            // ยกเลิกเฉพาะที่เป็น ungrouped
            setSelectedApplicants(
                selectedApplicants.filter(id => !ungroupedKeys.includes(id))
            );
        } else {
            // เลือกเฉพาะอันที่ยังไม่ได้เลือก
            const newSelections = ungroupedKeys.filter(id => !selectedApplicants.includes(id));
            setSelectedApplicants([...selectedApplicants, ...newSelections]);
        }
    };
    const { handleEditSave } = useEditInterviewGrouping({
        applicantData,
        setApplicantData,
        interviewSchedules,
    });

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div>
                <AdminNavbar
                    isCollapsed={isCollapsed}
                />
                <div className="flex flex-row flex-1 min-h-screen overflow-hidden">
                    <div className="relative z-50">
                        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                    </div>
                    <main
                        className={`w-full transition-all p-6 mt-[64px] min-h-[calc(100vh-64px)] ${isCollapsed ? "ml-[80px]" : "ml-[300px]"}`}
                    >
                        {/* Search and Filter Box */}
                        <FilterBox
                            filterValues={filterValues}
                            setFilterValues={setFilterValues}
                            onSearch={handleSearch}
                            onReset={handleReset}
                            isExpanded={isExpanded}
                            setIsExpanded={setIsExpanded}
                            courseOptions={courseOptions}
                            roundOptions={roundOptions}
                            admitStatusOptions={admitStatusOptions}
                            docStatusOptions={docStatusOptions}
                            paymentStatusOptions={paymentStatusOptions}
                            allRoomOptions={allRoomOptions}
                            committeeOptions={committeeOptions}
                        />
                        {/* Display Filtered Results */}
                        <div className="mt-6 ">
                            <div className="flex justify-between mb-4">
                                <h2
                                    className={`${isGroupingMode ? 'text-base' : 'text-xl'
                                        } text-[#565656] font-bold whitespace-nowrap`}
                                >
                                    {isGroupingMode
                                        ? `เลือกผู้สมัคร: ${selectedApplicants.length} คน`
                                        : `รายการใบสมัคร ${filteredApplicants.length}`}
                                </h2>

                                <TopBarActions
                                    isGroupingMode={isGroupingMode}
                                    isGrouped={isGrouped}
                                    selectedRooms={selectedRooms}
                                    setSelectedRooms={setSelectedRooms}
                                    roomOptions={roomOptions}
                                    handleEnterGroupingMode={handleEnterGroupingMode}
                                    handleSaveGrouping={handleSaveGrouping}
                                    canSaveGrouping={canSaveGrouping}
                                    handleExportExcel={handleExportExcel}
                                    setIsGroupingMode={setIsGroupingMode}
                                    showRoomDropdown={showRoomDropdown}
                                    setShowRoomDropdown={setShowRoomDropdown}
                                />
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-[#F3F5F6] text-center; text-[#565656]">
                                            {isGroupingMode && (
                                                <th className="px-2 py-4 text-center whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={isAllSelected}
                                                        onChange={toggleSelectAll}
                                                        disabled={!hasSelectableApplicants}
                                                        className={`w-5 h-5 accent-[#008A90] text-white rounded-md border-2 ${!hasSelectableApplicants ? "border-gray-300 cursor-not-allowed" : "border-[#008A90]"
                                                            }`}
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
                                            <th className="px-2 py-4 whitespace-nowrap ">ห้องสัมภาษณ์</th>
                                            <th className="px-2 py-4 whitespace-nowrap ">กรรมการสัมภาษณ์</th>
                                            <th className="px-2 py-4 whitespace-nowrap ">วัน-เวลา สัมภาษณ์</th>
                                            {isGroupingMode && filteredApplicants.some(app => app.grouping === "grouped") && (
                                                <th className="px-2 py-4 whitespace-nowrap"></th>
                                            )}

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedApplicants.map((app, index) => {
                                            const uniqueKey = `${app.round}-${app.applicantId}`;
                                            const isSelected = selectedApplicants.includes(uniqueKey);

                                            const handleCheckboxChange = () => {
                                                if (isSelected) {
                                                    setSelectedApplicants(selectedApplicants.filter((id) => id !== uniqueKey));
                                                } else {
                                                    setSelectedApplicants([...selectedApplicants, uniqueKey]);
                                                }
                                            };

                                            return (
                                                <tr
                                                    key={index}
                                                    className={`text-[#565656] h-[50px] items-center 
          ${app.admitStatus !== "09 - ยกเลิกการสมัคร" ? "hover:bg-gray-50" : ""}
          ${app.admitStatus === "09 - ยกเลิกการสมัคร" ? "bg-[#FFE8E8]" : ""}
        `}
                                                >
                                                    {isGroupingMode && (
                                                        <td className="text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={handleCheckboxChange}
                                                                disabled={app.grouping === "grouped"}
                                                                className={`w-5 h-5 accent-[#008A90] text-white rounded-md border-2 ${app.grouping === "grouped" ? "border-gray-300 cursor-not-allowed" : "border-[#008A90]"
                                                                    }`}
                                                            />
                                                        </td>
                                                    )}
                                                    <td className="text-center whitespace-nowrap">{startIndex + index + 1}</td>
                                                    <td className="text-center whitespace-nowrap">{app.round}</td>
                                                    <td className="text-center whitespace-nowrap">{app.applicantId}</td>
                                                    <td className="whitespace-nowrap">{app.name}</td>
                                                    <td className="text-center whitespace-nowrap">{app.course}</td>
                                                    <td>
                                                        <div className={`mr-4 whitespace-nowrap
            ${app.admitStatus === "04 - ผ่านการพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#166534]" : ""}
            ${app.admitStatus === "06 - รอสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-[#FFF4E2] text-[#DAA520]" : ""}
          `}>
                                                            {app.admitStatus}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={`mr-4 whitespace-nowrap
            ${app.docStatus === "03 - เอกสารครบถ้วน" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#13522B]" : ""}
          `}>
                                                            {app.docStatus}
                                                        </div>
                                                    </td>

                                                    <td className="text-center whitespace-nowrap text-[#565656]">
                                                        {app.interviewRoom ? (
                                                            app.interviewRoom
                                                        ) : (
                                                            <div className="flex items-center justify-center gap-1 text-[#B9B9B9]">
                                                                <Image
                                                                    src="/images/admin/interview/waiting_icon.svg"
                                                                    alt="ยังไม่เลือกห้องสัมภาษณ์"
                                                                    width={16}
                                                                    height={16}
                                                                />
                                                                <span>ยังไม่เลือกห้องสัมภาษณ์</span>
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="text-center whitespace-nowrap text-[#565656]">
                                                        {app.committee ? (
                                                            app.committee
                                                        ) : (
                                                            <div className="flex items-center justify-center gap-1 text-[#B9B9B9]">
                                                                <Image
                                                                    src="/images/admin/interview/waiting_icon.svg"
                                                                    alt="ยังไม่ได้เลือกกรรมการ"
                                                                    width={16}
                                                                    height={16}
                                                                />
                                                                <span>ยังไม่ได้เลือกกรรมการ</span>
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="text-center whitespace-nowrap text-[#565656]">
                                                        {app.interviewDateTime ? (() => {
                                                            const parts = app.interviewDateTime.split(" ");
                                                            const date = parts.slice(0, 3).join(" "); // เช่น "10 เม.ย. 2568"
                                                            const time = parts.slice(3).join(" ");    // เช่น "09:00 – 09:20 น."

                                                            return (
                                                                <>
                                                                    <div className="text-[15px]">{date}</div>
                                                                    <div className="text-[15px] text-[#6B7280]">{time}</div>
                                                                </>
                                                            );
                                                        })() : (
                                                            <div className="flex items-center justify-center gap-1 text-[#B9B9B9]">
                                                                <Image
                                                                    src="/images/admin/interview/waiting_icon.svg"
                                                                    alt="ยังไม่กำหนดวันเวลา"
                                                                    width={16}
                                                                    height={16}
                                                                />
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

                                                                className="text-[#F59E0B] border border-[#DAA520] hover:bg-[#FFF7E6] px-4 py-1 rounded-[10px] flex items-center gap-1 "
                                                            >
                                                                <Image
                                                                    src="/images/admin/interview/edit_icon.svg"
                                                                    alt="แก้ไขการจัดกลุ่มสัมภาษณ์"
                                                                    width={24}
                                                                    height={24}
                                                                />
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
                        </div>
                        <PaginationControls
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredApplicants.length}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            onNextPage={nextPage}
                            onPrevPage={prevPage}
                        />
                    </main>
                </div>
            </div>
            {showEditInterviewPopup && editingInterview && (
                <PopupEditInterviewGrouping
                    isOpen={showEditInterviewPopup}
                    onClose={() => setShowEditInterviewPopup(false)}
                    interviewSchedules={interviewSchedules}
                    currentData={{
                        room: editingInterview.interviewRoom || "",
                        startTime: editingInterview.interviewDateTime?.split(" ")[3] || "",
                        endTime: editingInterview.interviewDateTime?.split(" ")[5] || "",
                    }}
                    existingSchedules={applicantData
                        .filter(a => a.grouping === "grouped" && a.applicantId !== editingInterview.applicantId)
                        .map(a => ({
                            room: a.interviewRoom || "",
                            startTime: a.interviewDateTime?.split(" ")[3] || "",
                            endTime: a.interviewDateTime?.split(" ")[5] || "",
                        }))}
                    roomOptions={roomOptions}
                    onSave={({ room, startTime, endTime }) => {
                        handleEditSave(editingInterview, room, startTime, endTime);
                        setShowEditInterviewPopup(false);
                    }}
                />
            )}
        </div>
    );
};

export default Page;