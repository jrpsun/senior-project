"use client";
import { useState } from "react";

import React from 'react';
import Sidebar from "@components/components/SideBar";
import AdminNavbar from "@components/components/adminNavbar";
import SearchField from "@components/components/form/searchField";
import Image from 'next/image';

const applicant = [
    { round: 'DST01', applicantId: '0000001', name: 'อาทิตย์ แสงจันทร์', course: 'ITDS/B', admitStatus: '01 - ยังไม่ยื่นใบสมัคร', docStatus: '01 - ยังไม่มีเอกสาร', paymentStatus: '01 - ยังไม่ได้ชำระเงิน', email: 'Arthit.Saengchan@gmail.com', phoneNumber: '088-898-8888' },
    { round: 'ICT01', applicantId: '0000001', name: 'กนกวรรณ ทองสุข', course: 'ITCS/B', admitStatus: '01 - ยังไม่ยื่นใบสมัคร', docStatus: '01 - ยังไม่มีเอกสาร', paymentStatus: '01 - ยังไม่ได้ชำระเงิน', email: 'Kanokwan.Thongsuk@gmail.com', phoneNumber: '089-123-4567' },
    { round: 'DST01', applicantId: '0000002', name: 'พิชญะ วิสุทธิ์', course: 'ITDS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '02 - รอตรวจสอบเอกสาร', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Pitchaya.Visut@gmail.com', phoneNumber: '081-987-6543' },
    { round: 'ICT01', applicantId: '0000002', name: 'วราภรณ์ เจริญสุข', course: 'ITCS/B', admitStatus: '01 - ยังไม่ยื่นใบสมัคร', docStatus: '01 - ยังไม่มีเอกสาร', paymentStatus: '01 - ยังไม่ได้ชำระเงิน', email: 'Waraporn.Jaroen@gmail.com', phoneNumber: '082-567-8901' },
    { round: 'ICT01', applicantId: '0000003', name: 'อนันต์ โชติกุล', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '02 - รอตรวจสอบเอกสาร', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Chayapon.Rattanakun@gmail.com', phoneNumber: '089-555-1122' },
    { round: 'ICT01', applicantId: '0000004', name: 'ปรียาภรณ์ สุทธิวัฒน์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Preeyaporn.Sutti@gmail.com', phoneNumber: '081-333-4444' },
    { round: 'ICT01', applicantId: '0000005', name: 'ธนากร ศรีสวัสดิ์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Thanakorn.Srisawat@gmail.com', phoneNumber: '088-444-5555' },
    { round: 'ICT01', applicantId: '0000006', name: 'ณัฐมน มณีวงศ์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Nattamon.Manee@gmail.com', phoneNumber: '089-123-4567' },
    { round: 'DST01', applicantId: '0000003', name: 'วิศรุต พิทักษ์ธรรม', course: 'ITDS/B', admitStatus: '09 - ยกเลิกการสมัคร', docStatus: '01 - ยังไม่มีเอกสาร', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Wisarut.Pitak@gmail.com', phoneNumber: '081-789-1234' },
    { round: 'ICT01', applicantId: '0000007', name: 'อภิรักษ์ ธีรพัฒนเกียรติ', course: 'ITCS/B', admitStatus: '01 - ยังไม่ยื่นใบสมัคร', docStatus: '01 - ยังไม่มีเอกสาร', paymentStatus: '01 - ยังไม่ได้ชำระเงิน', email: 'Apirak.Thee@gmail.com', phoneNumber: '089-237-4859' },
    { round: 'DST01', applicantId: '0000008', name: 'กนกวรรณ วัฒนปัญญากุล', course: 'ITDS/B', admitStatus: '01 - ยังไม่ยื่นใบสมัคร', docStatus: '01 - ยังไม่มีเอกสาร', paymentStatus: '01 - ยังไม่ได้ชำระเงิน', email: 'Kanokwan.wat@gmail.com', phoneNumber: '081-649-7283' },
    { round: 'ICT01', applicantId: '0000009', name: 'พิชญา นาคสุข', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Pichaya.nak@gmail.com', phoneNumber: '092-105-3967' },
    { round: 'ICT01', applicantId: '0000010', name: 'ชลธิชา นันทวโรภาส', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '02 - รอตรวจสอบเอกสาร', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Chonticha.nut@gmail.com', phoneNumber: '094-954-6031' },
    { round: 'ICT01', applicantId: '0000012', name: 'พัชรีย์ เกษมสุขเจริญ', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Pacharee.kasem@gmail.com', phoneNumber: '086-576-9302' },
    { round: 'ICT01', applicantId: '0000013', name: 'จารุวรรณ รัตนศิลป์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Jaruwan.wat@gmail.com', phoneNumber: '081-821-6403' },
    { round: 'DST01', applicantId: '0000005', name: 'วารินทร์ รัตนประเสริฐกุล', course: 'ITDS/B', admitStatus: '01 - ยังไม่ยื่นใบสมัคร', docStatus: '01 - ยังไม่มีเอกสาร', paymentStatus: '01 - ยังไม่ได้ชำระเงิน', email: 'Warin.rat@gmail.com', phoneNumber: '095-733-2184 ' },
    { round: 'ICT01', applicantId: '0000014', name: 'ศุภชัย จิตตเมธากานต์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Suphachail.jitt@gmail.com', phoneNumber: ' 090-142-7956' },
    { round: 'DST01', applicantId: '0000006', name: 'มนัสนันท์ อัครพงศ์วณิช', course: 'ITDS/B', admitStatus: '01 - ยังไม่ยื่นใบสมัคร', docStatus: '01 - ยังไม่มีเอกสาร', paymentStatus: '01 - ยังไม่ได้ชำระเงิน', email: 'Manasanan.asawa@gmail.com', phoneNumber: '093-468-5217' },
    { round: 'ICT01', applicantId: '0000015', name: 'ปรเมศวร์ อินทร์สถิตธรรม', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Porametch.instat@gmail.com', phoneNumber: '089-677-3140' },
    { round: 'ICT01', applicantId: '0000016', name: 'ธัญญ์วาริน บุญฤทธิ์วรา', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '02 - รอตรวจสอบเอกสาร', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Tanwarin.boon@gmail.com', phoneNumber: '082-158-9042' },
    { round: 'ICT01', applicantId: '0000017', name: 'วรเมธ รัตนากรไพบูลย์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'Worameth.rat@gmail.com', phoneNumber: '091-345-7821' },
    { round: 'ICT01', applicantId: '0000018', name: 'ณัฐณิชา พิพัฒน์เวชกิจ', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'natthanicha.pit@gmail.com', phoneNumber: '096-781-2056' },
    { round: 'ICT01', applicantId: '0000019', name: 'วีรยุทธ พิพัฒน์ผล', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'werayut.piput@gmail.com', phoneNumber: '087-519-6348' },
    { round: 'DST01', applicantId: '0000007', name: 'อนวัช ธนเศรษฐกุลภักดี', course: 'ITDS/B', admitStatus: '01 - ยังไม่ยื่นใบสมัคร', docStatus: '01 - ยังไม่มีเอกสาร', paymentStatus: '01 - ยังไม่ได้ชำระเงิน', email: 'annawitch.tha@hotmail.com', phoneNumber: '085-437-1920' },
    { round: 'ICT01', applicantId: '0000020', name: 'ชยุตม์ ภูมิวรางกูร', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'chayut.mun@gmail.com', phoneNumber: '090-304-8751' },
    { round: 'DST01', applicantId: '0000008', name: 'ขวัญฤดี บุญเรือง', course: 'ITDS/B', admitStatus: '01 - ยังไม่ยื่นใบสมัคร', docStatus: '01 - ยังไม่มีเอกสาร', paymentStatus: '01 - ยังไม่ได้ชำระเงิน', email: 'kwanruedee.boon@gmail.com', phoneNumber: '081-903-7485' },
    { round: 'ICT01', applicantId: '0000021', name: 'ภูริชญ์ วัฒนศิริธรรมรัตน์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'poorin.watthana@gmail.com', phoneNumber: '092-601-2375' },
    { round: 'ICT01', applicantId: '0000022', name: 'ศักดิ์สิทธิ์ จันทร์เพ็ญ', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '02 - รอตรวจสอบเอกสาร', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'saksith.jan@gmail.com', phoneNumber: '086-205-3947' },
    { round: 'ICT01', applicantId: '0000023', name: 'ปรเมศวร์ ชัยมงคล', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'porameth.chai@gmail.com', phoneNumber: '082-470-5198' },
    { round: 'ICT01', applicantId: '0000024', name: 'นลินี โชติวัฒน์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'nalinee.chot@gmail.com', phoneNumber: '091-395-8402' },
    { round: 'ICT01', applicantId: '0000025', name: 'ธเนศ วงศ์มณฑลพัฒนา', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'tanet.wongmonthon@gmail.com', phoneNumber: '087-813-2907' },
    { round: 'ICT01', applicantId: '0000025', name: 'ธนบดี มิ่งมงคลทรัพย์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', email: 'tanabodee.mingmong@gmail.com', phoneNumber: '062-467-9312' }
]

const courseOptions = ["ITDS/B", "ITCS/B"];
const roundOptions = [
    { label: "1/68 - MU – Portfolio (TCAS 1)", value: "DST01" },
    { label: "1/68 - ICT Portfolio", value: "ICT01" },
];

const admitStatusOptions = ["01 - ยังไม่ยื่นใบสมัคร", "02 - ยื่นใบสมัครแล้ว", "03 - รอพิจารณา", "04 - ผ่านการพิจารณา", "05 - ไม่ผ่านการพิจารณา", "06 - รอสัมภาษณ์", "07-ผ่านการสัมภาษณ์", "08-ไม่ผ่านการสัมภาษณ์", "09 - ยกเลิกการสมัคร"];
const docStatusOptions = ["01 - ยังไม่มีเอกสาร", "02 - รอตรวจสอบเอกสาร", "03 - เอกสารครบถ้วน", "04 - เอกสารไม่ครบถ้วน"];
const paymentStatusOptions = ["01 - ยังไม่ได้ชำระเงิน", "02 - รอตรวจสอบการชำระเงิน", "03 - ชำระเงินเรียบร้อย", "04 - ชำระเงินไม่สำเร็จ"];

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
    }

    const [filters, setFilters] = useState<FilterState>({});
    const [filterValues, setFilterValues] = useState<FilterState>({});
    const [isExpanded, setIsExpanded] = useState(false);

    /* used for immediately filter
    const [filters, setFilters] = useState({
      course: "",
      round: "",
      admitStatus: "",
      docStatus: "",
      paymentStatus: "",
      indexNum: "",
      name: ""
    });
    */

    const handleSearch = () => {
        setFilters(filterValues);
    };

    const handleReset = () => {
        setFilterValues({});
        setFilters({});
    };
    /*
    const filteredApplicants = applicant.filter(app =>
      (filters.course === "" || app.course.includes(filters.course)) &&
      (filters.round === "" || app.round.includes(filters.round)) &&
      (filters.admitStatus === "" || app.admitStatus.includes(filters.admitStatus)) &&
      (filters.docStatus === "" || app.docStatus.includes(filters.docStatus)) &&
      (filters.paymentStatus === "" || app.paymentStatus.includes(filters.paymentStatus)) &&
      (filters.indexNum === "" || app.indexNum.includes(filters.indexNum)) &&
      (filters.name === "" || app.name.includes(filters.name))
    );
    */
    const filteredApplicants = applicant.filter(app =>
        (!filters.course || app.course === filters.course) &&
        (!filters.round || app.round === filters.round) &&
        (!filters.admitStatus || app.admitStatus === filters.admitStatus) &&
        (!filters.docStatus || app.docStatus === filters.docStatus) &&
        (!filters.paymentStatus || app.paymentStatus === filters.paymentStatus) &&
        (!filters.applicantId || app.applicantId.includes(filters.applicantId)) &&
        (!filters.name || app.name.includes(filters.name))
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

                        <div className="relative max-w-[1600px] w-full mx-auto p-5 rounded-lg shadow-md mb-6 px-4 md:px-8 z-10 mt-5">
                            <h2 className="text-[24px] font-semibold text-[#565656] mb-4">ค้นหาผู้สมัคร</h2>
                            <hr className="mb-4 border-gray-300" />

                            <div className="flex flex-wrap items-end gap-2 mb-4">
                                <div className="w-[200px] z-20">
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
                                        options={admitStatusOptions.map(value => ({ label: value, value }))}
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
                                        options={docStatusOptions.map(value => ({ label: value, value }))}
                                        placeholder="เลือกสถานะเอกสาร"
                                    />
                                </div>

                                <div className="w-[250px]">
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
                                        className="px-2 h-[40px] rounded-md bg-[#008A90] hover:bg-[#007178] text-white flex items-center gap-1"
                                        onClick={handleSearch}
                                    >
                                        <Image src="/images/admin/searchBar/search_icon.svg" alt="search" width={16} height={16} className="w-4 h-4" />
                                        ค้นหารายการ
                                    </button>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="flex flex-wrap gap-2">
                                    <div className="w-[200px]">
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
                                    <div className="w-[320px]">
                                        <SearchField
                                            label="ชื่อ-นามสกุล ผู้สมัคร"
                                            value={filterValues.name || ""}
                                            onChange={(value) => {
                                                if (typeof value === "object" && value !== null && "value" in value) {
                                                    setFilterValues({ ...filterValues, name: value.value });
                                                } else {
                                                    setFilterValues({ ...filterValues, name: value ?? undefined });
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
                                <div className="flex gap-2 ml-auto mr-15">
                                    <button>
                                        <div className="bg-[#008A90] hover:bg-[#02949B] text-white px-3 py-2 rounded-md flex items-center gap-2">
                                            <div>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clipPath="url(#clip0_911_32737)">
                                                        <path d="M3.33366 6.66732C2.41283 6.66732 1.66699 7.41315 1.66699 8.33398V16.6673C1.66699 17.584 2.41699 18.334 3.33366 18.334H15.0003C15.9212 18.334 16.667 17.5882 16.667 16.6673H3.33366V6.66732ZM16.667 15.0007H6.66699C5.74616 15.0007 5.00033 14.2548 5.00033 13.334V5.00065C5.00033 4.07982 5.74616 3.33398 6.66699 3.33398H9.16699C10.0878 3.33398 10.8337 4.07982 10.8337 5.00065H16.667C17.5878 5.00065 18.3337 5.74648 18.3337 6.66732V13.334C18.3337 14.2548 17.5878 15.0007 16.667 15.0007Z" fill="white" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_911_32737">
                                                            <rect width="20" height="20" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </div>
                                            <div>ดาวน์โหลดเอกสาร</div>
                                        </div>
                                    </button>
                                    <button >
                                        <div className="bg-[#00796B] hover:bg-[#028273] text-white px-3 py-2 rounded-md flex items-center gap-2">
                                            <Image
                                                src="/images/admin/searchBar/download_icon.svg"
                                                alt="Download Excel"
                                                width={16}
                                                height={16}
                                                className="w-4 h-4"
                                            />
                                            <div>Export to Excel</div>
                                        </div>

                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-[#F3F5F6] text-center; text-[#565656]">
                                            <th className="px-2 py-4 whitespace-nowrap">No</th>
                                            <th className="px-2 py-4 whitespace-nowrap">รอบ</th>
                                            <th className="px-2 py-4 whitespace-nowrap">เลขที่สมัคร</th>
                                            <th className="px-2 py-4 whitespace-nowrap">ชื่อ - นามสกุล ผู้สมัคร</th>
                                            <th className="px-2 py-4 whitespace-nowrap">หลักสูตร</th>
                                            <th className="px-2 py-4 whitespace-nowrap">สถานะการสมัคร</th>
                                            <th className="px-2 py-4 whitespace-nowrap">สถานะเอกสาร</th>
                                            <th className="px-2 py-4 whitespace-nowrap">สถานะการชำระเงิน</th>
                                            <th className="px-2 py-4 whitespace-nowrap">อีเมล</th>
                                            <th className="px-2 py-4 whitespace-nowrap">โทรศัพท์</th>
                                            <th className="px-2 py-4 whitespace-nowrap "></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedApplicants.map((app, index) => (
                                            <tr
                                                key={index}
                                                className={`text-[#565656] h-[50px] items-center 
                                              ${app.admitStatus !== "09 - ยกเลิกการสมัคร" ? "hover:bg-gray-50" : ""}
                                              ${app.admitStatus === "09 - ยกเลิกการสมัคร" ? "bg-[#FFE8E8]" : ""}
                                            `}
                                            >

                                                <td className="text-center whitespace-nowrap">{startIndex + index + 1}</td>
                                                <td className="text-center whitespace-nowrap">{app.round}</td>
                                                <td className="text-center whitespace-nowrap">{app.applicantId}</td>
                                                <td className="whitespace-nowrap">{app.name}</td>
                                                <td className="text-center whitespace-nowrap">{app.course}</td>
                                                <td>
                                                    <div className={`mr-4 whitespace-nowrap
          ${app.admitStatus === "02 - ยื่นใบสมัครแล้ว" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#166534]" : "py-2"}
          ${app.admitStatus === "03 - รอพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-[#FFF4E2] text-[#DAA520]" : "py-2"}
          ${app.admitStatus === "04 - ผ่านการพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#166534]" : "py-2"}
          ${app.admitStatus === "05 - ไม่ผ่านการพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-red-200 text-red-600 " : "py-2"}
          ${app.admitStatus === "06 - รอสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-[#FFF4E2] text-[#DAA520] " : "py-2"}
          ${app.admitStatus === "07 - ผ่านการสอบสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#166534]" : "py-2"}
          ${app.admitStatus === "08 - ไม่ผ่านการสอบสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-red-200 text-red-600 " : "py-2"}
          ${app.admitStatus === "09 - ยกเลิกการสมัคร" ? "h-[30px] pt-[2px] rounded-xl text-red-600 " : "py-2"}
        `}>
                                                        {app.admitStatus}
                                                    </div>
                                                </td>

                                                {/* Document Status with Conditional Highlight */}
                                                <td>
                                                    {app.admitStatus === "09 - ยกเลิกการสมัคร" ? (
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
                                                    {app.admitStatus === "09 - ยกเลิกการสมัคร" ? (
                                                        <div>ยกเลิกการชำระเงิน</div>
                                                    ) : (
                                                        <div className={`mr-4 whitespace-nowrap
      ${app.paymentStatus === "02 - รอตรวจสอบการชำระเงิน" ? "h-[30px] pt-[2px] rounded-xl bg-[#FFF4E2] text-[#DAA520]" : ""}
      ${app.paymentStatus === "03 - ชำระเงินเรียบร้อย" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#13522B]" : ""}
      ${app.paymentStatus === "04 - ชำระเงินไม่สำเร็จ" ? "h-[30px] pt-[2px] rounded-xl bg-red-200 text-red-600" : ""}
    `}>
                                                            {app.paymentStatus}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="py-2 whitespace-nowrap">{app.email}</td>
                                                <td className="py-2 whitespace-nowrap ">{app.phoneNumber}</td>
                                                <td className="py-2 text-center whitespace-nowrap">
                                                    {app.admitStatus === "02 - ยื่นใบสมัครแล้ว" && (
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
                                                    {app.admitStatus === "09 - ยกเลิกการสมัคร" && (
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