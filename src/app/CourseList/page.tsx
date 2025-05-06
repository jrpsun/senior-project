"use client";

import Navbar from "../../components/Navbar";
import { useLanguage } from "../../hooks/LanguageContext";
import ictGuidance from "../../translation/ictGuidance";
import dstGuidance from "../../translation/dstGuidance";
import { useRouter, useSearchParams } from "next/navigation";
import { NextButton } from "../../components/common/button";
import Image from "next/image";

// Define the type for document list items
interface DocumentItem {
  title: string;
  details: string[];
}

// Define the type for texts
interface GuidanceTexts {
  title: string;
  subtitle: string;
  infoMessage: string;
  documentHeader: string;
  documentList: DocumentItem[];
  uploadGuideHeader: string;
  uploadGuide: string[];
  warningHeader: string;
  warningList: string[];
  additionalDetailsHeader: string;
  additionalDetails: string;
  applicationAnnouncement: string;
  nextButton: string;
}

export default function CourseList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const program = searchParams.get("program"); // ค่าเริ่มต้นเป็น DST
  const id = searchParams.get("id")

  const { language } = useLanguage() as { language: "TH" | "ENG" };

  // เลือก guidanceTexts ตามหลักสูตรที่สมัคร
  const texts: GuidanceTexts = (program?.includes("ITCS")) ? ictGuidance[language] : dstGuidance[language];
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col p-0 gap-4 pt-10">
          {/* หัวข้อ */}
          <h2 className="font-bold text-2xl sm:text-3xl text-[#111827] leading-7 text-center">
            {texts.title}
          </h2>
          <h4 className="font-medium text-2xl sm:text-2xl text-[#008A90] leading-7 text-center">
            {texts.subtitle}
          </h4>

          {/* ข้อความแนะนำ */}
          <div className="flex justify-center py-1 bg-[white]">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl lg:max-w-screen-xl p-2">
              <div className="p-2 rounded-lg flex items-center">
                <span className="text-[#B3B3B3] flex items-center text-sm">
                <Image src="/images/info_Message.svg" alt="Information" width={20} height={20} className="mr-2" />
                  {texts.infoMessage}
                </span>
              </div>
            </div>
          </div>

          {/* เอกสารประกอบการสมัคร */}
          <div className="flex justify-center py-1 bg-[white]">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl lg:max-w-screen-xl p-5 border">
              <div className="p-5 bg-white rounded-lg w-full max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-4">
                <Image src="/images/guidance/document_icon.svg" alt="Document" width={32} height={32} className="mr-2" />

                  <h2 className="font-bold text-xl text-[#008A90]">{texts.documentHeader}</h2>
                </div>

                {/* รายการเอกสาร */}
                <div className="text-[#565656] text-sm leading-6">
                  <ol className="list-decimal pl-6">
                    {texts.documentList.map((doc, index) => (
                      <li key={index} className="font-semibold">{doc.title}
                        <ul className="list-disc pl-6 font-normal">
                          {doc.details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* คำแนะนำการอัปโหลดเอกสาร */}
          <div className="flex justify-center py-1 bg-[white]">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl lg:max-w-screen-xl p-5 border">
              <div className="p-5 bg-white rounded-lg w-full max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-4">
                <Image src="/images/guidance/upload_guide_icon.svg" alt="Upload Guide" width={32} height={32} className="mr-3" />

                  <h2 className="font-bold text-lg sm:text-xl text-[#008A90]">{texts.uploadGuideHeader}</h2>
                </div>

                {/* รายละเอียดคำแนะนำ */}
                <ul className="text-[#565656] text-sm leading-6 list-disc pl-6 font-normal">
                  {texts.uploadGuide.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ข้อควรระวัง */}
          <div className="flex justify-center py-1 bg-[white]">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl lg:max-w-screen-xl p-5 border">
              <div className="p-5 bg-white rounded-lg w-full max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-4">
                <Image src="/images/guidance/warning_icon.svg" alt="Warning" width={32} height={32} className="mr-3" />
                  <h2 className="font-bold text-lg sm:text-xl text-[#008A90]">{texts.warningHeader}</h2>
                </div>

                {/* รายละเอียดข้อควรระวัง */}
                <ul className="text-[#565656] text-sm leading-6 list-disc pl-6 font-normal">
                  {texts.warningList.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* รายละเอียดเพิ่มเติม */}
          <div className="flex justify-center py-1 bg-[white]">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl lg:max-w-screen-xl p-2 border">
              <div className="p-5 bg-white rounded-lg w-full max-w-6xl mx-auto">
                <h2 className="font-bold text-lg sm:text-xl text-[#008A90]">{texts.additionalDetailsHeader}</h2>
                {/* รายละเอียด */}
                <div className="text-[#565656] text-sm mt-2 flex items-center">
                  <span>{texts.additionalDetails}</span>
                  <a
                    href={program === "ICT"
                      ? "https://www.ict.mahidol.ac.th/th/ict-round-1-ict-portfolio-academic-year-2025/"
                      : "https://www.ict.mahidol.ac.th/th/ict-round-1-ict-portfolio-academic-year-2025/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 flex items-center text-[#008A90] font-medium hover:underline"
                  >
                    <Image src="/images/guidance/link_icon.svg" alt="Link" width={20} height={20} className="mr-1" />
                    {texts.applicationAnnouncement}
                  </a>
                </div>
              </div>
            </div>
          </div>


          {/* ปุ่ม NextButton */}
          <div className="flex justify-center mt-5 mb-5">
            <NextButton onClick={() => router.push(`/apply/ApplicationInfo?program=${program}&id=${id}`)}>
              {texts.nextButton}
            </NextButton>
          </div>
        </div>
      </div>
    </div>
  );
}
