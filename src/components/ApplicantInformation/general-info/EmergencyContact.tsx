"use client";

import { useState, useEffect,useMemo } from "react";
import FormField from "../../form/FormField";
import CustomSelect from "../../form/CustomSelect";
import { useLanguage } from "../../../hooks/LanguageContext";
import { generalInfoTexts, relationshipOptions } from "../../../translation/generalInfo";
import { validateThaiCharacters, validateEnglishCharacters, validateEmail, formatPhoneNumber, preventNonNumericInput, allowEnglishAndSpecialCharactersOnly } from "../../../utils/validation";
import { EmergencyContactInterface } from "@components/types/generalInfoType";

interface EmergencyContactProps {
  data: EmergencyContactInterface;
  onChange: (data: any) => void;
}

const EmergencyContact: React.FC<EmergencyContactProps> = ({ data, onChange }) => {
  const { language } = useLanguage();
  const currentTexts = generalInfoTexts[language] || generalInfoTexts["ENG"];

  const errorMessages = useMemo(
    () => ({
      ENG: { invalidEmail: "Invalid email address" },
      TH: { invalidEmail: "รูปแบบอีเมลไม่ถูกต้อง" },
    }),
    []
  );

  const [formData, setFormData] = useState({
    contactFirstNameTH: "",
    contactLastNameTH: "",
    contactMiddleNameTH: "",
    contactFirstNameEN: "",
    contactMiddleNameEN: "",
    contactLastNameEN: "",
    relationship: "",
    contactPhone: "",
    contactEmail: "",
  });

  const [emailError, setEmailError] = useState<string>("");

  useEffect(() => {
    if (data) {
      setFormData({
        contactFirstNameTH: data?.contactFirstNameTH || "",
        contactLastNameTH: data?.contactLastNameTH || "",
        contactMiddleNameTH: data?.contactMiddleNameTH || "",
        contactFirstNameEN: data?.contactFirstNameEN || "",
        contactMiddleNameEN: data?.contactMiddleNameEN || "",
        contactLastNameEN: data?.contactLastNameEN || "",
        relationship: data?.relationship || "",
        contactPhone: data?.contactPhone || "",
        contactEmail: data?.contactEmail || "",
      })
      setChangedData({});
    }
    if (emailError && formData.contactEmail !== "") {
      setEmailError(errorMessages[language]?.invalidEmail || "Invalid email");
    }
  }, [language, formData.contactEmail, emailError, errorMessages, data]);

  const [changedData, setChangedData] = useState({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newChangedData = { ...changedData, [field]: value };
    setChangedData(newChangedData);
    onChange(newChangedData);
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const emailValid = validateEmail(e.target.value);
    if (!emailValid && e.target.value !== "") {
      setEmailError(errorMessages[language]?.invalidEmail || "Invalid email");
    } else {
      setEmailError("");
    }
  };

  return (
    <div className="flex justify-center py-5 bg-[white]">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
        <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
          <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
            {currentTexts.titleEmergency}
          </h2>

          {/*กริดสำหรับชื่อไทย */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              label={currentTexts.firstName}
              value={formData.contactFirstNameTH || ""}
              onChange={(value) => handleChange("contactFirstNameTH", validateThaiCharacters(value))}
              placeholder={currentTexts.enterFirstName}
            />
            <FormField
              label={currentTexts.middleName}
              value={formData.contactMiddleNameTH || ""}
              onChange={(value) => handleChange("contactMiddleNameTH", validateThaiCharacters(value))}
              placeholder={currentTexts.enterMiddleName}
            />
            <FormField
              label={currentTexts.lastName}
              value={formData.contactLastNameTH || ""}
              onChange={(value) => handleChange("contactLastNameTH", validateThaiCharacters(value))}
              placeholder={currentTexts.enterLastName}
            />
          </div>

          {/* กริดสำหรับชื่อภาษาอังกฤษ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <FormField
              label={currentTexts.firstNameEng}
              value={formData.contactFirstNameEN || ""}
              onChange={(value) => handleChange("contactFirstNameEN", validateEnglishCharacters(value))}
              placeholder={currentTexts.enterFirstNameEng}
              required
            />
            <FormField
              label={currentTexts.middleNameEng}
              value={formData.contactMiddleNameEN || ""}
              onChange={(value) => handleChange("contactMiddleNameEN", validateEnglishCharacters(value))}
              placeholder={currentTexts.enterMiddleNameEng}
            />
            <FormField
              label={currentTexts.lastNameEng}
              value={formData.contactLastNameEN || ""}
              onChange={(value) => handleChange("contactLastNameEN", validateEnglishCharacters(value))}
              placeholder={currentTexts.enterLastNameEng}
              required
            />
          </div>

          {/* กริดสำหรับ Relationship / Phone / Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <CustomSelect
              label={currentTexts.relationship}
              options={relationshipOptions[language] || relationshipOptions["ENG"]}
              value={formData.relationship || ""}
              onChange={(selectedOption) =>
                handleChange("relationship", selectedOption ? selectedOption.value : "")
              }
              placeholder={currentTexts.selectRelationship}
              width="100%"
            />
            <FormField
              label={currentTexts.phone}
              value={formData.contactPhone || ""}
              onChange={(value) => handleChange("contactPhone", formatPhoneNumber(value))}
              placeholder={currentTexts.phonePlaceholder}
              onKeyDown={preventNonNumericInput}
              required
              type="tel"
            />
            <FormField
              key={language} // Force re-render เมื่อเปลี่ยนภาษา
              label={currentTexts.email}
              value={formData.contactEmail || ""}
              onChange={(value) => handleChange("contactEmail", allowEnglishAndSpecialCharactersOnly(value))}
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
