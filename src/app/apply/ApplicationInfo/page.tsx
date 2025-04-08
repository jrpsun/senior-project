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
import next from "next";


const ApplicationInfo = () => {
  const { language } = useLanguage();
  const [selected, setSelected] = useState(0);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const currentTexts = generalInfoTexts[language as keyof typeof generalInfoTexts] || generalInfoTexts["ENG"];
  const [editedGeneralData, setEditedGeneralData] = useState({})
  const [editedEducationData, setEditedEducationData] = useState({})
  const [editedAwardData, setEditedAwardData] = useState([{}])
  const [editedTalentData, setEditedTalentData] = useState([{}])
  const [editedTrainData, setEditedTrainData] = useState([{}])
  const [editedDocData, setEditedDocData] = useState({})

  const handleGeneralInfoUpdate = (key: string, updatedData: any) => {
    setEditedGeneralData(prev => ({ ...prev, [key]: updatedData }));
  };

  const handleEducationUpdate = (key: string, updatedData: any) => {
    setEditedEducationData(prev => ({ ...prev, [key]: updatedData }))
  }

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => setPopupOpen(false);

  const nextStep = () => {
    setSelected(prev => Math.min(prev + 1, 5));
    console.log("next", selected)
  };

  const prevStep = () => {
    setSelected(prev => Math.max(prev - 1, 0));
    console.log("back", selected)
  };
  
  const contents = [
    <GeneralInformation key="general" onUpdate={handleGeneralInfoUpdate}/>,
    <EducationInformation key="education" onUpdate={handleEducationUpdate}/>,
    <Award key="award" setAward={setEditedAwardData} setTalent={setEditedTalentData}/>,
    <Training key="training" setTrain={setEditedTrainData}/>,
    <AdditionalDocuments key="documents" setDoc={setEditedDocData}/>,
    <Summary key="summary" onOpenPopup={handleOpenPopup} />,
  ];

  const handleSave = async () => {
    if (selected === 0) {
      console.log("Saving Combined Changes:", editedGeneralData);
      updatedGeneralInfo();
    } else if (selected === 1) {
      console.log("click edu tab", editedEducationData)
      updatedEducationInfo();
    } else if (selected === 2) {
      console.log("award tab:", editedAwardData)
      console.log("talent tab:", editedTalentData)
      if (editedAwardData.length > 0 && Object.keys(editedAwardData[0]).length > 0) {
        console.log("reward pass");
        updatedAward();
      } 
      if (editedTalentData.length > 0 && Object.keys(editedTalentData[0]).length > 0) {
        console.log("talent pass");
        upDatedTalent();
      }
    } else if (selected === 3) {
      console.log("Training Data tab:", editedTrainData);
      if (editedTrainData.length > 0 && Object.keys(editedTrainData[0]).length > 0) {
        updatedTraining();
      }
    } else if (selected === 4) {
      console.log("Doc tab: ", editedDocData);
      updatedDocument();
    } else if (selected === 5) {
      submitForm();
    }
  }

  const updatedGeneralInfo = async() => {
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

  const updatedEducationInfo = async() => {
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/applicant/education/0000001`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedEducationData.education),
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

  const updatedAward = async() => {
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/applicant/reward`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedAwardData),
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

  const upDatedTalent = async() => {
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/applicant/talent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedTalentData),
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

  const updatedTraining = async() => {
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/applicant/training`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedTrainData),
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

  const updatedDocument = async() => {
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/applicant/document/0000001`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedDocData),
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

  const submitForm = async() => {
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/applicant/submit/0000001`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json()
      if (response.ok) {
        console.log('ข้อมูลถูกอัปเดตเรียบร้อย:', result);
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
      <div className="flex justify-center mt-6 mb-6 gap-x-4">
        <BackButton onClick={prevStep}>{currentTexts.backButton}</BackButton>
        <button onClick={handleSave}>Save</button>
        <NextButton onClick={nextStep}>{currentTexts.nextButton}</NextButton>
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


