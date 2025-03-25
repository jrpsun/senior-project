"use client";
import React, { useState, useEffect } from "react";
import SideBar from "../../../../components/SideBar";
import AdminNavbar from "../../../../components/adminNavbar";
import SearchField from "../../../../components/form/searchField";

const mockGroupedData = [
    {
        committeeName: "อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์",
        course: "ITCS/B",
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
        course: "ITCS/B",
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
    const [summaryData, setSummaryData] = useState({});

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
    const handleSearch = () => {
        const filtered = filteredData.map(group => {
            const filteredApplicants = group.applicants.filter(applicant => {
                const matchCommittee =
                    searchData.committee === "ทั้งหมด" ||
                    group.committeeName.includes(searchData.committee);
                const matchResult =
                    searchData.result === "ทั้งหมด" || applicant.result === searchData.result;
                const matchId =
                    searchData.applicantId === "" || applicant.id.includes(searchData.applicantId);
                const matchName =
                    searchData.applicantName === "" || applicant.name.includes(searchData.applicantName);

                return matchCommittee && matchResult && matchId && matchName;
            });

            return {
                ...group,
                applicants: filteredApplicants,
                passed: filteredApplicants.filter(a => a.result === "ผ่าน").length,
                failed: filteredApplicants.filter(a => a.result === "ไม่ผ่าน").length,
                pending: filteredApplicants.filter(a => a.result === "รอ").length
            };
        }).filter(group => group.applicants.length > 0);

        setFilteredData(filtered); // อัปเดตข้อมูลที่กรองแล้ว
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {isPopupVisible && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black/20">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-[600px] w-full min-h-[175px] text-[#565656]">
                        <div className="flex items-center justify-start mb-4">
                            <img
                                src="/images/admin/preliminaryResult/warning_export_icon.svg"
                                alt="warning"
                                className="w-8 h-8"
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
                                className="px-4 py-2 bg-[#008A90] text-white rounded-md flex items-center gap-2"
                                onClick={() => {
                                    setIsPopupVisible(false);
                                    // ฟังก์ชัน export
                                }}
                            >
                                <img
                                    src="/images/admin/preliminaryResult/download_icon.svg"
                                    alt="download"
                                    className="w-4 h-4"
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
                <div className="relative z-50">
                    <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
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
                                    value={searchData.course}
                                    onChange={(option) =>
                                        setSearchData({ ...searchData, course: option?.value || "" })
                                    }
                                    options={[{ value: "ITCS/B", label: "ITCS/B" }]}
                                    placeholder="เลือกหลักสูตร"
                                />
                            </div>
                            <div className="w-[300px] z-50 relative">
                                <SearchField
                                    label="รอบรับสมัคร"
                                    type="dropdown"
                                    value={searchData.round}
                                    onChange={(option) => setSearchData({ ...searchData, round: option?.value || "" })}
                                    options={[{ value: "1/68 - ICT Portfolio", label: "1/68 - ICT Portfolio" }]}
                                    placeholder="เลือกรอบรับสมัคร"
                                />
                            </div>
                            <div className="w-[370px] z-50 relative">
                                <SearchField
                                    label="กรรมการหลักสูตร"
                                    type="dropdown"
                                    value={searchData.committee}
                                    onChange={(option) => setSearchData({ ...searchData, committee: option?.value || "" })}
                                    options={[
                                        { value: "ทั้งหมด", label: "แสดงทั้งหมด" },
                                        { value: "พิสุทธิ์ธร", label: "อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์" },
                                        { value: "อารดา", label: "อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล" },
                                    ]}
                                    placeholder="เลือกกรรมการหลักสูตร"
                                />
                            </div>
                            <div className="w-[300px] z-[9999] relative">
                                <SearchField
                                    label="ผลการคัดกรองเบื้องต้น"
                                    type="dropdown"
                                    value={searchData.result}
                                    onChange={(option) => setSearchData({ ...searchData, result: option?.value || "" })}
                                    options={[
                                        { value: "ทั้งหมด", label: "แสดงทั้งหมด" },
                                        { value: "ผ่าน", label: "ผ่านการพิจารณาเบื้องต้น" },
                                        { value: "ไม่ผ่าน", label: "ไม่ผ่านการพิจารณาเบื้องต้น" },
                                        { value: "รอ", label: "รอพิจารณาเพิ่มเติม" },
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
                                    <img
                                        src={
                                            isExpanded
                                                ? "/images/admin/searchBar/show_less_icon.svg"
                                                : "/images/admin/searchBar/show_more_icon.svg"
                                        }
                                        alt={isExpanded ? "แสดงน้อยลง" : "แสดงเพิ่มเติม"}
                                        className="w-37 h-37"
                                    />
                                </button>

                                {/* ปุ่มล้างค่า */}
                                <button
                                    onClick={() => {
                                        setSearchData({
                                            course: "",
                                            round: "",
                                            committee: "",
                                            result: "",
                                            applicantId: "",
                                            applicantName: "",
                                        });
                                        setFilteredData(mockGroupedData);
                                    }}

                                    className="px-4 h-[40px] border border-gray-400 rounded-md text-[#565656] bg-white flex items-center gap-1"
                                >
                                    <img src="/images/admin/searchBar/clear_icon.svg" alt="reset" className="w-4 h-4" />
                                    ล้างค่า
                                </button>

                                {/* ปุ่มค้นหารายการ */}
                                <button
                                    onClick={handleSearch}

                                    className="px-4 h-[40px] rounded-md bg-[#008A90] hover:bg-[#007178] text-white flex items-center gap-2"
                                >
                                    <img src="/images/admin/searchBar/search_icon.svg" alt="search" className="w-4 h-4" />
                                    ค้นหารายการ
                                </button>
                            </div>
                        </div>


                        {isExpanded && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                <div className="w-[185px]">
                                    <SearchField
                                        label="เลขที่สมัคร"
                                        value={searchData.applicantId}
                                        onChange={(value) => setSearchData({ ...searchData, applicantId: value })}
                                        placeholder="กรุณากรอกข้อมูล"
                                    />
                                </div>

                                <div className="w-[350px]">
                                    <SearchField
                                        label="ชื่อ – นามสกุล ผู้สมัคร"
                                        value={searchData.applicantName}
                                        onChange={(value) => setSearchData({ ...searchData, applicantName: value })}
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
                            <img
                                src="/images/admin/searchBar/download_icon.svg"
                                alt="Download Excel"
                                className="w-4 h-4"
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
                                <img src="/images/admin/preliminaryResult/pass_icon.svg" alt="ผ่าน" className="w-6 h-6" />
                                <span className="text-[#565656] text-lg">
                                    ผ่านการพิจารณาเบื้องต้น <span className="text-[#388E3C]">{summaryData.passed || 0} คน</span>
                                </span>
                            </div>

                            {/* ไม่ผ่าน */}
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <img src="/images/admin/preliminaryResult/fail_icon.svg" alt="ไม่ผ่าน" className="w-6 h-6" />
                                <span className="text-[#565656] text-lg">
                                    ไม่ผ่านการพิจารณาเบื้องต้น <span className="text-[#D92D20]">{summaryData.failed || 0} คน</span>
                                </span>
                            </div>

                            {/* รอพิจารณา */}
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <img src="/images/admin/preliminaryResult/pending_icon.svg" alt="รอพิจารณา" className="w-6 h-6" />
                                <span className="text-[#565656] text-lg">
                                    รอพิจารณาเพิ่มเติม <span className="text-[#DAA520]">{summaryData.pending || 0} คน</span>
                                </span>
                            </div>
                        </div>

                        {/* Loop รายกรรมการ */}
                        {filteredData.map((group, index) => (
                            <div key={index} className="border-t border-gray-200">
                                {/* หัวกรรมการ */}
                                <div className="bg-[#C4C4C4] text-[#333] font-semibold px-6 py-3">
                                    กรรมการหลักสูตร: {group.committeeName}
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
                                                <tr key={a.id} className="border-t">
                                                    <td className="px-4 py-2 truncate">{idx + 1}</td>
                                                    <td className="px-4 py-2 truncate">{a.id}</td>
                                                    <td className="px-4 py-2 truncate">{a.name}</td>
                                                    <td
                                                        className={`px-4 py-2 truncate ${a.result === "ผ่าน"
                                                            ? "text-green-600"
                                                            : a.result === "ไม่ผ่าน"
                                                                ? "text-red-600"
                                                                : "text-yellow-600"
                                                            }`}
                                                    >
                                                        {a.result === "ผ่าน"
                                                            ? "ผ่านการคัดกรอง"
                                                            : a.result === "ไม่ผ่าน"
                                                                ? "ไม่ผ่านการคัดกรอง"
                                                                : "รอพิจารณา"}
                                                    </td>
                                                    <td className="px-4 py-2 truncate">{a.comment || "-"}</td>
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
