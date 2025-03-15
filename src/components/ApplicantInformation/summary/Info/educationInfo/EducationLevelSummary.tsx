import React from "react";
import { useLanguage } from "../../../../../hooks/LanguageContext"; // ใช้ context เพื่อดึงค่าภาษา
import { educationInfoTexts } from "../../../../../translation/educationInfo";

interface EducationLevelSummaryProps {
    currentStatus: "Studying" | "Graduated";
    transcriptFile?: string;
    transcriptSize?: string;
    program?: string;
    degree: string;
    customDegree?: string;
    country: string;
    province?: string;
    school: string;
    major: string;
    customMajor?: string;
    gpa?: string;
    gpaMath?: string;
    gpaEnglish?: string;
    gpaScience?: string;
    mathScore?: string;
    scienceScore?: string;
    socialStudiesScore?: string;
    languageArtsScore?: string;

    mathTotalCredit?: string;
    scienceTotalCredit?: string;
    englishTotalCredit?: string;
    computerTotalCredit?: string;


    mathSubject?: string;
    scienceSubject?: string;
    englishSubject?: string;
    computerSubject?: string;

    graduationYear?: string;
    graduationDate?: string;
}

const EducationLevelSummary: React.FC<EducationLevelSummaryProps> = ({
    currentStatus,
    transcriptFile,
    transcriptSize,
    program,
    degree,
    customDegree,
    country,
    province,
    school,
    major,
    customMajor,
    gpa,
    gpaMath,
    gpaEnglish,
    gpaScience,
    mathScore,
    scienceScore,
    socialStudiesScore,
    languageArtsScore,
    mathTotalCredit,
    scienceTotalCredit,
    englishTotalCredit,
    computerTotalCredit,
    mathSubject,
    scienceSubject,
    englishSubject,
    computerSubject,
    graduationYear,
    graduationDate,
}) => {
    const { language } = useLanguage();
    const texts = educationInfoTexts[language] || educationInfoTexts["ENG"]; // ใช้ ENG เป็นค่าเริ่มต้น

    const isGED = degree === "GED";
    return (
        <div className="flex justify-center py-5 bg-[white]">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
                    {/* หัวข้อ Education Level */}
                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6">{texts.titleEducation}</h2>

                    {/* สถานะการศึกษา */}
                    <div className="mb-4">
                        <p className="text-[#565656] font-bold">{texts.currentStatus}</p>
                        <p className="text-[#565656] text-left pl-6">{currentStatus === "Studying" ? texts.studyingStatus : texts.graduatedStatus}</p>
                    </div>

                    {/* Transcript */}
                    {transcriptFile && (
                        <div className="mb-4">
                            <h3 className="text-[#565656] font-semibold mb-2">{texts.transcript}</h3>
                            <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-4 shadow-sm">
                                <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                                <div className="flex flex-col max-w-full">
                                    <a
                                        href={transcriptFile}
                                        download
                                        className="text-[#008A90] font-medium hover:underline truncate max-w-[250px] md:max-w-[400px] inline-block"
                                        title={transcriptFile.split("/").pop()}
                                    >
                                        {transcriptFile.split("/").pop()}
                                    </a>
                                    {transcriptSize && <span className="text-gray-500 text-xs md:text-sm">{transcriptSize}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ข้อมูลการศึกษา */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-6">

                        {/* ระดับการศึกษา */}
                        <div className="col-span-1 md:col-span-2">
                            <p className="text-[#565656] font-bold">{texts.degree}</p>
                            <p className="text-[#565656] text-left pl-6">{degree === "other" ? customDegree : degree}</p>
                        </div>

                        {/* ประเทศที่ศึกษา */}
                        {!isGED && (
                            <div className="col-span-1 md:col-span-2">
                                <p className="text-[#565656] font-bold">{texts.country}</p>
                                <p className="text-[#565656] text-left pl-6">{country}</p>
                            </div>
                        )}

                        {/* จังหวัดที่ศึกษา (เฉพาะประเทศไทย) */}
                        {!isGED && country === "ไทย" && province && (
                            <div className="col-span-1">
                                <p className="text-[#565656] font-bold">{texts.province}</p>
                                <p className="text-[#565656] text-left pl-6">{province}</p>
                            </div>
                        )}

                        {/* ชื่อโรงเรียน และ สาขาวิชา / แผนการเรียน */}
                        {!isGED && (
                            <>
                                <div className="col-span-1">
                                    <p className="text-[#565656] font-bold">{texts.school}</p>
                                    <p className="text-[#565656] text-left pl-6">{school}</p>
                                </div>
                                <div className="col-span-1">
                                    <p className="text-[#565656] font-bold">{texts.major}</p>
                                    <p className="text-[#565656] text-left pl-6">{major === "other" ? customMajor : major}</p>
                                </div>
                            </>
                        )}

                        {/* ปีที่จบการศึกษา (เฉพาะ GED / Grade12/13) */}
                        {["GED", "Grade12/13", "other"].includes(degree) && graduationYear && (
                            <div className="col-span-1">
                                <p className="text-[#565656] font-bold">{texts.graduationYear}</p>
                                <p className="text-[#565656] text-left pl-6">{degree === "other" ? customDegree : graduationYear}</p>
                            </div>
                        )}

                        {/* วันที่จบการศึกษา (เฉพาะ ม.6 และ ปวช.) */}
                        {["Mathayom6", "VocCert"].includes(degree) && graduationDate && (
                            <div className="col-span-1">
                                <p className="text-[#565656] font-bold">{texts.graduationDate}</p>
                                <p className="text-[#565656] text-left pl-6">{graduationDate}</p>
                            </div>
                        )}

                        {/* GPAX รวม (เฉพาะ ม.6 และ ปวช.) */}
                        {["Mathayom6", "VocCert"].includes(degree) && gpa && (
                            <div className="col-span-1">
                                <p className="text-[#565656] font-bold">{texts.cumulativeGPA}</p>
                                <p className="text-[#565656] text-left pl-6">{gpa}</p>
                            </div>
                        )}



                        {/* คะแนนวิชาเฉพาะของ GED (ยังคงเดิม) */}
                        {degree === "GED" && (
                            <>
                                {mathScore && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.mathScore}</p>
                                        <p className="text-[#565656] text-left pl-6">{mathScore}</p>
                                    </div>
                                )}
                                {scienceScore && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.scienceScore}</p>
                                        <p className="text-[#565656] text-left pl-6">{scienceScore}</p>
                                    </div>
                                )}
                                {socialStudiesScore && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.socialStudiesScore}</p>
                                        <p className="text-[#565656] text-left pl-6">{socialStudiesScore}</p>
                                    </div>
                                )}
                                {languageArtsScore && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.languageArtsScore}</p>
                                        <p className="text-[#565656] text-left pl-6">{languageArtsScore}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* แสดงเกรดเฉลี่ยแยกวิชา (Math, Science, English) เฉพาะ DST */}
                        {degree === "Mathayom6" && program === "DST" && (
                            <>
                                {gpaMath && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.mathematicsGPA}</p>
                                        <p className="text-[#565656] text-left pl-6">{gpaMath}</p>
                                    </div>
                                )}
                                {gpaScience && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.scienceGPA}</p>
                                        <p className="text-[#565656] text-left pl-6">{gpaScience}</p>
                                    </div>
                                )}
                                {gpaEnglish && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.englishGPA}</p>
                                        <p className="text-[#565656] text-left pl-6">{gpaEnglish}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* หน่วยกิตและรายวิชาเฉพาะของ Grade 12/Year 13 */}
                        {degree === "Grade12/13" && (
                            <>
                                {/* วิชาคณิตศาสตร์ */}
                                {(mathTotalCredit || mathSubject) && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.mathSubject}</p>
                                        {mathTotalCredit && (
                                            <p className="text-[#565656] text-left pl-6">{texts.totalCredit}: {mathTotalCredit}</p>
                                        )}
                                        {mathSubject && (
                                            <p className="text-[#565656] text-left pl-6">{texts.subject}: {mathSubject}</p>
                                        )}
                                    </div>
                                )}

                                {/* วิชาวิทยาศาสตร์ */}
                                {(scienceTotalCredit || scienceSubject) && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.scienceSubject}</p>
                                        {scienceTotalCredit && (
                                            <p className="text-[#565656] text-left pl-6">{texts.totalCredit}: {scienceTotalCredit}</p>
                                        )}
                                        {scienceSubject && (
                                            <p className="text-[#565656] text-left pl-6">{texts.subject}: {scienceSubject}</p>
                                        )}
                                    </div>
                                )}

                                {/* วิชาภาษาอังกฤษ */}
                                {(englishTotalCredit || englishSubject) && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.englishSubject}</p>
                                        {englishTotalCredit && (
                                            <p className="text-[#565656] text-left pl-6">{texts.totalCredit}: {englishTotalCredit}</p>
                                        )}
                                        {englishSubject && (
                                            <p className="text-[#565656] text-left pl-6">{texts.subject}: {englishSubject}</p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* หน่วยกิตและรายวิชาเฉพาะของ VocCert (ปวช.) */}
                        {degree === "VocCert" && (
                            <>
                                {(computerTotalCredit || computerSubject) && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.ComputerScienceSubject}</p>
                                        {computerTotalCredit && (
                                            <p className="text-[#565656] text-left pl-6">{texts.totalCredit}: {computerTotalCredit}</p>
                                        )}
                                        {computerSubject && (
                                            <p className="text-[#565656] text-left pl-6">{texts.subject}: {computerSubject}</p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationLevelSummary;
