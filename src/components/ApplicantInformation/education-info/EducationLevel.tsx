"use client";

import { useState, useEffect } from "react";
import FormField from "../../form/FormField";
import { useLanguage } from "../../../hooks/LanguageContext";
import { educationInfoTexts, degreeOptions, majorOptions } from "../../../translation/educationInfo";
import FileUpload from "../../form/FileUpload";
import CustomSelect from "../../form/CustomSelect";
import axios from "axios";
import { formatGPAValue, validateTestScore, preventInvalidTestScoreInput, validateCreditInput } from "../../../utils/validation";
import DateInput from "../../common/date";
import { useSearchParams } from "next/navigation";


const generateGraduationYears = (language: string) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => {
        const yearAD = currentYear - i; // ค.ศ. (AD)
        const yearBE = yearAD + 543; // พ.ศ. (BE)
        return {
            value: yearAD.toString(),
            label: language === "TH" ? yearBE.toString() : yearAD.toString(),
        };
    });
};

const DEFAULT_DEGREE = "Mathayom6";

const EducationLevel: React.FC = () => {
    const searchParams = useSearchParams(); // ใช้สำหรับดึงค่าจาก URL
    const programParam = searchParams.get("program"); // ดึงค่าจาก query params

    const [formData, setFormData] = useState({
        program: programParam || "", //ลองเทสโดยเปลี่ยนเป็น DST หรือ ICT
        currentStatus: "studying", // ตั้งค่าเริ่มต้นให้เป็น "กำลังศึกษา"
        graduationDate: null,
        graduationYear: "",
        mathScore: "",
        scienceScore: "",
        socialStudiesScore: "",
        languageArtsScore: "",
        EducationLevel: "",
        transcript: null as File | null, // ใช้สำหรับอัปโหลดไฟล์
        degree: "Mathayom6",
        customDegree: "",
        country: "Thailand",
        province: "",
        schoolName: "",
        major: "",
        customMajor: "",
        cumulativeGPA: "",
        gpaMath: "",
        gpaEnglish: "",
        gpaScience: "",
        computerTotalCredit: "",
        computerSubject: "",
        mathTotalCredit: "",
        mathSubject: "",
        scienceTotalCredit: "",
        scienceSubject: "",
        englishTotalCredit: "",
        englishSubject: "",


    });
    const { language } = useLanguage();
    const isDST = formData.degree === "Mathayom6" && formData.program === "DST";
    const isICT = formData.degree === "Mathayom6" && formData.program === "ICT";
    const currentLanguage = language || "ENG";
    const currentTexts = educationInfoTexts[currentLanguage] || educationInfoTexts["ENG"];
    const [provinceOptions, setProvinceOptions] = useState([]);
    const graduationYearOptions = generateGraduationYears(language);
    const isHighSchoolOrVocational = ["Mathayom6", "Grade12/13", "VocCert"].includes(formData.degree);
    const hasMajorField = ["Mathayom6", "VocCert"].includes(formData.degree);
    const shouldShowGraduationDate = ["Mathayom6", "VocCert"].includes(formData.degree) && formData.currentStatus === "graduated";
    const shouldShowSubjectFields = formData.degree === "Grade12/13";
    const shouldShowGPAX = ["Mathayom6", "VocCert"].includes(formData.degree);
    const safeLanguage = (language === "EN" ? "ENG" : language) as keyof typeof majorOptions;
    const majorType = formData.degree === "VocCert" ? "vocational" : "highSchool";
    const majorList = majorOptions[safeLanguage]?.[majorType] || [];
    const isVocCert = formData.degree === "VocCert";
    const isThaiEducation = ["Mathayom6", "VocCert"].includes(formData.degree);
    const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
    const shouldShowProvince = formData.degree !== "Grade12/13" || (formData.degree === "Grade12/13" && formData.country === "TH");

    const renderRadioButton = (value: string, label: string, disabled = false) => (
        <label className={`flex items-center cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
            <input
                type="radio"
                name="currentStatus"
                value={value}
                checked={formData.currentStatus === value}
                onChange={() => handleChange("currentStatus", value)}
                className="hidden"
                disabled={disabled}
            />
            <div
                className={`w-5 h-5 rounded-full border-2 ${formData.currentStatus === value ? "border-[#008A90] bg-[#008A90]" : "border-gray-400 bg-white"
                    } flex items-center justify-center`}
            >
                {formData.currentStatus === value && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
            <span className="ml-2 text-[#565656]">{label}</span>
        </label>
    );
    const renderFileUpload = () => {
        if (formData.currentStatus === "studying") {
            return (
                <FileUpload
                    label={currentTexts.transcript}
                    onChange={(file) => console.log(file)}
                    fileType="pdf"
                    maxSize="5 MB"
                    accept=".pdf"
                    infoMessage={<p>{currentTexts.studyingInfoTranscipt}</p>}
                />
            );
        } else if (formData.currentStatus === "graduated") {
            return (
                <FileUpload
                    label={currentTexts.transcript}
                    onChange={(file) => console.log(file)}
                    fileType="pdf"
                    maxSize="5 MB"
                    accept=".pdf"
                    infoMessage={<p>{currentTexts.graduatedInfoTranscript}</p>}
                />
            );
        }
        return null;
    };
    const renderSubjectField = (subjectKey: string, totalCreditKey: string, infoKey: string) => (
        <div className="mb-3 w-full">
            <label className="block text-[#565656] mb-1">{currentTexts?.[subjectKey]}</label>
            <div className="grid grid-cols-1 sm:grid-cols-[350px_auto] gap-x-4 gap-y-1">
                {/* หน่วยกิตรวม (350px) */}
                <div>
                    <FormField
                        label={currentTexts?.totalCredit}
                        value={formData[totalCreditKey] || ""}
                        onChange={(value) => handleChange(totalCreditKey, validateCreditInput(value))}
                        onKeyDown={(event) => restrictInvalidCreditInput(event, formData[totalCreditKey] || "")}
                        type="text"
                        placeholder={currentTexts?.totalCreditPlaceholder}
                        required
                    />
                </div>
                {/* รายวิชา (เต็มแถวในจอใหญ่) */}
                <div>
                    <FormField
                        label={currentTexts?.subject}
                        value={formData[subjectKey] || ""}
                        onChange={(value) => handleChange(subjectKey, value)}
                        type="text"
                        placeholder={currentTexts?.subjectPlaceholder}
                    />
                </div>
            </div>
            <p className="text-sm text-[#B3B3B3] mt-1">{currentTexts?.[infoKey]}</p>
        </div>
    );

    const formatInputValue = (field: string, value: string) => {
        const formatRules: Record<string, (val: string) => string> = {
            cumulativeGPA: formatGPAValue,
            gpaEnglish: formatGPAValue,
            gpaScience: formatGPAValue,
            gpaMath: formatGPAValue,
            mathTotalCredit: validateCreditInput,
            scienceTotalCredit: validateCreditInput,
            englishTotalCredit: validateCreditInput,
            computerTotalCredit: validateCreditInput,
        };

        return formatRules[field] ? formatRules[field](value) : value;
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: formatInputValue(field, value) ?? "",
        }));
    };
    useEffect(() => {
        if (programParam) {
            setFormData((prev) => ({ ...prev, program: programParam }));
        }
    }, [programParam]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            degree: DEFAULT_DEGREE,
        }));
    }, []);
    useEffect(() => {
        if (formData.degree === "GED") {
            setFormData((prev) => ({
                ...prev,
                currentStatus: "graduated", // บังคับเป็นสำเร็จการศึกษา
            }));
        }
    }, [formData.degree]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get("/data/country-list.json"); // เปลี่ยนเป็น API ที่ใช้จริง
                let countryData = response.data.map((country: any) => ({
                    value: country.alpha2,
                    label: language === "TH" ? country.name : country.enName
                }));

                // เรียงลำดับประเทศตามภาษาไทย (ก-ฮ) หรืออังกฤษ (A-Z)
                countryData.sort((a, b) => a.label.localeCompare(b.label, language === "TH" ? "th" : "en"));

                setCountries(countryData);
            } catch (error) {
                console.error("Error fetching country data:", error);
            }
        };

        fetchCountries();
    }, [language]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json");
                const provincesData = response.data.map((province: any) => ({
                    value: province.id.toString(),
                    labelTH: province.name_th,
                    labelEN: province.name_en,
                }));

                setProvinceOptions(provincesData.map(p => ({
                    value: p.value,
                    label: language === "TH" ? p.labelTH : p.labelEN,
                })));
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };

        fetchProvinces();
    }, [language]);

    return (
        <div className="flex justify-center py-5 bg-white">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
                    {/* หัวข้อเปลี่ยนตามภาษา */}
                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
                        {currentTexts.titleEducation}
                    </h2>
                    {/* สถานะปัจจุบัน */}
                    <div className="mb-4">
                        <label className="block text-[#565656] mb-1">
                            {currentTexts.currentStatus} <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-x-4">
                            {renderRadioButton("studying", currentTexts.studyingStatus, formData.degree === "GED")}
                            {renderRadioButton("graduated", currentTexts.graduatedStatus)}
                        </div>
                    </div>
                    {/* อัปโหลดเอกสาร */}
                    <div className="mt-4">{renderFileUpload()}</div>

                    <div className="mb-4 grid grid-cols-1 sm:grid-cols-[350px_auto] gap-x-2 gap-y-1 items-center">
                        {/* Dropdown เลือกระดับการศึกษา */}
                        <div className="w-[350px]">
                            <CustomSelect
                                label={currentTexts.degree}
                                options={degreeOptions[language] || degreeOptions["ENG"]}
                                value={formData.degree}
                                onChange={(selectedOption) =>
                                    handleChange("degree", selectedOption ? selectedOption.value : "")
                                }
                                placeholder={currentTexts.degreePlaceholder}
                            />
                        </div>

                        {/* แสดงฟิลด์ระบุเพิ่มเติมเมื่อเลือก "อื่นๆ" */}
                        {formData.degree === "other" && (
                            <div className="w-[350px]">
                                <FormField
                                    label={currentTexts.other}
                                    value={formData.customDegree || ""}
                                    onChange={(value) => handleChange("customDegree", value)}
                                    type="text"
                                    placeholder={currentTexts.other}
                                    required
                                />
                            </div>
                        )}
                    </div>
                    {/* แสดงฟิลด์ปีที่สำเร็จการศึกษา กรณีที่เลือกจบการศึกษา */}
                    {formData.currentStatus === "graduated" &&
                        (["GED", "Grade12/13", "other"].includes(formData.degree)) && (
                            <div className="mb-4 w-[350px]">
                                <CustomSelect
                                    label={currentTexts.graduationYear}
                                    options={graduationYearOptions}
                                    value={formData.graduationYear}
                                    onChange={(selectedOption) =>
                                        handleChange("graduationYear", selectedOption ? selectedOption.value : "")
                                    }
                                    placeholder={currentTexts.graduationYearPlaceholder}
                                />
                            </div>
                        )}
                    {/* แสดงฟอร์มเฉพาะเมื่อเลือก มัธยมศึกษาตอนปลาย (ม.6), Grade 12, 13, ปวช. */}
                    {isHighSchoolOrVocational && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-[350px_350px] gap-x-[100px] gap-y-1 mb-1">
                                {/* กรณีเป็น ม.6 หรือ ปวช. แสดง "Thailand" */}
                                {isThaiEducation ? (
                                    <div>
                                        <label className="block text-[#565656] mb-1">
                                            {currentTexts?.country || "ประเทศที่ตั้งสถานศึกษา"} <span className="text-red-500">*</span>
                                        </label>
                                        <p className="text-[#565656] font-medium indent-1">{currentTexts.countryInfo}</p>
                                    </div>
                                ) : (
                                    /* กรณีเป็น Grade 12/Year 13 ให้เลือกประเทศได้ */
                                    <div className="w-full sm:w-auto max-w-[350px]">
                                        <CustomSelect
                                            label={currentTexts.country}
                                            options={countries}
                                            value={formData.country}
                                            onChange={(selectedOption) => handleChange("country", selectedOption?.value || "")}
                                            placeholder={currentTexts.countryPlaceholder}
                                            className="w-full sm:w-[350px] max-w-[350px] inline-block"
                                        />
                                    </div>
                                )}

                                {/* จังหวัดที่ตั้งสถานศึกษา (แสดงเฉพาะเมื่อเป็นไทย) */}
                                {shouldShowProvince && (
                                    <div className="w-full sm:w-auto max-w-[350px]">
                                        <CustomSelect
                                            label={currentTexts.province}
                                            options={provinceOptions}
                                            value={formData.province}
                                            onChange={(selectedOption) => handleChange("province", selectedOption ? selectedOption.value : "")}
                                            placeholder={currentTexts.provincePlaceholder}
                                            className="w-full sm:w-[350px] max-w-[350px] inline-block"
                                        />
                                    </div>
                                )}

                                {/* ฟิลด์วันที่จบการศึกษา (แสดงเฉพาะ ม.6 หรือ ปวช. ที่จบแล้ว) */}
                                {shouldShowGraduationDate && (
                                    <div className="mb-4 w-[350px]">
                                        <label className="block text-[#565656] mb-1">{currentTexts.graduationDate} <span className="text-red-500">*</span></label>
                                        <DateInput
                                            selected={formData.graduationDate}
                                            onChange={(date) => handleChange("graduationDate", date)}
                                            placeholderText={currentTexts.graduationDatePlaceholder}
                                            mode="expiry"
                                        />
                                    </div>
                                )}

                            </div>
                            {/* ชื่อสถานศึกษา */}
                            <div className="mb-4 w-[350px]">
                                <FormField
                                    label={currentTexts.school}
                                    value={formData.schoolName}
                                    onChange={(value) => handleChange("schoolName", value)}
                                    type="text"
                                    placeholder={currentTexts.schoolPlaceholder}
                                    required
                                />
                            </div>

                            {hasMajorField && (
                                <div className="mb-6 grid grid-cols-1 sm:grid-cols-[350px_auto] gap-x-[100px] gap-y-4 items-center">
                                    {/* Dropdown เลือกสาขา */}
                                    <div className="w-[350px]">
                                        <CustomSelect
                                            label={currentTexts.major}
                                            options={[...majorList]}
                                            value={formData.major}
                                            onChange={(selectedOption) => handleChange("major", selectedOption ? selectedOption.value : "")}
                                            placeholder={currentTexts.majorPlaceholder}
                                        />
                                    </div>

                                    {/* ฟิลด์ระบุเพิ่มเติมเมื่อเลือก "อื่นๆ" */}
                                    {formData.major === "other" && (
                                        <div className="w-[350px]">
                                            <FormField
                                                label={currentTexts.other}
                                                value={formData.customMajor || ""}
                                                onChange={(value) => handleChange("customMajor", value)}
                                                type="text"
                                                placeholder={currentTexts.other}
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* แสดง GPAX สำหรับทั้ง DST และ ICT */}
                            {shouldShowGPAX && (
                                <div className="w-[350px]">
                                    <FormField
                                        label={currentTexts.cumulativeGPA}
                                        value={formData.cumulativeGPA}
                                        onChange={(value) => handleChange("cumulativeGPA", value)}
                                        type="text"
                                        placeholder={currentTexts.cumulativeGPAPlaceholder}
                                        required
                                    />
                                </div>
                            )}
                            {shouldShowGPAX && <p className="text-sm text-[#B3B3B3] mt-1">{currentTexts.cumulativeGPAInfo}</p>}

                            {/* แสดงเกรดเฉลี่ย 4 วิชาเฉพาะ DST */}
                            {shouldShowGPAX && isDST && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 w-full">
                                    {[
                                        { key: "gpaMath", textKey: "mathematicsGPA", placeholderKey: "mathematicsGPAPlaceholder", infoKey: "mathematicsGPAInfo" },
                                        { key: "gpaEnglish", textKey: "englishGPA", placeholderKey: "englishGPAPlaceholder", infoKey: "englishGPAInfo" },
                                        { key: "gpaScience", textKey: "scienceGPA", placeholderKey: "scienceGPAPlaceholder", infoKey: "scienceGPAInfo" }
                                    ].map(({ key, textKey, placeholderKey, infoKey }) => (
                                        <div key={key} className="w-full sm:w-[320px]">
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
                        </>
                    )}
                    {isVocCert && (
                        <div className="mt-2">
                            {renderSubjectField("ComputerScienceSubject", "computerTotalCredit", "infoComputerScienceSubject")}
                        </div>
                    )}

                    {/* หมวดหมู่วิชาตามเกณฑ์ (เฉพาะ Grade 12/Year 13) */}
                    {shouldShowSubjectFields && (
                        <>
                            {renderSubjectField("mathSubject", "mathTotalCredit", "infoMathtotalCredit")}
                            {renderSubjectField("scienceSubject", "scienceTotalCredit", "infoSciencetotalCredit")}
                            {renderSubjectField("englishSubject", "englishTotalCredit", "infoEnglishtotalCredit")}
                        </>
                    )}
                    {/* แสดงฟอร์มเฉพาะเมื่อเลือก GED*/}
                    {formData.degree === "GED" && (
                        <>
                            <div >
                                <label className="text-[#565656]">
                                    {currentTexts?.GEDScore || "ผลคะแนน"}
                                </label>
                                <div className="text-sm text-[#B3B3B3] flex items-center ">
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
                                    {currentTexts?.infoGEDScore || "ต้องได้คะแนนไม่น้อยกว่า 145 คะแนนในแต่ละรายวิชา"}
                                </div>
                            </div>

                            {/* กล่องกรอกคะแนน (4 วิชา) */}
                            <div className="grid grid-cols-1 sm:grid-cols-[350px_350px] gap-x-[100px] gap-y-1 mb-1">
                                {[
                                    { key: "mathScore", label: currentTexts.mathScore, placeholder: currentTexts.mathScorePlaceholder },
                                    { key: "scienceScore", label: currentTexts.scienceScore, placeholder: currentTexts.scienceScorePlaceholder },
                                    { key: "socialStudiesScore", label: currentTexts.socialStudiesScore, placeholder: currentTexts.socialStudiesScorePlaceholder },
                                    { key: "languageArtsScore", label: currentTexts.languageArtsScore, placeholder: currentTexts.languageArtsScorePlaceholder }
                                ].map(({ key, label, placeholder }) => (
                                    <div key={key} className="flex justify-center sm:justify-start w-full">
                                        <div className="w-full sm:w-[350px]">
                                            <FormField
                                                label={label}
                                                value={formData[key]}
                                                onChange={(value) => handleChange(key, validateTestScore(value, formData.degree, formData[key]))}
                                                onKeyDown={(event) => preventInvalidTestScoreInput(event, formData[key], formData.degree)}
                                                type="text"
                                                placeholder={placeholder}
                                                required
                                                className="w-full h-full min-h-[50px]"
                                            />

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EducationLevel;
