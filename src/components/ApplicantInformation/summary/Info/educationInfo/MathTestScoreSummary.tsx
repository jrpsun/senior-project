import React from "react";
import { useLanguage } from "../../../../../hooks/LanguageContext";
import { educationInfoTexts } from "../../../../../translation/educationInfo";
import { EducationMathExam } from "@components/types/educationInfoType";

// interface MathTestScoreSummaryProps {
//     testType?: string;
//     score?: string;
//     testDate?: string;
//     document?: string;
//     documentSize?: string;
// }

interface MathTestScoreSummaryProps {
    props: EducationMathExam;
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
}


const MathTestScoreSummary: React.FC<MathTestScoreSummaryProps> = ({
    props, isVisible, setIsVisible
}) => {
    const { language } = useLanguage();
    const texts = educationInfoTexts[language] || educationInfoTexts["ENG"];

    if (!props?.mathType) return null; // ถ้าไม่มีประเภทคะแนนสอบ ไม่ต้องแสดงอะไร

    return (
        <div className="flex justify-center py-5 bg-white">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
                    {/* หัวข้อ Math Test Score */}
                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
                        {texts.mathProficiencyTestScore}
                    </h2>

                    {/* อัปโหลดไฟล์ผลสอบ */}
                    {props?.mathCerName && (
                        <div className="mt-4">
                            <p className="text-[#565656] font-bold">{texts.uploadMathTestScore}</p>
                            <a href={props?.mathCer}
                                download
                                className="text-[#008A90] font-medium hover:underline">
                                {props?.mathCerName}
                            </a>
                            {props?.mathCerSize && <span className="text-gray-500 text-sm ml-2">{props?.mathCerSize}</span>}
                        </div>
                    )}

                    {/* ประเภทการสอบ */}
                    <div className="mb-4">
                        <p className="text-[#565656] font-bold">{texts.mathTestType}</p>
                        <p className="text-gray-900">{props?.mathType}</p>
                    </div>

                    {/* วันที่สอบ */}
                    {props?.mathExamDate && (
                        <div className="mb-4">
                            <p className="text-[#565656] font-bold">{texts.testDate}</p>
                            <p className="text-gray-900">{props?.mathExamDate}</p>
                        </div>
                    )}

                    {/* คะแนนสอบ */}
                    {props?.mathScore && (
                        <div className="mb-4">
                            <p className="text-[#565656] font-bold">{texts.score}</p>
                            <p className="text-gray-900">{props?.mathScore}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MathTestScoreSummary;
