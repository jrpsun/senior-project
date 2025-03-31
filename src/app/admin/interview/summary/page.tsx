"use client";
import React, { useState, useEffect } from "react";
import SideBar from "../../../../components/SideBar";
import AdminNavbar from "../../../../components/adminNavbar";
import SearchField from "../../../../components/form/searchField";
import Image from "next/image";
import { mockGroupedData, GroupedData } from "@components/data/admin/Interview/summary/mockApplicant";
import ConfirmEvalErrorPopup from "@components/components/common/admin/interview/interviewSummary/ConfirmEvalErrorPopup";
import ConfirmEvaluationPopup from "@components/components/common/admin/interview/interviewSummary/ConfirmEvaluationPopup";

const SummaryResultPage = () => {
    const [filteredData, setFilteredData] = useState(mockGroupedData);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEvaluationConfirmed, setIsEvaluationConfirmed] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    const [searchData, setSearchData] = useState({
        course: "",
        round: "",
        committee: "ทั้งหมด",
        result: "ทั้งหมด",
        interviewer: "ทั้งหมด",
        room: "ทั้งหมด",
        applicantId: "",
        applicantName: "",
    });

    interface SummaryData {
        passed: number;
        failed: number;
        pending: number;
        notInterview: number;
        waitingEval: number;
        totalAverage?: number;
        englishAverage?: number;
        personalityAverage?: number;
        intentionAverage?: number;
        computerAverage?: number;
    }

    const [summaryData, setSummaryData] = useState<SummaryData>({
        passed: 0,
        failed: 0,
        pending: 0,
        notInterview: 0,
        waitingEval: 0,
    });

    const [showConfirmErrorPopup, setShowConfirmErrorPopup] = useState(false);
    // กดปุ่มครั้งแรก — แค่เปิด popup ยืนยันก่อน
    const handleOpenConfirmPopup = () => {
        setShowConfirmPopup(true);
    };

    // กดปุ่ม "ยืนยัน" ใน popup
    const handleConfirmEvaluation = () => {
        const hasPendingResult = filteredData.some(group =>
            group.applicants.some(app =>
                app.interviewResult === "รอ" ||
                app.interviewResult === "รอผลการประเมินเพิ่มเติม"
            )
        );

        if (hasPendingResult) {
            setShowConfirmPopup(false); // ปิด popup ยืนยัน
            setShowConfirmErrorPopup(true); // แสดง popup error
        } else {
            setIsEvaluationConfirmed(true);
            setShowConfirmPopup(false);
            console.log("Confirmed evaluation.");
        }
    };

    const calculateSummaryAndUpdateState = (groupedData: GroupedData[]) => {
        const updatedGroupedData = groupedData.map((group: GroupedData) => {
            const passed = group.applicants.filter(a => a.interviewResult === "ผ่าน").length;
            const failed = group.applicants.filter(a => a.interviewResult === "ไม่ผ่าน").length;
            const pending = group.applicants.filter(a => a.interviewResult === "รอ").length;
            const notInterview = group.applicants.filter(a => a.interviewResult === "ไม่มา").length;
            const waitingEval = group.applicants.filter(a => a.interviewResult === "รอผลการประเมินเพิ่มเติม").length;

            const validApplicants = group.applicants.filter(a =>
                typeof a.englishScore === "number" &&
                typeof a.personalityScore === "number" &&
                typeof a.intentionScore === "number" &&
                typeof a.computerScore === "number" &&
                typeof a.totalScore === "number"
            );

            const sum = { english: 0, personality: 0, intention: 0, computer: 0, total: 0 };
            validApplicants.forEach(a => {
                sum.english += a.englishScore!;
                sum.personality += a.personalityScore!;
                sum.intention += a.intentionScore!;
                sum.computer += a.computerScore!;
                sum.total += a.totalScore!;
            });

            const count = validApplicants.length;

            return {
                ...group,
                passed,
                failed,
                pending,
                notInterview,
                waitingEval,
                avgEnglishScore: count ? sum.english / count : undefined,
                avgPersonalityScore: count ? sum.personality / count : undefined,
                avgIntentionScore: count ? sum.intention / count : undefined,
                avgComputerScore: count ? sum.computer / count : undefined,
                averageScore: count ? sum.total / count : undefined,
            };
        });

        // สรุปรวม
        const totalPassed = updatedGroupedData.reduce((acc, g) => acc + g.passed, 0);
        const totalFailed = updatedGroupedData.reduce((acc, g) => acc + g.failed, 0);
        const totalPending = updatedGroupedData.reduce((acc, g) => acc + g.pending, 0);
        const totalNotInterview = updatedGroupedData.reduce((acc, g) => acc + g.notInterview, 0);
        const totalWaitingEval = updatedGroupedData.reduce((acc, g) => acc + g.waitingEval, 0);

        let totalEnglish = 0, totalPersonality = 0, totalIntention = 0, totalComputer = 0, totalOverall = 0, count = 0;
        updatedGroupedData.forEach(g => {
            g.applicants.forEach(a => {
                if (
                    typeof a.englishScore === "number" &&
                    typeof a.personalityScore === "number" &&
                    typeof a.intentionScore === "number" &&
                    typeof a.computerScore === "number" &&
                    typeof a.totalScore === "number"
                ) {
                    totalEnglish += a.englishScore;
                    totalPersonality += a.personalityScore;
                    totalIntention += a.intentionScore;
                    totalComputer += a.computerScore;
                    totalOverall += a.totalScore;
                    count++;
                }
            });
        });

        setFilteredData(updatedGroupedData);
        setSummaryData({
            passed: totalPassed,
            failed: totalFailed,
            pending: totalPending,
            notInterview: totalNotInterview,
            waitingEval: totalWaitingEval,
            totalAverage: count ? totalOverall / count : 0,
            englishAverage: count ? totalEnglish / count : 0,
            personalityAverage: count ? totalPersonality / count : 0,
            intentionAverage: count ? totalIntention / count : 0,
            computerAverage: count ? totalComputer / count : 0,
        });
    };

    useEffect(() => {
        calculateSummaryAndUpdateState(mockGroupedData);
    }, []);

    // ฟังก์ชันค้นหาข้อมูล
    const handleSearch = () => {
        const filtered = mockGroupedData
            .filter(group => {
                const matchCourse =
                    searchData.course === "" || group.course === searchData.course;
                const matchRound =
                    searchData.round === "" || group.round === searchData.round;
                const matchRoom =
                    searchData.room === "ทั้งหมด" || group.room === searchData.room;
                const matchCommittee =
                    searchData.committee === "ทั้งหมด" || group.committeeName.includes(searchData.committee);

                return matchCourse && matchRound && matchRoom && matchCommittee;
            })
            .map(group => {
                const filteredApplicants = group.applicants.filter(applicant => {
                    const matchResult =
                        searchData.result === "ทั้งหมด" || applicant.interviewResult === searchData.result;
                    const matchId =
                        searchData.applicantId === "" || applicant.id.includes(searchData.applicantId);
                    const matchName =
                        searchData.applicantName === "" || applicant.name.includes(searchData.applicantName);
                    const matchInterviewer =
                        searchData.interviewer === "ทั้งหมด" ||
                        group.committeeName.includes(searchData.interviewer);

                    return matchResult && matchId && matchName && matchInterviewer;
                });

                return {
                    ...group,
                    applicants: filteredApplicants,
                };
            })
            .filter(group => group.applicants.length > 0);

        calculateSummaryAndUpdateState(filtered);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <AdminNavbar
                isCollapsed={isCollapsed}
                backToPage={{ href: "/camp", label: "กลับสู่หน้ารายการ" }}
            />

            <div className="flex flex-row flex-1 min-h-screen overflow-hidden">
            <div className="relative z-50">
        <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}  userRole="admin"/>
        </div>

                <main
                    className={`w-full transition-all p-6 mt-[64px] min-h-[calc(100vh-64px)] ${isCollapsed ? "ml-[80px]" : "ml-[300px]"}`}
                >
                    {/* กล่องค้นหา */}
                    <div className="relative max-w-[1600px] w-full mx-auto p-5 rounded-lg shadow-md mb-6 px-4 md:px-8 z-10 mt-5">
                        <h2 className="text-[24px] font-semibold text-[#565656] mb-4">ค้นหาผลการสัมภาษณ์</h2>
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
                                        setSearchData({
                                            ...searchData,
                                            course: typeof option === "object" && option !== null ? option.value : ""
                                        })
                                    }
                                    options={[
                                        { value: "ICT01", label: "ICT01" },
                                        { value: "DST01", label: "DST01" },
                                    ]}
                                    placeholder="เลือกหลักสูตร"
                                />
                            </div>

                            <div className="w-[300px] z-50 relative">
                                <SearchField
                                    label="รอบรับสมัคร"
                                    type="dropdown"
                                    value={searchData.round}
                                    onChange={(option) => setSearchData({
                                        ...searchData,
                                        round: typeof option === "object" && option !== null ? option.value : ""
                                    })}
                                    options={[{ value: "1/68 - ICT Portfolio", label: "1/68 - ICT Portfolio" }]}
                                    placeholder="เลือกรอบรับสมัคร"
                                />
                            </div>
                            <div className="w-[325px] z-[9999] relative">
                                <SearchField
                                    label="สถานะการสัมภาษณ์"
                                    type="dropdown"
                                    value={searchData.result}
                                    onChange={(option) =>
                                        setSearchData({
                                            ...searchData,
                                            result: typeof option === "object" && option !== null && "value" in option ? option.value : ""
                                        })
                                    }
                                    options={[
                                        { value: "ทั้งหมด", label: "แสดงทั้งหมด" },
                                        { value: "ไม่มา", label: "02 - ไม่มาสัมภาษณ์" },
                                        { value: "รอ", label: "03 - รอพิจารณาเพิ่มเติม" },
                                        { value: "ผ่าน", label: "04 - ผ่านการสัมภาษณ์" },
                                        { value: "ไม่ผ่าน", label: "05 - ไม่ผ่านการสัมภาษณ์" },
                                        { value: "รอผลการประเมินเพิ่มเติม", label: "06 - รอผลการประเมินเพิ่มเติม" },
                                    ]}
                                    placeholder="เลือกผลการสัมภาษณ์"
                                />
                            </div>

                            <div className="w-[250px] z-50 relative">
                                <SearchField
                                    label="ห้องสัมภาษณ์"
                                    type="dropdown"
                                    value={searchData.room}
                                    onChange={(option) =>
                                        setSearchData({
                                            ...searchData,
                                            room: typeof option === "object" && option !== null && "value" in option ? option.value : ""
                                        })
                                    }
                                    options={[
                                        { value: "ทั้งหมด", label: "แสดงทั้งหมด" },
                                        { value: "ห้อง IT 123", label: "ห้อง IT 123" },
                                        { value: "ห้อง IT 124", label: "ห้อง IT 124" },
                                        { value: "ห้อง IT 125", label: "ห้อง IT 125" },
                                    ]}
                                    placeholder="เลือกห้องสัมภาษณ์"
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
                                        setSearchData({
                                            course: "",
                                            round: "",
                                            committee: "ทั้งหมด",
                                            result: "ทั้งหมด",
                                            interviewer: "ทั้งหมด",
                                            room: "ทั้งหมด",
                                            applicantId: "",
                                            applicantName: "",
                                        });

                                        calculateSummaryAndUpdateState(mockGroupedData);
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
                            <div className="flex flex-wrap gap-3 mb-4">
                                <div className="w-[185px]">
                                    <SearchField
                                        label="เลขที่สมัคร"
                                        value={searchData.applicantId}
                                        onChange={(value) => setSearchData({ ...searchData, applicantId: typeof value === "string" ? value : "" })}
                                        placeholder="กรุณากรอกข้อมูล"
                                    />
                                </div>

                                <div className="w-[310px]">
                                    <SearchField
                                        label="ชื่อ – นามสกุล ผู้สมัคร"
                                        value={searchData.applicantName}
                                        onChange={(value) => setSearchData({ ...searchData, applicantName: typeof value === "string" ? value : "" })}
                                        placeholder="กรุณากรอกข้อมูล"
                                    />
                                </div>
                                <div className="w-[300px] z-50 relative">
                                    <SearchField
                                        label="กรรมการสัมภาษณ์"
                                        type="dropdown"
                                        value={searchData.interviewer}
                                        onChange={(option) =>
                                            setSearchData({
                                                ...searchData,
                                                interviewer: typeof option === "object" && option !== null && "value" in option ? option.value : ""
                                            })
                                        }
                                        options={[
                                            { value: "ทั้งหมด", label: "แสดงทั้งหมด" },
                                            { value: "อ. วรพงษ์", label: "อ. วรพงษ์" },
                                            { value: "อ. อารดา", label: "อ. อารดา" },
                                            { value: "อ. ชนากานต์", label: "อ. ชนากานต์" },
                                            { value: "อ. จินต์พิชชา", label: "อ. จินต์พิชชา" },
                                            { value: "อ. คชาภา", label: "อ. คชาภา" },
                                            { value: "อ. เจตน์พิภพ", label: "อ. เจตน์พิภพ" },
                                        ]}
                                        placeholder="เลือกกรรมการสัมภาษณ์"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    {/* ปุ่ม Export to Excel */}
                    <div className="max-w-[1600px] mx-auto mb-6 flex flex-wrap justify-start lg:justify-end gap-2">
                        <button
                            className="bg-[#00796B] hover:bg-[#028273] text-white px-4 py-2 rounded-md flex items-center gap-2"
                        >
                            <Image src="/images/admin/searchBar/download_icon.svg" alt="Download Excel" width={16} height={16} />
                            Export to Excel
                        </button>


                        {/* ปุ่มยืนยันผลการประเมิน */}
                        {!isEvaluationConfirmed && (
                            <button
                                onClick={handleOpenConfirmPopup} // ← เปลี่ยนตรงนี้
                                className="bg-white border border-[#008A90] text-[#008A90] px-2.5 py-2 rounded-md flex items-center gap-2"
                            >
                                <Image src="/images/admin/interview/summary/confirm_eval_button.svg" alt="Confirm" width={16} height={16} />
                                ยืนยันผลการสัมภาษณ์
                            </button>
                        )}

                    </div>
                    {/* หัวตารางรวมผลสัมภาษณ์ */}
                    <div className="w-full mx-auto mb-6">
                        <div className="bg-[#EDEFF1] text-[#333] font-semibold text-[20px] px-6 py-2 rounded-t-md">
                            สรุปผลคะแนนรวม
                        </div>
                        {/* แถบสถานะผลสัมภาษณ์ */}
                        {isEvaluationConfirmed ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-[18px] mb-6 mt-6 font-semibold text-[#1D2939]">
                                <div className="flex items-center gap-2">
                                    <Image src="/images/admin/interview/summary/afterConfirm/eval_eligible_icon.svg" alt="ผู้มีสิทธิ์" width={24} height={24} />
                                    ผู้มีสิทธิ์สัมภาษณ์ <span className="text-[#F59E0B]">{summaryData.passed + summaryData.failed + summaryData.notInterview} คน</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image src="/images/admin/interview/summary/afterConfirm/eval_attend_icon.svg" alt="มาสัมภาษณ์" width={24} height={24} />
                                    มาสัมภาษณ์ <span className="text-[#2563EB]">{summaryData.passed + summaryData.failed} คน</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image src="/images/admin/interview/summary/afterConfirm/eval_attend_percent_icon.svg" alt="เปอร์เซ็นต์มาสัมภาษณ์" width={24} height={24} />
                                    เปอร์เซ็นต์มาสัมภาษณ์ <span className="text-[#2563EB]">
                                        {((summaryData.passed + summaryData.failed) / (summaryData.passed + summaryData.failed + summaryData.notInterview) * 100 || 0).toFixed(2)}%
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image src="/images/admin/interview/summary/afterConfirm/eval_passed_icon.svg" alt="ผ่านสัมภาษณ์" width={24} height={24} />
                                    ผ่านสัมภาษณ์ <span className="text-[#15803D]">{summaryData.passed} คน</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image src="/images/admin/interview/summary/afterConfirm/eval_passed_percent_icon.svg" alt="เปอร์เซ็นต์ผ่าน" width={24} height={24} />
                                    เปอร์เซ็นต์ผ่านสัมภาษณ์ <span className="text-[#15803D]">
                                        {((summaryData.passed) / (summaryData.passed + summaryData.failed) * 100 || 0).toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-[18px] mb-6 mt-6">
                                <div className="flex items-center gap-2">
                                    <Image src="/images/admin/interview/summary/beforeConfirm/pass_icon.svg" alt="ผ่าน" width={30} height={30} />
                                    <span className="text-[#1D2939] font-bold">ผ่านสัมภาษณ์</span>
                                    <span className="font-semibold text-green-700">{summaryData.passed} คน</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image src="/images/admin/interview/summary/beforeConfirm/fail_icon.svg" alt="ไม่ผ่าน" width={30} height={30} />
                                    <span className="text-[#1D2939] font-bold">ไม่ผ่านสัมภาษณ์</span>
                                    <span className="font-semibold text-red-600">{summaryData.failed} คน</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image src="/images/admin/interview/summary/beforeConfirm/waiting_icon.svg" alt="รอพิจารณา" width={30} height={30} />
                                    <span className="text-[#1D2939] font-bold">รอพิจารณาเพิ่มเติม</span>
                                    <span className="font-semibold text-yellow-600">{summaryData.pending} คน</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image src="/images/admin/interview/summary/beforeConfirm/wait_eval_icon.svg" alt="รอผลประเมิน" width={25} height={30} />
                                    <span className="text-[#1D2939] font-bold">รอผลการประเมินเพิ่มเติม</span>
                                    <span className="font-semibold text-blue-700">{summaryData.waitingEval || 0} คน</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image src="/images/admin/interview/summary/beforeConfirm/absent_icon.svg" alt="ไม่มาสัมภาษณ์" width={30} height={30} />
                                    <span className="text-[#1D2939] font-bold">ไม่มาสัมภาษณ์</span>
                                    <span className="font-semibold text-gray-600">{summaryData.notInterview || 0} คน</span>
                                </div>
                            </div>
                        )}

                        {/* แถบคะแนนเฉลี่ยรวม */}
                        <div className="border border-black rounded-md px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 text-[#333]">
                            <div className="flex items-center gap-2">
                                <Image src="/images/admin/interview/summary/score/total_score.svg" alt="คะแนนรวม" width={35} height={30} />
                                คะแนนเฉลี่ยรวม: <span className="font-medium">{(summaryData.totalAverage ?? 0).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src="/images/admin/interview/summary/score/eng_score.svg" alt="EN" width={30} height={28} />
                                ภาษาอังกฤษ: {(summaryData.englishAverage ?? 0).toFixed(2)}
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src="/images/admin/interview/summary/score/personality_score.svg" alt="บุคลิกภาพ" width={25} height={28} />
                                บุคลิกภาพ: {(summaryData.personalityAverage ?? 0).toFixed(2)}
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src="/images/admin/interview/summary/score/attention_score.svg" alt="ความตั้งใจเรียน" width={30} height={25} />
                                ความตั้งใจเรียน: {(summaryData.intentionAverage ?? 0).toFixed(2)}
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src="/images/admin/interview/summary/score/computer_score.svg" alt="คอมพิวเตอร์" width={25} height={25} />
                                คอมพิวเตอร์: {(summaryData.computerAverage ?? 0).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* สรุปผลการคัดกรอง */}
                    <div className="flex flex-col gap-6">
                        {filteredData.map((group, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">

                                {/* หัวตาราง */}
                                <div className="bg-[#C4C4C4] px-6 py-3 text-[#333] font-semibold flex flex-wrap gap-x-8">
                                    <div>ห้องสัมภาษณ์: <span className="font-bold">{group.room}</span></div>
                                    <div>กรรมการสัมภาษณ์: {group.committeeName}</div>
                                </div>

                                {/* แถบรวม: คะแนนเฉลี่ย + สรุปผล */}
                                <div className="bg-[#f9f9f9] px-6 py-2 text-[#565656] border rounded-md 
    flex flex-col lg:flex-row lg:flex-wrap-nowrap justify-between items-start gap-y-3 gap-x-4">

                                    {/* แถบสรุปผล - อยู่ซ้าย */}
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 w-full lg:w-1/2 font-bold ">
                                        <div className="flex items-center gap-1">
                                            <span>ผ่าน :</span>
                                            <span className="text-green-600">{group.passed}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>ไม่ผ่าน :</span>
                                            <span className="text-red-600">{group.failed}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>รอพิจารณาเพิ่มเติม :</span>
                                            <span className="text-yellow-600">{group.pending}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>รอผลการประเมินเพิ่มเติม :</span>
                                            <span className="text-[#0D47A1]">{group.waitingEval || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>ไม่มาสัมภาษณ์ :</span>
                                            <span className="text-gray-500">{group.notInterview || 0}</span>
                                        </div>
                                    </div>

                                    {/* แถบคะแนนเฉลี่ย - อยู่ขวา */}
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 w-full lg:w-auto justify-start lg:justify-end text-[#565656]">
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold">คะแนนเฉลี่ยรวม :</span>
                                            <span>{group.averageScore?.toFixed(2) || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold">ภาษาอังกฤษ :</span>
                                            <span>{group.avgEnglishScore?.toFixed(2) || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold">บุคลิกภาพ :</span>
                                            <span>{group.avgPersonalityScore?.toFixed(2) || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold">ความตั้งใจเรียน :</span>
                                            <span>{group.avgIntentionScore?.toFixed(2) || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold">คอมพิวเตอร์ :</span>
                                            <span>{group.avgComputerScore?.toFixed(2) || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ตารางผู้สมัคร */}
                                <div className="overflow-x-auto">
                                <table className="w-full border-t border-gray-200 table-auto min-w-[1000px]">
                                        <thead className="bg-[#F5F5F5] text-[#565656] text-left">
                                            <tr>
                                                <th className="px-2 py-2 w-[50px] text-center whitespace-nowrap">No</th>
                                                <th className="px-2 py-2 w-[100px] whitespace-nowrap">เลขที่สมัคร</th>
                                                <th className="px-2 py-2 w-[170px] whitespace-nowrap">ชื่อ - นามสกุล ผู้สมัคร</th>
                                                <th className="px-2 py-2 w-[100px] whitespace-nowrap">ห้องสัมภาษณ์</th>
                                                <th className="px-2 py-2 w-[130px] whitespace-nowrap">ภาษาอังกฤษ (/10)</th>
                                                <th className="px-2 py-2 w-[120px] whitespace-nowrap">บุคลิกภาพ (/10)</th>
                                                <th className="px-2 py-2 w-[140px] whitespace-nowrap">ความตั้งใจเรียน (/10)</th>
                                                <th className="px-2 py-2 w-[120px] whitespace-nowrap">คอมพิวเตอร์ (/4)</th>
                                                <th className="px-2 py-2 w-[120px] whitespace-nowrap">คะแนนรวม (/34)</th>
                                                <th className="px-2 py-2 w-[160px] text-center whitespace-nowrap">สถานะการสัมภาษณ์</th>
                                                <th className="px-2 py-2 w-[100px] text-center whitespace-nowrap">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.applicants.map((a, idx) => (
                                                <tr key={a.id} className="border-t ">
                                                    <td className="px-2 py-2 text-center whitespace-nowrap">{idx + 1}</td>
                                                    <td className="px-2 py-2">{a.id}</td>
                                                    <td className="px-2 py-2">{a.name}</td>
                                                    <td className="px-2 py-2 text-center">{a.room}</td>
                                                    <td className="px-2 py-2 text-center">{a.englishScore ?? "-"}</td>
                                                    <td className="px-2 py-2 text-center">{a.personalityScore ?? "-"}</td>
                                                    <td className="px-2 py-2 text-center">{a.intentionScore ?? "-"}</td>
                                                    <td className="px-2 py-2 text-center">{a.computerScore ?? "-"}</td>
                                                    <td className="px-2 py-2 text-center">{a.totalScore ?? "-"}</td>
                                                    <td className="px-2 py-2 text-center">
                                                        <div
                                                            className={`h-[30px] w-[180px] flex items-center justify-start rounded-xl whitespace-nowrap mx-auto
      ${a.interviewResult === "ผ่าน" ? "bg-[#E2F5E2] text-[#13522B]" : ""}
      ${a.interviewResult === "ไม่ผ่าน" ? "bg-[#FEE2E2] text-red-600" : ""}
      ${a.interviewResult === "รอ" ? "bg-[#FFF4E2] text-[#DAA520]" : ""}
      ${a.interviewResult === "รอผลการประเมินเพิ่มเติม" ? "bg-[#E0F2FE] text-[#0077B6]" : ""}
      ${a.interviewResult === "ไม่มา" ? "bg-[#EEEEEE] text-[#666666]" : ""}
      ${!["ผ่าน", "ไม่ผ่าน", "รอ", "รอผลการประเมินเพิ่มเติม", "ไม่มา"].includes(a.interviewResult || "") ? "text-[#565656] bg-transparent" : ""}
    `}
                                                        >
                                                            {a.interviewResult === "ผ่าน" && "04 - ผ่านการสัมภาษณ์"}
                                                            {a.interviewResult === "ไม่ผ่าน" && "05 - ไม่ผ่านการสัมภาษณ์"}
                                                            {a.interviewResult === "รอ" && "03 - รอพิจารณาเพิ่มเติม"}
                                                            {a.interviewResult === "รอผลการประเมินเพิ่มเติม" && "03 - รอผลการประเมินเพิ่มเติม"}
                                                            {a.interviewResult === "ไม่มา" && "02 - ไม่มาสัมภาษณ์"}
                                                            {!["ผ่าน", "ไม่ผ่าน", "รอ", "รอผลการประเมินเพิ่มเติม", "ไม่มา"].includes(a.interviewResult || "") &&
                                                                "ยังไม่ระบุผล"}
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-2 text-center max-w-[160px] overflow-hidden">
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
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                    {showConfirmPopup && (
                        <ConfirmEvaluationPopup
                            onCancel={() => setShowConfirmPopup(false)}
                            onConfirm={handleConfirmEvaluation}
                        />
                    )}
                    {showConfirmErrorPopup && (
                        <ConfirmEvalErrorPopup onClose={() => setShowConfirmErrorPopup(false)} />
                    )}

                </main>
            </div>
        </div>
    );
};

export default SummaryResultPage;
