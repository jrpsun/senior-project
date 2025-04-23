//สถานะสมัคร มีแค่ ผ่านการพิจารณา และ รอสัมภาษณ์ เท่านั้น
//สถานะเอกสาร มีแค่ เอกสารครบถ้วนเท่านั้น
//สถานะชำระเงิน มีแค่ ชำระเงินเรียบร้อยเท่านั้น

"use client";
import { useState, useMemo, useEffect } from "react";
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
import AlertAdmin from "@components/components/common/admin/alertAdmin";
import { InterviewScreeningForEduInterface } from "@components/types/screening";
import { InterviewRoomDetails } from "@components/types/interviewRooms";
import { getDecodedToken } from "@components/lib/auth";
import Modal from "@components/components/common/popup-login";
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
    // fetch applicants data to show on table
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
    const [applicants, setApplicants] = useState<InterviewScreeningForEduInterface[]>([]);
    const [rooms, setRooms] = useState<InterviewRoomDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);
    const [id, setId] = useState('');

    useEffect(() => {
        const decoded = getDecodedToken();
        if (!decoded) {
            setShowModal(true);
            return;
        }
        setRoles(decoded.roles);
        setId(decoded.id);
    }, []);

    async function fetchData() {
        try {
            const [res_app, res_room] = await Promise.all([
                fetch(`${API_BASE_URL}/education-department/get-summary-applicants-interview`),
                fetch(`${API_BASE_URL}/education-department/get-all-interview-rooms`)
            ])

            if (!res_app.ok || !res_room.ok) {
                throw new Error("Failed to fetch one or more resources");
            }

            const data_app = await res_app.json();
            const data_room = await res_room.json()

            setApplicants(data_app.applicants || []);
            setRooms(data_room.room || []);

        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    //console.log("applicants", applicants)
    useEffect(() => {
        const statusMap = new Map<string, boolean>();

        for (const item of applicants) {
            // If the current applicant is already marked as false, skip
            if (statusMap.get(item.applicantId || '') === false) continue;

            if (item.interviewStatus === null) {
                statusMap.set(item.applicantId || '', false);
            } else if (!statusMap.has(item.applicantId || '')) {
                statusMap.set(item.applicantId || '', true);
            }
        }

        const allGrouped = Array.from(statusMap.values()).every(v => v === true);
        setIsAllGrouped(allGrouped);
    }, [applicants]);

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

    const allRoomOptions = rooms.map(room => ({
        label: room.interviewRoom,
        value: room.interviewRoom,
        id: room.interviewRoundId
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
    const [isAllGrouped, setIsAllGrouped] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [showEditInterviewPopup, setShowEditInterviewPopup] = useState(false);
    const [editingInterview, setEditingInterview] = useState<InterviewScreeningForEduInterface[]>([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    interface Applicant {
        applicantId: string;
        round: string;
        name: string;
        course: string;
        admitStatus: string;
        docStatus: string;
        interviewRoom: string; // Ensure it's always a string
        interviewDateTime: string; // Ensure it's always a string
        grouping: string; // Ensure it's always a string
        committee?: string[];
        paymentStatus: string;
    }

    const [applicantData, setApplicantData] = useState<Applicant[]>(
        mockApplicants.map(applicant => ({
            ...applicant,
            grouping: applicant.grouping ?? "ungrouped",
            committee: applicant.committee ? [applicant.committee] : undefined,
            interviewRoom: applicant.interviewRoom, // Ensure it's always a string
            interviewDateTime: applicant.interviewDateTime || "", // ← TypeScript อาจยังไม่มั่นใจว่ามี field นี้
        }))
    );

    const [groupedApplicants, setGroupedApplicants] = useState([]);
    const handleEnterGroupingMode = () => {

        const assignments = [];
        const applicantsQueue = [...selectedApplicants];

        for (const room of selectedRooms) {
            const {
                startTime,
                endTime,
                duration,
                interviewComs,
                interviewDate,
                interviewRoom,
                interviewRoomId,
                interviewRoundId
            } = room;

            const [startHour, startMinute] = startTime.split(":").map(Number);
            const [endHour, endMinute] = endTime.split(":").map(Number);
            const interviewDuration = parseInt(duration, 10);

            const start = new Date(`1970-01-01T${startTime}:00`);
            const end = new Date(`1970-01-01T${endTime}:00`);
            const totalMinutes = (end.getTime() - start.getTime()) / 60000;
            const maxApplicants = Math.floor(totalMinutes / interviewDuration);

            for (let i = 0; i < maxApplicants && applicantsQueue.length > 0; i++) {
                const appId = applicantsQueue.shift();
                const slotStart = new Date(start.getTime() + i * interviewDuration * 60000);
                const slotEnd = new Date(slotStart.getTime() + interviewDuration * 60000);

                const formatTime = (date: Date) => {
                    const h = String(date.getHours()).padStart(2, "0");
                    const m = String(date.getMinutes()).padStart(2, "0");
                    return `${h}:${m}`;
                };

                const dateTime = `${interviewDate} - ${formatTime(slotStart)}–${formatTime(slotEnd)}`;

                assignments.push({
                    appId,
                    roundId: interviewRoundId,
                    interviewRoom,
                    interviewRoomId,
                    interviewComs,
                    dateTime,
                });
            }
        }

        // Add unassigned applicants (if any)
        while (applicantsQueue.length > 0) {
            assignments.push({
                appId: applicantsQueue.shift(),
                unassigned: true,
            });
        }

        setGroupedApplicants(assignments);
        setIsGrouped(true);
        //setApplicantData(updatedData);

    }


    const canSaveGrouping = isGrouped;

    const transformInterviewData = (data) => {
        return data.map((item) => {
            const [intDate, intTime] = item.dateTime.split(' - ');
            return {
                applicantId: item.appId,
                room: item.interviewRoom,
                intDate: intDate,
                intTime: intTime,
                interviewRoundId: item.roundId,
                committeeId: item.interviewComs.map((com) => com.interviewComId),
            };
        });
    };

    const handleSaveGrouping = async () => {
        const transformedData = transformInterviewData(groupedApplicants);

        try {
            const response = await fetch(`${API_BASE_URL}/interview-committee/create-interview-eva`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transformedData),
            });

            if (!response.ok) throw new Error("Failed to save interview evaluations");
            alert("บันทึกข้อมูลสำเร็จ");

            window.location.reload();
        } catch (error) {
            console.error('Error submitting interview evaluations:', error);
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
        }
    };

    const filteredApplicants = useFilterApplicants(applicants, filters);
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

    const [selectedApp, setSelectedApp] = useState<string[]>([]);
    const [selectedRooms, setSelectedRooms] = useState<InterviewRoomDetails[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<InterviewRoomDetails[]>([]);
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
        .filter(app => app.interviewStatus === null)
        .every(app => selectedApplicants.includes(`${app.applicantId}`));

    const hasSelectableApplicants = filteredApplicants.some(app => app.interviewStatus === null);


    // ฟังก์ชันเลือก/ไม่เลือกทั้งหมดในหน้า current page
    const toggleSelectAll = () => {
        const ungroupedKeys = filteredApplicants
            .filter(app => app.interviewStatus === null)
            .map(app => `${app.applicantId}`);

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
    // const { handleEditSave } = useEditInterviewGrouping({
    //     applicantData,
    //     setApplicantData,
    //     interviewSchedules,
    // });
    const handleEditSave = async (room, roundId, start, end) => {
        try {
            const response = await fetch(`${API_BASE_URL}/interview-committee/update-interview-room-auto-grouping`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    applicantId: currentApplicant,
                    interviewRoom: room,
                    interviewRoundId: roundId,
                    interviewTime: `${start}-${end}`
                }),
            });

            if (!response.ok) throw new Error("Failed to edit interview room");
            alert("บันทึกข้อมูลสำเร็จ");

            window.location.reload();
        } catch (error) {
            console.error('Error submitting interview room:', error);
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
        }
    }

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [currentApplicant, setCurrentApplicant] = useState("");
    const handleEditMode = (app: InterviewScreeningForEduInterface) => {
        setEditingInterview(app);
        setShowEditInterviewPopup(true);
        setStartTime(app.interviewTime.split('-')[0])
        setEndTime(app.interviewTime.split('-')[1])
        setCurrentApplicant(app.applicantId)
    }

    console.log('selected app', selectedApplicants)
    console.log('selected room(s)', selectedRooms)
    console.log('grouped applicant', groupedApplicants)
    console.log('is all app are grouped?????', isAllGrouped)
    console.log('date time is --->', startTime, endTime)
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {showModal && <Modal role="admin"/>}
            <div>
                <AdminNavbar
                    isCollapsed={isCollapsed}
                />
                <div className="flex flex-row flex-1 min-h-screen overflow-hidden">
                    <div className="relative z-50">
                        <Sidebar
                            isCollapsed={isCollapsed}
                            setIsCollapsed={setIsCollapsed}
                            userRoles={roles}
                        />
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
                                    isAllGrouped={isAllGrouped}
                                    selectedRooms={selectedRooms}
                                    setSelectedRooms={setSelectedRooms}
                                    selectedRoomId={selectedRoomId}
                                    setSelectedRoomId={setSelectedRoomId}
                                    roomOptions={roomOptions}
                                    handleEnterGroupingMode={handleEnterGroupingMode}
                                    handleSaveGrouping={handleSaveGrouping}
                                    canSaveGrouping={canSaveGrouping}
                                    handleExportExcel={handleExportExcel}
                                    setIsGroupingMode={setIsGroupingMode}
                                    showRoomDropdown={showRoomDropdown}
                                    setShowRoomDropdown={setShowRoomDropdown}
                                    isEdit={isEdit}
                                    setIsEdit={setIsEdit}
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
                                            {isEdit && (
                                                <th className="px-2 py-4 whitespace-nowrap"></th>
                                            )}

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedApplicants.map((app, index) => {

                                            const uniqueKey = `${app.applicantId}`;
                                            const isSelected = selectedApplicants.includes(uniqueKey);
                                            const groupedApp = groupedApplicants.find(item => item.appId === app.applicantId)
                                            const handleCheckboxChange = () => {
                                                if (isSelected) {
                                                    setSelectedApplicants(selectedApplicants.filter((id) => id !== uniqueKey));
                                                } else {
                                                    setSelectedApplicants([...selectedApplicants, uniqueKey]);
                                                }
                                            };

                                            return (
                                                <tr
                                                    key={app.applicantId}
                                                    className={`text-[#565656] h-[50px] items-center 
          ${app.admissionStatus !== "09 - ยกเลิกการสมัคร" ? "hover:bg-gray-50" : ""}
          ${app.admissionStatus === "09 - ยกเลิกการสมัคร" ? "bg-[#FFE8E8]" : ""}
        `}
                                                >
                                                    {isGroupingMode && (
                                                        <td className="text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={handleCheckboxChange}
                                                                disabled={app.interviewStatus !== null}
                                                                className={`w-5 h-5 accent-[#008A90] text-white rounded-md border-2 ${app.grouping === "grouped" ? "border-gray-300 cursor-not-allowed" : "border-[#008A90]"
                                                                    }`}
                                                            />
                                                        </td>
                                                    )}
                                                    <td className="text-center whitespace-nowrap">{startIndex + index + 1}</td>
                                                    <td className="text-center whitespace-nowrap">{app.roundName}</td>
                                                    <td className="text-center whitespace-nowrap">{app.applicantId}</td>
                                                    <td className="whitespace-nowrap">{app.fullnameEN}</td>
                                                    <td className="text-center whitespace-nowrap">{app.program}</td>
                                                    <td>
                                                        <div className={`mr-4 whitespace-nowrap
            ${app.admissionStatus === "04 - ผ่านการพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#166534]" : ""}
            ${app.admissionStatus === "06 - รอสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-[#FFF4E2] text-[#DAA520]" : ""}
          `}>
                                                            {app.admissionStatus}
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
                                                        ) : isGrouped ? (
                                                            <div>
                                                                <span>{groupedApp?.interviewRoom}</span>
                                                            </div>
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

                                                    <td className="text-center whitespace-nowrap text-[#565656] mt-3 flex flex-row space-x-1 px-4">
                                                        {isGrouped ? (
                                                            <div className="flex flex-row space-x-2">
                                                                {groupedApp?.interviewComs.map((com, index) => (
                                                                    <div key={index}>
                                                                        อ. {com.firstName} |
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (app.InterviewCommittee?.length === 0) ? (

                                                            <div className="flex items-center justify-center gap-1 text-[#B9B9B9]">
                                                                <Image
                                                                    src="/images/admin/interview/waiting_icon.svg"
                                                                    alt="ยังไม่ได้เลือกกรรมการ"
                                                                    width={16}
                                                                    height={16}
                                                                />
                                                                <span>ยังไม่ได้เลือกกรรมการ</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-row space-x-2">
                                                                {app.InterviewCommittee?.map((com, index) => (
                                                                    <div key={index}>
                                                                        {com.shortName} |
                                                                    </div>
                                                                ))}
                                                            </div>

                                                        )}

                                                    </td>

                                                    <td className="text-center whitespace-nowrap text-[#565656]">
                                                        {isGrouped ? (
                                                            <div>
                                                                <span>{groupedApp?.dateTime}</span>
                                                            </div>
                                                        ) : (app.interviewDate && app.interviewTime) ? (
                                                            // const parts = app.interviewDateTime.split(" ");
                                                            // const date = parts.slice(0, 3).join(" "); // เช่น "10 เม.ย. 2568"
                                                            // const time = parts.slice(3).join(" ");    // เช่น "09:00 – 09:20 น."
                                                            <>
                                                                <div className="text-[15px]">{app.interviewDate}</div>
                                                                <div className="text-[15px] text-[#6B7280]">{app.interviewTime}</div>
                                                            </>

                                                        ) : (
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
                                                    {isEdit && (
                                                        <td className="text-center whitespace-nowrap">
                                                            <button
                                                                onClick={() => {
                                                                    handleEditMode(app);
                                                                }}

                                                                className="text-[#F59E0B] border border-[#DAA520] hover:bg-[#FFF7E6] px-4 py-1 rounded-[10px] flex justify-center gap-1 "
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
            {showSuccessAlert && (
                <AlertAdmin
                    message={'ดำเนินการจัดกลุ่มเรียบร้อย ผู้สมัครรอการสัมภาษณ์'}
                    onClose={() => setShowSuccessAlert(false)}
                />
            )}
            {/* this way */}
            {showEditInterviewPopup && editingInterview && (
                <PopupEditInterviewGrouping
                    isOpen={showEditInterviewPopup}
                    onClose={() => setShowEditInterviewPopup(false)}
                    interviewSchedules={interviewSchedules}
                    currentData={{
                        room: editingInterview.interviewRoom || "",
                        startTime: startTime.trim() || "",
                        endTime: endTime.trim() || "",
                    }}
                    existingSchedules={applicantData
                        .filter(a => a.grouping === "grouped" && a.applicantId !== editingInterview.applicantId)
                        .map(a => ({
                            room: a.interviewRoom || "",
                            startTime: a.interviewDateTime?.split(" ")[3] || "",
                            endTime: a.interviewDateTime?.split(" ")[5] || "",
                        }))}
                    roomOptions={allRoomOptions}
                    onSave={({ room, roundId, startTime, endTime }) => {
                        handleEditSave(room, roundId, startTime, endTime);
                    }}
                />
            )}
        </div>
    );
};

export default Page;