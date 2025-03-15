import React from "react";
import { useLanguage } from "../../../../../hooks/LanguageContext";
import { educationInfoTexts } from "../../../../../translation/educationInfo";

interface EnglishTestScoreSummaryProps {
    testType?: string;
    score?: string;
    testDate?: string;
    document?: string;
    documentSize?:string;
    listeningScore?: string;
    readingScore?: string;
    writingScore?: string;
    speakingScore?: string;
    literacyScore?: string;
    comprehensionScore?: string;
    conversationScore?: string;
    productionScore?: string;
    listeningComprehensionScore?: string;
    structureWrittenScore?: string;
    readingComprehensionScore?: string;
}

const EnglishTestScoreSummary: React.FC<EnglishTestScoreSummaryProps> = ({
    testType,
    score,
    testDate,
    document,
    documentSize,
    listeningScore,
    readingScore,
    writingScore,
    speakingScore,
    literacyScore,
    comprehensionScore,
    conversationScore,
    productionScore,
    listeningComprehensionScore,
    structureWrittenScore,
    readingComprehensionScore,
}) => {
    const { language } = useLanguage();
    const texts = educationInfoTexts[language] || educationInfoTexts["ENG"];

    if (!testType) return null; // ถ้าไม่มีประเภทคะแนนสอบ ไม่ต้องแสดงอะไร

    return (
        <div className="flex justify-center py-5 bg-[white]">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6">{texts.englishProficiencyTestScore}</h2>
                    {/* อัปโหลดไฟล์ผลสอบ */}
                    {document && (
                        <div className="mt-4">
                            <p className="text-[#565656] font-bold">{texts.uploadEngTestScore}</p>
                            <a href={document} download className="text-[#008A90] font-medium hover:underline">
                                {document.split("/").pop()}
                            </a>
                            {documentSize && <span className="text-gray-500 text-sm ml-2">{documentSize}</span>}
                        </div>
                    )}

                    {/* ประเภทคะแนนสอบ */}
                    <div className="mb-4">
                        <p className="text-[#565656] font-bold">{texts.englishTestType}</p>
                        <p className="text-gray-900">{testType}</p>
                    </div>


                    {/* วันที่สอบ */}
                    {testDate && (
                        <div className="mb-4">
                            <p className="text-[#565656] font-bold">{texts.testDate}</p>
                            <p className="text-gray-900">{testDate}</p>
                        </div>
                    )}

                    {/* คะแนนสอบทั่วไป */}
                    {score && (
                        <div className="mb-4">
                            <p className="text-[#565656] font-bold">{texts.score}</p>
                            <p className="text-gray-900">{score}</p>
                        </div>
                    )}

                    {/* IELTS / TOEFL iBT */}
                    {(["IELTS", "TOEFL_IBT"].includes(testType)) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {listeningScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.listeningScore}</p>
                                    <p className="text-gray-900">{listeningScore}</p>
                                </div>
                            )}
                            {readingScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.readingScore}</p>
                                    <p className="text-gray-900">{readingScore}</p>
                                </div>
                            )}
                            {writingScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.writingScore}</p>
                                    <p className="text-gray-900">{writingScore}</p>
                                </div>
                            )}
                            {speakingScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.speakingScore}</p>
                                    <p className="text-gray-900">{speakingScore}</p>
                                </div>
                            )}
                        </div>
                    )}
                     {/* Duolinguo */}
                    {testType === "Duolingo" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {literacyScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.literacyScore}</p>
                                    <p className="text-gray-900">{literacyScore}</p>
                                </div>
                            )}
                            {comprehensionScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.comprehensionScore}</p>
                                    <p className="text-gray-900">{comprehensionScore}</p>
                                </div>
                            )}
                            {conversationScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.conversationScore}</p>
                                    <p className="text-gray-900">{conversationScore}</p>
                                </div>
                            )}
                            {productionScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.productionScore}</p>
                                    <p className="text-gray-900">{productionScore}</p>
                                </div>
                            )}
                        </div>
                    )}
               {/* Toefl ITP & IELT_PBT */}
                    {["TOEFL_ITP", "TOEFL_PBT"].includes(testType) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {listeningComprehensionScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.listeningComprehensionScore}</p>
                                    <p className="text-gray-900">{listeningComprehensionScore}</p>
                                </div>
                            )}
                            {structureWrittenScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.structureWrittenScore}</p>
                                    <p className="text-gray-900">{structureWrittenScore}</p>
                                </div>
                            )}
                            {readingComprehensionScore && (
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.readingComprehensionScore}</p>
                                    <p className="text-gray-900">{readingComprehensionScore}</p>
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