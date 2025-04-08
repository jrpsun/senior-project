"use client"
import React, { useEffect, useState } from "react";
import EducationLevel from "./education-info/EducationLevel";
import EnglishTestScore from "./education-info/EnglishTestScore";
import MathTestScore from "./education-info/MathTestScore";
import { ApplicantEducationResponse, EducationBackground, EducationEngExam, EducationMathExam } from "@components/types/educationInfoType";


const EducationInformation: React.FC = ({ onUpdate }: any) => {
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
    try {
      const res = await fetch(`${process.env.API_BASE_URL}/applicant/education/0000001`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) throw new Error("Failed to fetch education data");
      
      const result = await res.json();
      console.log("education result:", result)
      setData(result)
      console.log("education data:", data)
    } catch (error) {
      console.error("Error fetching education information:", error);
    }
  }
  

  useEffect(() => {
    fetchEducationData()
  }, []);

  return (
  <div className="flex flex-col gap-4 pb-10">
    <EducationLevel data={data?.background as EducationBackground} onChange={(data) => handleChildUpdate('background', data)}/>
    <EnglishTestScore data={data?.eng_exam as EducationEngExam} onChange={(data) => handleChildUpdate('eng_exam', data)}/>
    <MathTestScore data={data?.math_exam as EducationMathExam} onChange={(data) => handleChildUpdate('math_exam', data)}/>
  </div>
);
};
export default EducationInformation;