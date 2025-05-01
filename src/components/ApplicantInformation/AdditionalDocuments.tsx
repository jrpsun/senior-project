//additional Documents Page
'use client';

import React, { useEffect, useState } from 'react';
import FileUpload from '../../components/form/FileUpload';
import { useLanguage } from "../../hooks/LanguageContext";
import { additionalDocumentsTexts } from "../../translation/AdditionalDocsInfo";
import Image from "next/image";
import { authFetch } from '@components/lib/auth';

const AdditionalDocuments = ({ setDoc, appId, admId }: any) => {
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
    if (appId && admId) {
      fetchDocuments();
    }
  },[appId, admId])

  const fetchDocuments = async() => {
    const response = await authFetch(`${process.env.API_BASE_URL}/applicant/document/${appId}/${admId}`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json()
    setFormData({
      stateOfPurpose: data?.stateOfPurpose || "",
      stateOfPurposeName: data?.stateOfPurposeName || "",
      stateOfPurposeSize: data?.stateOfPurposeSize || "",
      portfolio: data?.portfolio || "",
      portfolioName: data?.portfolioName || "",
      portfolioSize: data?.portfolioSize || "",
      vdo: data?.vdo || "",
      applicantResume: data?.applicantResume || "",
      applicantResumeName: data?.applicantResumeName || "",
      applicantResumeSize: data?.applicantResumeSize || "",
      additional: data?.additional || "",
      additionalName: data?.additionalName || "",
      additionalSize: data?.additionalSize || "",
    })
    console.log("aaddiisd", data)
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

  const handleDeleteDocCopy = (fieldfile: string, fieldName: string, fieldSize: string) => {
    const updatedData = {
      ...formData,
      [fieldfile]: "",
      [fieldName]: "",
      [fieldSize]: ""
    };
    
    setFormData(updatedData); 
    setDoc(updatedData);
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
          {formData.stateOfPurpose !== "" ? (
            <div className="mb-4">
              <div className="border border-gray-300 rounded-lg p-3 flex flex-wrap items-center gap-4 shadow-sm">
                <div className="flex justify-between items-center w-full gap-4">
                  <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                  <div className="flex flex-col">
                    <span className="text-[#008A90] font-medium truncate max-w-[250px] md:max-w-[400px]">
                      {formData.stateOfPurposeName}
                    </span>
                    <span className="text-[#565656] text-xs md:text-sm">
                      {formData.stateOfPurposeSize} bytes
                    </span>
                  </div>
                  <button className="ml-auto" onClick={() => handleDeleteDocCopy("stateOfPurpose", "stateOfPurposeName", "stateOfPurposeSize")}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="10" stroke="#D92D20" strokeWidth="2" fill="none" />
                      <path d="M15.5833 11.9173H6.41667C5.86667 11.9173 5.5 11.5507 5.5 11.0007C5.5 10.4507 5.86667 10.084 6.41667 10.084H15.5833C16.1333 10.084 16.5 10.4507 16.5 11.0007C16.5 11.5507 16.1333 11.9173 15.5833 11.9173Z" fill="#D92D20" />
                    </svg>
                  </button>
                </div> 
              </div>
            </div>
              ) : (
            <FileUpload
              label={`${currentTexts.statementOfPurpose} `}
              onChange={(file) => handleUploadFile(file, "stateOfPurpose")}
              fileType="pdf"
              maxSize="5 MB"
              accept=".pdf"
              infoMessage={<p>{currentTexts.statementInfo}</p>}
            />
            )}
          </div>

          {/* Portfolio */}
          <div className="mb-6">
          {formData.portfolio !== "" ? (
            <div className="mb-4">
              <div className="border border-gray-300 rounded-lg p-3 flex flex-wrap items-center gap-4 shadow-sm">
                <div className="flex justify-between items-center w-full gap-4">
                  <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                  <div className="flex flex-col">
                    <span className="text-[#008A90] font-medium truncate max-w-[250px] md:max-w-[400px]">
                      {formData.portfolioName}
                    </span>
                    <span className="text-[#565656] text-xs md:text-sm">
                      {formData.portfolioSize} bytes
                    </span>
                  </div>
                  <button className="ml-auto" onClick={() => handleDeleteDocCopy("portfolio", "portfolioName", "portfolioSize")}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="10" stroke="#D92D20" strokeWidth="2" fill="none" />
                      <path d="M15.5833 11.9173H6.41667C5.86667 11.9173 5.5 11.5507 5.5 11.0007C5.5 10.4507 5.86667 10.084 6.41667 10.084H15.5833C16.1333 10.084 16.5 10.4507 16.5 11.0007C16.5 11.5507 16.1333 11.9173 15.5833 11.9173Z" fill="#D92D20" />
                    </svg>
                  </button>
                </div> 
              </div>
            </div>
              ) : (
            <FileUpload
              label={`${currentTexts.portfolio} `}
              onChange={(file) => handleUploadFile(file, "portfolio")}
              fileType="pdf"
              maxSize="5 MB"
              accept=".pdf"
              infoMessage={<p>{currentTexts.portfolioInfo}</p>}
            />)}
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
          {formData.applicantResume !== "" ? (
            <div className="mb-4">
              <div className="border border-gray-300 rounded-lg p-3 flex flex-wrap items-center gap-4 shadow-sm">
                <div className="flex justify-between items-center w-full gap-4">
                  <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                  <div className="flex flex-col">
                    <span className="text-[#008A90] font-medium truncate max-w-[250px] md:max-w-[400px]">
                      {formData.applicantResumeName}
                    </span>
                    <span className="text-[#565656] text-xs md:text-sm">
                      {formData.applicantResumeSize} bytes
                    </span>
                  </div>
                  <button className="ml-auto" onClick={() => handleDeleteDocCopy("applicantResume", "applicantResumeName", "applicantResumeSize")}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="10" stroke="#D92D20" strokeWidth="2" fill="none" />
                      <path d="M15.5833 11.9173H6.41667C5.86667 11.9173 5.5 11.5507 5.5 11.0007C5.5 10.4507 5.86667 10.084 6.41667 10.084H15.5833C16.1333 10.084 16.5 10.4507 16.5 11.0007C16.5 11.5507 16.1333 11.9173 15.5833 11.9173Z" fill="#D92D20" />
                    </svg>
                  </button>
                </div> 
              </div>
            </div>
              ): (
            <FileUpload
              label={currentTexts.resume}
              onChange={(file) => handleUploadFile(file, "applicantResume")}
              fileType="pdf"
              maxSize="5 MB"
              accept=".pdf"
              infoMessage={<p>{currentTexts.resumeInfo}</p>}
              required={false}
            />)}
          </div>

          {/* Other Documents */}
          <div className="mb-6">
          {formData.additional !== "" ? (
            <div className="mb-4">
              <div className="border border-gray-300 rounded-lg p-3 flex flex-wrap items-center gap-4 shadow-sm">
                <div className="flex justify-between items-center w-full gap-4">
                  <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                  <div className="flex flex-col">
                    <span className="text-[#008A90] font-medium truncate max-w-[250px] md:max-w-[400px]">
                      {formData.additionalName}
                    </span>
                    <span className="text-[#565656] text-xs md:text-sm">
                      {formData.additionalSize} bytes
                    </span>
                  </div>
                  <button className="ml-auto" onClick={() => handleDeleteDocCopy("additional", "additionalName", "additionalSize")}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="10" stroke="#D92D20" strokeWidth="2" fill="none" />
                      <path d="M15.5833 11.9173H6.41667C5.86667 11.9173 5.5 11.5507 5.5 11.0007C5.5 10.4507 5.86667 10.084 6.41667 10.084H15.5833C16.1333 10.084 16.5 10.4507 16.5 11.0007C16.5 11.5507 16.1333 11.9173 15.5833 11.9173Z" fill="#D92D20" />
                    </svg>
                  </button>
                </div> 
              </div>
            </div>
              ):(
            <FileUpload
              label={currentTexts.otherDocuments}
              onChange={(file) => handleUploadFile(file, "additional")}
              fileType="pdf"
              maxSize="5 MB"
              accept=".pdf"
              infoMessage={<p>{currentTexts.otherDocumentsInfo}</p>}
              required={false}
            />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdditionalDocuments;
