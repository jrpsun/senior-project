import React from "react";
import EducationLevel from "./education-info/EducationLevel";
import { useLanguage } from "../../hooks/LanguageContext";
import { educationInfoTexts } from "../../translation/educationInfo";
import Button from "../common/button";
import EnglishTestScore from "./education-info/EnglishTestScore";
import MathTestScore from "./education-info/MathTestScore";


const EducationInformation: React.FC = () => {
  const { language } = useLanguage();
  const currentTexts = educationInfoTexts[language as keyof typeof educationInfoTexts] || educationInfoTexts["ENG"];

  return (
  <div className="flex flex-col gap-4 pb-10">
    <EducationLevel />
    <EnglishTestScore />
    <MathTestScore />

    {/* ครอบปุ่มให้อยู่แถวเดียวกัน */}
    <div className="flex justify-center mt-20 gap-x-4">
      {/* ปุ่มย้อนกลับ */}
      <Button variant="back" icon="/images/back_arrow.svg">
        {currentTexts.backButton}
      </Button>

      {/* ปุ่มถัดไป */}
      <Button variant="next" icon="/images/next_arrow.svg">
        {currentTexts.nextButton}
      </Button>
    </div>
  </div>
);
};

export default EducationInformation;
