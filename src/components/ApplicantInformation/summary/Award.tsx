import React from "react";
import { useLanguage } from "../../../hooks/LanguageContext";
import { summaryTexts } from "@components/translation/summary";
import AwardSummary from "./Info/awardInfo/awardSummary";
import TalentSummary from "./Info/awardInfo/talentSummary"; 

const awardsData = [
  {
    competitionName: "ACM-ICPC Thailand National Contest",
    competitionYear: "2024",
    competitionLevel: "ระดับประเทศ",
    awardsReceived: "รางวัลรองชนะเลิศอันดับ 1",
    projectWorks: "Algorithm Optimization for Data Analysis",
    document: "/documents/ACM-ICPC_Certificate.pdf",
    documentSize: "840 KB",
  },
  {
    competitionName: "Hackathon Asia",
    competitionYear: "2023",
    competitionLevel: "ระดับนานาชาติ",
    awardsReceived: "รางวัลชนะเลิศ",
    projectWorks: "AI-Driven Data Visualization Tools",
    document: "/documents/Hackaton_Asia_Certificate.pdf",
    documentSize: "840 KB",
  },
  {
    competitionName: "Web Design Challenge",
    competitionYear: "2023",
    competitionLevel: "ระดับภูมิภาค",
    awardsReceived: "รางวัลรองชนะเลิศอันดับ 2",
    projectWorks: "Web Application for Community Engagement",
    document: "/documents/Web_Design_Certificate.pdf",
    documentSize: "840 KB",
  },
];
const talentData = [
    {
      talentType: "ความสามารถด้านกีฬา",
      talentYear: "2023",
      talentActivity: "การแข่งขันฟุตบอลระดับจังหวัดนครปฐม",
      talentAward: "รางวัลรองชนะเลิศอันดับ 1",
      talentURL: "https://drive.google.com/file/d/xyz123",
      document: "/documents/Football_Competition_Cert.pdf",
      documentSize: "840 KB",
    },
    {
      talentType: "ความสามารถด้านผู้นำและจิตอาสา",
      talentYear: "2023",
      talentActivity: 'โครงการจิตอาสา "สร้างชุมชนสีเขียว"',
      talentAward: "-",
      talentURL: "-",
      document: "/documents/GreenLeader_Certificate.pdf",
      documentSize: "840 KB",
    },
  ];

const AwardPage = () => {
  const { language } = useLanguage();
  const texts = summaryTexts[language] || summaryTexts["ENG"];

  return (
    <div className="space-y-6">
      <div className="mb-4 bg-[#008A90] text-white text-[22px] md:text-[22px] font-medium py-3 px-6 rounded-lg w-full">
        {texts.awards}
      </div>

      <AwardSummary awards={awardsData} />
      <TalentSummary talents={talentData} />
    </div>
  );
};

export default AwardPage;
