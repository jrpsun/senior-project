import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormField from "../../form/FormField";
import { useLanguage } from "../../../hooks/LanguageContext";
import { educationInfoTexts, EnglishTestTypeOptions, ScoreOptions } from "../../../translation/educationInfo";
import FileUpload from "../../form/FileUpload";
import CustomSelect from "../../form/CustomSelect";
import DateInput from "../../common/date";
import { validateTestScore, preventInvalidTestScoreInput } from "../../../utils/validation";

const EnglishTestScore = () => {
  const searchParams = useSearchParams();
  const programParam = searchParams.get("program"); // ดึงค่าจาก query params

  const { language } = useLanguage();
  const currentLanguage = language || "ENG";
  const currentTexts = educationInfoTexts[currentLanguage] || educationInfoTexts["ENG"];

  const [program, setProgram] = useState(programParam || "ICT");

  useEffect(() => {
    if (programParam) {
      setProgram(programParam);
    }
  }, [programParam]);

  const [formData, setFormData] = useState({
    testType: "",
    score: "",
    testDate: "",
    document: null,
    listeningScore: "",
    readingScore: "",
    writingScore: "",
    speakingScore: "",
    literacyScore: "",
    comprehensionScore: "",
    conversationScore: "",
    productionScore: "",
    listeningComprehensionScore: "",
    structureWrittenScore: "",
    readingComprehensionScore: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({}); // เก็บข้อผิดพลาด

  if (program !== "ICT") return null;


  const handleChange = (field: string, value: string | number | File | null | undefined) => {
    setFormData((prev) => {
      // หากเปลี่ยน testType -> รีเซ็ตค่าทั้งหมด
      if (field === "testType") {
        return {
          testType: typeof value === "string" ? value : "",
          score: "",
          testDate: "",
          document: null,
          listeningScore: "",
          readingScore: "",
          writingScore: "",
          speakingScore: "",
          literacyScore: "",
          comprehensionScore: "",
          conversationScore: "",
          productionScore: "",
          listeningComprehensionScore: "",
          structureWrittenScore: "",
          readingComprehensionScore: "",
        };
      }
      if (field === "score" || field.includes("Score")) {
        const sanitizedValue = validateTestScore(value, prev.testType);
        return {
          ...prev,
          [field]: sanitizedValue,
        };
      }
      return { ...prev, [field]: value };
    });

    setErrors((prev) => ({
      ...prev,
      [field]: value ? "" : "",
    }));
  };

  const renderScoreField = (key: string, label: string, placeholder = "", info: string) => (
    <div key={key} className="flex flex-col w-full sm:w-[400px]">
      <FormField
        label={label}
        value={formData[key] ?? ""}
        onChange={(value) => handleChange(key, value)}
        type="text"
        className="w-full h-full min-h-[50px]"
        placeholder={placeholder || "กรอกคะแนน"} 
        onKeyDown={(event) => preventInvalidTestScoreInput(event, formData[key], formData.testType)}
      />
      {/* แสดง Error Message เฉพาะเมื่อมันเป็นข้อความ (ไม่ใช่ตัวเลข) */}
      {errors[key] && isNaN(Number(errors[key])) && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
      <p className="text-sm text-[#B3B3B3] mt-1">{info}</p>
    </div>
  );
  

  return (
    <div className="flex justify-center py-5 bg-white">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
        <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
          <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
            {currentTexts.englishProficiencyTestScore}
          </h2>

          <FileUpload
            label={currentTexts.uploadEngTestScore}
            onChange={(file) => handleChange("document", file)}
            fileType="pdf"
            maxSize="5 MB"
            accept=".pdf"
            infoMessage={<p>{currentTexts.infouploadEngTestScore}</p>}
            required={false}
          />
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-[400px_auto] gap-x-2 gap-y-1 items-center">
            <div className="w-sm:w-[400px]">
              <CustomSelect
                label={currentTexts.englishTestType}
                options={EnglishTestTypeOptions}
                value={formData.testType}
                onChange={(selectedOption) => handleChange("testType", selectedOption?.value || "")}
                placeholder={currentTexts.englishTestTypePlaceholder}
                required={false}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[400px_400px] lg:gap-x-[50px] gap-y-1 mb-1">
            <div className="w-full max-w-[400px] mb-4">
              <div className="w-full max-w-[400px] mb-4">
                {["IGCSE_ESL", "IGCSE_FL"].includes(formData.testType) ? (
                  <CustomSelect
                    label={currentTexts.score}
                    options={ScoreOptions}
                    value={formData.score}
                    onChange={(selectedOption) => handleChange("score", selectedOption?.value || "")}
                    placeholder={currentTexts.selectScore}
                    required={false}
                  />
                ) : (
                  <FormField
                    label={currentTexts.score}
                    value={formData.score}
                    onChange={(value) => handleChange("score", value)}
                    type="text"
                    placeholder={currentTexts.scorePlaceholder}
                    required={false}
                  />
                )}
              </div>

            </div>
            <div className="w-full sm:w-[400px] max-w-[400px]">
              <label className="block text-[#565656]">{currentTexts.testDate} </label>
              <DateInput
                selected={formData.testDate}
                onChange={(date) => handleChange("testDate", date)}
                placeholderText={currentTexts.selecttestDate}
                required={false}
              />
              <div className="flex items-start text-sm text-[#B3B3B3] mt-2">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                >
                  <path
                    d="M10.0804 0.0176134C4.55191 0.003686 0.044976 4.46514 0.0137688 9.98192C-0.0174547 15.5105 4.42992 20.0035 9.94663 20.0175C15.4752 20.0314 19.9821 15.5699 20.0133 10.0531C20.0563 4.52454 15.5971 0.0315615 10.0804 0.0176134ZM9.93497 2.71126C10.4193 2.71041 10.8207 2.8869 11.151 3.2289C11.4931 3.55907 11.658 3.97224 11.6573 4.45658C11.6566 4.94092 11.4907 5.34285 11.1476 5.68604C10.8164 6.01738 10.4027 6.18349 9.9302 6.18432C9.43405 6.18519 9.03263 6.02051 8.6905 5.69035C8.36019 5.36016 8.18356 4.94701 8.18422 4.46267C8.1849 3.96652 8.36265 3.56456 8.70569 3.23319C9.03693 2.89003 9.45063 2.71211 9.93497 2.71126ZM7.10548 7.19339L11.7008 7.18533L11.689 15.7499L13.0712 15.7474L13.0696 16.8461L7.0922 16.8565L7.09371 15.7579L8.46403 15.7555L8.47429 8.28961L7.10397 8.29202L7.10548 7.19339Z"
                    fill="#008A91"
                  />
                </svg>
                <div>{currentTexts.infoTestDate}</div>
              </div>
            </div>
          </div>
          {/* แสดงฟิลด์คะแนนเฉพาะเมื่อเลือก IELTS หรือ TOEFL iBT */}
          {["IELTS", "TOEFL_IBT"].includes(formData.testType) && (
          <div className="grid grid-cols-1 lg:grid-cols-[400px_400px] lg:gap-x-[50px] gap-y-1 mb-1">
              {[
                { key: "listeningScore", label: currentTexts.listeningScore, placeholder: currentTexts.listeningScorePlaceholder },
                { key: "readingScore", label: currentTexts.readingScore, placeholder: currentTexts.readingScorePlaceholder },
                { key: "writingScore", label: currentTexts.writingScore, placeholder: currentTexts.writingScorePlaceholder },
                { key: "speakingScore", label: currentTexts.speakingScore, placeholder: currentTexts.speakingScorePlaceholder }
              ].map(({ key, label, placeholder }) =>
                renderScoreField(
                  key,
                  label,
                  placeholder,
                  formData.testType === "IELTS" ? currentTexts.infoIELTSScore : currentTexts.infoTOEFLInternetScore
                )
              )}
            </div>
          )}

          {/* แสดงฟิลด์คะแนนเฉพาะเมื่อเลือก Duolingo */}
          {formData.testType === "Duolingo" && (
                      <div className="grid grid-cols-1 lg:grid-cols-[400px_400px] lg:gap-x-[50px] gap-y-1 mb-1">
              {[
                { key: "literacyScore", label: currentTexts.literacyScore, placeholder: currentTexts.literacyScorePlaceholder, info: currentTexts.infoDuolingoScore },
                { key: "comprehensionScore", label: currentTexts.comprehensionScore, placeholder: currentTexts.comprehensionScorePlaceholder, info: currentTexts.infoDuolingoScore },
                { key: "conversationScore", label: currentTexts.conversationScore, placeholder: currentTexts.conversationScorePlaceholder, info: currentTexts.infoDuolingoScore },
                { key: "productionScore", label: currentTexts.productionScore, placeholder: currentTexts.productionScorePlaceholder, info: currentTexts.infoDuolingoScore }
              ].map(({ key, label, placeholder, info }) => renderScoreField(key, label, placeholder, info))}
            </div>
          )}

          {/* แสดงฟิลด์คะแนนเฉพาะเมื่อเลือก TOEFL ITP & TOEFL PBT */}
          {["TOEFL_ITP", "TOEFL_PBT"].includes(formData.testType) && (
              <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-y-4 mt-6 w-full">
              {[
                { key: "listeningComprehensionScore", textKey: "listeningComprehensionScore", placeholderKey: "listeningComprehensionScorePlaceholder", infoKey: "infoTOEFLScore" },
                { key: "structureWrittenScore", textKey: "structureWrittenScore", placeholderKey: "structureWrittenScorePlacehodler", infoKey: "infoTOEFLScore" },
                { key: "readingComprehensionScore", textKey: "readingComprehensionScore", placeholderKey: "readingComprehensionScorePlaceholder", infoKey: "infoTOEFLReadingScore" }
              ].map(({ key, textKey, placeholderKey, infoKey }) => (
                <div key={key} className="w-full sm:w-[315px]">
                  <FormField
                    label={currentTexts[textKey]}
                    value={formData[key]}
                    onChange={(value) => handleChange(key, value)}
                    type="text"
                    placeholder={currentTexts[placeholderKey]}
                    required
                  />
                  <p className="text-sm text-[#B3B3B3] mt-1">
                    {currentTexts[infoKey]}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EnglishTestScore;