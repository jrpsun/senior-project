"use client";
import { useEffect, useState } from "react";

import React from 'react';
import Sidebar from "@components/components/SideBar";
import AdminNavbar from "@components/components/adminNavbar";
import SearchField from "@components/components/form/searchField";
import Image from 'next/image';
import { InterviewScreeningForEduInterface } from "@components/types/screening";
import Link from "next/link";

const applicant = [
    { round: 'DST01', applicantId: '0000001', name: 'อาทิตย์ แสงจันทร์', course: 'ITDS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '29 มี.ค. 2568 09.04 น.' },
    { round: 'ICT01', applicantId: '0000001', name: 'กนกวรรณ ทองสุข', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '29 มี.ค. 2568 09.10 น.' },
    { round: 'DST01', applicantId: '0000002', name: 'พิชญะ วิสุทธิ์', course: 'ITDS/B', admitStatus: '05 - ไม่ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '31 มี.ค. 2568 09.15 น.' },
    { round: 'ICT01', applicantId: '0000002', name: 'วราภรณ์ เจริญสุข', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '31 มี.ค. 2568 09.23 น.' },
    { round: 'ICT01', applicantId: '0000003', name: 'อนันต์ โชติกุล', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '29 มี.ค. 2568 09.45 น.' },
    { round: 'ICT01', applicantId: '0000004', name: 'ปรียาภรณ์ สุทธิวัฒน์', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '29 มี.ค. 2568 11.02 น.' },
    { round: 'ICT01', applicantId: '0000005', name: 'ธนากร ศรีสวัสดิ์', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '29 มี.ค. 2568 11.03 น.' },
    { round: 'ICT01', applicantId: '0000006', name: 'ณัฐมน มณีวงศ์', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '29 มี.ค. 2568 11.07 น.' },
    { round: 'DST01', applicantId: '0000003', name: 'วิศรุต พิทักษ์ธรรม', course: 'ITDS/B', admitStatus: '03 - รอพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '' },
    { round: 'ICT01', applicantId: '0000007', name: 'อภิรักษ์ ธีรพัฒนเกียรติ', course: 'ITCS/B', admitStatus: '03 - รอพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: ' ' },
    { round: 'DST01', applicantId: '0000008', name: 'กนกวรรณ วัฒนปัญญากุล', course: 'ITDS/B', admitStatus: '03 - รอพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: ' ' },
    { round: 'ICT01', applicantId: '0000009', name: 'พิชญา นาคสุข', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '29 มี.ค. 2568 13.10 น.' },
    { round: 'ICT01', applicantId: '0000010', name: 'ชลธิชา นันทวโรภาส', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '29 มี.ค. 2568 13.12 น.' },
    { round: 'ICT01', applicantId: '0000012', name: 'พัชรีย์ เกษมสุขเจริญ', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '29 มี.ค. 2568 13.23 น.' },
    { round: 'ICT01', applicantId: '0000013', name: 'จารุวรรณ รัตนศิลป์', course: 'ITCS/B', admitStatus: '05 - ไม่ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '29 มี.ค. 2568 13.56 น.' },
    { round: 'DST01', applicantId: '0000005', name: 'วารินทร์ รัตนประเสริฐกุล', course: 'ITDS/B', admitStatus: '03 - รอพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '' },
    { round: 'ICT01', applicantId: '0000014', name: 'ศุภชัย จิตตเมธากานต์', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '29 มี.ค. 2568 15.34 น.' },
    { round: 'DST01', applicantId: '0000006', name: 'มนัสนันท์ อัครพงศ์วณิช', course: 'ITDS/B', admitStatus: '03 - รอพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '' },
    { round: 'ICT01', applicantId: '0000015', name: 'ปรเมศวร์ อินทร์สถิตธรรม', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '29 มี.ค. 2568 15.40 น.' },
    { round: 'ICT01', applicantId: '0000016', name: 'ธัญญ์วาริน บุญฤทธิ์วรา', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '29 มี.ค. 2568 15.43 น.' },
    { round: 'ICT01', applicantId: '0000017', name: 'วรเมธ รัตนากรไพบูลย์', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '29 มี.ค. 2568 15.47 น.' },
    { round: 'ICT01', applicantId: '0000018', name: 'ณัฐณิชา พิพัฒน์เวชกิจ', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '29 มี.ค. 2568 15.53 น.' },
    { round: 'ICT01', applicantId: '0000019', name: 'วีรยุทธ พิพัฒน์ผล', course: 'ITCS/B', admitStatus: '05 - ไม่ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '29 มี.ค. 2568 16.02 น.' },
    { round: 'DST01', applicantId: '0000007', name: 'อนวัช ธนเศรษฐกุลภักดี', course: 'ITDS/B', admitStatus: '03 - รอพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '' },
    { round: 'ICT01', applicantId: '0000020', name: 'ชยุตม์ ภูมิวรางกูร', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '29 มี.ค. 2568 16.02 น.' },
    { round: 'DST01', applicantId: '0000008', name: 'ขวัญฤดี บุญเรือง', course: 'ITDS/B', admitStatus: '03 - รอพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '' },
    { round: 'ICT01', applicantId: '0000021', name: 'ภูริชญ์ วัฒนศิริธรรมรัตน์', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '29 มี.ค. 2568 16.08 น.' },
    { round: 'ICT01', applicantId: '0000022', name: 'ศักดิ์สิทธิ์ จันทร์เพ็ญ', course: 'ITCS/B', admitStatus: '05 - ไม่ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '29 มี.ค. 2568 16.10 น.' },
    { round: 'ICT01', applicantId: '0000023', name: 'ปรเมศวร์ ชัยมงคล', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '29 มี.ค. 2568 16.15 น.' },
    { round: 'ICT01', applicantId: '0000024', name: 'นลินี โชติวัฒน์', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '29 มี.ค. 2568 16.18 น.' },
    { round: 'ICT01', applicantId: '0000025', name: 'ธเนศ วงศ์มณฑลพัฒนา', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์', evaluationDate: '29 มี.ค. 2568 16.20 น.' },
    { round: 'ICT01', applicantId: '0000025', name: 'ธนบดี มิ่งมงคลทรัพย์', course: 'ITCS/B', admitStatus: '04 - ผ่านการพิจารณา', docStatus: '03 - เอกสารครบถ้วน', committee: 'อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล', evaluationDate: '29 มี.ค. 2568 16.24 น.' }
]

const courseOptions = ["ITDS/B", "ITCS/B"];
const roundOptions = [
    { label: "1/68 - MU – Portfolio (TCAS 1)", value: "DST01" },
    { label: "1/68 - ICT Portfolio", value: "ICT01" },
];

const ScreeningStatusOptions = [
    { label: "แสดงทั้งหมด", value: '' },
    { label: "ผ่านการพิจารณา", value: "04 - ผ่านการพิจารณา" },
    { label: "ผ่านการพิจารณา", value: "04 - ผ่านการพิจารณา" },
    { label: "ไม่ผ่านการพิจารณา", value: "05 - ไม่ผ่านการพิจารณา" },
    { label: "รอพิจารณา", value: "03 - รอพิจารณา" }
];

const Page = () => {
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
    const [applicants, setApplicants] = useState<InterviewScreeningForEduInterface[]>([]);
    const [loading, setLoading] = useState(true);


    async function fetchData() {
        try {
            const res = await fetch(`${API_BASE_URL}/education-department/get-summary-applicants-interview`)

            if (!res.ok) {
                throw new Error("Failed to fetch one or more resources");
            }

            const data = await res.json();

            setApplicants(data.applicants || []);

        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const committeeOptions = applicants.map((com) => ({
        full: `${com.InterviewCommittee?.map((com) => `${com.name}`)}`,
        value: `${com.InterviewCommittee?.map((com) => `${com.id}`)}`,

    }));

    const committeeOptions1 = applicants.map((com) => (
        com.InterviewCommittee?.map((com) => ({
            label: `${com.name}`,
            value: `${com.id}`,
            result: `${com.InterviewResult}`
        }))
    ));

    const [isCollapsed, setIsCollapsed] = useState(false);
    interface FilterState {
        course?: string;
        round?: string;
        interviewStatus?: string;
        paymentStatus?: string;
        applicantId?: string;
        fname?: string;
        lname?: string;
        fullname?: string;
        committee?: string[];
        room?: string;
    }

    const [filters, setFilters] = useState<FilterState>({});
    const [filterValues, setFilterValues] = useState<FilterState>({});
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSearch = () => {
        setFilters(filterValues);
    };

    const handleReset = () => {
        setFilterValues({});
        setFilters({});
    };

    console.log("applicants", applicants);

    const filteredApplicants = applicants.filter(app =>
        (!filters.course || app.program === filters.course) &&
        (!filters.round || app.roundName === filters.round) &&
        (!filters.interviewStatus || app.interviewStatus === filters.interviewStatus) &&
        (!filters.applicantId || app.applicantId?.includes(filters.applicantId)) &&
        (!filters.fullname || app.fullnameEN?.includes(filters.fullname)) &&
        (!filters.room || app.interviewRoom === filters.room) &&
        (!filters.committee || filters.committee.every(filterCom => app.InterviewCommittee?.some(com => com.id === filterCom)))
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

    const interviewStatusOptions = [
        { label: "แสดงทั้งหมด", value: "" },
        { label: "01 - รอสัมภาษณ์", value: "01 - รอสัมภาษณ์" },
        { label: "03 - ผ่านการสัมภาษณ์", value: "03 - ผ่านการสัมภาษณ์" },
        { label: "04 - ไม่ผ่านการสัมภาษณ์", value: "04 - ไม่ผ่านการสัมภาษณ์" },
        { label: "02 - ไม่มาสัมภาษณ์", value: "02 - ไม่มาสัมภาษณ์" },
        { label: "05 - รอพิจารณาเพิ่มเติม", value: "05 - รอพิจารณาเพิ่มเติม" },
        { label: "06 - รอผลการประเมินเพิ่มเติม", value: "06 - รอผลการประเมินเพิ่มเติม" },
    ];

    const interviewRoomOptions = [
        { label: "ห้อง IT 123", value: "IT123" },
        { label: "ห้อง IT 124", value: "IT124" },
        { label: "ห้อง IT 122", value: "IT122" },
    ];
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div>
                <AdminNavbar
                    isCollapsed={isCollapsed}
                />
                <div className="flex flex-row flex-1 min-h-screen overflow-hidden">
                    <div className="relative z-50">
                        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} userRole="admin" />
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

                                <div className="w-[300px] z-20">
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
                                <div className="w-[180px]">
                                    <SearchField
                                        label="ห้องสัมภาษณ์"
                                        type="dropdown"
                                        value={filterValues.room || ""}
                                        onChange={(option) => {
                                            if (typeof option === "object" && option !== null && "value" in option) {
                                                setFilterValues({ ...filterValues, room: option.value });
                                            } else {
                                                setFilterValues({ ...filterValues, room: "" });
                                            }
                                        }}
                                        options={interviewRoomOptions}
                                        placeholder="เลือกห้อง"
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
                                    <div className="w-[375px]">
                                        <SearchField
                                            label="กรรมการสัมภาษณ์"
                                            type="dropdown"
                                            value={Array.isArray(filterValues.committee) ? filterValues.committee.join(", ") : filterValues.committee || ""}
                                            onChange={(option) => {
                                                if (typeof option === "object" && option !== null && "value" in option) {
                                                    setFilterValues({ ...filterValues, committee: [option.value] });
                                                } else {
                                                    setFilterValues({ ...filterValues, committee: [] });
                                                }
                                            }}
                                            options={[...new Map(
                                                committeeOptions1
                                                    .filter(value => value !== undefined)
                                                    .flatMap(value => value.map(com => ({ label: `${com.label}`, value: `${com.value}` })))
                                                    .map(item => [item.value, item])
                                            ).values()]}
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
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-[#F3F5F6] text-center text-[#565656]">
                                            <th className="px-2 py-4 whitespace-nowrap w-[50px]">No</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[60px]">รอบ</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[100px]">เลขที่สมัคร</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[200px]">ชื่อ - นามสกุล ผู้สมัคร</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[100px]">หลักสูตร</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[170px]">สถานะการสัมภาษณ์</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[170px]">ห้องสัมภาษณ์</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[170px]">กรรมการสัมภาษณ์</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[200px]">วัน-เวลา สัมภาษณ์</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[180px]">ผลการสัมภาษณ์</th>
                                            <th className="px-2 py-4 whitespace-nowrap w-[130px]"></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {paginatedApplicants.map((app, index) => (
                                            <tr
                                                key={index}
                                                className={`text-[#565656] h-[50px] items-center 
                                              ${app.interviewStatus !== "09 - ยกเลิกการสมัคร" ? "hover:bg-gray-50" : ""}
                                              ${app.interviewStatus === "09 - ยกเลิกการสมัคร" ? "bg-[#FFE8E8]" : ""}
                                            `}
                                            >

                                                <td className="text-center whitespace-nowrap">{startIndex + index + 1}</td>
                                                <td className="text-center whitespace-nowrap">{app.roundName}</td>
                                                <td className="text-center whitespace-nowrap">{app.applicantId}</td>
                                                <td className="whitespace-nowrap">{app.firstnameEN} {app.lastnameEN}</td>
                                                <td className="text-center whitespace-nowrap">{app.program}</td>
                                                <td>
                                                    <div className={`mr-4 whitespace-nowrap
          ${app.interviewStatus === "04 - ผ่านการสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#166534]" : "py-2"}
          ${app.interviewStatus === "01 - รอสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-[#FFF4E2] text-[#DAA520]" : "py-2"}
          ${app.interviewStatus === "05 - ไม่ผ่านการสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-[#FEE2E2] text-red-600 " : "py-2"}
          ${app.interviewStatus === "03 - รอพิจารณาเพิ่มเติม" ? "h-[30px] pt-[2px] rounded-xl bg-[#FFF4E2] text-[#DAA520] " : "py-2"}
          ${app.interviewStatus === "06 - รอผลการประเมินเพิ่มเติม" ? "h-[30px] pt-[2px] rounded-xl bg-[#E3F2FD] text-[#0D47A1]" : "py-2"}
        `}>
                                                        {app.interviewStatus}
                                                    </div>
                                                </td>

                                                <td className="text-center whitespace-nowrap">{app.interviewRoom}</td>
                                                <td className="py-2 whitespace-nowrap text-center">
                                                    {app.InterviewCommittee?.map((com) => (
                                                        <div key={com.id} className={`mr-4 whitespace-nowrap`}>
                                                            {com.shortName}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="py-2 whitespace-nowrap"><span>{app.interviewDate} {app.interviewTime}</span></td>
                                                <td className="py-2 whitespace-nowrap text-center">
                                                    {app.InterviewCommittee?.map((com) => (
                                                        <div key={com.id} className="mr-4 whitespace-nowrap flex flex-row space-x-1">
                                                            <div>
                                                                {com.shortName}
                                                            </div>
                                                            <div>
                                                                <Image
                                                                    src={
                                                                        com.InterviewResult === "ผ่านการสัมภาษณ์"
                                                                            ? "/images/admin/interview/statusFollowUp/pass_icon.svg"
                                                                            : com.InterviewResult === "ไม่ผ่านการสัมภาษณ์"
                                                                                ? "/images/admin/interview/statusFollowUp/fail_icon.svg"
                                                                                : com.InterviewResult === "รอพิจารณาเพิ่มเติม" || com.InterviewResult === "รอผลการประเมินเพิ่มเติม" || com.InterviewResult === null
                                                                                    ? "/images/admin/interview/statusFollowUp/wait_icon.svg"
                                                                                    : "/images/admin/interview/statusFollowUp/calendar_icon.svg"
                                                                    }
                                                                    alt={com.InterviewResult || ""}
                                                                    width={16}
                                                                    height={16}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </td>

                                                <td className="py-2 text-center whitespace-nowrap">

                                                    <Link
                                                        key='view'
                                                        href={{
                                                            pathname: '/admin/applicant/view',
                                                            query: {
                                                                QapplicantId: `${app.applicantId}`,
                                                                Qpath: '/admin/interview/tracking'
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
                                                    </Link>

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