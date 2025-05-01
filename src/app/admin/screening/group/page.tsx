"use client";
import { useEffect, useState } from "react";

import React from 'react';
import Sidebar from "@components/components/SideBar";
import AdminNavbar from "@components/components/adminNavbar";
import SearchField from "@components/components/form/searchField";
import Image from 'next/image';
import { CourseComScreeningInterface, EduScreeningGroupingAllCourseComInterface } from "@components/types/screening";
import { getDecodedToken } from "@components/lib/auth";
import Modal from "@components/components/common/popup-login";

const courseOptions = ["ITDS/B", "ITCS/B"];
const roundOptions = [
    { label: "1/68 - MU – Portfolio (TCAS 1)", value: "DST01" },
    { label: "1/68 - ICT Portfolio", value: "ICT01" },
];
const admitStatusOptions = [
    { label: "03 - รอพิจารณา", value: "03 - รอพิจารณา" },
    { label: "04 - ผ่านการพิจารณา", value: "04 - ผ่านการพิจารณา" },
    { label: "05 - ไม่ผ่านการพิจารณา", value: "05 - ไม่ผ่านการพิจารณา" },

];
const paymentStatusOptions = ["03 - ชำระเงินเรียบร้อย"];

const Page = () => {
    const [committees, setCommittees] = useState<EduScreeningGroupingAllCourseComInterface[]>([]);
    const [applicants, setApplicants] = useState<CourseComScreeningInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const decoded = getDecodedToken();
        if (!decoded) {
          setShowModal(true);
          return;
        }
        setRoles(decoded.roles);
      }, []);

    async function fetchData() {
        try {
            const [res_com, res_app] = await Promise.all([
                fetch(`${process.env.API_BASE_URL}/course-committee/get-all-courseC`),
                fetch(`${process.env.API_BASE_URL}/course-committee/all-applicant-courseC`)
            ]);

            if (!res_com.ok || !res_app.ok) {
                throw new Error("Failed to fetch one or more resources");
            }

            const data_com = await res_com.json();
            const data_app = await res_app.json();

            setCommittees(data_com || []);
            setApplicants(data_app.applicants || []);

        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
    const [selectedCommittees, setSelectedCommittees] = useState<string[]>([]);
    const [editSelectedCommittees, setEditSelectedCommittees] = useState<string[]>([]);
    const [editSelectedApplicantIds, setEditSelectedApplicantIds] = useState<string[]>([]);

    const createApplicantCommitteePairs = (applicantIds: string[], committees: string[]) => {
        const validApplicantIds = Array.isArray(applicantIds) ? applicantIds : [];
        const pairs = validApplicantIds.map((applicantId, index) => {
            const committeeId = committees[index % committees.length];
            return { app_id: applicantId, com_id: committeeId };
        });

        return pairs;
    };

    const applicantCommitteePairs = createApplicantCommitteePairs(selectedApplicantIds, selectedCommittees);
    const editApplicantCommitteePairs = createApplicantCommitteePairs(editSelectedApplicantIds, editSelectedCommittees);


    const sendPairsToBackend = async (pairs: { app_id: string; com_id: string }[]) => {
        try {
            const response = await fetch(`${process.env.API_BASE_URL}/education-department/update-edu-preEva`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pairs),
            });

            if (!response.ok) {
                throw new Error('Failed to update data in the database');
            }

            alert('Data successfully updated in the database');
            window.location.reload();
        } catch (error) {
            console.error("Error sending pairs to backend:", error);
            alert('An error occurred while updating data');
        }
    };

    const [isCollapsed, setIsCollapsed] = useState(false);

    interface FilterState {
        course?: string;
        round?: string;
        admitStatus?: string;
        docStatus?: string;
        paymentStatus?: string;
        applicantId?: string;
        fname?: string;
        lname?: string;
        fullname?: string;
        committee?: string;
        grouping?: string;
    }

    const [filters, setFilters] = useState<FilterState>({})
    const [filterValues, setFilterValues] = useState<FilterState>({
        docStatus: "03 - เอกสารครบถ้วน",
        paymentStatus: "03 - ชำระเงินเรียบร้อย"
    });

    const [isExpanded, setIsExpanded] = useState(false);

    const handleSearch = () => {
        setFilters(filterValues);
    };

    const handleReset = () => {
        setFilterValues({
            docStatus: "03 - เอกสารครบถ้วน",
            paymentStatus: "03 - ชำระเงินเรียบร้อย"
        });
        setFilters({});
    };

    const committeeGroups = committees.map((com) => ({
        label: `อ. ${com.firstName}`,
        value: `${com.courseComId}`,
        full: `${com.prefix} ${com.firstName} ${com.lastName}`
    }));

    const filteredApplicants = applicants.filter(app =>
        (!filters.course || app.program === filters.course) &&
        (!filters.round || app.roundName === filters.round) &&
        (!filters.admitStatus || app.admissionStatus === filters.admitStatus) &&
        (!filters.docStatus || app.docStatus === filters.docStatus) &&
        (!filters.applicantId || app.applicantId?.includes(filters.applicantId)) &&
        (!filters.fullname || app.fullnameEN?.includes(filters.fullname)) &&
        (!filters.committee || app.courseComId?.includes(filters.committee)) &&
        (!filters.grouping || (filters.grouping === "grouped" && app.courseComId) || (filters.grouping === "ungrouped" && !app.courseComId))
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Show 10 items per page

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

    const [showPopup, setShowPopup] = useState(false)
    const [isGroupingMode, setIsGroupingMode] = useState(false);
    const [isAssignedShowing, setIsAssignedShowing] = useState(false);
    const isAllSelected = paginatedApplicants.every(app => selectedApplicantIds.includes(app.applicantId));
    const [assignedCommitteeMap, setAssignedCommitteeMap] = useState<Record<string, string>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [showingEditDropdown, setShowingEditDropdown] = useState('');

    const handleEnterGroupingMode = () => {
        setIsGroupingMode(!isGroupingMode);
    }

    const handleAssignCommittees = () => {
        const assignments: Record<string, string> = {};
        const totalApplicants = selectedApplicantIds.length;
        const totalCommittees = selectedCommittees.length;

        if (totalApplicants === 0 || totalCommittees === 0) return;

        const applicantsPerCommittee = Math.floor(totalApplicants / totalCommittees);
        const remainingApplicants = totalApplicants % totalCommittees;

        let currentIndex = 0;

        selectedCommittees.forEach((committeeId, index) => {
            const numberToAssign = applicantsPerCommittee + (index < remainingApplicants ? 1 : 0);

            for (let i = 0; i < numberToAssign; i++) {
                if (currentIndex >= totalApplicants) break;
                const applicantId = selectedApplicantIds[currentIndex];
                const committee = committeeGroups.find((c) => c.value === committeeId);
                if (committee) {
                    assignments[applicantId] = committee.full;
                }
                currentIndex++;
            }
        });

        setAssignedCommitteeMap(assignments);
        setIsAssignedShowing(true);
    };



    return (
        <div className="flex flex-col min-h-screen bg-white">
            {showModal && <Modal role="admin"/>}
            <AdminNavbar
                isCollapsed={isCollapsed}
            />
            <div className="flex flex-row flex-1 min-h-screen overflow-hidden">
                <div className="relative z-50">
                    <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} userRoles={roles} />
                </div>
                <div
                    className={`w-full transition-all p-6 mt-[64px] min-h-[calc(100vh-64px)] ${isCollapsed ? "ml-[80px]" : "ml-[300px]"}`}
                >
                    {/* Search and Filter Box */}

                    <div className="relative max-w-[1600px] w-full mx-auto p-5 rounded-lg shadow-md mb-6 px-4 md:px-8 z-10 mt-5">
                        <h2 className="text-[24px] font-semibold text-[#565656] mb-4">ค้นหาผู้สมัคร</h2>
                        <hr className="mb-4 border-gray-300" />

                        <div className="flex flex-wrap items-end gap-2 mb-4">
                            <div className="w-[180px] z-20">
                                <SearchField
                                    label="หลักสูตร"
                                    type="dropdown"
                                    value={filterValues.course || ""}
                                    onChange={(option) => {
                                        if (typeof option === "object" && option !== null && "value" in option) {
                                            setFilterValues({ ...filterValues, course: option.value });
                                        } else {
                                            setFilterValues({ ...filterValues, course: "" });
                                        }
                                    }}
                                    options={courseOptions.map(value => ({ label: value, value }))}
                                    placeholder="เลือกหลักสูตร"
                                />
                            </div>

                            <div className="w-[320px] z-50 relative">
                                <SearchField
                                    label="รอบรับสมัคร"
                                    type="dropdown"
                                    value={filterValues.round || ""}
                                    onChange={(option) => {
                                        if (typeof option === "object" && option !== null && "value" in option) {
                                            setFilterValues({ ...filterValues, round: option.value });
                                        } else {
                                            setFilterValues({ ...filterValues, round: "" });
                                        }
                                    }}
                                    options={roundOptions}
                                    placeholder="เลือกรอบรับสมัคร"
                                />
                            </div>

                            <div className="w-[240px]">
                                <SearchField
                                    label="สถานะการสมัคร"
                                    type="dropdown"
                                    value={filterValues.admitStatus || ""}
                                    onChange={(option) => {
                                        if (typeof option === "object" && option !== null && "value" in option) {
                                            setFilterValues({ ...filterValues, admitStatus: option.value });
                                        } else {
                                            setFilterValues({ ...filterValues, admitStatus: "" });
                                        }
                                    }}
                                    options={admitStatusOptions}
                                    placeholder="เลือกสถานะการสมัคร"
                                />
                            </div>

                            <div className="w-[240px]">
                                <SearchField
                                    label="สถานะเอกสาร"
                                    type="dropdown"
                                    value={filterValues.docStatus || ""}
                                    onChange={(option) => {
                                        if (typeof option === "object" && option !== null && "value" in option) {
                                            setFilterValues({ ...filterValues, docStatus: option.value });
                                        } else {
                                            setFilterValues({ ...filterValues, docStatus: "" });
                                        }
                                    }}
                                    options={[
                                        { label: "03 - เอกสารครบถ้วน", value: "03 - เอกสารครบถ้วน" },
                                    ]}
                                    placeholder="เลือกสถานะเอกสาร"
                                />
                            </div>

                            <div className="w-[270px]">
                                <SearchField
                                    label="สถานะการชำระเงิน"
                                    type="dropdown"
                                    value={filterValues.paymentStatus || ""}
                                    onChange={(option) => {
                                        if (typeof option === "object" && option !== null && "value" in option) {
                                            setFilterValues({ ...filterValues, paymentStatus: option.value });
                                        } else {
                                            setFilterValues({ ...filterValues, paymentStatus: "" });
                                        }
                                    }}
                                    options={paymentStatusOptions.map(value => ({ label: value, value }))}
                                    placeholder="เลือกสถานะการชำระเงิน"
                                />
                            </div>

                            <div className="flex gap-1 flex-wrap items-end">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="w-[30px] h-[40px] flex items-center justify-center border border-[#565656] rounded-md"
                                >

                                    <Image
                                        src={
                                            isExpanded
                                                ? "/images/admin/searchBar/show_less_icon.svg"
                                                : "/images/admin/searchBar/show_more_icon.svg"
                                        }
                                        alt={isExpanded ? "แสดงน้อยลง" : "แสดงเพิ่มเติม"}
                                        width={37}
                                        height={37}
                                        className="w-37 h-37"
                                    />
                                </button>
                                <button
                                    className="px-1.5 h-[40px] border border-gray-400 rounded-md text-[#565656] bg-white flex items-center gap-1"
                                    onClick={handleReset}
                                >
                                    <Image src="/images/admin/searchBar/clear_icon.svg" alt="reset" width={16} height={16} className="w-4 h-4" />
                                    ล้างค่า
                                </button>
                                <button
                                    className="px-2 h-[40px] rounded-md bg-[#008A90] hover:bg-[#009198] text-white flex items-center gap-1"
                                    onClick={handleSearch}
                                >
                                    <Image src="/images/admin/searchBar/search_icon.svg" alt="search" width={16} height={16} className="w-4 h-4" />
                                    ค้นหารายการ
                                </button>
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="flex flex-wrap gap-2">
                                <div className="w-[180px]">
                                    <SearchField
                                        label="เลขที่สมัคร"
                                        value={filterValues.applicantId || ""}
                                        onChange={(value) => {
                                            if (typeof value === "object" && value !== null && "value" in value) {
                                                setFilterValues({ ...filterValues, applicantId: value.value });
                                            } else {
                                                setFilterValues({ ...filterValues, applicantId: value ?? undefined });
                                            }
                                        }}
                                        placeholder="กรุณากรอกข้อมูล"
                                    />
                                </div>
                                <div className="w-[280px]">
                                    <SearchField
                                        label="ชื่อ-นามสกุล ผู้สมัคร"
                                        value={filterValues.fullname || ""}
                                        onChange={(value) => {
                                            if (typeof value === "object" && value !== null && "value" in value) {
                                                setFilterValues({ ...filterValues, fullname: value.value });
                                            } else {
                                                setFilterValues({ ...filterValues, fullname: value ?? undefined });
                                            }
                                        }}
                                        placeholder="กรุณากรอกข้อมูล"
                                    />
                                </div>
                                <div className="w-[240px]">
                                    <SearchField
                                        label="การจัดกลุ่มผู้สมัคร"
                                        type="dropdown"
                                        value={filterValues.grouping || ""}
                                        onChange={(option) => {
                                            if (typeof option === "object" && option !== null && "value" in option) {
                                                setFilterValues({ ...filterValues, grouping: option.value });
                                            } else {
                                                setFilterValues({ ...filterValues, grouping: "" });
                                            }
                                        }}
                                        options={[
                                            { label: "จัดกลุ่มแล้ว", value: "grouped" },
                                            { label: "ยังไม่ได้จัดกลุ่ม", value: "ungrouped" },
                                        ]}
                                        placeholder="เลือกการจัดกลุ่ม"
                                    />
                                </div>
                                <div className="w-[240px]">
                                    <SearchField
                                        label="กรรมการหลักสูตร"
                                        type="dropdown"
                                        value={filterValues.committee || ""}
                                        onChange={(option) => {
                                            if (typeof option === "object" && option !== null && "value" in option) {
                                                setFilterValues({ ...filterValues, committee: option.value });
                                            } else {
                                                setFilterValues({ ...filterValues, committee: "" });
                                            }

                                        }}
                                        options={committeeGroups}
                                        placeholder="เลือกกรรมการหลักสูตร"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Display Filtered Results */}
                    <div className="mt-6 ">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold text-[#565656] whitespace-nowrap">
                                รายการใบสมัคร  <span className="text-[#6B7280] font-bold">{filteredApplicants.length}</span>
                            </h2>

                            <div className="flex flex-row space-x-2">
                                <div>

                                    {isGroupingMode && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            {selectedCommittees.map((id) => {
                                                const group = committeeGroups.find((g) => g.value === id);
                                                return (
                                                    <div
                                                        key={id}
                                                        className="bg-[#008A90] text-white px-2 py-1 rounded-full flex items-center gap-1"
                                                    >
                                                        <span>{group?.label}</span>
                                                        <button
                                                            className="text-white hover:text-gray-200"
                                                            onClick={() =>
                                                                setSelectedCommittees(selectedCommittees.filter((gid) => gid !== id))
                                                            }
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                );
                                            })}


                                            <select
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value && !selectedCommittees.includes(value)) {
                                                        setSelectedCommittees([...selectedCommittees, value]);
                                                    }
                                                }}
                                                value=""
                                                className="border border-gray-300 text-gray-500 rounded-md px-2 py-2 w-[200px]"
                                            >
                                                <option value="" disabled>เลือกกรรมการ</option>
                                                {committeeGroups.map((group) => (
                                                    <option key={group.value} value={group.value}>
                                                        {group.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                                {isGroupingMode ? (


                                    <div className="flex flex-row space-x-2">
                                        <button
                                            className="min-w-[160px] border border-[#008A90] text-[#008A90] bg-white px-3 py-2 rounded-md flex items-center gap-2"
                                            onClick={handleAssignCommittees}
                                        >
                                            <Image src="/images/admin/preliminaryResult/grouping_icon_after.svg" alt="จัดกลุ่มอัตโนมัติ" width={20} height={20} />
                                            <div>จัดกลุ่มอัตโนมัติ</div>
                                        </button>

                                        <button
                                            className={`min-w-[160px] px-3 py-2 rounded-md flex items-center gap-2 text-white ${selectedApplicantIds.length > 0 && selectedCommittees.length > 0
                                                ? "bg-[#008A90] hover:bg-[#009198]"
                                                : "bg-gray-300 cursor-not-allowed"}
                                                        `}
                                            onClick={() => sendPairsToBackend(applicantCommitteePairs)}
                                            disabled={selectedApplicantIds.length === 0 || !selectedCommittees}
                                        >
                                            <Image src="/images/admin/preliminaryResult/save_icon.svg" alt="บันทึกการจัดกลุ่ม" width={16} height={16} className="w-4 h-4" />
                                            <div>บันทึกการจัดกลุ่ม</div>
                                        </button>
                                    </div>


                                ) : applicants.every(app => app.prefix && app.firstName && app.lastName) ? (
                                    <div className="flex flex-row space-x-2">
                                        <button
                                            className="min-w-[160px] border border-[#F59E0B] text-[#F59E0B] bg-white  px-3 py-2 rounded-[10px] flex items-center gap-2"
                                            onClick={() => setIsEditing(!isEditing)}
                                        >
                                            <Image src="/images/admin/interview/edit_icon.svg" alt="แก้ไขการจัดกลุ่ม" width={20} height={20} />
                                            <div>แก้ไขการจัดกลุ่ม</div>
                                        </button>
                                        <button
                                            className="min-w-[160px] bg-[#00796B] hover:bg-[#028273] text-white px-3 py-2 rounded-md flex items-center gap-2 "

                                        >
                                            <Image src="/images/admin/searchBar/download_icon.svg" alt="Download Excel" width={16} height={16} className="w-4 h-4" />
                                            <div>Export to Excel</div>
                                        </button>
                                    </div>
                                ) : (

                                    <div className="flex flex-row space-x-2">
                                        <button
                                            className={`min-w-[160px] px-3 py-2 rounded-[10px] flex items-center gap-2 bg-[#008A90] hover:bg-[#009198] text-white`}
                                            onClick={handleEnterGroupingMode}
                                        >
                                            <Image src="/images/admin/preliminaryResult/grouping_icon_before.svg" alt="จัดกลุ่มอัตโนมัติ" width={20} height={20} />
                                            <div>จัดกลุ่มอัตโนมัติ</div>
                                        </button>

                                        <button
                                            className="min-w-[160px] bg-[#C4C4C4] text-white px-3 py-2 rounded-md flex items-center gap-2 cursor-not-allowed"
                                            disabled
                                            title="โปรดจัดกลุ่มผู้สมัครก่อน"
                                        >
                                            <Image src="/images/admin/searchBar/download_icon.svg" alt="Download Excel" width={16} height={16} className="w-4 h-4" />
                                            <div>Export to Excel</div>
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>
                        <div className="overflow-x-auto w-full">
                            <table className="w-full table-auto border-collapse">
                                <thead>
                                    <tr className="bg-[#F3F5F6] text-center text-[#565656]">
                                        {isGroupingMode && (<th className="px-2 py-4 whitespace-nowrap w-[40px]">
                                            <input
                                                type="checkbox"
                                                checked={isAllSelected}
                                                onChange={(e) => {
                                                    const allIds = paginatedApplicants.map(app => app.applicantId);
                                                    setSelectedApplicantIds(e.target.checked ? allIds : []);
                                                }}
                                            />
                                        </th>)}
                                        <th className="px-2 py-4 whitespace-nowrap w-[50px]">No</th>
                                        <th className="px-2 py-4 whitespace-nowrap w-[60px]">รอบ</th>
                                        <th className="px-2 py-4 whitespace-nowrap w-[100px]">เลขที่สมัคร</th>
                                        <th className="px-2 py-4 whitespace-nowrap w-[200px]">ชื่อ - นามสกุล ผู้สมัคร</th>
                                        <th className="px-2 py-4 whitespace-nowrap w-[100px]">หลักสูตร</th>
                                        <th className="px-2 py-4 whitespace-nowrap w-[170px]">สถานะการสมัคร</th>
                                        <th className="px-2 py-4 whitespace-nowrap w-[170px]">สถานะเอกสาร</th>
                                        <th className="px-2 py-4 whitespace-nowrap w-[180px]">สถานะการชำระเงิน</th>
                                        <th className="px-2 py-4 whitespace-nowrap w-[200px]">กรรมการหลักสูตร</th>
                                        <th className="px-2 py-4 whitespace-nowrap w-[130px]"></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedApplicants.map((app, index) => (
                                        <tr
                                            key={index}
                                            className={`text-[#565656] h-[50px] items-center 
                                              ${app.admissionStatus !== "09 - ยกเลิกการสมัคร" ? "hover:bg-gray-50" : ""}
                                              ${app.admissionStatus === "09 - ยกเลิกการสมัคร" ? "bg-[#FFE8E8]" : ""}
                                            `}
                                        >
                                            {isGroupingMode && (<td className="text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedApplicantIds.includes(app.applicantId)}
                                                    onChange={(e) => {
                                                        setSelectedApplicantIds(prev =>
                                                            e.target.checked
                                                                ? [...prev, app.applicantId]
                                                                : prev.filter(id => id !== app.applicantId)
                                                        );
                                                    }}
                                                />
                                            </td>)}

                                            <td className="text-center whitespace-nowrap">{startIndex + index + 1}</td>
                                            <td className="text-center whitespace-nowrap">{app.roundName}</td>
                                            <td className="text-center whitespace-nowrap">{app.applicantNumber}</td>
                                            <td className="whitespace-nowrap">{app.firstnameEN} {app.lastnameEN}</td>
                                            <td className="text-center whitespace-nowrap">{app.program}</td>
                                            <td>
                                                <div className={`mr-4 whitespace-nowrap
                                                    ${app.admissionStatus === "02 - ยื่นใบสมัครแล้ว" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#166534]" : ""}
                                                    ${app.admissionStatus === "03 - รอพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-[#FFF4E2] text-[#DAA520]" : ""}
                                                `}>
                                                    {app.admissionStatus}
                                                </div>
                                            </td>

                                            {/* Document Status with Conditional Highlight */}
                                            <td>
                                                {app.admissionStatus === "09 - ยกเลิกการสมัคร" ? (
                                                    <div >ไม่ต้องดำเนินการต่อ</div>
                                                ) : (
                                                    <div className={`mr-4 whitespace-nowrap
                                                        ${app.docStatus === "02 - รอตรวจสอบเอกสาร" ? "h-[30px] pt-[2px] rounded-xl bg-[#FFF4E2] text-[#DAA520]" : ""}
                                                        ${app.docStatus === "03 - เอกสารครบถ้วน" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#13522B]" : ""}
                                                        ${app.docStatus === "04-เอกสารไม่ครบถ้วน" ? "h-[30px] pt-[2px] rounded-xl bg-red-200 text-red-600" : ""}
                                                        `}>
                                                        {app.docStatus}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <div className={`mr-4 whitespace-nowrap
                                                    ${app.paymentStatus === "03 - ชำระเงินเรียบร้อย" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#13522B]" : ""}
                                                `}>
                                                    {app.paymentStatus}
                                                </div>
                                            </td>
                                            <td className="text-center text-[#565656] whitespace-nowrap">
                                                {isAssignedShowing ? (
                                                    (() => {
                                                        const committee = committeeGroups.find(group =>
                                                            group.value === applicantCommitteePairs.find(pair => pair.app_id === app.applicantId)?.com_id
                                                        );
                                                        return committee ? (
                                                            <span>{committee.full}</span>
                                                        ) : null;
                                                    })()

                                                ) : app.prefix ? (
                                                    <span>{app.prefix} {app.firstName} {app.lastName}</span>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-1 text-[#6B7280]">
                                                        <Image
                                                            src="/images/admin/preliminaryResult/not_grouping_icon.svg"
                                                            alt="ยังไม่ได้เลือกกรรมการ"
                                                            width={16}
                                                            height={16}
                                                        />
                                                        <span>ยังไม่ได้เลือกกรรมการหลักสูตร</span>
                                                    </div>
                                                )
                                                }
                                            </td>


                                            <td>
                                                {isEditing && (
                                                    <div>
                                                        <button
                                                            className="min-w-[160px] border border-[#F59E0B] text-[#F59E0B] bg-white mx-5 px-1 py-1 rounded-[10px] flex items-center gap-2"
                                                            onClick={() => {
                                                                setShowPopup(true)
                                                                setEditSelectedApplicantIds([...editApplicantCommitteePairs, app.applicantId])
                                                            }}
                                                        >
                                                            <Image src="/images/admin/interview/edit_icon.svg" alt="แก้ไขการจัดกลุ่ม" width={20} height={20} />
                                                            <div>แก้ไขการจัดกลุ่ม</div>
                                                        </button>
                                                        {showPopup && (
                                                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                                                                    <h2 className="text-xl font-bold mb-4">แก้ไขการจัดกลุ่มผู้สมัคร</h2>
                                                                    <p className="mb-4 text-[15px] text-gray-700">กรรมการหลักสูตร</p>
                                                                    <div className="flex flex-col gap-2 mb-4">
                                                                        <div className="relative w-full">
                                                                            <select
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    if (value) {
                                                                                        setShowingEditDropdown(value);
                                                                                        setEditSelectedCommittees([...editSelectedCommittees, value]);
                                                                                    }
                                                                                }}
                                                                                value={showingEditDropdown}
                                                                                className="appearance-none border border-gray-300 text-gray-500 rounded-md px-2 py-2 w-full pr-10"
                                                                            >
                                                                                <option value="" disabled>เลือกกรรมการหลักสูตร</option>
                                                                                {committeeGroups.map((group) => (
                                                                                    <option key={group.value} value={group.value}>
                                                                                        {group.label}
                                                                                    </option>
                                                                                ))}
                                                                            </select>

                                                                            <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
                                                                                <Image
                                                                                    src="/images/dropdown_button.svg"
                                                                                    alt="Dropdown"
                                                                                    width={16}
                                                                                    height={16}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex justify-center flex-row mt-4 gap-x-2">
                                                                            <button
                                                                                onClick={() => setShowPopup(false)}
                                                                                className="px-8 py-2 text-black rounded-md border border-gray-400"
                                                                            >
                                                                                ยกเลิก
                                                                            </button>
                                                                            <button

                                                                                className="px-8 py-2 bg-[#008A90] text-white rounded-md flex flex-row gap-x-1 items-center"
                                                                                onClick={() => sendPairsToBackend(editApplicantCommitteePairs)}
                                                                            >
                                                                                <svg width="21" height="25" viewBox="0 0 21 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M14.4943 21.2402L14.4943 13.2402L6.16097 13.2402L6.16097 21.2402M6.16097 3.24023L6.16097 8.24023L12.8276 8.24023M16.161 21.2402L4.4943 21.2402C4.05228 21.2402 3.62835 21.0295 3.31579 20.6544C3.00323 20.2794 2.82764 19.7707 2.82764 19.2402L2.82764 5.24023C2.82764 4.7098 3.00323 4.20109 3.31579 3.82602C3.62835 3.45095 4.05228 3.24023 4.4943 3.24023L13.661 3.24023L17.8276 8.24023L17.8276 19.2402C17.8276 19.7707 17.652 20.2794 17.3395 20.6544C17.0269 21.0295 16.603 21.2402 16.161 21.2402Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                </svg>

                                                                                บันทึก
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex justify-between flex-row mt-6 items-center">
                        {/* จำนวนรายการที่แสดง */}
                        <div className="items-center">
                            <span className="mx-2 text-[#565656] text-sm">จำนวนรายการที่แสดง</span>
                            <select
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="border border-[#C4C4C4] rounded-[10px] w-[80px] p-0.5 text-sm focus:outline-none focus:ring-0"
                            >

                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={filteredApplicants.length}>ทั้งหมด</option>
                            </select>
                        </div>

                        {/* ช่วงที่แสดง + pagination */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-[#6B7280]">
                                {filteredApplicants.length === 0
                                    ? "0 รายการ"
                                    : `${startIndex + 1}-${Math.min(endIndex, filteredApplicants.length)} จาก ${filteredApplicants.length}`}
                            </span>

                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="border-2 border-solid border-gray-300 px-3 py-2 rounded-md"
                            >
                                <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.4 6.5L8 11.1L6.6 12.5L0.6 6.5L6.6 0.5L8 1.9L3.4 6.5Z" fill="#1D1B20" />
                                </svg>
                            </button>

                            <span className="bg-[#008A90] px-3 py-[6px] rounded-md text-white">{currentPage}</span>

                            <button
                                onClick={nextPage}
                                disabled={endIndex >= filteredApplicants.length}
                                className="border-2 border-solid border-gray-300 px-3 py-2 rounded-md"
                            >
                                <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.13125 6.5L0.53125 1.9L1.93125 0.5L7.93125 6.5L1.93125 12.5L0.53125 11.1L5.13125 6.5Z" fill="#1D1B20" />
                                </svg>
                            </button>
                        </div>
                    </div>


                </div>
            </div>

        </div>

    );
};

export default Page;