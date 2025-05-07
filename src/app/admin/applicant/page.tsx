"use client";
import { useEffect, useState } from "react";

import React from 'react';
import Sidebar from "@components/components/SideBar";
import AdminNavbar from "@components/components/adminNavbar";
import SearchField from "@components/components/form/searchField";
import Image from 'next/image';
import AlertAdmin from "@components/components/common/admin/alertAdmin";
import PopupCancelReason from "@components/components/common/admin/applicant/PopupCancelReason";
import { EduScreeningInterface } from "@components/types/screening";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TokenAdminPayload } from "@components/types/token";
import { jwtDecode } from "jwt-decode";
import Modal from "@components/components/common/popup-login";
import { getDecodedToken } from "@components/lib/auth";
import { AdmissionResponse } from "@components/types/admission";



const currentYear = new Date().getFullYear() + 543;
const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return { label: `${year}`, value: `${year}` };
});

const admitStatusOptions = ["01 - ยังไม่ยื่นใบสมัคร", "02 - ยื่นใบสมัครแล้ว", "03 - รอพิจารณา", "04 - ผ่านการพิจารณา", "05 - ไม่ผ่านการพิจารณา", "06 - รอสัมภาษณ์", "07 - ผ่านการสัมภาษณ์", "08 - ไม่ผ่านการสัมภาษณ์", "09 - ยกเลิกการสมัคร"];
const docStatusOptions = ["01 - ยังไม่มีเอกสาร", "02 - รอตรวจสอบเอกสาร", "03 - เอกสารครบถ้วน", "04 - เอกสารไม่ครบถ้วน"];
const paymentStatusOptions = ["01 - ยังไม่ได้ชำระเงิน", "02 - รอตรวจสอบการชำระเงิน", "03 - ชำระเงินเรียบร้อย", "04 - ชำระเงินไม่สำเร็จ"];

const Page = () => {
    const [applicants, setApplicants] = useState<EduScreeningInterface[]>([]);
    const [admOption, setAdmOption] = useState<AdmissionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        const decoded = getDecodedToken();
        if (!decoded) {
            setShowModal(true);
            return;
        }
        setRoles(decoded.roles);
    }, []);


    const fetchAllApplicants = async () => {
        try {
            const res = await fetch(`${process.env.API_BASE_URL}/education-department/all-applicant-edu`);
            const res_adm = await fetch(`${process.env.API_BASE_URL}/admission/`);

            if (!res.ok) {
                throw new Error("Failed to fetch applicants");
            }
            const data = await res.json();
            const adm = await res_adm.json();

            console.log("data", data)
            setApplicants(data || []);
            setAdmOption(adm || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllApplicants();
    }, []);
    //console.log('adm', admOption)

    const courseOptions = admOption.map(adm => ({
        label: adm.program === 'ITDS/B'
            ? 'หลักสูตร DST (ไทย)'
            : adm.program === 'ITCS/B'
                ? 'หลักสูตร ICT (นานาชาติ)'
                : '',
        value: adm.program
    }));

    const roundOptions = admOption.map(adm => ({
        label: adm.roundName,
        value: adm.roundName
    }));

    const [isCollapsed, setIsCollapsed] = useState(false);
    interface FilterState {
        course?: string;
        round?: string;
        year?: string;
        admitStatus?: string;
        docStatus?: string;
        paymentStatus?: string;
        applicantId?: string;
        fname?: string;
        lname?: string;
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
    const filteredApplicants = applicants.filter(app =>
        (!filters.course || app.program === filters.course) &&
        (!filters.round || app.roundName === filters.round) &&
        (!filters.year || app.year === filters.year) &&
        (!filters.admitStatus || app.admissionStatus === filters.admitStatus) &&
        (!filters.docStatus || app.docStatus === filters.docStatus) &&
        (!filters.paymentStatus || app.paymentStatus === filters.paymentStatus) &&
        (!filters.applicantId || app.applicantId?.includes(filters.applicantId)) &&
        (!filters.fname || app.firstnameEN?.includes(filters.fname)) &&
        (!filters.lname || app.lastnameEN?.includes(filters.lname))
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Show 10 items per page
    const [showAlert, setShowAlert] = useState(false);
    const [cancelPopupVisible, setCancelPopupVisible] = useState(false);
    const [cancelReasonData, setCancelReasonData] = useState<{ reason: string; details: string } | null>(null);

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
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectedApplicants, setSelectedApplicants] = useState<
        { applicantId: string; admissionId: string }[]
    >([]);

    // const eligibleApplicants = filteredApplicants.filter(
    //     (app) => app.admissionStatus === "02 - ยื่นใบสมัครแล้ว"
    // );

    // const hasSelectableApplicants = eligibleApplicants.length > 0;
    // const isAllSelected = eligibleApplicants.length > 0 && eligibleApplicants.every(app => selectedApplicants.includes(app.applicantId));

    // const toggleSelectAll = () => {
    //     if (isAllSelected) {
    //         setSelectedApplicants([]);
    //     } else {
    //         setSelectedApplicants(eligibleApplicants.map(app => app.applicantId));
    //     }
    // };

    // const handleCheckboxChange = (applicantId: string, admissionId: string) => {
    //     setSelectedApplicants((prev) => {
    //       const exists = prev.some(
    //         (item) => item.applicantId === applicantId && item.admissionId === admissionId
    //       );

    //       if (exists) {
    //         return prev.filter(
    //           (item) =>
    //             !(item.applicantId === applicantId && item.admissionId === admissionId)
    //         );
    //       } else {
    //         return [...prev, { applicantId, admissionId }];
    //       }
    //     });
    // };

    const handleToggleDownloadMode = () => {
        setShowCheckboxes(true);
        setSelectedApplicants([]);
    };
    const handleConfirmDownload = async () => {
        console.log("ดาวน์โหลดเอกสารสำหรับ:", selectedApplicants);
        await downloadSelectedApplicants();
        setShowAlert(true);            // แสดง Alert
        setSelectedApplicants([]);     // ล้างรายการที่เลือก
        setShowCheckboxes(false);      // ปิดโหมด checkbox
    };

    const downloadSelectedApplicants = async () => {
        try {
            const res = await fetch(`${process.env.API_BASE_URL}/upload/download-applicants`, {
                method: "POST",
                body: JSON.stringify(selectedApplicants),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                throw new Error("Download failed");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Applicants.zip";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error downloading file:", err);
            alert("มีข้อผิดพลาดในการดาวน์โหลดไฟล์");
        }
    };


    const handleClickView = (appId: string, admId: string) => {
        router.push(`/admin/applicant/view?id=${appId}&admId=${admId}`);
    }

    const isChecked = (applicantId: string, admissionId: string) => {
        return selectedApplicants.some(
            (item) => item.applicantId === applicantId && item.admissionId === admissionId
        );
    };

    const handleCheckboxChange = (applicantId: string, admissionId: string) => {
        setSelectedApplicants((prev) => {
            const exists = prev.some(
                (item) => item.applicantId === applicantId && item.admissionId === admissionId
            );

            if (exists) {
                return prev.filter(
                    (item) => !(item.applicantId === applicantId && item.admissionId === admissionId)
                );
            } else {
                return [...prev, { applicantId, admissionId }];
            }
        });
    };

    const isSelectable = (app: EduScreeningInterface) => {
        // เงื่อนไขที่ใช้กำหนดว่า checkbox กดได้ไหม เช่น app.status === "ผ่าน"
        return app.admissionStatus === "02 - ยื่นใบสมัครแล้ว"
    };

    const hasSelectableApplicants = applicants.some((app) => isSelectable(app));

    const isAllSelected =
        hasSelectableApplicants &&
        applicants
            .filter((app) => isSelectable(app))
            .every((app) => isChecked(app.applicantId, app.admissionId));

    const toggleSelectAll = () => {
        const selectableApps = applicants.filter((app) => isSelectable(app));

        if (isAllSelected) {
            // ถ้ากดอีกที → ยกเลิกทั้งหมด
            setSelectedApplicants((prev) =>
                prev.filter(
                    (item) =>
                        !selectableApps.some(
                            (app) =>
                                app.applicantId === item.applicantId &&
                                app.admissionId === item.admissionId
                        )
                )
            );
        } else {
            // เลือกทั้งหมดที่เลือกได้
            const newSelections = selectableApps.map((app) => ({
                applicantId: app.applicantId,
                admissionId: app.admissionId,
            }));

            setSelectedApplicants((prev) => {
                const merged = [...prev];
                newSelections.forEach((sel) => {
                    const exists = merged.some(
                        (item) =>
                            item.applicantId === sel.applicantId &&
                            item.admissionId === sel.admissionId
                    );
                    if (!exists) merged.push(sel);
                });
                return merged;
            });
        }
    };

    const export_excel = async () => {
        try {
            const response = await fetch(`${process.env.API_BASE_URL}/excel/applicant-list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filters),
            });

            if (!response.ok) {
                throw new Error("Download failed");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // สร้าง element <a> เพื่อดาวน์โหลด
            const a = document.createElement("a");
            a.href = url;

            // ดึงชื่อไฟล์จาก Content-Disposition (ถ้ามี)
            const disposition = response.headers.get("Content-Disposition");
            const match = disposition?.match(/filename\*?=.*?''(.+)/);
            const filename = match ? decodeURIComponent(match[1]) : `Applicant_List_${filters.course}_${filters.round}.xlsx`;

            a.download = filename;
            document.body.appendChild(a);
            a.click();

            // ล้าง
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
            alert("ไม่สามารถดาวน์โหลดไฟล์ได้");
        }
    };

    // debugging
    console.log("all apps", applicants)
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {showModal && <Modal role="admin" />}
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

                                <div className="w-[220px] z-50">
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

                                <div className="w-[145px] z-50">
                                    <SearchField
                                        label="ปีการศึกษา"
                                        type="dropdown"
                                        value={filterValues.year || ""}
                                        onChange={(option) => {
                                            if (typeof option === "object" && option !== null && "value" in option) {
                                                setFilterValues({ ...filterValues, year: option.value });
                                            } else {
                                                setFilterValues({ ...filterValues, year: "" });
                                            }
                                        }}
                                        options={yearOptions}
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

                                <div className="flex justify-end gap-2 mt-4">
                                    {/* ปุ่มยืนยันดาวน์โหลดเอกสาร (แสดงเฉพาะตอน checkbox mode) */}
                                    {/* ปุ่มยืนยันดาวน์โหลดเอกสาร */}
                                    {showCheckboxes && (
                                        <button
                                            onClick={handleConfirmDownload}
                                            disabled={selectedApplicants.length === 0}
                                            className={`px-3 py-1.5 rounded-md flex items-center gap-1 border ${selectedApplicants.length === 0
                                                ? "bg-[#C4C4C4] text-white border-[#C4C4C4] cursor-not-allowed"
                                                : "bg-white text-[#008A90] border-[#008A90]"
                                                }`}
                                        >
                                            <Image
                                                src={
                                                    selectedApplicants.length === 0
                                                        ? "/images/admin/applicant/disable_confirm_download_icon.svg"
                                                        : "/images/admin/applicant/enable_confirm_download_icon.svg"
                                                }
                                                alt="Confirm Icon"
                                                width={25}
                                                height={25}
                                                className="w-5 h-4"
                                            />
                                            <span>ยืนยันดาวน์โหลดเอกสาร</span>
                                        </button>
                                    )}

                                    {/* ปุ่มดาวน์โหลดเอกสาร (แสดงเฉพาะก่อนเข้าโหมด checkbox) */}
                                    {!showCheckboxes && (
                                        <button onClick={handleToggleDownloadMode}>
                                            <div className="bg-[#008A90] hover:bg-[#009198] text-white px-3 py-2 rounded-md flex items-center gap-2">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path
                                                        d="M3.33366 6.66732C2.41283 6.66732 1.66699 7.41315 1.66699 8.33398V16.6673C1.66699 17.584 2.41699 18.334 3.33366 18.334H15.0003C15.9212 18.334 16.667 17.5882 16.667 16.6673H3.33366V6.66732ZM16.667 15.0007H6.66699C5.74616 15.0007 5.00033 14.2548 5.00033 13.334V5.00065C5.00033 4.07982 5.74616 3.33398 6.66699 3.33398H9.16699C10.0878 3.33398 10.8337 4.07982 10.8337 5.00065H16.667C17.5878 5.00065 18.3337 5.74648 18.3337 6.66732V13.334C18.3337 14.2548 17.5878 15.0007 16.667 15.0007Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                                <span>ดาวน์โหลดเอกสาร</span>
                                            </div>
                                        </button>
                                    )}

                                    {/* ปุ่ม Export to Excel (แสดงตลอด แต่อาจ disabled) */}
                                    <button disabled={showCheckboxes} onClick={export_excel}>
                                        <div
                                            className={`px-3 py-2 rounded-md flex items-center gap-2 ${showCheckboxes
                                                ? "bg-[#C4C4C4] cursor-not-allowed text-white"
                                                : "bg-[#00796B] hover:bg-[#028273] text-white"
                                                }`}
                                        >
                                            <Image
                                                src="/images/admin/searchBar/download_icon.svg"
                                                alt="Download Excel"
                                                width={16}
                                                height={16}
                                                className="w-4 h-4"
                                            />
                                            <span>Export to Excel</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                            {/* แสดงจำนวนผู้สมัครที่เลือก */}
                            {showCheckboxes && (
                                <div className="mt-2 mb-2 text-[#565656] text-left w-full">
                                    เลือกผู้สมัคร <span className="font-bold">{selectedApplicants.length} คน</span>
                                </div>
                            )}
                            <div className="overflow-x-auto w-full">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-[#F3F5F6] text-center; text-[#565656]">
                                            {/* ตรง thead */}
                                            <th className="px-2 py-4 whitespace-nowrap">
                                                {showCheckboxes && (
                                                    <input
                                                        type="checkbox"
                                                        checked={isAllSelected}
                                                        onChange={toggleSelectAll}
                                                        disabled={!hasSelectableApplicants}
                                                        className={`w-5 h-5 accent-[#008A90] text-white rounded-md border-2 
                                                        ${!hasSelectableApplicants ? "border-gray-300 cursor-not-allowed" : "border-[#008A90]"}
                                                    `}
                                                        title={!hasSelectableApplicants ? "ไม่มีผู้สมัครที่สามารถเลือกได้" : ""}
                                                    />
                                                )}
                                            </th>

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
                                        {paginatedApplicants.map((app, index) => {
                                            const isSelectable = app.admissionStatus === "02 - ยื่นใบสมัครแล้ว";

                                            return (
                                                <tr
                                                    key={index}
                                                    className={`text-[#565656] h-[50px] items-center 
                                                    ${app.admissionStatus !== "09 - ยกเลิกการสมัคร" ? "hover:bg-gray-50" : ""}
                                                    ${app.admissionStatus === "09 - ยกเลิกการสมัคร" ? "bg-[#FFE8E8]" : ""}
                                                    `}
                                                >
                                                    <td className="text-center">
                                                        {showCheckboxes ? (
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelectable && isChecked(app.applicantId, app.admissionId)}
                                                                onChange={() => handleCheckboxChange(app.applicantId, app.admissionId)}
                                                                disabled={!isSelectable}
                                                                className={`w-5 h-5 rounded border-2 
                                                                    ${isSelectable ? "accent-[#008A90]" : "border-gray-300 bg-white cursor-not-allowed"}
                                                                `}
                                                            />
                                                        ) : null}
                                                    </td>

                                                    <td className="text-center whitespace-nowrap">{startIndex + index + 1}</td>
                                                    <td className="text-center whitespace-nowrap">{app.roundName}</td>
                                                    <td className="text-center whitespace-nowrap">{app.applicantNumber}</td>
                                                    <td className="whitespace-nowrap">{app.firstnameEN} {app.lastnameEN}</td>
                                                    <td className="text-center whitespace-nowrap">{app.program}</td>

                                                    <td>
                                                        <div className={`mr-4 whitespace-nowrap
                                                            ${app.admissionStatus === "02 - ยื่นใบสมัครแล้ว" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#166534]" : "py-2"}
                                                            ${app.admissionStatus === "03 - รอพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-[#FFF4E2] text-[#DAA520]" : "py-2"}
                                                            ${app.admissionStatus === "04 - ผ่านการพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#166534]" : "py-2"}
                                                            ${app.admissionStatus === "05 - ไม่ผ่านการพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-red-200 text-red-600 " : "py-2"}
                                                            ${app.admissionStatus === "06 - รอสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-[#FFF4E2] text-[#DAA520] " : "py-2"}
                                                            ${app.admissionStatus === "07 - ผ่านการสอบสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-[#E2F5E2] text-[#166534]" : "py-2"}
                                                            ${app.admissionStatus === "08 - ไม่ผ่านการสอบสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-red-200 text-red-600 " : "py-2"}
                                                            ${app.admissionStatus === "09 - ยกเลิกการสมัคร" ? "h-[30px] pt-[2px] rounded-xl text-red-600 " : "py-2"}
                                                        `}>
                                                            {app.admissionStatus}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {app.admissionStatus === "09 - ยกเลิกการสมัคร" ? (
                                                            <div>ไม่ต้องดำเนินการต่อ</div>
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
                                                        {app.admissionStatus === "09 - ยกเลิกการสมัคร" ? (
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

                                                    <td className="py-2 whitespace-nowrap">{app.applicantEmail}</td>
                                                    <td className="py-2 whitespace-nowrap">{app.applicantPhone}</td>

                                                    <td className="py-2 text-center whitespace-nowrap">
                                                        {/* {app.admissionStatus !== "01 - ยังไม่ยื่นใบสมัคร" && (
                                                            <Link
                                                            key='view'
                                                            href={{
                                                                pathname: '/admin/applicant/view',
                                                                query: {
                                                                    QapplicantId: `${app.applicantId}`,
                                                                    QapplicantFullname: `${app.firstnameEN} ${app.lastnameEN}`,
                                                                    QroundName: `${app.roundName}`,
                                                                    Qprogram: `${app.program}`,
                                                                    QadmissionStatus: `${app.admissionStatus}`,
                                                                    QdocStatus: `${app.docStatus}`,
                                                                    QpaymentStatus: `${app.paymentStatus}`,
                                                                    Qpath: '/admin/applicant'
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
                                                        )} */}
                                                        {app.admissionStatus !== "01 - ยังไม่ยื่นใบสมัคร" && app.admissionStatus !== "09 - ยกเลิกการสมัคร" && (
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
                                                        )}

                                                        {app.admissionStatus === "09 - ยกเลิกการสมัคร" && (
                                                            <button
                                                                onClick={() => {
                                                                    setCancelReasonData({
                                                                        reason: app.reason,
                                                                        details: app.moreDetail
                                                                    });
                                                                    setCancelPopupVisible(true);
                                                                }}
                                                                className="bg-red px-1 py-1 my-2 rounded-lg border border-red-500 text-red-500 text-[14px] font-bold w-[130px]">
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
                        {showAlert && (
                            <AlertAdmin
                                message="ดำเนินการดาวน์โหลดเอกสารผู้สมัครเรียบร้อยแล้ว"
                                onClose={() => setShowAlert(false)}
                            />
                        )}
                        {cancelPopupVisible && cancelReasonData && (
                            <PopupCancelReason
                                reason={cancelReasonData.reason}
                                details={cancelReasonData.details}
                                onClose={() => setCancelPopupVisible(false)}
                            />
                        )}

                    </main>
                </div>
            </div>
        </div>

    );
};

export default Page;
