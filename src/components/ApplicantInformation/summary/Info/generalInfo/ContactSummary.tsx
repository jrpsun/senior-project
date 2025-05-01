import React from "react";
import { useLanguage } from "../../../../../hooks/LanguageContext"; // ใช้ context เพื่อดึงค่าภาษา
import { generalInfoTexts } from "../../../../../translation/generalInfo";
import { ContactInfoInterface } from "@components/types/generalInfoType";
import ReportProb from "@components/components/common/admin/reportProb";

/*interface ContactSummaryProps {
  phoneNumber: string;
  email: string;
  line: string;
  facebook: string;
  instagram: string;
}*/

interface ContactSummaryProps {
  props: ContactInfoInterface;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  setReport: any;
  email?: string;
}

const ContactSummary: React.FC<ContactSummaryProps> = ({ props, isVisible, setIsVisible, setReport, email }) => {
  const { language } = useLanguage();
  const texts = generalInfoTexts[language] ?? generalInfoTexts["ENG"];

  return (
    <div className="flex justify-center py-5 bg-[white]">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
        <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
          <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
            {texts.titleContact}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* หมายเลขโทรศัพท์ */}
            <div>
              <div className="flex flex-cols gap-2">
                <p className="text-[#565656] font-bold">{texts.phone}</p>
                <ReportProb isVisible={isVisible} problem={texts.phone} setReport={setReport} reportColumn={"phoneApplicant"}/>
              </div>
              <p className="text-[#565656] text-left pl-6">{props?.applicantPhone}</p>
            </div>
            
            {/* อีเมล */}
            <div>
              <p className="text-[#565656] font-bold">{texts.email}</p>
              <p className="text-[#565656] text-left pl-6">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Line ID */}
            <div>
              <p className="text-[#565656] font-bold">{texts.line}</p>
              <p className="text-[#565656] text-left pl-6">{props?.line || "-"}</p>
            </div>

            {/* Facebook */}
            <div>
              <p className="text-[#565656] font-bold">Facebook</p>
              <p className="text-[#565656] text-left pl-6">{props?.facebook || "-"}</p>
            </div>
            
            {/* Instagram */}
            <div>
              <p className="text-[#565656] font-bold">Instagram</p>
              <p className="text-[#565656] text-left pl-6">{props?.instagram || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSummary;