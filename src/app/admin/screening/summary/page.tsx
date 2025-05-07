"use client";
import React, { useState, useEffect } from "react";
import SideBar from "../../../../components/SideBar";
import AdminNavbar from "../../../../components/adminNavbar";
import SearchField from "../../../../components/form/searchField";
import Image from "next/image";
import { CourseComScreeningInterface, PreEvaSummaryApplicantsResponse } from "@components/types/screening";
import { getDecodedToken } from "@components/lib/auth";
import Modal from "@components/components/common/popup-login";
import { AdmissionResponse } from "@components/types/admission";

interface GroupedData {
    committeeName: string;
    course: string;
    round: string;
    applicants: {
        id: string;
        name: string;
        result: string;
        comment?: string;
    }[];
    passed?: number;
    failed?: number;
    pending?: number;
}

const mockGroupedData: GroupedData[] = [
    {
        committeeName: "อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์",
        course: "ICT01",
        round: "1/68 - ICT Portfolio",
        applicants: [
            { id: "0000003", name: "พิชญะ วิสุทธิ์", result: "ผ่าน" },
            { id: "0000005", name: "อนันต์ โชติกุล", result: "ผ่าน" },
            { id: "0000007", name: "ธนากร ศรีสวัสดิ์", result: "ไม่ผ่าน", comment: "วัตถุประสงค์หรือเป้าหมายของผู้สมัครไม่สอดคล้องกับแนวทางของหลักสูตร" },
            { id: "0000009", name: "วิศรุต พิทักษ์ธรรม", result: "ผ่าน" },
        ]
    },
    {
        committeeName: "อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล",
        course: "ICT01",
        round: "1/68 - ICT Portfolio",
        applicants: [
            { id: "0000013", name: "ชยุตม์ วัฒนานนท์", result: "ผ่าน" },
            { id: "0000015", name: "ปริญญ์ เกียรติกาญจนา", result: "ผ่าน" },
            { id: "0000017", name: "อนุชา สุทธิเพียร", result: "รอ" },
            { id: "0000019", name: "อริสรา จิรศิริกุล", result: "รอ" },
        ]
    }
];

const ScreeningResultPage = () => {
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
    const [admOption, setAdmOption] = useState<AdmissionResponse[]>([]);
    const [preEvaSum, setPreEvaSum] = useState<PreEvaSummaryApplicantsResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);
    const [eduId, setEduId] = useState('');

    useEffect(() => {
        const decoded = getDecodedToken();
        if (!decoded) {
            setShowModal(true);
            return;
        }
        setRoles(decoded.roles);
        setEduId(decoded.id);
    }, []);


    async function fetchData() {
        try {
            const res = await fetch(`${API_BASE_URL}/education-department/get-pre-eva-sum`)
            const res_adm = await fetch(`${process.env.API_BASE_URL}/admission/`);
            if (!res.ok) {
                throw new Error("Failed to fetch one or more resources");
            }

            const data_app = await res.json();
            const adm = await res_adm.json();

            setPreEvaSum(data_app.preEva || []);
            setAdmOption(adm || []);

        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    console.log('pre eva summary #####', preEvaSum);

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

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const [searchData, setSearchData] = useState({
        course: "",
        round: "",
        committee: "ทั้งหมด",
        result: "ทั้งหมด",
        applicantId: "",
        applicantName: "",
    });
    const [filteredData, setFilteredData] = useState(mockGroupedData);
    interface SummaryData {
        passed: number;
        failed: number;
        pending: number;
    }

    const [summaryData, setSummaryData] = useState<SummaryData>({
        passed: 0,
        failed: 0,
        pending: 0,
    });

    const checkPendingApplicants = () => {
        const hasPending = filteredData.some(group =>
            group.applicants.some(applicant => applicant.result === "รอ")
        );
        if (hasPending) {
            setIsPopupVisible(true);
        } else {
            console.log("Exporting data...");
        }
    };

    useEffect(() => {
        const updatedGroupedData = mockGroupedData.map(group => {
            const passed = group.applicants.filter(a => a.result === "ผ่าน").length;
            const failed = group.applicants.filter(a => a.result === "ไม่ผ่าน").length;
            const pending = group.applicants.filter(a => a.result === "รอ").length;

            return {
                ...group,
                passed,
                failed,
                pending,
            };
        });

        const totalPassed = updatedGroupedData.reduce((acc, group) => acc + group.passed, 0);
        const totalFailed = updatedGroupedData.reduce((acc, group) => acc + group.failed, 0);
        const totalPending = updatedGroupedData.reduce((acc, group) => acc + group.pending, 0);

        setSummaryData({
            passed: totalPassed,
            failed: totalFailed,
            pending: totalPending,
        });

        setFilteredData(updatedGroupedData); // อัปเดตข้อมูลให้แสดงผล
    }, []); // คำนวณเพียงครั้งเดียวเมื่อหน้าโหลด


    // ฟังก์ชันค้นหาข้อมูล
    // const handleSearch = () => {
    //     const filtered = mockGroupedData
    //         .filter(group => {
    //             const matchCourse =
    //                 searchData.course === "" || group.course === searchData.course;
    //             return matchCourse;
    //         })
    //         .map(group => {
    //             const filteredApplicants = group.applicants.filter(applicant => {
    //                 const matchCommittee =
    //                     searchData.committee === "ทั้งหมด" ||
    //                     group.committeeName.includes(searchData.committee);
    //                 const matchResult =
    //                     searchData.result === "ทั้งหมด" || applicant.result === searchData.result;
    //                 const matchId =
    //                     searchData.applicantId === "" || applicant.id.includes(searchData.applicantId);
    //                 const matchName =
    //                     searchData.applicantName === "" || applicant.name.includes(searchData.applicantName);

    //                 return matchCommittee && matchResult && matchId && matchName;
    //             });

    //             return {
    //                 ...group,
    //                 applicants: filteredApplicants,
    //                 passed: filteredApplicants.filter(a => a.result === "ผ่าน").length,
    //                 failed: filteredApplicants.filter(a => a.result === "ไม่ผ่าน").length,
    //                 pending: filteredApplicants.filter(a => a.result === "รอ").length
    //             };
    //         })
    //         .filter(group => group.applicants.length > 0);

    //     setFilteredData(filtered); // อัปเดตข้อมูลที่กรองแล้ว
    // };


    const totals = preEvaSum.reduce(
        (acc, curr) => {
            acc.passed += curr.passed;
            acc.failed += curr.failed;
            acc.pending += curr.pending;
            return acc;
        },
        { passed: 0, failed: 0, pending: 0 }
    );

    // handle search and filter
    const handleSearch = () => {
        setFilters(filterValues);
    };

    interface FilterState {
        program?: string;
        roundName?: string;
        preEvaResult?: string;
        applicantId?: string;
        applicantName?: string;
        committeeId?: string;
    }

    const [filters, setFilters] = useState<FilterState>();
    const [filterValues, setFilterValues] = useState<FilterState>();

    const filteredApplicant = preEvaSum
        .map(group => {
            const filteredApplicants = group.applicants.filter(applicant =>
                (!filters?.program || applicant.program?.includes(filters.program)) &&
                (!filters?.roundName || applicant.roundName?.includes(filters.roundName)) &&
                (!filters?.preEvaResult || applicant.preliminaryEva?.includes(filters.preEvaResult)) &&
                (!filters?.applicantId || applicant.applicantId?.includes(filters.applicantId)) &&
                (!filters?.applicantName || `${applicant.firstnameEN} ${applicant.lastnameEN}`.includes(filters.applicantName)) &&
                (!filters?.committeeId || group.courseComId?.includes(filters.committeeId))
            );

            if (filteredApplicants.length === 0) return null; // no applicants matched

            return {
                ...group, // courseComId, prefix, firstName, lastName, passed, failed, pending
                applicants: filteredApplicants // only matched applicants
            };
        })
        .filter(group => group !== null); // remove groups with no matched applicants

    const committeeGroups = preEvaSum.map((com) => ({
        label: `อ. ${com.firstName}`,
        value: `${com.courseComId}`,
        full: `${com.prefix} ${com.firstName} ${com.lastName}`
    }));

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {showModal && <Modal role="admin" />}
            {isPopupVisible && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black/20">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-[600px] w-full min-h-[175px] text-[#565656]">
                        <div className="flex items-center justify-start mb-4">
                            <Image
                                src="/images/admin/preliminaryResult/warning_export_icon.svg"
                                alt="warning"
                                width={32}
                                height={32}
                            />
                            <h3 className="text-xl font-semibold ml-2">พบผู้สมัครที่ยังไม่ได้รับการพิจารณา</h3>
                        </div>

                        <p>
                            มีผู้สมัคร 2 คนที่ยังอยู่ในสถานะ รอการพิจารณา รายงานที่ Export อาจยังไม่สมบูรณ์
                        </p>

                        <div className="mt-4 flex justify-center gap-2">
                            <button
                                className="px-4 py-2 border border-[#C4C4C4] rounded-md"
                                onClick={() => setIsPopupVisible(false)}
                            >
                                ย้อนกลับ
                            </button>
                            <button
                                className="px-4 py-2 bg-[#00796B] text-white rounded-md flex items-center gap-2"
                                onClick={() => {
                                    setIsPopupVisible(false);
                                    // ฟังก์ชัน export
                                }}
                            >
                                <Image
                                    src="/images/admin/preliminaryResult/download_icon.svg"
                                    alt="download"
                                    width={16}
                                    height={16}
                                />
                                ดำเนินการส่งออก
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AdminNavbar
                isCollapsed={isCollapsed}
                backToPage={{ href: "/camp", label: "กลับสู่หน้ารายการ" }}
            />

            <div className="flex flex-row flex-1 min-h-screen overflow-hidden">
                <div className="relative z-20">
                    <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} userRoles={roles} />
                </div>

                <main
                    className={`w-full transition-all p-6 mt-[64px] min-h-[calc(100vh-64px)] ${isCollapsed ? "ml-[80px]" : "ml-[300px]"}`}
                >
                    {/* กล่องค้นหา */}
                    <div className="relative max-w-[1600px] w-full mx-auto p-5 rounded-lg shadow-md mb-6 px-4 md:px-8 z-10 mt-5">
                        <h2 className="text-[24px] font-semibold text-[#565656] mb-4">ค้นหาผลการคัดกรอง</h2>
                        <hr className="mb-4 border-gray-300" />
                        {/* บรรทัดแรก 4 ช่องแบบชิดกัน */}
                        <div className="flex flex-wrap items-end gap-2 mb-4">
                            {/* SearchField ต่าง ๆ */}
                            <div className="w-[200px] z-20">
                                <SearchField
                                    label="หลักสูตร"
                                    type="dropdown"
                                    value={filterValues?.program || ""}
                                    onChange={(option) => {
                                        if (typeof option === "object" && option !== null && "value" in option) {
                                            setFilterValues({ ...filterValues, program: option.value });
                                        } else {
                                            setFilterValues({ ...filterValues, program: "" });
                                        }
                                    }}
                                    options={courseOptions}
                                    placeholder="เลือกหลักสูตร"
                                />
                            </div>

                            <div className="w-[300px] z-50 relative">
                                <SearchField
                                    label="รอบรับสมัคร"
                                    type="dropdown"
                                    value={filterValues?.roundName || ""}
                                    onChange={(option) => {
                                        if (typeof option === "object" && option !== null && "value" in option) {
                                            setFilterValues({ ...filterValues, roundName: option.value });
                                        } else {
                                            setFilterValues({ ...filterValues, roundName: "" });
                                        }
                                    }}
                                    options={roundOptions}
                                    placeholder="เลือกรอบรับสมัคร"
                                />
                            </div>
                            <div className="w-[370px] z-50 relative">
                                <SearchField
                                    label="กรรมการหลักสูตร"
                                    type="dropdown"
                                    value={filterValues?.committeeId || ""}
                                    onChange={(option) => {
                                        if (typeof option === "object" && option !== null && "value" in option) {
                                            setFilterValues({ ...filterValues, committeeId: option.value });
                                        } else {
                                            setFilterValues({ ...filterValues, committeeId: "" });
                                        }
                                    }}
                                    options={committeeGroups}
                                    placeholder="เลือกกรรมการหลักสูตร"
                                />
                            </div>
                            <div className="w-[300px] z-[9999] relative">
                                <SearchField
                                    label="ผลการคัดกรองเบื้องต้น"
                                    type="dropdown"
                                    value={filterValues?.preEvaResult || ""}
                                    onChange={(option) => {
                                        if (typeof option === "object" && option !== null && "value" in option) {
                                            setFilterValues({ ...filterValues, preEvaResult: option.value });
                                        } else {
                                            setFilterValues({ ...filterValues, preEvaResult: "" });
                                        }
                                    }}
                                    options={[
                                        { value: "ผ่านการคัดกรอง", label: "ผ่านการคัดกรอง" },
                                        { value: "ไม่ผ่านการคัดกรอง", label: "ไม่ผ่านการคัดกรอง" },
                                        { value: "รอพิจารณาเพิ่มเติม", label: "รอพิจารณาเพิ่มเติม" },
                                    ]}
                                    placeholder="เลือกผลการคัดกรอง"
                                />
                            </div>
                            {/* ปุ่มต่าง ๆ ต่อท้าย */}
                            <div className="flex gap-1 justify-end lg:justify-end sm:justify-start w-full lg:w-auto">
                                {/* ปุ่มลูกศร */}
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="w-[40px] h-[40px] flex items-center justify-center border border-[#565656] rounded-md"
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
                                    />

                                </button>

                                {/* ปุ่มล้างค่า */}
                                <button
                                    onClick={() => {
                                        setFilterValues({
                                            program: "",
                                            roundName: "",
                                            preEvaResult: "",
                                            applicantId: "",
                                            applicantName: "",
                                            committeeId: "",
                                        });
                                        setFilters({});
                                    }}

                                    className="px-4 h-[40px] border border-gray-400 rounded-md text-[#565656] bg-white flex items-center gap-1"
                                >
                                    <Image src="/images/admin/searchBar/clear_icon.svg" alt="reset" width={16} height={16} />

                                    ล้างค่า
                                </button>

                                {/* ปุ่มค้นหารายการ */}
                                <button
                                    onClick={handleSearch}

                                    className="px-4 h-[40px] rounded-md bg-[#008A90] hover:bg-[#007178] text-white flex items-center gap-2"
                                >
                                    <Image src="/images/admin/searchBar/search_icon.svg" alt="search" width={16} height={16} />

                                    ค้นหารายการ
                                </button>
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                <div className="w-[185px]">
                                    <SearchField
                                        label="เลขที่สมัคร"
                                        value={filterValues?.applicantId || ""}
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

                                <div className="w-[350px]">
                                    <SearchField
                                        label="ชื่อ – นามสกุล ผู้สมัคร"
                                        value={filterValues?.applicantName || ""}
                                        onChange={(value) => {
                                            if (typeof value === "object" && value !== null && "value" in value) {
                                                setFilterValues({ ...filterValues, applicantName: value.value });
                                            } else {
                                                setFilterValues({ ...filterValues, applicantName: value ?? undefined });
                                            }
                                        }}
                                        placeholder="กรุณากรอกข้อมูล"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    {/* ปุ่ม Export to Excel */}
                    <div className="max-w-[1600px] mx-auto mb-6 flex justify-start lg:justify-end">
                        <button
                            onClick={checkPendingApplicants}  // ตรวจสอบสถานะผู้สมัครก่อน export
                            className="bg-[#00796B] hover:bg-[#028273] text-white px-4 py-2 rounded-md flex items-center gap-2"
                        >
                            <Image
                                src="/images/admin/searchBar/download_icon.svg"
                                alt="Download Excel"
                                width={16}
                                height={16}
                            />
                            Export to Excel
                        </button>
                    </div>

                    {/* สรุปผลการคัดกรอง */}
                    <div className="relative max-w-[1600px] w-full mx-auto p-5 rounded-lg shadow-md mb-6 px-4 md:px-8 ">
                        <h2 className="text-[22px] font-semibold text-black mb-4">สรุปผลการประเมิน</h2>
                        {/* หัว summary bar */}
                        <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-10 items-start px-6 py-3 border-b border-gray-200 font-semibold">
                            {/* ผ่าน */}
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Image src="/images/admin/preliminaryResult/pass_icon.svg" alt="ผ่าน" width={24} height={24} />
                                <span className="text-[#565656] text-lg">
                                    ผ่านการพิจารณาเบื้องต้น <span className="text-[#388E3C]">{totals.passed || 0} คน</span>
                                </span>
                            </div>

                            {/* ไม่ผ่าน */}
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Image src="/images/admin/preliminaryResult/fail_icon.svg" alt="ไม่ผ่าน" width={24} height={24} />
                                <span className="text-[#565656] text-lg">
                                    ไม่ผ่านการพิจารณาเบื้องต้น <span className="text-[#D92D20]">{totals.failed || 0} คน</span>
                                </span>
                            </div>

                            {/* รอพิจารณา */}
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Image src="/images/admin/preliminaryResult/pending_icon.svg" alt="รอพิจารณา" width={24} height={24} />
                                <span className="text-[#565656] text-lg">
                                    รอพิจารณาเพิ่มเติม <span className="text-[#DAA520]">{totals.pending || 0} คน</span>
                                </span>
                            </div>
                        </div>

                        {/* Loop รายกรรมการ */}
                        {filteredApplicant.map((group, index) => (
                            <div key={index} className="border-t border-gray-200">
                                {/* หัวกรรมการ */}
                                <div className="bg-[#C4C4C4] text-[#333] font-semibold px-6 py-3">
                                    กรรมการหลักสูตร: {group.prefix} {group.firstName} {group.lastName}
                                </div>

                                <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-6 px-6 py-2 font-semibold text-[#565656]">
                                    <div>
                                        ผ่าน: <span className="text-[#388E3C]">{group.passed}</span>
                                    </div>
                                    <div>
                                        ไม่ผ่าน: <span className="text-red-600">{group.failed}</span>
                                    </div>
                                    <div>
                                        รอพิจารณา: <span className="text-yellow-600">{group.pending}</span>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-[700px] w-full text-[#333] border-t border-gray-200 table-fixed">

                                        <thead className="bg-[#F5F5F5] text-[#565656] text-left">
                                            <tr>
                                                <th className="px-4 py-2 w-[60px]">No</th>
                                                <th className="px-4 py-2 w-[100px]">เลขที่สมัคร</th>
                                                <th className="px-4 py-2 w-[200px]">ชื่อ – นามสกุล ผู้สมัคร</th>
                                                <th className="px-4 py-2 w-[200px]">ผลการคัดกรองเบื้องต้น</th>
                                                <th className="px-4 py-2 w-[500px]">ความคิดเห็นเพิ่มเติม</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.applicants.map((a, idx) => (
                                                <tr key={idx} className="border-t">
                                                    <td className="px-4 py-2 truncate">{idx + 1}</td>
                                                    <td className="px-4 py-2 truncate">{a.applicantId}</td>
                                                    <td className="px-4 py-2 truncate">{a.firstnameEN} {a.lastnameEN}</td>
                                                    <td
                                                        className={`px-4 py-2 truncate ${a.preliminaryEva === "ผ่านการคัดกรอง"
                                                            ? "text-green-600"
                                                            : a.preliminaryEva === "ไม่ผ่านการคัดกรอง"
                                                                ? "text-red-600"
                                                                : "text-yellow-600"
                                                            }`}
                                                    >
                                                        {a.preliminaryEva === "ผ่านการคัดกรอง"
                                                            ? "ผ่านการคัดกรอง"
                                                            : a.preliminaryEva === "ไม่ผ่านการคัดกรอง"
                                                                ? "ไม่ผ่านการคัดกรอง"
                                                                : "รอพิจารณา"}
                                                    </td>
                                                    <td className="px-4 py-2 truncate">{a.preliminaryComment || "-"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default ScreeningResultPage;
