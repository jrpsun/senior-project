"use client"
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../hooks/LanguageContext";
import { summaryTexts } from "@components/translation/summary";
import AwardSummary from "./Info/awardInfo/awardSummary";
import TalentSummary from "./Info/awardInfo/talentSummary"; 

// const awardsData = [
//   {
//     competitionName: "ACM-ICPC Thailand National Contest",
//     competitionYear: "2024",
//     competitionLevel: "ระดับประเทศ",
//     awardsReceived: "รางวัลรองชนะเลิศอันดับ 1",
//     projectWorks: "Algorithm Optimization for Data Analysis",
//     document: "/documents/ACM-ICPC_Certificate.pdf",
//     documentSize: "840 KB",
//   },
//   {
//     competitionName: "Hackathon Asia",
//     competitionYear: "2023",
//     competitionLevel: "ระดับนานาชาติ",
//     awardsReceived: "รางวัลชนะเลิศ",
//     projectWorks: "AI-Driven Data Visualization Tools",
//     document: "/documents/Hackaton_Asia_Certificate.pdf",
//     documentSize: "840 KB",
//   },
//   {
//     competitionName: "Web Design Challenge",
//     competitionYear: "2023",
//     competitionLevel: "ระดับภูมิภาค",
//     awardsReceived: "รางวัลรองชนะเลิศอันดับ 2",
//     projectWorks: "Web Application for Community Engagement",
//     document: "/documents/Web_Design_Certificate.pdf",
//     documentSize: "840 KB",
//   },
// ];
// const talentData = [
//     {
//       talentType: "ความสามารถด้านกีฬา",
//       talentYear: "2023",
//       talentActivity: "การแข่งขันฟุตบอลระดับจังหวัดนครปฐม",
//       talentAward: "รางวัลรองชนะเลิศอันดับ 1",
//       talentURL: "https://drive.google.com/file/d/xyz123",
//       document: "/documents/Football_Competition_Cert.pdf",
//       documentSize: "840 KB",
//     },
//     {
//       talentType: "ความสามารถด้านผู้นำและจิตอาสา",
//       talentYear: "2023",
//       talentActivity: 'โครงการจิตอาสา "สร้างชุมชนสีเขียว"',
//       talentAward: "-",
//       talentURL: "-",
//       document: "/documents/GreenLeader_Certificate.pdf",
//       documentSize: "840 KB",
//     },
//   ];

const AwardPage = () => {
  const { language } = useLanguage();
  const texts = summaryTexts[language] || summaryTexts["ENG"];
  const [isVisible, setIsVisible] = useState(false)
  const [awardsData, setAwardsData] = useState([{
      rewardId: "",
      applicantId: "",
      nameOfCompetition: "",
      rewardYear: "",
      rewardLevel: "",
      rewardAwards: "",
      project: "",
      rewardCer: "",
      rewardCerName: "",
      rewardCerSize: "",
    }])
    const [talentsData, setTalentsData] = useState([{
        talentId: "",
        applicantId: "",
        kindOfTalent: "",
        nameOfCompetition: "",
        talentYear: "",
        talentAwards: "",
        url: "",
        moreDetails: "",
        talentCer: "",
        talentCerName: "",
        talentCerSize: "",
      }])

  const fetchAward = async () => {
    try {
      const res = await fetch(`${process.env.API_BASE_URL}/applicant/reward/0000001`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json()
      setAwardsData(data)

    } catch (error){
      console.error('Failed to fetch rewards:', error);
      throw error;
    }
  }

  const fetchTalent = async() => {
    try {
      const res = await fetch(`${process.env.API_BASE_URL}/applicant/talent/0000001`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json()
      console.log("talent: ", data)
      setTalentsData(data)
    } catch (error) {
      console.error("Error Fetch :", error)
    }
  }

  useEffect(() => {
    fetchAward();
    fetchTalent();
  },[])

  useEffect(() => {
    console.log("summary reward:", awardsData)
  },[awardsData, talentsData])

  const hasAwards = awardsData.length > 0;
  const hasTalents = talentsData.length > 0;

  return (
    <div className="space-y-6">

      <div className="mb-4 bg-[#008A90] text-white text-[22px] md:text-[22px] font-medium py-3 px-6 rounded-lg w-full">
        {texts.awards}
      </div>

      {!hasAwards && !hasTalents ? (
        <div className="flex justify-center items-center h-[200px] text-2xl text-[#C5C5C6] font-medium">
          {language === "TH"
            ? "ไม่มีข้อมูลรางวัลและผลงาน"
            : "No Award or Achievement Information."}
        </div>
      ) : (
        <>
          <AwardSummary 
            awards={awardsData}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
          />
          <TalentSummary
            talents={talentsData}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
          />
        </>
      )}
    </div>
  );
};

export default AwardPage;
