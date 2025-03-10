"use client";

import { useState } from "react";
import FormField from "../../form/FormField";
import { useLanguage } from "../../../hooks/LanguageContext"; // ใช้ context เพื่อดึงค่าภาษา
import { generalInfoTexts } from "../../../translation/generalInfo";
import { formatPhoneNumber, preventNonNumericInput } from "../../../utils/validation";

const ContactInfo: React.FC = () => {
  const { language } = useLanguage();
  const currentLanguage = language || "ENG"; // ป้องกัน undefined
  const currentTexts = generalInfoTexts[currentLanguage] || generalInfoTexts["ENG"]; // ใช้ ENG เป็น default

  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "test.raboobsamak@gmail.com",
    line: "",
    facebook: "",
    instagram: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
              value={formData.phoneNumber}
              onChange={(value) => handleChange("phoneNumber", formatPhoneNumber(value))}
              placeholder={currentTexts.phonePlaceholder}
              onKeyDown={preventNonNumericInput}
              required
              type="tel"
            />

            {/*  อีเมล (อ่านอย่างเดียว) */}
            <div className="flex flex-col">
              <label className="block text-[#565656] mb-1">
                {currentTexts.email} <span className="text-red-500">*</span>
              </label>
              <p className="text-[#565656] font-medium bg-[#F5F5F5] border border-gray-300 rounded-[10px] px-3 py-2">
                {formData.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Line ID */}
            <FormField
              label={currentTexts.line || "Line"}
              value={formData.line}
              onChange={(value) => handleChange("line", (value))}
              placeholder={currentTexts.line}
            />

            <FormField
              label="Facebook"
              value={formData.facebook}
              onChange={(value) => handleChange("facebook", (value))}
              placeholder={currentTexts.facebook}
            />
            {/* Instagram */}
            <FormField
              label="Instagram"
              value={formData.instagram}
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
