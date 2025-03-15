import React from "react";
import { useLanguage } from "../../../hooks/LanguageContext";
import { summaryTexts } from "@components/translation/summary";
import AdditionalDocumentsSummary from "./Info/additionalSummary";

const additionalDocumentsData = {
  statementOfPurpose: {
    name: "Statement_of_Purpose_Test_Raboobsamak.pdf",
    size: "1.1 MB",
    url: "/documents/Statement_of_Purpose_Test.pdf",
  },
  portfolio: {
    name: "Portfolio_Test_Raboobsamak.pdf",
    size: "3.8 MB",
    url: "/documents/Portfolio_Test.pdf",
  },
  videoLink: "https://drive.google.com/file/d/1aBeFgHiJkLmNoPqRStUvWxYz/view?usp=sharing",
};

const AdditionalDocumentsPage = () => {
  const { language } = useLanguage();
  const texts = summaryTexts[language] || summaryTexts["ENG"];

  return (
    <div className="space-y-2">
            <div className="mb-4 bg-[#008A90] text-white text-[22px] md:text-[22px] font-medium py-3 px-6 rounded-lg w-full">
        {texts.additionalDoc}
      </div>

      <AdditionalDocumentsSummary documents={additionalDocumentsData} />
    </div>
  );
};

export default AdditionalDocumentsPage;
