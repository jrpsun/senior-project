import React from "react";
import { useLanguage } from "../../../../hooks/LanguageContext";
import { additionalDocumentsTexts } from "../../../../translation/AdditionalDocsInfo";
import ReportProb from "@components/components/common/admin/reportProb";

interface AdditionalDocumentsProps {
  documents: {
    statementOfPurpose?: { name: string; size: string; url: string };
    portfolio?: { name: string; size: string; url: string };
    videoLink?: string;
    resume?: { name: string; size: string; url: string };
    otherDocuments?: { name: string; size: string; url: string };
  };
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}
const AdditionalDocumentsSummary: React.FC<AdditionalDocumentsProps> = ({ documents, isVisible, setIsVisible }) => {
  const { language } = useLanguage();
  const texts = additionalDocumentsTexts[language] || additionalDocumentsTexts["ENG"];

  return (
    <div className="flex justify-center py-4 bg-white">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl lg:max-w-screen-xl p-4">
      <div className="flex justify-center pt-10 bg-[#FFFFFF] p-6">
      <div className="sm:w-[1100px] max-w-none bg-white rounded-lg p-6 border border-gray-300">

            {/* Statement of Purpose */}
            {documents.statementOfPurpose && (
              <div className="mb-4">
                <h3 className="text-[#565656] font-semibold mb-2">
                  {texts.statementOfPurpose}
                </h3>
                <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                <div className="border border-gray-300 rounded-lg p-3 flex flex-wrap items-center gap-4 shadow-sm">
                  <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                  <div className="flex flex-col">
                    <a
                      href={documents.statementOfPurpose.url}
                      download
                      className="text-[#008A90] font-medium hover:underline truncate max-w-[250px] md:max-w-[400px] inline-block"
                      title={documents.statementOfPurpose.name} // Hover เพื่อดูชื่อเต็ม
                    >
                      {documents.statementOfPurpose.name}
                    </a>
                    <span className="text-[#565656] text-xs md:text-sm">{documents.statementOfPurpose.size}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio */}
            {documents.portfolio && (
              <div className="mb-4">
                <h3 className="text-[#565656] font-semibold mb-2 ">
                  {texts.portfolio}
                </h3>
                <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                <div className="border border-gray-300 rounded-lg p-3 flex flex-wrap items-center gap-4 shadow-sm">
                  <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                  <div className="flex flex-col">
                    <a
                      href={documents.portfolio.url}
                      download
                      className="text-[#008A90] font-medium hover:underline truncate max-w-[250px] md:max-w-[400px] inline-block"
                      title={documents.portfolio.name}
                    >
                      {documents.portfolio.name}
                    </a>
                    <span className="text-[#565656] text-xs md:text-sm">{documents.portfolio.size}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Video Link */}
            {documents.videoLink && (
              <div className="mb-4">
                <h3 className="text-[#565656] font-semibold mb-2 ">{texts.video}</h3>
                <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                <a href={documents.videoLink} target="_blank" rel="noopener noreferrer" className="text-[#008A90] hover:underline break-all">
                  {documents.videoLink}
                </a>
              </div>
            )}

            {/* Resume */}
            {documents.resume && (
              <div className="mb-4">
                <h3 className="text-[#565656] font-semibold mb-2 ">
                  {texts.resume}
                </h3>
                <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap items-center gap-4 shadow-sm">
                  <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                  <div className="flex flex-col">
                    <a
                      href={documents.resume.url}
                      download
                      className="text-[#008A90] font-medium hover:underline truncate max-w-[250px] md:max-w-[400px] inline-block"
                      title={documents.resume.name}
                    >
                      {documents.resume.name}
                    </a>
                    <span className="text-[#565656] text-xs md:text-sm">{documents.resume.size}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Other Documents */}
            {documents.otherDocuments && (
              <div className="mb-4">
                <h3 className="text-[#565656] font-semibold mb-2">
                  {texts.otherDocuments}
                </h3>
                <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap items-center gap-4 shadow-sm">
                  <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                  <div className="flex flex-col">
                    <a
                      href={documents.otherDocuments.url}
                      download
                      className="text-[#008A90] font-medium hover:underline truncate max-w-[250px] md:max-w-[400px] inline-block"
                      title={documents.otherDocuments.name}
                    >
                      {documents.otherDocuments.name}
                    </a>
                    <span className="text-[#565656] text-xs md:text-sm">{documents.otherDocuments.size}</span>
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
