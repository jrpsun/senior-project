import React from "react";
import { useLanguage } from "../../../../../hooks/LanguageContext";
import { educationInfoTexts } from "../../../../../translation/educationInfo";
import { EducationEngExam } from "@components/types/educationInfoType";

// interface EnglishTestScoreSummaryProps {
//     testType?: string;
//     score?: string;
//     testDate?: string;
//     document?: string;
//     documentSize?:string;
//     listeningScore?: string;
//     readingScore?: string;
//     writingScore?: string;
//     speakingScore?: string;
//     literacyScore?: string;
//     comprehensionScore?: string;
//     conversationScore?: string;
//     productionScore?: string;
//     listeningComprehensionScore?: string;
//     structureWrittenScore?: string;
//     readingComprehensionScore?: string;
// }

interface EnglishTestScoreSummaryProps {
    props: EducationEngExam;
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
}


const EnglishTestScoreSummary: React.FC<EnglishTestScoreSummaryProps> = ({
    props, isVisible, setIsVisible
}) => {
    const { language } = useLanguage();
    const texts = educationInfoTexts[language] || educationInfoTexts["ENG"];

    if (!props?.examType) return null; // ถ้าไม่มีประเภทคะแนนสอบ ไม่ต้องแสดงอะไร

    return (
        <div className="flex justify-center py-5 bg-[white]">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6">{texts.englishProficiencyTestScore}</h2>
                    {/* อัปโหลดไฟล์ผลสอบ */}
                    {document && (
                        <div className="mt-4">
                            <p className="text-[#565656] font-bold">{texts.uploadEngTestScore}</p>
                            <a href={props?.enCer}
                                download 
                                className="text-[#008A90] font-medium hover:underline">
                                {props?.enCerName}
                            </a>
                            {props?.enCerSize && <span className="text-gray-500 text-sm ml-2">{props?.enCerSize}</span>}
                        </div>
                    )}

                    {/* ประเภทคะแนนสอบ */}
                    <div className="mb-4">
                        <p className="text-[#565656] font-bold">{texts.englishTestType}</p>
                        <p className="text-gray-900">{props?.examType}</p>
                    </div>


                    {/* วันที่สอบ */}
                    {props?.enExamDate && (
                        <div className="mb-4">
                            <p className="text-[#565656] font-bold">{texts.testDate}</p>
                            <p className="text-gray-900">{props?.enExamDate}</p>
                        </div>
                    )}

                    {/* คะแนนสอบทั่วไป */}
                    {props?.enScore && (
                        <div className="mb-4">
                            <p className="text-[#565656] font-bold">{texts.score}</p>
                            <p className="text-gray-900">{props?.enScore}</p>
                        </div>
                    )}

                    {/* IELTS / TOEFL iBT */}
                    {(["IELTS", "TOEFL_IBT"].includes(props?.examType)) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {props?.listening && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.listeningScore}</p>
                                    <p className="text-gray-900">{props?.listening}</p>
                                </div>
                            )}
                            {props?.reading && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.readingScore}</p>
                                    <p className="text-gray-900">{props?.reading}</p>
                                </div>
                            )}
                            {props?.writing && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.writingScore}</p>
                                    <p className="text-gray-900">{props?.writing}</p>
                                </div>
                            )}
                            {props?.speaking && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.speakingScore}</p>
                                    <p className="text-gray-900">{props?.speaking}</p>
                                </div>
                            )}
                        </div>
                    )}
                     {/* Duolinguo */}
                    {props?.examType === "Duolingo" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {props?.literacy && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.literacyScore}</p>
                                    <p className="text-gray-900">{props?.literacy}</p>
                                </div>
                            )}
                            {props?.comprehension && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.comprehensionScore}</p>
                                    <p className="text-gray-900">{props?.comprehension}</p>
                                </div>
                            )}
                            {props?.conversation && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.conversationScore}</p>
                                    <p className="text-gray-900">{props?.conversation}</p>
                                </div>
                            )}
                            {props?.production && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.productionScore}</p>
                                    <p className="text-gray-900">{props?.production}</p>
                                </div>
                            )}
                        </div>
                    )}
               {/* Toefl ITP & IELT_PBT */}
                    {["TOEFL_ITP", "TOEFL_PBT"].includes(props?.examType) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {props?.listeningComprehensionScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.listeningComprehensionScore}</p>
                                    <p className="text-gray-900">{props?.listeningComprehensionScore}</p>
                                </div>
                            )}
                            {props?.structureWrittenScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.structureWrittenScore}</p>
                                    <p className="text-gray-900">{props?.structureWrittenScore}</p>
                                </div>
                            )}
                            {props?.readingComprehensionScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.readingComprehensionScore}</p>
                                    <p className="text-gray-900">{props?.readingComprehensionScore}</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default EnglishTestScoreSummary;