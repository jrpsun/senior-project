"use client";
import AdditionalDocuments from "@components/components/ApplicantInformation/AdditionalDocuments";
import Award from "@components/components/ApplicantInformation/Award";
import EducationInformation from "@components/components/ApplicantInformation/EducationInformation";
import GeneralInformation from "@components/components/ApplicantInformation/GeneralInformation";
import Summary from "@components/components/ApplicantInformation/Summary";
import Training from "@components/components/ApplicantInformation/Training";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../hooks/LanguageContext";
import Popup from "../../../components/common/popup";
import { BackButton, NextButton } from "@components/components/common/button";
import { generalInfoTexts } from "@components/translation/generalInfo";


const ApplicationInfo = () => {
  const { language } = useLanguage();
  const [selected, setSelected] = useState(0);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const currentTexts = generalInfoTexts[language as keyof typeof generalInfoTexts] || generalInfoTexts["ENG"];
  const [editedGeneralData, setEditedGeneralData] = useState({})

  const handleGeneralInfoUpdate = (key: string, updatedData: any) => {
    setEditedGeneralData(prev => ({ ...prev, [key]: updatedData}));
  };

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => setPopupOpen(false);
  
  const contents = [
    <GeneralInformation key="general" onUpdate={handleGeneralInfoUpdate}/>,
    <EducationInformation key="education" />,
    <Award key="award" />,
    <Training key="training" />,
    <AdditionalDocuments key="documents" />,
    <Summary key="summary" onOpenPopup={handleOpenPopup} />,
  ];

  const handleSave = async () => {
    console.log("Saving Combined Changes:", editedGeneralData);
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/applicant/general/0000001`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedGeneralData.generalInfo),
      });

      const result = await response.json()
      if (response.ok) {
        console.log('ข้อมูลถูกอัปเดตเรียบร้อย:', result);
      } else {
        console.error('เกิดข้อผิดพลาด:', result.error);
      }

    } catch (error){
      console.error('เกิดข้อผิดพลาดในการส่งข้อมูล:', error);
    }

  }

  return (
    <div className="bg-[white] min-h-screen">
    <div className="flex flex-col pt-10 pl-[10%] pr-[10%]">
      <div className="text-[30px] leading-[54px] font-semibold text-[#008A91]">
           {language === "TH" ? "ข้อมูลผู้สมัคร" : "Applicant Information"}
        </div>
        <div className="w-full grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-4">
          <button
            className={`flex flex-col md:flex-row border border-[#C4C4C4] p-2 justify-center gap-2 items-center  ${selected === 0 ? "text-[#008A91] font-bold leading-[28px]  min-h-[100px] underline" : "text-[#565656]"}`}
            onClick={() => setSelected(0)}
          >
            
            <div className="text-[24px]">
            {language === "TH" ? "ข้อมูลทั่วไป" : "General Information"}
        </div>
          </button>
          <button
             className={`flex flex-col md:flex-row border border-[#C4C4C4] p-2 justify-center gap-2 items-center  ${selected === 1 ? "text-[#008A91] font-bold leading-[28px] min-h-[100px] underline" : "text-[#565656]"}`}
            onClick={() => setSelected(1)}
          >
            
            <div className="text-[24px]">
            {language === "TH" ? "ข้อมูลการศึกษา" : "Education Information"}
        </div>
          </button>
          <button
             className={`flex flex-col md:flex-row border border-[#C4C4C4] p-2 justify-center gap-2 items-center ${selected === 2 ? "text-[#008A91] font-bold leading-[28px]  min-h-[100px] underline" : "text-[#565656]"}`}
            onClick={() => setSelected(2)}
          >
            
            <div className="text-[24px]">
            {language === "TH" ? "รางวัลและผลงาน" : "Award and Achievements"}
        </div>
          </button>
          <button
             className={`flex flex-col md:flex-row border border-[#C4C4C4] p-2 justify-center gap-2 items-center  ${selected === 3 ? "text-[#008A91] font-bold leading-[28px]  min-h-[100px] underline" : "text-[#565656]"}`}
            onClick={() => setSelected(3)}
          >
            
            <div className="text-[24px]">
            {language === "TH" ? "การฝึกอบรม" : "Training"}
        </div>
          </button>
          <button
             className={`flex flex-col md:flex-row border border-[#C4C4C4] p-2 justify-center gap-2 items-center  ${selected === 4 ? "text-[#008A91] font-bold leading-[28px]  min-h-[100px] underline" : "text-[#565656]"}`}
            onClick={() => setSelected(4)}
          >
            
            <div className="text-[24px]">
            {language === "TH" ? "เอกสารเพิ่มเติม" : "Additional Documents"}
        </div>
          </button>
          <button
             className={`flex flex-col md:flex-row border border-[#C4C4C4] p-2 justify-center gap-2 items-center  ${selected === 5 ? "text-[#008A91] font-bold leading-[28px]  min-h-[100px] underline" : "text-[#565656]"}`}
            onClick={() => setSelected(5)}
          >
            
            <div className="text-[24px]">
            {language === "TH" ? "สรุปข้อมูล" : "Summary"}
        </div>
          </button>
        </div>
        <div className="mt-10">{contents[selected]}</div>
      </div>
      <div className="flex flex-row justify-center gap-4">
        <button onClick={handleSave}>Save</button>
        <NextButton>{currentTexts.NextButton}</NextButton>
      </div>
      {isPopupOpen && (
        <Popup isOpen={isPopupOpen} onClose={handleClosePopup} type="confirmApplication">
          <p>คุณต้องการยืนยันการสมัครหรือไม่?</p>
        </Popup>
      )}
    </div>
  );
};

export default ApplicationInfo;


