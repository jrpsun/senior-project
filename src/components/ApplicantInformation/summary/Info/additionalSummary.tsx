import React from "react";
import { useLanguage } from "../../../../hooks/LanguageContext";
import { additionalDocumentsTexts } from "../../../../translation/AdditionalDocsInfo";
import ReportProb from "@components/components/common/admin/reportProb";
import { AdditionalDoc } from "@components/types/additionalDoc";

interface AdditionalDocumentsProps {
  documents: AdditionalDoc;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  setReport: any
}
const AdditionalDocumentsSummary: React.FC<AdditionalDocumentsProps> = ({ documents, isVisible, setIsVisible, setReport }) => {
  const { language } = useLanguage();
  const texts = additionalDocumentsTexts[language] || additionalDocumentsTexts["ENG"];

  return (
    <div className="flex justify-center py-4 bg-white">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl lg:max-w-screen-xl p-4">
      <div className="flex justify-center pt-10 bg-[#FFFFFF] p-6">
      <div className="sm:w-[1100px] max-w-none bg-white rounded-lg p-6 border border-gray-300">

            {/* Statement of Purpose */}
            {documents?.stateOfPurposeName && (
              <div className="mb-4">
                <div className="flex flex-cols gap-4">
                  <h3 className="text-[#565656] font-semibold mb-2">
                    {texts.statementOfPurpose}
                  </h3>
                  <ReportProb isVisible={isVisible} problem={texts.statementOfPurpose} setReport={setReport} reportColumn={"sop"}/>
                </div>
                <div className="border border-gray-300 rounded-lg p-3 flex flex-wrap items-center gap-4 shadow-sm">
                  <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                  <div className="flex flex-col">
                    <a
                      href={documents?.stateOfPurpose}
                      download
                      className="text-[#008A90] font-medium hover:underline truncate max-w-[250px] md:max-w-[400px] inline-block"
                      title={documents?.stateOfPurposeName} // Hover เพื่อดูชื่อเต็ม
                    >
                      {documents?.stateOfPurposeName}
                    </a>
                    <span className="text-[#565656] text-xs md:text-sm">{documents?.stateOfPurposeSize}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio */}
            {documents?.portfolioName && (
              <div className="mb-4">
                <div className="flex flex-cols gap-4">
                  <h3 className="text-[#565656] font-semibold mb-2 ">
                    {texts.portfolio}
                  </h3>
                  <ReportProb isVisible={isVisible} problem={texts.portfolio} setReport={setReport} reportColumn={"portfolio"}/>
                </div>
                <div className="border border-gray-300 rounded-lg p-3 flex flex-wrap items-center gap-4 shadow-sm">
                  <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                  <div className="flex flex-col">
                    <a
                      href={documents?.portfolio}
                      download
                      className="text-[#008A90] font-medium hover:underline truncate max-w-[250px] md:max-w-[400px] inline-block"
                      title={documents?.portfolioName}
                    >
                      {documents?.portfolioName}
                    </a>
                    <span className="text-[#565656] text-xs md:text-sm">{documents?.portfolioSize}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Video Link */}
            {documents?.vdo && (
              <div className="mb-4">
                <div className="flex flex-cols gap-4">
                  <h3 className="text-[#565656] font-semibold mb-2 ">{texts.video}</h3>
                  <ReportProb isVisible={isVisible} problem={texts.video} setReport={setReport} reportColumn={"video"}/>
                </div>  
                <a href={documents?.vdo} target="_blank" rel="noopener noreferrer" className="text-[#008A90] hover:underline break-all">
                  {documents?.vdo}
                </a>
              </div>
            )}

            {/* Resume */}
            {documents?.applicantResumeName && (
              <div className="mb-4">
                <div className="flex flex-cols gap-4">
                   <h3 className="text-[#565656] font-semibold mb-2 ">
                    {texts.resume}
                  </h3>
                  <ReportProb isVisible={isVisible} problem={texts.resume} setReport={setReport} reportColumn={"resume"}/>
                </div>
                <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap items-center gap-4 shadow-sm">
                  <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                  <div className="flex flex-col">
                    <a
                      href={documents?.applicantResumeName}
                      download
                      className="text-[#008A90] font-medium hover:underline truncate max-w-[250px] md:max-w-[400px] inline-block"
                      title={documents?.applicantResumeName}
                    >
                      {documents?.applicantResumeName}
                    </a>
                    <span className="text-[#565656] text-xs md:text-sm">{documents?.applicantResumeSize}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Other Documents */}
            {documents?.additionalName && (
              <div className="mb-4">
                <div className="flex flex-cols gap-4">
                  <h3 className="text-[#565656] font-semibold mb-2">
                    {texts.otherDocuments}
                  </h3>
                  <ReportProb isVisible={isVisible} problem={texts.otherDocuments} setReport={setReport} reportColumn={"addDoc"}/>
                </div>
                <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap items-center gap-4 shadow-sm">
                  <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                  <div className="flex flex-col">
                    <a
                      href={documents?.additionalName}
                      download
                      className="text-[#008A90] font-medium hover:underline truncate max-w-[250px] md:max-w-[400px] inline-block"
                      title={documents?.additionalName}
                    >
                      {documents?.additionalName}
                    </a>
                    <span className="text-[#565656] text-xs md:text-sm">{documents?.additionalSize}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalDocumentsSummary;
