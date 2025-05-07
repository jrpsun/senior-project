"use client";

import { useEffect, useState } from "react";
import FormField from "../../form/FormField";
import { useLanguage } from "../../../hooks/LanguageContext"; // ใช้ context เพื่อดึงค่าภาษา
import { generalInfoTexts } from "../../../translation/generalInfo";
import { formatPhoneNumber} from "../../../utils/validation";
import { ContactInfoInterface } from "@components/types/generalInfoType";

interface ContractInfoProps {
  data: ContactInfoInterface;
  email: string;
  onChange: (data: any) => void;
}

const ContactInfo: React.FC<ContractInfoProps> = ({ data, email, onChange }) => {
  const { language } = useLanguage();
  const currentLanguage = language || "ENG";
  const currentTexts = generalInfoTexts[currentLanguage] || generalInfoTexts["ENG"];

  const [formData, setFormData] = useState({
    applicantPhone: "",
    applicantEmail: "",
    line: "",
    facebook: "",
    instagram: "",
  });

  const [changedData, setChangedData] = useState({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newChangedData = { ...changedData, [field]: value };
    setChangedData(newChangedData);
    onChange(newChangedData);
  };

  useEffect(() => {
    if (data && email) {
      setFormData({
        applicantPhone: data.applicantPhone || "",
        applicantEmail: email || "",
        line: data.line || "",
        facebook: data.facebook || "",
        instagram: data.instagram || "",
      });
      setChangedData({});
    }
  }, [data, email]);

  return (
    <div className="flex justify-center py-5 bg-[white]">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
        <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
          {/* หัวข้อเปลี่ยนตามภาษา */}
          <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
            {currentTexts.titleContact}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* หมายเลขโทรศัพท์ */}
            <FormField
              label={currentTexts.phone}
              value={formData.applicantPhone || ""}
              onChange={(value) => handleChange("applicantPhone", formatPhoneNumber(value))}
              placeholder={currentTexts.phonePlaceholder}
              required
              type="tel"
            />

            {/*  อีเมล (อ่านอย่างเดียว) */}
            <div className="flex flex-col">
              <label className="block text-[#565656] mb-1 flex items-center gap-1 relative">
                {currentTexts.email} <span className="text-red-500">*</span>
                <div className="relative group">
                  <span className="text-white bg-[#008A90] rounded-full w-4 h-4 text-xs flex items-center justify-center cursor-default">
                    i
                  </span>
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block 
                                  bg-white text-[#333] text-sm px-4 py-2 rounded-md shadow-md w-max max-w-xs border border-gray-300 z-20">
                    <p className="font-semibold">คำแนะนำในการแก้ไขข้อมูล</p>
                    <p>หากต้องการแก้ไขชื่อจริง นามสกุล หรืออีเมล กรุณาไปที่เมนู "แก้ไขข้อมูล"</p>
                  </div>
                </div>
              </label>
              <p className="text-[#565656] font-medium bg-[#F5F5F5] border border-gray-300 rounded-[10px] px-3 py-2">
                {formData.applicantEmail}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Line ID */}
            <FormField
              label={currentTexts.line || "Line"}
              value={formData.line || ""}
              onChange={(value) => handleChange("line", (value))}
              placeholder={currentTexts.line}
            />

            <FormField
              label={currentTexts.facebook || "Facebook"}
              value={formData.facebook || ""}
              onChange={(value) => handleChange("facebook", (value))}
              placeholder={currentTexts.facebook}
            />
            {/* Instagram */}
            <FormField
              label={currentTexts.instagram || "Instagram"}
              value={formData.instagram || ""}
              onChange={(value) => handleChange("instagram", (value))}
              placeholder={currentTexts.instagram}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
