import React from "react";
import { useLanguage } from "../../../hooks/LanguageContext";
import { summaryTexts } from "@components/translation/summary";
import EducationLevelSummary from "./Info/educationInfo/EducationLevelSummary"; // นำเข้า EducationLevelSummary
import EnglishTestScoreSummary from "./Info/educationInfo/EnglishTestScoreSummary"; // นำเข้า EnglishTestScoreSummary
import MathTestScoreSummary from "./Info/educationInfo/MathTestScoreSummary";

const EducationInfo = () => {
    const { language } = useLanguage();
    const texts = summaryTexts[language] || summaryTexts["ENG"];

    return (
        <div className="space-y-6">
            <div className="mb-4 bg-[#008A90] text-white text-[22px] md:text-[22px] font-medium py-3 px-6 rounded-lg w-full">
                {texts.educationInfo}
            </div>

            <EducationLevelSummary
                currentStatus="Studying"
                transcriptFile="/path/to/Transcript_Test_Raboobsamak.pdf"
                transcriptSize="676 KB"
                degree="Mathayom6"
                country="ไทย"
                province="กรุงเทพมหานคร"
                school="ทวีธาภิเษก"
                major="Science-Math"
                gpa="3.33"
            />

            {/* แสดงผลคะแนนสอบภาษาอังกฤษ 
            <EnglishTestScoreSummary
                testType="IELTS"
                score="7.5"
                testDate="04/05/2024"
                document="/path/to/IELTS_Test_Score.pdf"
                documentSize="768 KB"
                listeningScore="8.0"
                readingScore="7.0"
                writingScore="6.5"
                speakingScore="7.5"
            />
             */}
            {/* แสดงผลคะแนนสอบคณิตศาสตร์
            <MathTestScoreSummary
                testType="SAT (Math)"
                score="700"
                testDate="24/05/2024"
                document="/path/to/SAT_Math_Test_Score.pdf"
                documentSize="512 KB"
            />
             */}
        </div>
    );
};

export default EducationInfo;
