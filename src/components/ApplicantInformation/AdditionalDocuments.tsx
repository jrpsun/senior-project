//additional Documents Page
'use client';

import React, { useEffect, useState } from 'react';
import FileUpload from '../../components/form/FileUpload';
import { useLanguage } from "../../hooks/LanguageContext";
import { additionalDocumentsTexts } from "../../translation/AdditionalDocsInfo";
import Image from "next/image";
import { authFetch } from '@components/lib/auth';

const AdditionalDocuments = ({ setDoc, appId }: any) => {
  const { language } = useLanguage();
  const currentTexts = additionalDocumentsTexts[language] || additionalDocumentsTexts["ENG"];
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
    console.log("Doc FormData", formData)
  },[formData])

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

  const handleUploadFile = (file : File, field: string) => {
    if (!file) return;
    console.log("file", file)
    
    if (file.type !== "application/pdf") {
      alert("กรุณาอัปโหลดไฟล์ PDF เท่านั้น");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('ขนาดไฟล์ไม่ควรเกิน 5MB');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const base64String = event.target?.result as string;

      const updated = {
        ...formData,
        [field]: base64String,
        [`${field}Name`]: file.name,
        [`${field}Size`]: String(file.size)
      };
  
      setFormData(updated);
      setDoc(updated);
    }
    reader.readAsDataURL(file);
  }

  const handleVideoLink = (value: string) => {
    const updated = {
      ...formData,
      vdo: value,
    };
    setFormData(updated);
    setDoc(updated);
  }

  return (
    <>
    <div className="flex justify-center pt-10 bg-[#FFFFFF] p-6">
      <div className="sm:w-[1100px] max-w-none bg-white rounded-lg p-6 border border-gray-300">
          <h1 className="text-2xl font-semibold text-[#008A90] mb-4">
            {currentTexts.additionalDocuments}
          </h1>

          {/* Statement of Purpose */}
          <div className="mb-6">
            <FileUpload
              label={`${currentTexts.statementOfPurpose} `}
              onChange={(file) => handleUploadFile(file, "stateOfPurpose")}
              fileType="pdf"
              maxSize="5 MB"
              accept=".pdf"
              infoMessage={<p>{currentTexts.statementInfo}</p>}
            />
          </div>

          {/* Portfolio */}
          <div className="mb-6">
            <FileUpload
              label={`${currentTexts.portfolio} `}
              onChange={(file) => handleUploadFile(file, "portfolio")}
              fileType="pdf"
              maxSize="5 MB"
              accept=".pdf"
              infoMessage={<p>{currentTexts.portfolioInfo}</p>}
            />
          </div>
          {/* Video (ใช้ FormField) */}
          <div className="mb-6 ">
            <label className="font-medium text-gray-800">
              {currentTexts.video} <span className="text-[#D92D20]">*</span>
            </label>
            {/* Info message อยู่ด้านบน */}
            <div className="flex items-center text-[#B3B3B3] text-sm mb-2 mt-2">
              <Image
                src="/images/Info_Message.svg"
                alt="Info Icon"
                width={20}
                height={20}
                className="mr-2"
              />
              <span>{currentTexts.videoInfo}</span>
            </div>
            <input
              type="text"
              value={formData?.vdo || ""}
              onChange={(e) => handleVideoLink(e.target.value)}
              placeholder={currentTexts.enterVideoLink}
              className={`w-full px-3 py-2 border rounded-[10px] text-[#565656]
              }`}
            />
          </div>

          {/* Resume */}
          <div className="mb-6">
            <FileUpload
              label={currentTexts.resume}
              onChange={(file) => handleUploadFile(file, "applicantResume")}
              fileType="pdf"
              maxSize="5 MB"
              accept=".pdf"
              infoMessage={<p>{currentTexts.resumeInfo}</p>}
              required={false}
            />
          </div>

          {/* Other Documents */}
          <div className="mb-6">
            <FileUpload
              label={currentTexts.otherDocuments}
              onChange={(file) => handleUploadFile(file, "additional")}
              fileType="pdf"
              maxSize="5 MB"
              accept=".pdf"
              infoMessage={<p>{currentTexts.otherDocumentsInfo}</p>}
              required={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdditionalDocuments;
