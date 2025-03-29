"use client"
import React, { useEffect } from "react";
import EducationLevel from "./education-info/EducationLevel";
import { useLanguage } from "../../hooks/LanguageContext";
import { educationInfoTexts } from "../../translation/educationInfo";
import { BackButton, NextButton } from "../common/button";
import EnglishTestScore from "./education-info/EnglishTestScore";
import MathTestScore from "./education-info/MathTestScore";


const EducationInformation: React.FC = () => {
  const { language } = useLanguage();
  const currentTexts = educationInfoTexts[language as keyof typeof educationInfoTexts] || educationInfoTexts["ENG"];

  useEffect(() => {
      console.log("Fetch 2")
    }, []);

  return (
  <div className="flex flex-col gap-4 pb-10">
    <EducationLevel />
    <EnglishTestScore />
    <MathTestScore />

    {/* ครอบปุ่มให้อยู่แถวเดียวกัน */}
    <div className="flex justify-center mt-6 mb-6 gap-x-4">
        <BackButton>{currentTexts.backButton}</BackButton>
        <NextButton>{currentTexts.nextButton}</NextButton>
      </div>
    </div>
);
};
export default EducationInformation;