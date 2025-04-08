"use client";
import { useEffect, useState } from "react";

import React from 'react';
import Sidebar from "@components/components/SideBar";
import AdminNavbar from "@components/components/adminNavbar";
import SearchField from "@components/components/form/searchField";
import Image from 'next/image';
import { CourseComScreeningInterface, EduScreeningGroupingAllCourseComInterface } from "@components/types/screening";

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

const Page = () => {

    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
    const [committees, setCommittees] = useState<EduScreeningGroupingAllCourseComInterface[]>([]);
    const [applicants, setApplicants] = useState<CourseComScreeningInterface[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        try {
            const [res_com, res_app] = await Promise.all([
                fetch(`${API_BASE_URL}/course-committee/get-all-courseC`),
                fetch(`${API_BASE_URL}/course-committee/all-applicant-courseC`)
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

    const handleAutoGrouping = async () => {
        if (selectedApplicantIds.length === 0 || !selectedCommittees) return;

        try {
            const payload = {
                app_id: selectedApplicantIds,
                com_id: selectedCommittees,
            };

            const response = await fetch(`${API_BASE_URL}/education-department/update-edu-preEva`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('ไม่สามารถจัดกลุ่มได้');
            }

            alert('จัดกลุ่มสำเร็จแล้ว');

        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาดในการจัดกลุ่ม');
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
        committee?: string;
    }

    const [filters, setFilters] = useState<FilterState>({
        docStatus: "03 - เอกสารครบถ้วน",
    });

    const [filterValues, setFilterValues] = useState<FilterState>({
        docStatus: "03 - เอกสารครบถ้วน",
    });

    const [isExpanded, setIsExpanded] = useState(false);

    const handleSearch = () => {
        setFilters(filterValues);
    };

    const handleReset = () => {
        const defaultDocStatus = "03 - เอกสารครบถ้วน";
        setFilterValues({ docStatus: defaultDocStatus });
        setFilters({ docStatus: defaultDocStatus });
    };

    const committeeGroups = committees.map((com) => ({
        com_name: `อ. ${com.firstName}`,
        com_id: `${com.courseComId}`
    }));

    const filteredApplicants = applicants.filter(app =>
        (!filters.course || app.program === filters.course) &&
        (!filters.round || app.roundName === filters.round) &&
        (!filters.admitStatus || app.admissionStatus === filters.admitStatus) &&
        (!filters.docStatus || app.docStatus === filters.docStatus) &&
        (!filters.applicantId || app.applicantId?.includes(filters.applicantId)) &&
        (!filters.fname || app.firstnameEN?.includes(filters.fname)) &&
        (!filters.lname || app.lastnameEN?.includes(filters.lname))
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

    const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
    const [selectedCommittees, setSelectedCommittees] = useState<string[]>([]);
    const isAllSelected = paginatedApplicants.every(app => selectedApplicantIds.includes(app.applicantId));


    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div>
                <AdminNavbar
                    isCollapsed={isCollapsed}
                />
                <div className="flex flex-row flex-1 min-h-screen overflow-hidden">
                    <div className="relative z-50">
                        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} userRole="กรรมการหลักสูตร" />
                    </div>
                    <main
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

                                <div className="w-[300px]">
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

                                <div className="w-[275px]">
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
                                            label="ชื่อ ผู้สมัคร"
                                            value={filterValues.fname || ""}
                                            onChange={(value) => {
                                                if (typeof value === "object" && value !== null && "value" in value) {
                                                    setFilterValues({ ...filterValues, fname: value.value });
                                                } else {
                                                    setFilterValues({ ...filterValues, fname: value ?? undefined });
                                                }
                                            }}
                                            placeholder="กรุณากรอกข้อมูล"
                                        />
                                    </div>
                                    <div className="w-[280px]">
                                        <SearchField
                                            label="นามสกุล ผู้สมัคร"
                                            value={filterValues.lname || ""}
                                            onChange={(value) => {
                                                if (typeof value === "object" && value !== null && "value" in value) {
                                                    setFilterValues({ ...filterValues, lname: value.value });
                                                } else {
                                                    setFilterValues({ ...filterValues, lname: value ?? undefined });
                                                }
                                            }}
                                            placeholder="กรุณากรอกข้อมูล"
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

                                    <div className="flex flex-wrap items-center gap-2">
                                        {selectedCommittees.map((id) => {
                                            const group = committeeGroups.find((g) => g.com_id === id);
                                            return (
                                                <div
                                                    key={id}
                                                    className="bg-[#008A90] text-white px-2 py-1 rounded-full flex items-center gap-1"
                                                >
                                                    <span>{group?.com_name}</span>
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
                                    </div>

                                    <select
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value && !selectedCommittees.includes(value)) {
                                                setSelectedCommittees([...selectedCommittees, value]);
                                            }
                                        }}
                                        value=""
                                        className="border border-gray-300 rounded px-2 py-1 w-[200px]"
                                    >
                                        <option value="" disabled>เลือกกรรมการ</option>
                                        {committeeGroups.map((group) => (
                                            <option key={group.com_id} value={group.com_id}>
                                                {group.com_name}
                                            </option>
                                        ))}
                                    </select>


                                    <button
                                        className={`min-w-[160px] px-3 py-2 rounded-md flex items-center gap-2 text-white 
                                                ${selectedApplicantIds.length > 0 && selectedCommittees
                                                ? "bg-[#008A90] hover:bg-[#009198]"
                                                : "bg-gray-300 cursor-not-allowed"}
                                                `}
                                        onClick={handleAutoGrouping}
                                        disabled={selectedApplicantIds.length === 0 || !selectedCommittees}
                                    >
                                        <Image src="/images/admin/preliminaryResult/grouping_icon_before.svg" alt="จัดกลุ่มอัตโนมัติ" width={20} height={20} />
                                        <div>จัดกลุ่มอัตโนมัติ</div>
                                    </button>


                                    <button
                                        className="min-w-[160px] bg-[#00796B] hover:bg-[#028273] text-white px-3 py-2 rounded-md flex items-center gap-2 "

                                    >
                                        <Image src="/images/admin/searchBar/download_icon.svg" alt="Download Excel" width={16} height={16} className="w-4 h-4" />
                                        <div>Export to Excel</div>
                                    </button>

                                    {/*<button
                                        className={`min-w-[160px] px-3 py-2 rounded-[10px] flex items-center gap-2 bg-[#008A90] hover:bg-[#009198] text-white`}
                                    >
                                        <Image src="/images/admin/preliminaryResult/save_icon.svg" alt="บันทึกการจัดกลุ่ม" width={16} height={16} className="w-4 h-4" />
                                        <div>บันทึกการจัดกลุ่ม</div>
                                    </button>*/}
                                </div>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-[#F3F5F6] text-center text-[#565656]">
                                            <th className="px-2 py-4 whitespace-nowrap w-[40px]">
                                                <input
                                                    type="checkbox"
                                                    checked={isAllSelected}
                                                    onChange={(e) => {
                                                        const allIds = paginatedApplicants.map(app => app.applicantId);
                                                        setSelectedApplicantIds(e.target.checked ? allIds : []);
                                                    }}
                                                />
                                            </th>
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
                                                <td className="text-center">
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
                                                </td>

                                                <td className="text-center whitespace-nowrap">{startIndex + index + 1}</td>
                                                <td className="text-center whitespace-nowrap">{app.roundName}</td>
                                                <td className="text-center whitespace-nowrap">{app.applicantId}</td>
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
                                                    {app.firstName ? (
                                                        `${app.prefix} ${app.firstName} ${app.lastName}`
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
                                                    )}
                                                </td>

                                                <td className="py-2 text-center whitespace-nowrap">
                                                    {(app.admissionStatus === "04 - ผ่านการพิจารณา" || app.admissionStatus === "05 - ไม่ผ่านการพิจารณา" || app.admissionStatus === "03 - รอพิจารณา") && (
                                                        <button className="bg-white px-4 py-1 my-2 rounded-lg border border-[#008A90] text-[#008A90] ">
                                                            <div className="flex flex-row gap-1">
                                                                <div className="pt-1">
                                                                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M18.6438 16.6993L14.5879 12.6365C15.6817 11.3031 16.335 9.59495 16.335 7.73621C16.335 3.46403 12.8738 0 8.60502 0C4.33626 0 0.875 3.46403 0.875 7.73621C0.875 12.0084 4.33626 15.4724 8.60502 15.4724C10.4696 15.4724 12.1801 14.8112 13.5161 13.7092L17.572 17.7683C18.0455 18.2018 18.4896 17.9226 18.6438 17.7683C18.9521 17.4634 18.9521 17.0042 18.6438 16.6993ZM2.38356 7.73621C2.38356 4.29789 5.16945 1.50977 8.60502 1.50977C12.0406 1.50977 14.8301 4.29789 14.8301 7.73621C14.8301 11.1745 12.0442 13.9626 8.60869 13.9626C5.17312 13.9626 2.38356 11.1745 2.38356 7.73621Z" fill="#008A91" />
                                                                    </svg>
                                                                </div>
                                                                <div>view</div>
                                                            </div>
                                                        </button>
                                                    )}

                                                    {app.admissionStatus === "09 - ยกเลิกการสมัคร" && (
                                                        <button className="bg-red px-1 py-1 my-2 rounded-lg border border-red-500 text-red-500 text-[14px] font-bold w-[130px]">
                                                            <div className="flex flex-row gap-1">
                                                                <div className="pt-1">
                                                                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M5.02655 0.00736992C2.26224 -0.00847055 0.0160495 2.21504 0.0094537 4.97341C0.00286904 7.73769 2.23391 9.99135 4.9923 10.0072C7.7566 10.023 10.0028 7.79951 10.0094 5.04114C10.0219 2.27687 7.78494 0.0232018 5.02655 0.00736992ZM4.95821 1.35397C5.20038 1.35433 5.40137 1.44322 5.56708 1.61475C5.73869 1.78039 5.82177 1.98724 5.82223 2.22941C5.82269 2.47158 5.74037 2.67228 5.56941 2.84333C5.40434 3.00847 5.19776 3.09086 4.9615 3.09052C4.71342 3.09015 4.51244 3.00717 4.34084 2.84154C4.17514 2.67591 4.08615 2.46905 4.08569 2.22688C4.08522 1.9788 4.17344 1.7781 4.34442 1.61297C4.50948 1.44192 4.71604 1.35362 4.95821 1.35397ZM3.55078 3.59052L5.84843 3.59387L5.85653 7.87616L6.5476 7.87717L6.54864 8.42648L3.55991 8.42213L3.55888 7.87281L4.24404 7.87381L4.23698 4.14083L3.55181 4.13984L3.55078 3.59052Z" fill="#D92D20" />
                                                                    </svg>
                                                                </div>
                                                                <div>เหตุผลการยกเลิก</div>
                                                            </div>
                                                        </button>
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

                    </main>
                </div>
            </div>
        </div>

    );
};

export default Page;