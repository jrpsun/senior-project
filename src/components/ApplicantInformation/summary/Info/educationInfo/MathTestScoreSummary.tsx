import React from "react";
import { useLanguage } from "../../../../../hooks/LanguageContext";
import { educationInfoTexts } from "../../../../../translation/educationInfo";

interface MathTestScoreSummaryProps {
    testType?: string;
    score?: string;
    testDate?: string;
    document?: string;
    documentSize?: string;
}

const MathTestScoreSummary: React.FC<MathTestScoreSummaryProps> = ({
    testType,
    score,
    testDate,
    document,
    documentSize,
}) => {
    const { language } = useLanguage();
    const texts = educationInfoTexts[language] || educationInfoTexts["ENG"];

    if (!testType) return null; // ถ้าไม่มีประเภทคะแนนสอบ ไม่ต้องแสดงอะไร

    return (
        <div className="flex justify-center py-5 bg-white">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
                    {/* หัวข้อ Math Test Score */}
                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
                        {texts.mathProficiencyTestScore}
                    </h2>

                    {/* อัปโหลดไฟล์ผลสอบ */}
                    {document && (
                        <div className="mt-4">
                            <p className="text-[#565656] font-bold">{texts.uploadMathTestScore}</p>
                            <a href={document} download className="text-[#008A90] font-medium hover:underline">
                                {document.split("/").pop()}
                            </a>
                            {documentSize && <span className="text-gray-500 text-sm ml-2">{documentSize}</span>}
                        </div>
                    )}

                    {/* ประเภทการสอบ */}
                    <div className="mb-4">
                        <p className="text-[#565656] font-bold">{texts.mathTestType}</p>
                        <p className="text-gray-900">{testType}</p>
                    </div>

                    {/* วันที่สอบ */}
                    {testDate && (
                        <div className="mb-4">
                            <p className="text-[#565656] font-bold">{texts.testDate}</p>
                            <p className="text-gray-900">{testDate}</p>
                        </div>
                    )}

                    {/* คะแนนสอบ */}
                    {score && (
                        <div className="mb-4">
                            <p className="text-[#565656] font-bold">{texts.score}</p>
                            <p className="text-gray-900">{score}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MathTestScoreSummary;
