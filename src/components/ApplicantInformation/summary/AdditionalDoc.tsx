"use client"
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../hooks/LanguageContext";
import { summaryTexts } from "@components/translation/summary";
import AdditionalDocumentsSummary from "./Info/additionalSummary";
import { authFetch } from "@components/lib/auth";


const AdditionalDocumentsPage = ({appId}: any) => {
  const { language } = useLanguage();
  const texts = summaryTexts[language] || summaryTexts["ENG"];
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    stateOfPurpose: "",
    stateOfPurposeName: "",
    stateOfPurposeSize: "",
    portfolio: "",
    portfolioName: "",
    portfolioSize: "",
    vdo: "",
    applicantResume: "",
    applicantResumeName: "",
    applicantResumeSize: "",
    additional: "",
    additionalName: "",
    additionalSize: "",
  })

  useEffect(() => {
    if (appId) {
      fetchDocuments();
    }
  },[appId])

  const fetchDocuments = async() => {
    const response = await authFetch(`${process.env.API_BASE_URL}/applicant/document/${appId}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json()
    setFormData(data)
  }

  return (
    <div className="space-y-2">
            <div className="mb-4 bg-[#008A90] text-white text-[22px] md:text-[22px] font-medium py-3 px-6 rounded-lg w-full">
        {texts.additionalDoc}
      </div>

      <AdditionalDocumentsSummary 
        documents={formData}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </div>
  );
};

export default AdditionalDocumentsPage;
