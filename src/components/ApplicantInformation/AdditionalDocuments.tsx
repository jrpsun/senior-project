//additional Documents Page
'use client';

import React, { useState } from 'react';
import FileUpload from '../../components/form/FileUpload';
import { BackButton, NextButton } from "../common/button";
import { useLanguage } from "../../hooks/LanguageContext";
import { additionalDocumentsTexts } from "../../translation/AdditionalDocsInfo";
import Image from "next/image";

const AdditionalDocuments = () => {
  const { language } = useLanguage();
  const currentTexts = additionalDocumentsTexts[language] || additionalDocumentsTexts["ENG"];
  const [videoLink, setVideoLink] = useState("");

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
              onChange={(file) => console.log(file)}
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
              onChange={(file) => console.log(file)}
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
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder={currentTexts.enterVideoLink}
              className={`w-full px-3 py-2 border rounded-[10px] text-[#565656]
              }`}
            />
          </div>

          {/* Resume */}
          <div className="mb-6">
            <FileUpload
              label={currentTexts.resume}
              onChange={(file) => console.log(file)}
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
              onChange={(file) => console.log(file)}
              fileType="pdf"
              maxSize="5 MB"
              accept=".pdf"
              infoMessage={<p>{currentTexts.otherDocumentsInfo}</p>}
              required={false}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 mb-6 gap-x-4">
        <BackButton>{currentTexts.back}</BackButton>
        <NextButton>{currentTexts.next}</NextButton>
      </div>
    </>
  );
};

export default AdditionalDocuments;
