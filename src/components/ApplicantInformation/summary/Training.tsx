"use client"
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../hooks/LanguageContext";
import { summaryTexts } from "@components/translation/summary";
import TrainingSummary from "./Info/trainingSummary"; 

// const trainingsData = [
//   {
//     programName: "Data Science Bootcamp",
//     institution: "Udemy",
//     trainingYear: "2024",
//     trainingMode: "ออนไลน์(Online)",
//     country: "-",
//     document: "/documents/DataScience_Bootcamp_Certificate.pdf",
//     documentSize: "846 KB",
//   },
//   {
//     programName: "Cybersecurity Fundamentals",
//     institution: "จุฬาลงกรณ์มหาวิทยาลัย",
//     trainingYear: "2023",
//     trainingMode: "สถานที่จริง (On-Site)",
//     country: "ไทย",
//     document: "/documents/Cybersecurity_Certificate.pdf",
//     documentSize: "920 KB",
//   },
//   {
//     programName: "AI & Machine Learning Workshop",
//     institution: "มหาวิทยาลัยเกษตรศาสตร์",
//     trainingYear: "2022",
//     trainingMode: "สถานที่จริง (On-Site)",
//     country: "ไทย",
//     document: "/documents/AI_ML_Workshop_Certificate.pdf",
//     documentSize: "780 KB",
//   },
// ];

const TrainingPage = () => {
  const { language } = useLanguage();
  const texts = summaryTexts[language] || summaryTexts["ENG"];
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState([{
      trainingId: "",
      applicantId: "",
      nameOfCourse: "",
      institution: "",
      trainingYear: "",
      trainingMode: "",
      trainingCountry: "",
      trainingCer: "",
      trainingCerName: "",
      trainingCerSize: "",
    }])


  const fetchTrining = async() => {
    try {
      const res = await fetch(`${process.env.API_BASE_URL}/applicant/training/0000001`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json()
      console.log("data Training", data)
      setFormData(data)

    } catch (error){
      console.error('Failed to fetch rewards:', error);
      throw error;
    }
  }

  useEffect(() => {
      fetchTrining();
  }, [])

  return (
    <div className="space-y-6">
      <div className="mb-4 bg-[#008A90] text-white text-[22px] md:text-[22px] font-medium py-3 px-6 rounded-lg w-full">
        {texts.training}
      </div>

      <TrainingSummary
        trainings={formData}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </div>
  );
};

export default TrainingPage;
