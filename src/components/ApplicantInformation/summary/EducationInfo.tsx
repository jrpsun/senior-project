"use client"
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../hooks/LanguageContext";
import { summaryTexts } from "@components/translation/summary";
import EducationLevelSummary from "./Info/educationInfo/EducationLevelSummary"; // นำเข้า EducationLevelSummary
import EnglishTestScoreSummary from "./Info/educationInfo/EnglishTestScoreSummary"; // นำเข้า EnglishTestScoreSummary
import MathTestScoreSummary from "./Info/educationInfo/MathTestScoreSummary";
import { ApplicantEducationResponse, EducationBackground, EducationEngExam, EducationMathExam } from "@components/types/educationInfoType";
import { authFetch } from "@components/lib/auth";

const EducationInfo = ({appId, admId}: any) => {
    const { language } = useLanguage();
    const texts = summaryTexts[language] || summaryTexts["ENG"];
    const [eduData, setEduData] = useState<ApplicantEducationResponse | null>(null);
    const [isVisible, setIsVisible] = useState(false)

    const formatDate = (dateStr?: string) =>
        dateStr ? new Date(dateStr).toISOString().split("T")[0] : "";

    const fetchEducationData = async () => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/education/${appId}/${admId}`, {
            method: 'GET',
        });
        if (!response.ok) throw new Error("Failed to fetch education data");
        const result = await response.json();
          const parsedData = {
            background: {
                ...result.background,
                graduateDate: formatDate(result?.background?.graduateDate),
            },
            eng_exam: {
                ...result.eng_exam,
                enExamDate: formatDate(result?.eng_exam?.enExamDate),
            },
            math_exam: {
                ...result.math_exam,
                mathExamDate: formatDate(result?.math_exam?.mathExamDate),
            }
        };
        setEduData(parsedData)
    }

    useEffect(() => {
        if (appId && admId) {
            fetchEducationData();
        }
    },[appId, admId])

    
    return (
        <div className="space-y-6">
            <div className="mb-4 bg-[#008A90] text-white text-[22px] md:text-[22px] font-medium py-3 px-6 rounded-lg w-full">
                {texts.educationInfo}
            </div>

            <EducationLevelSummary
                props={eduData?.background as EducationBackground}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                setReport={null}
            />

            {/* แสดงผลคะแนนสอบภาษาอังกฤษ  */}
            <EnglishTestScoreSummary
                props={eduData?.eng_exam as EducationEngExam}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            />
            
            {/* แสดงผลคะแนนสอบคณิตศาสตร์ */}
            <MathTestScoreSummary
                props={eduData?.math_exam as EducationMathExam}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            />
            
        </div>
    );
};

export default EducationInfo;
