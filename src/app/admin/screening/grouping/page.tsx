//สถานะสมัคร มีแค่ "ยื่นใบสมัคร และ รอพิจารณา 
//สถานะเอกสาร มีแค่ เอกสารครบถ้วนเท่านั้น
//สถานะชำระเงิน มีแค่ ชำระเงินเรียบร้อยเท่านั้น
"use client";
import { useState } from "react";
import React from 'react';
import Sidebar from "@components/components/SideBar";
import AdminNavbar from "@components/components/adminNavbar";
import SearchField from "@components/components/form/searchField";
import Image from 'next/image';
import PopupEditGrouping from "@components/components/common/admin/screening/popupEditGrouping";
import AlertAdmin from "@components/components/common/admin/alertAdmin";

type Applicant = {
    round: string;
    applicantId: string;
    name: string;
    course: string;
    admitStatus: string;
    docStatus: string;
    paymentStatus: string;
    grouping: string;
    committee: string | undefined;
};

const applicant: Applicant[] = [
    { round: 'DST01', applicantId: '0000001', name: 'อาทิตย์ แสงจันทร์', course: 'ITDS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000001', name: 'กนกวรรณ ทองสุข', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'DST01', applicantId: '0000002', name: 'พิชญะ วิสุทธิ์', course: 'ITDS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000002', name: 'วราภรณ์ เจริญสุข', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000003', name: 'อนันต์ โชติกุล', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000004', name: 'ปรียาภรณ์ สุทธิวัฒน์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000005', name: 'ธนากร ศรีสวัสดิ์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000006', name: 'ณัฐมน มณีวงศ์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'DST01', applicantId: '0000003', name: 'วิศรุต พิทักษ์ธรรม', course: 'ITDS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000007', name: 'อภิรักษ์ ธีรพัฒนเกียรติ', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'DST01', applicantId: '0000008', name: 'กนกวรรณ วัฒนปัญญากุล', course: 'ITDS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000009', name: 'พิชญา นาคสุข', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000010', name: 'ชลธิชา นันทวโรภาส', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000012', name: 'พัชรีย์ เกษมสุขเจริญ', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000013', name: 'จารุวรรณ รัตนศิลป์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'DST01', applicantId: '0000005', name: 'วารินทร์ รัตนประเสริฐกุล', course: 'ITDS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000014', name: 'ศุภชัย จิตตเมธากานต์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'DST01', applicantId: '0000006', name: 'มนัสนันท์ อัครพงศ์วณิช', course: 'ITDS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000015', name: 'ปรเมศวร์ อินทร์สถิตธรรม', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000016', name: 'ธัญญ์วาริน บุญฤทธิ์วรา', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000017', name: 'วรเมธ รัตนากรไพบูลย์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000018', name: 'ณัฐณิชา พิพัฒน์เวชกิจ', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000019', name: 'วีรยุทธ พิพัฒน์ผล', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'DST01', applicantId: '0000007', name: 'อนวัช ธนเศรษฐกุลภักดี', course: 'ITDS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000020', name: 'ชยุตม์ ภูมิวรางกูร', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'DST01', applicantId: '0000009', name: 'ขวัญฤดี บุญเรือง', course: 'ITDS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000021', name: 'ภูริชญ์ วัฒนศิริธรรมรัตน์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000022', name: 'ศักดิ์สิทธิ์ จันทร์เพ็ญ', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000023', name: 'ปรเมศวร์ ชัยมงคล', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000024', name: 'นลินี โชติวัฒน์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000025', name: 'ธเนศ วงศ์มณฑลพัฒนา', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined },
    { round: 'ICT01', applicantId: '0000026', name: 'ธนบดี มิ่งมงคลทรัพย์', course: 'ITCS/B', admitStatus: '02 - ยื่นใบสมัครแล้ว', docStatus: '03 - เอกสารครบถ้วน', paymentStatus: '03 - ชำระเงินเรียบร้อย', grouping: 'ungrouped', committee: undefined as string | undefined }
]

const courseOptions = ["ITDS/B", "ITCS/B"];
const roundOptions = [
    { label: "1/68 - MU – Portfolio (TCAS 1)", value: "DST01" },
    { label: "1/68 - ICT Portfolio", value: "ICT01" },
];

const admitStatusOptions = ["02 - ยื่นใบสมัครแล้ว", "03 - รอพิจารณา"];
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
    }

    const [filters, setFilters] = useState<FilterState>({});
    const [filterValues, setFilterValues] = useState<FilterState>({
        docStatus: "03 - เอกสารครบถ้วน",
        paymentStatus: "03 - ชำระเงินเรียบร้อย"
    });

    const [isExpanded, setIsExpanded] = useState(false);

    const committeeOptions = [
        { label: "อ. พิสุทธิ์ธร ", value: "อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์" },
        { label: "อ. อารดา ", value: "อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล" },
        { label: "อ. พรรณวดี", value: "อาจารย์ ดร. พรรณวดี ชัยวัฒนมงคล" },
    ];

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


    //Grouping Applicant
    const [isGroupingMode, setIsGroupingMode] = useState(false);
    const [showCommitteeDropdown, setShowCommitteeDropdown] = useState(false);
    const [selectedCommittee, setSelectedCommittee] = useState<string[]>([]);
    const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
    const [applicantData, setApplicantData] = useState(applicant);
    const [isGrouped, setIsGrouped] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editingApplicant, setEditingApplicant] = useState<typeof applicant[0] | null>(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);


    const handleEnterGroupingMode = () => {
        setIsGroupingMode(true);

        if (selectedApplicants.length > 0 && selectedCommittee.length > 0) {
            const updatedData = [...applicantData];
            const totalCommittees = selectedCommittee.length;

            const fullCommitteeNames = selectedCommittee.map(label => {
                const found = committeeOptions.find(opt => opt.label === label);
                return found ? found.value : label;
            });

            selectedApplicants.forEach((id, index) => {
                const committeeIndex = index % totalCommittees;
                const assignedCommittee = fullCommitteeNames[committeeIndex];

                const targetIndex = updatedData.findIndex(
                    (app) => `${app.round}-${app.applicantId}` === id
                );

                if (targetIndex !== -1) {
                    updatedData[targetIndex].committee = assignedCommittee;
                    updatedData[targetIndex].grouping = "grouped";
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
                    admitStatus: "03 - รอพิจารณา",
                };
            }
            return app;
        });

        setApplicantData(updatedData);
        setIsGrouped(true);
        setIsGroupingMode(false);
        setSelectedApplicants([]);
        setSelectedCommittee([]);
        setShowSuccessAlert(true);
    };

    const handleEditGrouping = (applicant: Applicant) => {
        setEditingApplicant(applicant);
        setShowEditPopup(true);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Show 10 items per page

    const handleExportExcel = () => {
        // export to excel logic หรือ placeholder
        console.log("📥 Export to Excel clicked");
    };

    // Calculate indexes
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const filteredApplicants = applicantData.filter((app) => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            return app[key as keyof Applicant]?.toString().includes(value.toString());
        });
    });

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
        .filter((app) => app.grouping !== "grouped") // เฉพาะที่ยังไม่ grouped
        .every((app) => selectedApplicants.includes(`${app.round}-${app.applicantId}`));

    const hasSelectableApplicants = filteredApplicants.some((app) => app.grouping !== "grouped");

    // ฟังก์ชันเลือก/ไม่เลือกทั้งหมดในหน้า current page
    const toggleSelectAll = () => {
        const ungroupedKeys = filteredApplicants
            .filter((app) => app.grouping !== "grouped") // เฉพาะยังไม่ได้ grouped
            .map((app) => `${app.round}-${app.applicantId}`);

        if (isAllSelected) {
            // ยกเลิกเลือกเฉพาะที่ยังไม่ได้ grouped
            setSelectedApplicants(
                selectedApplicants.filter((id) => !ungroupedKeys.includes(id))
            );
        } else {
            // เพิ่มเฉพาะที่ยังไม่ได้ grouped
            const newSelections = ungroupedKeys.filter((id) => !selectedApplicants.includes(id));
            setSelectedApplicants([...selectedApplicants, ...newSelections]);
        }
    };


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

                                <div className="w-[280px] z-20 relative">
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

                                <div className="w-[240px] z-20">
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
                                            options={committeeOptions}
                                            placeholder="เลือกกรรมการ"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

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


                                <div className="flex gap-2 ml-auto mr-15">

                                    <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {/* Tag กรรมการ */}
                                            {isGroupingMode && (
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    {/* TAG ด้านซ้ายของ dropdown */}
                                                    {selectedCommittee.map((name) => (
                                                        <div
                                                            key={name}
                                                            className="flex items-center bg-gray-100 text-[#565656] rounded-xl px-3 py-0.5"
                                                        >
                                                            {name}
                                                            <button
                                                                className="ml-2 text-[#565656] hover:text-gray-700 text-2xl"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedCommittee(selectedCommittee.filter((n) => n !== name));
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {/*DROPDOWN */}
                                                    <div className="w-[250px] relative">
                                                        <div
                                                            className="w-full min-h-[44px] border border-gray-300 rounded-[8px] px-3 py-0.5 pr-10 flex items-center cursor-pointer"
                                                            onClick={() => setShowCommitteeDropdown(!showCommitteeDropdown)}
                                                        >
                                                            <span className={`${selectedCommittee.length === 0 ? "text-[#C4C4C4]" : "text-[#C4C4C4]"}`}>
                                                                {selectedCommittee.length === 0 ? "เลือกกรรมการหลักสูตร" : "เพิ่มกรรมการ"}
                                                            </span>

                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                                {selectedCommittee.length > 0 && showCommitteeDropdown ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedCommittee([]);
                                                                        }}
                                                                    >
                                                                        <Image src="/images/clear_icon.svg" alt="Clear" width={18} height={18} />
                                                                    </button>
                                                                ) : (
                                                                    <Image src="/images/dropdown_button.svg" alt="Dropdown" width={16} height={16} />
                                                                )}
                                                            </div>
                                                        </div>

                                                        {showCommitteeDropdown && (
                                                            <div className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-[200px] overflow-y-auto shadow-md">
                                                                {committeeOptions
                                                                    .filter((opt) => !selectedCommittee.includes(opt.label))
                                                                    .map((opt) => (
                                                                        <div
                                                                            key={opt.value}
                                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#565656]"
                                                                            onClick={() => setSelectedCommittee([...selectedCommittee, opt.label])}
                                                                        >
                                                                            {opt.label}
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                        {isGroupingMode ? (
                                            // อยู่ระหว่างการเลือกกลุ่ม
                                            <>
                                                <button
                                                    className="min-w-[160px] border border-[#008A90] text-[#008A90] bg-white px-3 py-2 rounded-md flex items-center gap-2"
                                                    onClick={handleEnterGroupingMode}
                                                >
                                                    <Image src="/images/admin/preliminaryResult/grouping_icon_after.svg" alt="จัดกลุ่มอัตโนมัติ" width={20} height={20} />
                                                    <div>จัดกลุ่มอัตโนมัติ</div>
                                                </button>

                                                <button
                                                    className={`min-w-[160px] px-3 py-2 rounded-[10px] flex items-center gap-2 ${canSaveGrouping ? "bg-[#008A90] hover:bg-[#009198] text-white" : "bg-[#C4C4C4] text-white cursor-not-allowed"
                                                        }`}
                                                    disabled={!canSaveGrouping}
                                                    onClick={handleSaveGrouping}
                                                >
                                                    <Image src="/images/admin/preliminaryResult/save_icon.svg" alt="บันทึกการจัดกลุ่ม" width={16} height={16} className="w-4 h-4" />
                                                    <div>บันทึกการจัดกลุ่ม</div>
                                                </button>
                                            </>
                                        ) : isGrouped ? (
                                            // จัดกลุ่มเสร็จแล้ว
                                            <>
                                                <button
                                                    className="min-w-[160px] border border-[#F59E0B] text-[#F59E0B] bg-white  px-3 py-2 rounded-[10px] flex items-center gap-2"
                                                    onClick={() => setIsGroupingMode(true)}
                                                >
                                                    <Image src="/images/admin/interview/edit_icon.svg" alt="แก้ไขการจัดกลุ่ม" width={20} height={20} />
                                                    <div>แก้ไขการจัดกลุ่ม</div>
                                                </button>

                                                <button
                                                    className="min-w-[160px] bg-[#00796B] hover:bg-[#028273] text-white px-3 py-2 rounded-md flex items-center gap-2 "
                                                    onClick={handleExportExcel}
                                                >
                                                    <Image src="/images/admin/searchBar/download_icon.svg" alt="Download Excel" width={16} height={16} className="w-4 h-4" />
                                                    <div>Export to Excel</div>
                                                </button>
                                            </>
                                        ) : (
                                            // ยังไม่ได้จัดกลุ่ม
                                            <>
                                                <button
                                                    className="min-w-[160px] bg-[#008A90] hover:bg-[#009198] text-white px-3 py-2 rounded-md flex items-center gap-2"
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
                                            </>
                                        )}
                                    </div>
                                </div>
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
                                            <th className="px-2 py-4 whitespace-nowrap">สถานะการชำระเงิน</th>
                                            <th className="px-2 py-4 whitespace-nowrap ">กรรมการหลักสูตร</th>
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
            ${app.admitStatus === "02 - ยื่นใบสมัครแล้ว" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#166534]" : ""}
            ${app.admitStatus === "03 - รอพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-[#FFF4E2] text-[#DAA520]" : ""}
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
                                                    <td>
                                                        <div className={`mr-4 whitespace-nowrap
            ${app.paymentStatus === "03 - ชำระเงินเรียบร้อย" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#13522B]" : ""}
          `}>
                                                            {app.paymentStatus}
                                                        </div>
                                                    </td>
                                                    <td className="text-center text-[#565656] whitespace-nowrap">
                                                        {app.committee ? (
                                                            app.committee
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
                                                    {isGroupingMode && app.grouping === "grouped" && (
                                                        <td className="text-center whitespace-nowrap">
                                                            <button
                                                                onClick={() => handleEditGrouping(app)}
                                                                className="text-[#F59E0B] border border-[#DAA520] hover:bg-[#FFF7E6] px-2 py-1 rounded-[10px] flex items-center gap-1 "
                                                            >
                                                                <Image
                                                                    src="/images/admin/interview/edit_icon.svg"
                                                                    alt="แก้ไขการจัดกลุ่ม"
                                                                    width={24}
                                                                    height={24}
                                                                />
                                                                แก้ไขการจัดกลุ่ม
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
            {showSuccessAlert && (
                <AlertAdmin
                    message={'ดำเนินการจัดกลุ่มเรียบร้อย ผู้สมัครรอการพิจารณา'}
                    onClose={() => setShowSuccessAlert(false)}
                />
            )}

            {showEditPopup && editingApplicant && (
                <PopupEditGrouping
                    isOpen={showEditPopup}
                    selectedCommittee={editingApplicant.committee || ""}
                    onClose={() => setShowEditPopup(false)}
                    onSave={(newCommittee) => {
                        const updatedData = [...applicantData];
                        const index = updatedData.findIndex(
                            (a) => a.applicantId === editingApplicant.applicantId && a.round === editingApplicant.round
                        );
                        if (index !== -1) {
                            updatedData[index].committee = newCommittee;
                            setApplicantData(updatedData);
                        }
                        setShowEditPopup(false);
                    }}
                />
            )}
        </div>
    );
};

export default Page;