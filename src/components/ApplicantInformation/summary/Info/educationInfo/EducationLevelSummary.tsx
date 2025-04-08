import React from "react";
import { useLanguage } from "../../../../../hooks/LanguageContext"; // ใช้ context เพื่อดึงค่าภาษา
import { educationInfoTexts } from "../../../../../translation/educationInfo";
import ReportProb from "@components/components/common/admin/reportProb";
import { EducationBackground } from "@components/types/educationInfoType";

// interface EducationLevelSummaryProps {
//     currentStatus: "Studying" | "Graduated";
//     transcriptFile?: string;
//     transcriptSize?: string;
//     program?: string;
//     degree: string;
//     customDegree?: string;
//     country: string;
//     province?: string;
//     school: string;
//     major: string;
//     customMajor?: string;
//     gpa?: string;
//     gpaMath?: string;
//     gpaEnglish?: string;
//     gpaScience?: string;
//     mathScore?: string;
//     scienceScore?: string;
//     socialStudiesScore?: string;
//     languageArtsScore?: string;

//     mathTotalCredit?: string;
//     scienceTotalCredit?: string;
//     englishTotalCredit?: string;
//     computerTotalCredit?: string;


//     mathSubject?: string;
//     scienceSubject?: string;
//     englishSubject?: string;
//     computerSubject?: string;

//     graduationYear?: string;
//     graduationDate?: string;

//     isVisible: boolean;
//     setIsVisible: (value: boolean) => void;
// }

interface EducationBackgroundProps {
    props: EducationBackground;
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
}

const EducationLevelSummary: React.FC<EducationBackgroundProps> = ({
    props, isVisible, setIsVisible
}) => {
    const { language } = useLanguage();
    const texts = educationInfoTexts[language] || educationInfoTexts["ENG"]; // ใช้ ENG เป็นค่าเริ่มต้น
    const program = "DST"

    const isGED = props?.academicType === "GED";
    return (
        <div className="flex justify-center py-5 bg-[white]">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
                    {/* หัวข้อ Education Level */}
                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6">{texts.titleEducation}</h2>

                    {/* สถานะการศึกษา */}
                    <div className="mb-4">
                        <p className="text-[#565656] font-bold">{texts.currentStatus}</p>
                        <p className="text-[#565656] text-left pl-6">{props?.currentStatus === "Studying" ? texts.studyingStatus : texts.graduatedStatus}</p>
                    </div>

                    {/* Transcript */}
                    {props?.docCopyName && (
                        <div className="mb-4">
                            <h3 className="text-[#565656] font-semibold mb-2">{texts.transcript}</h3>
                            <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                            <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-4 shadow-sm">
                                <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                                <div className="flex flex-col max-w-full">
                                    <a
                                        href={props?.docCopyTrans}
                                        download
                                        className="text-[#008A90] font-medium hover:underline truncate max-w-[250px] md:max-w-[400px] inline-block"
                                        title={props?.docCopyName}
                                    >
                                        {props?.docCopyName}
                                    </a>
                                    {props?.docCopySize && <span className="text-gray-500 text-xs md:text-sm">{props?.docCopySize}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ข้อมูลการศึกษา */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-6">

                        {/* ระดับการศึกษา */}
                        <div className="col-span-1 md:col-span-2">
                            <p className="text-[#565656] font-bold">{texts.degree}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.academicType === "other" ? props?.customAcademicType : props?.academicType}</p>
                        </div>

                        {/* ประเทศที่ศึกษา */}
                        {!isGED && (
                            <div className="col-span-1 md:col-span-2">
                                <p className="text-[#565656] font-bold">{texts.country}</p>
                                <p className="text-[#565656] text-left pl-6">{props?.academicCountry}</p>
                            </div>
                        )}

                        {/* จังหวัดที่ศึกษา (เฉพาะประเทศไทย) */}
                        {!isGED && props?.academicCountry === "ไทย" && props?.academicProvince && (
                            <div className="col-span-1">
                                <p className="text-[#565656] font-bold">{texts.province}</p>
                                <p className="text-[#565656] text-left pl-6">{props?.academicProvince}</p>
                            </div>
                        )}

                        {/* ชื่อโรงเรียน และ สาขาวิชา / แผนการเรียน */}
                        {!isGED && (
                            <>
                                <div className="col-span-1">
                                    <p className="text-[#565656] font-bold">{texts.school}</p>
                                    <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                                    <p className="text-[#565656] text-left pl-6">{props?.schoolName}</p>
                                </div>
                                <div className="col-span-1">
                                    <p className="text-[#565656] font-bold">{texts.major}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.studyPlan === "other" ? props?.customStudyPlan : props?.studyPlan}</p>
                                </div>
                            </>
                        )}

                        {/* ปีที่จบการศึกษา (เฉพาะ GED / Grade12/13) */}
                        {["GED", "Grade12/13", "other"].includes(props?.academicType || "") && props?.graduateYear && (
                            <div className="col-span-1">
                                <p className="text-[#565656] font-bold">{texts.graduationYear}</p>
                                <p className="text-[#565656] text-left pl-6">{props?.academicType === "other" ? props?.customAcademicType : props?.graduateYear}</p>
                            </div>
                        )}

                        {/* วันที่จบการศึกษา (เฉพาะ ม.6 และ ปวช.) */}
                        {["Mathayom6", "VocCert"].includes(props?.academicType || "") && props?.graduateDate && (
                            <div className="col-span-1">
                                <p className="text-[#565656] font-bold">{texts.graduationDate}</p>
                                <p className="text-[#565656] text-left pl-6">{props?.graduateDate}</p>
                            </div>
                        )}

                        {/* GPAX รวม (เฉพาะ ม.6 และ ปวช.) */}
                        {["Mathayom6", "VocCert"].includes(props?.academicType || "") && props?.cumulativeGPA && (
                            <div className="col-span-1">
                                <p className="text-[#565656] font-bold">{texts.cumulativeGPA}</p>
                                <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                                <p className="text-[#565656] text-left pl-6">{props?.cumulativeGPA}</p>
                            </div>
                        )}



                        {/* คะแนนวิชาเฉพาะของ GED (ยังคงเดิม) */}
                        {props?.academicType === "GED" && (
                            <>
                                {props?.gedMathematics && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.mathScore}</p>
                                        <p className="text-[#565656] text-left pl-6">{props?.gedMathematics}</p>
                                    </div>
                                )}
                                {props?.gedScience && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.scienceScore}</p>
                                        <p className="text-[#565656] text-left pl-6">{props?.gedScience}</p>
                                    </div>
                                )}
                                {props?.gedSocialStudies && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.socialStudiesScore}</p>
                                        <p className="text-[#565656] text-left pl-6">{props?.gedSocialStudies}</p>
                                    </div>
                                )}
                                {props?.gedLanguageArts && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.languageArtsScore}</p>
                                        <p className="text-[#565656] text-left pl-6">{props?.gedLanguageArts}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* แสดงเกรดเฉลี่ยแยกวิชา (Math, Science, English) เฉพาะ DST */}
                        {props?.academicType === "Mathayom6" && program === "DST" && (
                            <>
                                {props?.dstMathematics && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.mathematicsGPA}</p>
                                        <p className="text-[#565656] text-left pl-6">{props?.dstMathematics}</p>
                                    </div>
                                )}
                                {props?.dstScitech && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.scienceGPA}</p>
                                        <p className="text-[#565656] text-left pl-6">{props?.dstScitech}</p>
                                    </div>
                                )}
                                {props?.dstEnglish && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.englishGPA}</p>
                                        <p className="text-[#565656] text-left pl-6">{props?.dstEnglish}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* หน่วยกิตและรายวิชาเฉพาะของ Grade 12/Year 13 */}
                        {props?.academicType === "Grade12/13" && (
                            <>
                                {/* วิชาคณิตศาสตร์ */}
                                {(props?.g12MathCredit || props?.g12MathTitle) && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.mathSubject}</p>
                                        {props?.g12MathCredit && (
                                            <p className="text-[#565656] text-left pl-6">{texts.totalCredit}: {props?.g12MathCredit}</p>
                                        )}
                                        {props?.g12MathTitle && (
                                            <p className="text-[#565656] text-left pl-6">{texts.subject}: {props?.g12MathTitle}</p>
                                        )}
                                    </div>
                                )}

                                {/* วิชาวิทยาศาสตร์ */}
                                {(props?.g12SciCredit || props?.g12SciTitle) && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.scienceSubject}</p>
                                        {props?.g12SciCredit && (
                                            <p className="text-[#565656] text-left pl-6">{texts.totalCredit}: {props?.g12SciCredit}</p>
                                        )}
                                        {props?.g12SciTitle && (
                                            <p className="text-[#565656] text-left pl-6">{texts.subject}: {props?.g12SciTitle}</p>
                                        )}
                                    </div>
                                )}

                                {/* วิชาภาษาอังกฤษ */}
                                {(props?.g12EnCredit || props?.g12EnTitle) && (
                                    <div>
                                        <p className="text-[#565656] font-bold">{texts.englishSubject}</p>
                                        {props?.g12EnCredit && (
                                            <p className="text-[#565656] text-left pl-6">{texts.totalCredit}: {props?.g12EnCredit}</p>
                                        )}
                                        {props?.g12EnTitle && (
                                            <p className="text-[#565656] text-left pl-6">{texts.subject}: {props?.g12EnTitle}</p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* หน่วยกิตและรายวิชาเฉพาะของ VocCert (ปวช.) */}
                        {/* {props?.academicType === "VocCert" && (
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
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationLevelSummary;
