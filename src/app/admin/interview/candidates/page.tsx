"use client";
import { useEffect, useState } from "react";

import React from 'react';
import Sidebar from "@components/components/SideBar";
import AdminNavbar from "@components/components/adminNavbar";
import SearchField from "@components/components/form/searchField";
import { mockApplicants } from "@components/data/admin/Interview/candidates/mockApplicants";
import Image from 'next/image';
import { InterviewComScreeningInterface } from "@components/types/screening";
import Link from "next/link";
import { getDecodedToken } from "@components/lib/auth";
import Modal from "@components/components/common/popup-login";
import { useRouter } from "next/navigation";

const courseOptions = [
    { label: "ITDS/B", value: "หลักสูตร DST (ไทย)" },
    { label: "ITCS/B", value: "หลักสูตร ICT (นานาชาติ)" }
];
const roundOptions = [
    { label: "1/68 - MU – Portfolio (TCAS 1)", value: "DST01" },
    { label: "1/68 - ICT Portfolio", value: "ICT01" },
];

const Page = () => {

    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
    const [applicants, setApplicants] = useState<InterviewComScreeningInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);
    const [committee_id, setCommittee_id] = useState('');

    useEffect(() => {
        const decoded = getDecodedToken();
        if (!decoded) {
            setShowModal(true);
            return;
        }
        setRoles(decoded.roles);
        setCommittee_id(decoded.id);
    }, []);

    async function fetchAllApplicants() {
        const res = await fetch(`${API_BASE_URL}/interview-committee/all-applicant-interviewC/${committee_id}`);
        if (!res.ok) {
            throw new Error("Failed to fetch applicants");
        }
        return res.json();
    }

    useEffect(() => {
        if (committee_id) {
            fetchAllApplicants()
                .then((data) => {
                    console.log("Fetched data:", data);
                    setApplicants(data.applicants || []);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => setLoading(false));
        }
    }, [committee_id]);

    const [isCollapsed, setIsCollapsed] = useState(false);
    interface FilterState {
        course?: string;
        round?: string;
        admitStatus?: string;
        docStatus?: string;
        interviewStatus?: string;
        interviewRoom?: string;
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

    const interviewStatusOptions = [
        { label: "01 - รอสัมภาษณ์", value: "01 - รอสัมภาษณ์" },
        { label: "02 - ไม่มาสัมภาษณ์", value: "02 - ไม่มาสัมภาษณ์" },
        { label: "03 - รอพิจารณาเพิ่มเติม", value: "03 - รอพิจารณาเพิ่มเติม" },
        { label: "04 - ผ่านการสัมภาษณ์", value: "04 - ผ่านการสัมภาษณ์" },
        { label: "05 - ไม่ผ่านการสัมภาษณ์", value: "05 - ไม่ผ่านการสัมภาษณ์" }
    ];

    const docStatusOptions = [
        { label: "03 - เอกสารครบถ้วน", value: "03 - เอกสารครบถ้วน" },
    ];
 // หรือดึงมาจาก auth ในอนาคต

    /*const getSingleCommitteeInterviewStatus = (
        results: { committee: string; result: string }[]
    ): string => {
        const entry = results.find(r => r.committee === currentCommitteeName);
        if (!entry) return "01 - รอสัมภาษณ์";

        switch (entry.result) {
            case "ไม่มา":
                return "02 - ไม่มาสัมภาษณ์";
            case "รอ":
                return "03 - รอพิจารณาเพิ่มเติม";
            case "ผ่าน":
                return "04 - ผ่านการสัมภาษณ์";
            case "ไม่ผ่าน":
                return "05 - ไม่ผ่านการสัมภาษณ์";
            default:
                return "01 - รอสัมภาษณ์";
        }
    };*/

    const filteredApplicants = applicants.filter(app =>
        (!filters.course || app.program === filters.course) &&
        (!filters.round || app.roundName === filters.round) &&
        (!filters.admitStatus || app.admissionStatus === filters.admitStatus) &&
        (!filters.interviewStatus || app.interviewStatus === filters.interviewStatus) &&
        (!filters.docStatus || app.docStatus === filters.docStatus) &&
        (!filters.interviewRoom || app.interviewRoom === filters.interviewRoom) &&
        /*(!filters.committee || (
            Array.isArray(app.interviewResult) &&
            app.interviewResult.some(r => r.committee?.includes(filters.committee!))
        )) &&*/
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

    const router = useRouter();

    const handleClickView = (appId: string, admId: string) => {
        router.push(`/admin/applicant/view?id=${appId}&admId=${admId}`);
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {showModal && <Modal role="admin"/>}
            <div>
                <AdminNavbar
                    isCollapsed={isCollapsed}
                />
                <div className="flex flex-row flex-1 min-h-screen overflow-hidden">
                    <div className="relative z-50">
                        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} userRoles={roles} />
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
                                        options={courseOptions}
                                        placeholder="เลือกหลักสูตร"
                                    />
                                </div>

                                <div className="w-[280px] z-50 relative">
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
                                        label="สถานะการสัมภาษณ์"
                                        type="dropdown"
                                        value={filterValues.interviewStatus || ""}
                                        onChange={(option) => {
                                            if (typeof option === "object" && option !== null && "value" in option) {
                                                setFilterValues({ ...filterValues, interviewStatus: option.value });
                                            } else {
                                                setFilterValues({ ...filterValues, interviewStatus: "" });
                                            }
                                        }}
                                        options={interviewStatusOptions}
                                        placeholder="เลือกสถานะการสัมภาษณ์"
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
                                        options={docStatusOptions}
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
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-[#F3F5F6] text-center text-[#565656]">
                                            <th className="px-2 py-4 whitespace-nowrap w-[60px]">No</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[100px]">รอบ</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[120px]">เลขที่สมัคร</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[200px]">ชื่อ - นามสกุล ผู้สมัคร</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[100px]">หลักสูตร</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[160px]">สถานะการสัมภาษณ์</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[160px]">สถานะการเอกสาร</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[130px]">ห้องสัมภาษณ์</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[180px]">กรรมการสัมภาษณ์</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[180px]">วัน-เวลา สัมภาษณ์</th>
                                            <th className="px-2 py-4 w-[80px]"></th>
                                        </tr>

                                    </thead>
                                    {/* ปุ่ม view จะอยู่ใน <td> ของแต่ละ row */}

                                    <tbody>
                                        {paginatedApplicants.map((app, index) => (
                                            <tr key={index} className="text-[#565656] h-[50px] items-center">
                                                <td className="text-center whitespace-nowrap w-[60px]">{startIndex + index + 1}</td>
                                                <td className="text-center whitespace-nowrap w-[100px]">{app.roundName}</td>
                                                <td className="text-center whitespace-nowrap w-[120px]">{app.applicantId}</td>
                                                <td className="whitespace-nowrap w-[200px]">{app.firstnameEN} {app.lastnameEN}</td>
                                                <td className="text-center whitespace-nowrap w-[100px]">{app.program}</td>
                                                <td className="w-[160px] pr-5"> {/* เพิ่ม padding ด้านขวา */}
                                                    <div className={`h-[30px] pt-[2px] rounded-xl whitespace-nowrap
                                                        ${(app.interviewStatus) === "01 - รอสัมภาษณ์" ? "bg-[#FFF4E2] text-[#DAA520]" : ""}
                                                        ${(app.interviewStatus) === "02 - ไม่มาสัมภาษณ์" ? "text-[#565656]" : ""}
                                                        ${(app.interviewStatus) === "03 - รอพิจารณาเพิ่มเติม" ? "bg-[#FFF4E2] text-[#DAA520]" : ""}
                                                        ${(app.interviewStatus) === "04 - ผ่านการสัมภาษณ์" ? "bg-[#E2F5E2] text-[#13522B]" : ""}
                                                        ${(app.interviewStatus) === "05 - ไม่ผ่านการสัมภาษณ์" ? "bg-[#FEE2E2] text-red-600" : ""}
                                                        ${(app.interviewStatus) === "06 - รอผลการพิจารณา" ? "bg-[#E3F2FD] text-[#0D47A1]" : ""}
                                                        `}>
                                                        {(app.interviewStatus)}
                                                    </div>
                                                </td>

                                                <td className="w-[160px]">
                                                    <div className={`h-[30px] pt-[2px] rounded-xl whitespace-nowrap
                                                        ${app.docStatus === "03 - เอกสารครบถ้วน" ? "bg-[#E2F5E2] text-[#13522B]" : ""}
                                                        `}>
                                                        {app.docStatus}
                                                    </div>
                                                </td>

                                                <td className="text-center whitespace-nowrap w-[130px]">{app.interviewRoom}</td>
                                                <td className="whitespace-nowrap w-[180px]">
                                                    {/*Array.isArray(app.committee) ? app.committee.join(", ") : app.committee*/}
                                                    {app.prefix1} {app.firstName1}, {app.prefix2} {app.firstName2}
                                                </td>
                                                <td className="text-center whitespace-nowrap w-[180px]">
                                                    {app.interviewDate ? (
                                                        <div className="flex flex-col items-center leading-tight">
                                                            <div>{app.interviewDate}</div>
                                                            <div>{app.interviewTime}</div>
                                                            {/*
                                                            <div>{app.interviewDateTime.split(" ")[0]} {app.interviewDateTime.split(" ")[1]} {app.interviewDateTime.split(" ")[2]}</div>
                                                            <div className="text-[#6B7280]">{app.interviewDateTime.split(" ").slice(3).join(" ")}</div>*/}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>

                                                <td className="py-2 text-center whitespace-nowrap w-[80px]">
                                                {/* <Link
                                                    key='view'
                                                    href={{
                                                        pathname: '/admin/applicant/view',
                                                        query: {
                                                            QapplicantId: `${app.applicantId}`,
                                                            QinterviewComId: committee_id,
                                                            QapplicantFullname: `${app.firstnameEN} ${app.lastnameEN}`,
                                                            QroundName: `${app.roundName}`,
                                                            Qprogram: `${app.program}`,
                                                            QadmissionStatus: `${app.interviewStatus}`,
                                                            QdocStatus: `${app.docStatus}`,
                                                            Qpath: '/admin/interview/candidates'
                                                        }
                                                    }}
                                                    className="bg-white text-[#008A90]"
                                                >
                                                    <div className="flex justify-center flex-row border border-[#008A90] font-bold rounded-lg py-1 mt-1">
                                                        <div className="pt-1">
                                                            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M18.6438 16.6993L14.5879 12.6365C15.6817 11.3031 16.335 9.59495 16.335 7.73621C16.335 3.46403 12.8738 0 8.60502 0C4.33626 0 0.875 3.46403 0.875 7.73621C0.875 12.0084 4.33626 15.4724 8.60502 15.4724C10.4696 15.4724 12.1801 14.8112 13.5161 13.7092L17.572 17.7683C18.0455 18.2018 18.4896 17.9226 18.6438 17.7683C18.9521 17.4634 18.9521 17.0042 18.6438 16.6993ZM2.38356 7.73621C2.38356 4.29789 5.16945 1.50977 8.60502 1.50977C12.0406 1.50977 14.8301 4.29789 14.8301 7.73621C14.8301 11.1745 12.0442 13.9626 8.60869 13.9626C5.17312 13.9626 2.38356 11.1745 2.38356 7.73621Z" fill="#008A91" />
                                                            </svg>
                                                        </div>
                                                        <div>view</div>
                                                    </div>
                                                </Link> */}
                                                <button className="bg-white px-4 py-1 my-2 rounded-lg border border-[#008A90] text-[#008A90] "
                                                    onClick={() => handleClickView(app.applicantId || "", app.admissionId || "")}>
                                                        <div className="flex flex-row gap-1">
                                                            <div className="pt-1">
                                                                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M18.6438 16.6993L14.5879 12.6365C15.6817 11.3031 16.335 9.59495 16.335 7.73621C16.335 3.46403 12.8738 0 8.60502 0C4.33626 0 0.875 3.46403 0.875 7.73621C0.875 12.0084 4.33626 15.4724 8.60502 15.4724C10.4696 15.4724 12.1801 14.8112 13.5161 13.7092L17.572 17.7683C18.0455 18.2018 18.4896 17.9226 18.6438 17.7683C18.9521 17.4634 18.9521 17.0042 18.6438 16.6993ZM2.38356 7.73621C2.38356 4.29789 5.16945 1.50977 8.60502 1.50977C12.0406 1.50977 14.8301 4.29789 14.8301 7.73621C14.8301 11.1745 12.0442 13.9626 8.60869 13.9626C5.17312 13.9626 2.38356 11.1745 2.38356 7.73621Z" fill="#008A91" />
                                                                </svg>
                                                            </div>
                                                            <div>view</div>
                                                        </div>
                                                    </button>
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