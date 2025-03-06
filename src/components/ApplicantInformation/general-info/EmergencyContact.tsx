"use client";

import { useState, useEffect } from "react";
import FormField from "../../form/FormField";
import CustomSelect from "../../form/CustomSelect";
import { useLanguage } from "../../../hooks/LanguageContext";
import { generalInfoTexts, relationshipOptions } from "../../../translation/generalInfo";
import { validateThaiCharacters, validateEnglishCharacters, validateEmail, formatPhoneNumber, preventNonNumericInput,allowEnglishAndSpecialCharactersOnly } from "../../../utils/validation";

const EmergencyContact: React.FC = () => {
  const { language } = useLanguage(); // ใช้ language ตรงๆ
  const currentTexts = generalInfoTexts[language] || generalInfoTexts["ENG"];

  const errorMessages: Record<string, { invalidEmail: string }> = {
    ENG: { invalidEmail: "Invalid email address" },
    TH: { invalidEmail: "รูปแบบอีเมลไม่ถูกต้อง" },
  };

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    middleName: "",
    firstNameEng: "",
    middleNameEng: "",
    lastNameEng: "",
    relationship: "",
    phoneNumber: "",
    email: "",
  });

  const [emailError, setEmailError] = useState<string>("");

  // เปลี่ยน error message เมื่อเปลี่ยนภาษา (เฉพาะถ้ามี error อยู่)
  useEffect(() => {
    if (emailError && formData.email !== "") {
      setEmailError(errorMessages[language]?.invalidEmail || "Invalid email");
    }
  }, [language, formData.email]);
  


  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const emailValid = validateEmail(e.target.value);
    if (!emailValid && e.target.value !== "") {
      setEmailError(errorMessages[language]?.invalidEmail || "Invalid email");
    } else {
      setEmailError(""); // ถ้าอีเมลถูกต้องให้ล้าง error
    }
  };

  return (
    <div className="flex justify-center py-5 bg-[white]">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
        <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
          <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
            {currentTexts.titleEmergency}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label={currentTexts.firstName}
              value={formData.firstName}
              onChange={(value) => handleChange("firstName", validateThaiCharacters(value))}
              placeholder={currentTexts.enterFirstName}
             
            />
            <FormField
              label={currentTexts.middleName}
              value={formData.middleName}
              onChange={(value) => handleChange("middleName", validateThaiCharacters(value))}
              placeholder={currentTexts.enterMiddleName}
            />
            <FormField
              label={currentTexts.lastName}
              value={formData.lastName}
              onChange={(value) => handleChange("lastName", validateThaiCharacters(value))}
              placeholder={currentTexts.enterLastName}
              
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <FormField
              label={currentTexts.firstNameEng}
              value={formData.firstNameEng}
              onChange={(value) => handleChange("firstNameEng", validateEnglishCharacters(value))}
              placeholder={currentTexts.enterFirstNameEng}
              required
            />
            <FormField
              label={currentTexts.middleNameEng}
              value={formData.middleNameEng}
              onChange={(value) => handleChange("middleNameEng", validateEnglishCharacters(value))}
              placeholder={currentTexts.enterMiddleNameEng}
            />
            <FormField
              label={currentTexts.lastNameEng}
              value={formData.lastNameEng}
              onChange={(value) => handleChange("lastNameEng", validateEnglishCharacters(value))}
              placeholder={currentTexts.enterLastNameEng}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <CustomSelect
              label={currentTexts.relationship}
              options={relationshipOptions[language] || relationshipOptions["ENG"]}
              value={formData.relationship}
              onChange={(selectedOption) =>
                handleChange("relationship", selectedOption ? selectedOption.value : "")
              }
              placeholder={currentTexts.selectRelationship}
              width="100%"
            />
            <FormField
              label={currentTexts.phone}
              value={formData.phoneNumber}
              onChange={(value) => handleChange("phoneNumber", formatPhoneNumber(value))}
              placeholder={currentTexts.phonePlaceholder}
              onKeyDown={preventNonNumericInput}
              required
              type="tel"
            />
            <FormField
              key={language} // Force re-render เมื่อเปลี่ยนภาษา
              label={currentTexts.email}
              value={formData.email}
              onChange={(value) => handleChange("email", allowEnglishAndSpecialCharactersOnly(value))}
              placeholder={currentTexts.enterEmail}
              onBlur={handleEmailBlur}
              error={emailError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact;
