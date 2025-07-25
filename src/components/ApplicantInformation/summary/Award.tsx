"use client"
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../hooks/LanguageContext";
import { summaryTexts } from "@components/translation/summary";
import AwardSummary from "./Info/awardInfo/awardSummary";
import TalentSummary from "./Info/awardInfo/talentSummary"; 
import { authFetch } from "@components/lib/auth";

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

const AwardPage = ({appId, admId}: any) => {
  const { language } = useLanguage();
  const texts = summaryTexts[language] || summaryTexts["ENG"];
  const [isVisible, setIsVisible] = useState(false)
  const [awardsData, setAwardsData] = useState([{
      rewardId: "",
      applicantId: "",
      programRegistered: "",
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
      programRegistered: "",
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
    const response = await authFetch(`${process.env.API_BASE_URL}/applicant/reward/${appId}/${admId}`, {
        method: 'GET',
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json()
    setAwardsData(data)
  }

  const fetchTalent = async() => {
    const response = await authFetch(`${process.env.API_BASE_URL}/applicant/talent/${appId}/${admId}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json()
    setTalentsData(data)
  }

  useEffect(() => {
    if (appId && admId) {
      fetchAward();
      fetchTalent();
    }
  },[appId, admId])

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
            setReport={null}
          />
          <TalentSummary
            talents={talentsData}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            setReport={null}
          />
        </>
      )}
    </div>
  );
};

export default AwardPage;
