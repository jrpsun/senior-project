"use client"
import React, { useEffect, useState } from "react";
import EducationLevel from "./education-info/EducationLevel";
import EnglishTestScore from "./education-info/EnglishTestScore";
import MathTestScore from "./education-info/MathTestScore";
import { ApplicantEducationResponse, EducationBackground, EducationEngExam, EducationMathExam } from "@components/types/educationInfoType";
import { authFetch } from "@components/lib/auth";


const EducationInformation = ({ onUpdate, appId, admId }: { onUpdate: any, appId: string, admId: string }) => {
  const [data, setData] = useState<ApplicantEducationResponse | null>(null);

  const [allChanges, setAllChanges] = useState({
      background: {},
      eng_exam: {},
      math_exam: {}
  });

  const handleChildUpdate = (key: string, data: any) => {
    console.log("education field : value, ", key, data);
    
    // อัพเดตข้อมูลใน allChanges
    const updatedChanges = {
      ...allChanges,
      [key]: data  // เก็บข้อมูลใหม่ของแต่ละ component
    };
    
    setAllChanges(updatedChanges);
    
    // รวมข้อมูลจากทุก component
    const combinedChanges = {
      ...updatedChanges.background,
      ...updatedChanges.eng_exam,
      ...updatedChanges.math_exam,
    };

    console.log("combinedChanges", combinedChanges)
    
    // ส่งข้อมูลทั้งหมดที่รวมแล้วขึ้นไป
    onUpdate('education', combinedChanges);
  };

  const fetchEducationData = async () => {
    const response = await authFetch(`${process.env.API_BASE_URL}/applicant/education/${appId}/${admId}`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error("Failed to fetch education data");
    const result = await response.json();
    setData(result)
  }
  

  useEffect(() => {
    if (appId && admId) {
      fetchEducationData();
    }
  }, [appId, admId]);

  return (
  <div className="flex flex-col gap-4 pb-10">
    <EducationLevel data={data?.background as EducationBackground} onChange={(data) => handleChildUpdate('background', data)}/>
    <EnglishTestScore data={data?.eng_exam as EducationEngExam} onChange={(data) => handleChildUpdate('eng_exam', data)}/>
    <MathTestScore data={data?.math_exam as EducationMathExam} onChange={(data) => handleChildUpdate('math_exam', data)}/>
  </div>
);
};
export default EducationInformation;