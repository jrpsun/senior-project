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
import { EducationBackground, OCRTranscriptICTResponse } from "@components/types/educationInfoType";
import { OCRLoadingModal } from "@components/components/OCRLoading";
import { openPdfInNewTab } from "@components/utils/pdfUtils";


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

interface EducationLevelProps {
    data: EducationBackground;
    appId: string;
    name: string;
    onChange: (data: any) => void;
}

const EducationLevel: React.FC<EducationLevelProps> = ({ data, appId, name, onChange }) => {
    const searchParams = useSearchParams(); // ใช้สำหรับดึงค่าจาก URL
    const program = searchParams.get("program"); // ดึงค่าจาก query params

    const [formData, setFormData] = useState({
        currentStatus: "studying", // ตั้งค่าเริ่มต้นให้เป็น "กำลังศึกษา" studying
        graduateDate: "", //
        graduateYear: "", //
        gedMathematics: "", // ged
        gedScience: "", // ged
        gedSocialStudies: "", // ged
        gedLanguageArts: "", // ged
        docCopyTrans: "", // ใช้สำหรับอัปโหลดไฟล์
        docCopyName: "",
        docCopySize: "",
        academicType: "",//
        customAcademicType: "", //
        academicCountry: "", //
        academicProvince: "", //
        schoolName: "", //
        studyPlan: "", //
        customStudyPlan: "",//
        cumulativeGPA: "", // m6 ปวช 
        dstMathematics: "", // dst
        dstEnglish: "", // dst
        dstScitech: "", // dst
        comSciCredit: "", // ปวช
        comSciTitle: "", // ปวช
        g12MathCredit: "", // g12 
        g12MathTitle: "", // g12
        g12SciCredit: "", // g12
        g12SciTitle: "", // g12
        g12EnCredit: "", // g12
        g12EnTitle: "", // g12
    });
    

    useEffect(() => {
        if (data) {
          if (data.graduateDate) {
            setDisplayDate(new Date(data.graduateDate));
          }
     
          const mergedData = {
            currentStatus: data.currentStatus || "studying",
            graduateDate: data.graduateDate || "",
            graduateYear: data.graduateYear || "",
            gedMathematics: data.gedMathematics || "",
            gedScience: data.gedScience || "",
            gedSocialStudies: data.gedSocialStudies || "",
            gedLanguageArts: data.gedLanguageArts || "",
            docCopyTrans: data.docCopyTrans || "",
            docCopyName: data.docCopyName || "",
            docCopySize: data.docCopySize || "",
            academicType: data.academicType || "Mathayom6",
            customAcademicType: data.customAcademicType || "",
            academicCountry: data.academicCountry || "Thailand",
            academicProvince: data.academicProvince || "",
            schoolName: data.schoolName || "",
            studyPlan: data.studyPlan || "",
            customStudyPlan: data.customStudyPlan || "",
            cumulativeGPA: data.cumulativeGPA || "",
            dstMathematics: data.dstMathematics || "",
            dstEnglish: data.dstEnglish || "",
            dstScitech: data.dstScitech || "",
            comSciCredit: data.comSciCredit || "",
            comSciTitle: data.comSciTitle || "",
            g12MathCredit: data.g12MathCredit || "",
            g12MathTitle: data.g12MathTitle || "",
            g12SciCredit: data.g12SciCredit || "",
            g12SciTitle: data.g12SciTitle || "",
            g12EnCredit: data.g12EnCredit || "",
            g12EnTitle: data.g12EnTitle || "",
          };
      
          setFormData(mergedData);
          setChangedData(mergedData);
          onChange(mergedData);
        }
      }, [data]);
      


    const { language } = useLanguage();
    const isDST = formData.academicType === "Mathayom6" && program?.includes("ITDS");;
    //const isICT = formData.academicType === "Mathayom6" && program === "ICT";
    const currentLanguage = language || "ENG";
    const [displayDate, setDisplayDate] = useState<Date | null>(null);
    const currentTexts = educationInfoTexts[currentLanguage] || educationInfoTexts["ENG"];
    const [provinceOptions, setProvinceOptions] = useState([]);
    const graduationYearOptions = generateGraduationYears(language);
    const isHighSchoolOrVocational = ["Mathayom6", "Grade12/13", "VocCert"].includes(formData.academicType);
    const hasMajorField = ["Mathayom6", "VocCert"].includes(formData.academicType);
    const shouldShowGraduationDate = ["Mathayom6", "VocCert"].includes(formData.academicType) && formData.currentStatus === "graduated";
    const shouldShowSubjectFields = formData.academicType === "Grade12/13";
    const shouldShowGPAX = ["Mathayom6", "VocCert"].includes(formData.academicType);
    let safeLanguage = (language === "ENG" ? "ENG" : language) as keyof typeof majorOptions;
    if (safeLanguage == "EN") {
        safeLanguage = "ENG"
    }
    const majorType = formData.academicType === "VocCert" ? "vocational" : "highSchool";
    const majorList = majorOptions[safeLanguage]?.[majorType] || []; // TODO
    const isVocCert = formData.academicType === "VocCert";
    const isThaiEducation = ["Mathayom6", "VocCert"].includes(formData.academicType);
    const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
    const shouldShowProvince = formData.academicType !== "Grade12/13" || (formData.academicType === "Grade12/13" && formData.academicCountry === "TH");
    const [changedData, setChangedData] = useState({});
    const [transcriptData, setTranscriptData] = useState<OCRTranscriptICTResponse | null>(null);


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
                    onChange={(file) => handletranscript(file)}
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
                    onChange={(file) => handletranscript(file)}
                    fileType="pdf"
                    maxSize="5 MB"
                    accept=".pdf"
                    infoMessage={<p>{currentTexts.graduatedInfoTranscript}</p>}
                />
            );
        }
        return null;
    };
    const renderSubjectField = (subjectKey: keyof typeof formData, totalCreditKey: keyof typeof formData, infoKey: string) => (
        <div className="mb-3 w-full">
            <label className="block text-[#565656] mb-1">{currentTexts?.[subjectKey as keyof typeof currentTexts]}</label>
            <div className="grid grid-cols-1 lg:grid-cols-[350px_350px] lg:gap-x-[100px] gap-y-1 mb-1">
                {/* หน่วยกิตรวม (350px) */}
                <div>
                    <FormField
                        label={currentTexts?.totalCredit}
                        value={String(formData[totalCreditKey as keyof typeof formData] || "")}
                        onChange={(value) => handleChange(totalCreditKey, validateCreditInput(value))}
                        type="text"
                        placeholder={currentTexts?.totalCreditPlaceholder}
                        required
                    />
                </div>
                {/* รายวิชา (เต็มแถวในจอใหญ่) */}
                <div>
                    <FormField
                        label={currentTexts?.subject}
                        value={formData[subjectKey] as string || ""}
                        onChange={(value) => handleChange(subjectKey, value)}
                        type="text"
                        placeholder={currentTexts?.subjectPlaceholder}
                    />
                </div>
            </div>
            <p className="text-sm text-[#B3B3B3] mt-1">{currentTexts?.[infoKey as keyof typeof currentTexts]}</p>
        </div>
    );

    const [isOcrLoading, setOcrLoading] = useState(false)

    const handletranscript = async (file: File) => {
        if (!file) return;
        console.log("file", file)
        
        if (file.type !== "application/pdf") {
            alert("กรุณาอัปโหลดไฟล์ PDF เท่านั้น");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('ขนาดไฟล์ไม่ควรเกิน 5MB');
            return;
        }

        
        const reader = new FileReader();
        setOcrLoading(true)
        console.log("isOcr", isOcrLoading)

        reader.onload = async (event) => {
            const base64String = event.target?.result as string;
            
            try {
                const fileTranscriptICT = new FormData();
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
                fileTranscriptICT.append("file", file);
                console.log("📤 กำลังอัปโหลดไฟล์ไป API...");
                const response = await fetch(`${process.env.API_BASE_URL}/upload/transcript-ict`, {
                    method: 'POST',
                    body: fileTranscriptICT
                });
                console.log("📥 ได้รับ Response:", response.status, response.statusText);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("🚨 API Error:", errorText);
                    throw new Error(`OCR failed: ${errorText}`);
                }
                // ส่วนที่เหลือเหมือนเดิม...
                const result = await response.json();
                console.log("result OCR transcript:", result)
                setTranscriptData(result[0]);
                console.log("transcriptData", transcriptData)
            
                setFormData({
                    ...formData,
                    docCopyTrans: base64String,
                    docCopyName: `Transcript_${appId}_${name}`,
                    docCopySize: fileSizeMB,
                    academicProvince: result[0].academicProvince,
                    schoolName: result[0].schoolName,
                    cumulativeGPA: result[0].cumulativeGPA,
                });

                const newChangedData = { 
                    ...changedData,
                    docCopyTrans: base64String,
                    docCopyName: `Transcript_${appId}_${name}`,
                    docCopySize: fileSizeMB,
                    academicProvince: result[0].academicProvince,
                    schoolName: result[0].schoolName,
                    cumulativeGPA: result[0].cumulativeGPA,
                };
                setChangedData(newChangedData);
                onChange(newChangedData);  
            } catch (error) {
              console.error('OCR Error:', error);
              alert('การอ่านข้อมูล Transcript ล้มเหลว');
            } finally {
                setOcrLoading(false)
            }
          };     
          reader.readAsDataURL(file);
    }
    // กรองตัวเลือกระดับการศึกษา ตามโปรแกรมที่เลือก
    const filteredDegreeOptions = (degreeOptions[language] || degreeOptions["ENG"]).filter(option => {
        if (program?.includes("DST")) {
            return ["Mathayom6", "VocCert", "other"].includes(option.value); // DST แสดงเฉพาะ ม.6, ปวช., และ อื่นๆ
        }
        if (program?.includes("ICT")) {
            return option.value !== "VocCert"; // ICT แสดงทุกตัวเลือก ยกเว้น ปวช.
        }
        return true; // กรณีไม่มี program แสดงทั้งหมด
    });

    const formatInputValue = (field: string, value: string) => {
        const formatRules: Record<string, (val: string) => string> = {
            cumulativeGPA: formatGPAValue,
            dstEnglish: formatGPAValue,
            dstScitech: formatGPAValue,
            dstMathematics: formatGPAValue,
            g12MathCredit: validateCreditInput,
            g12SciCredit: validateCreditInput,
            g12EnCredit: validateCreditInput,
            comSciCredit: validateCreditInput,
        };

        return formatRules[field] ? formatRules[field](value) : value;
    };

    const handleChange = (field: string, value: string | Date) => {
        let formattedValue = value;

        if (value instanceof Date) {
            console.log("DATADATA")
            formattedValue = value.toISOString().split("T")[0]; // "2025-04-09"
            setDisplayDate(value)
        }
        const updatedData = { ...formData, [field]: formattedValue };

        setFormData(updatedData);
        const newChangedData = { ...changedData, [field]: formattedValue };
        setChangedData(newChangedData);
        onChange(newChangedData);
      };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            academicType: data?.academicType || DEFAULT_DEGREE,
        }));
    }, []);

    useEffect(() => {
        if (formData.academicType === "GED") {
            setFormData((prev) => ({
                ...prev,
                currentStatus: "graduated", // บังคับเป็นสำเร็จการศึกษา
            }));
        }
    }, [formData.academicType]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get("/data/country-list.json"); // เปลี่ยนเป็น API ที่ใช้จริง
                const countryData: { value: string; label: string }[] = response.data.map((country: { alpha2: string; name: string; enName: string }) => ({
                    value: country.alpha2,
                    label: language === "TH" ? country.name : country.enName
                }));

                // เรียงลำดับประเทศตามภาษาไทย (ก-ฮ) หรืออังกฤษ (A-Z)
                countryData.sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label, language === "TH" ? "th" : "en"));

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
                const provincesData = response.data.map((province: { id: number; name_th: string; name_en: string }) => ({
                    value: province.id.toString(),
                    labelTH: province.name_th,
                    labelEN: province.name_en,
                }));

                setProvinceOptions(provincesData.map((p: { id: number; name_th: string; name_en: string }) => ({
                    value: p.id, // .toString() error
                    label: language === "TH" ? p.name_th : p.name_en,
                })));
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };

        fetchProvinces();
    }, [language]);

    const handleDeleteDocCopy = () => {
        const updatedData = {
            ...formData,
            graduateDate: "",
            graduateYear: "",
            gedMathematics: "",
            gedScience: "",
            gedSocialStudies: "",
            gedLanguageArts: "",
            docCopyTrans: "",
            docCopyName: "",
            docCopySize: "",
            customAcademicType: "",
            academicProvince: "",
            schoolName: "",
            studyPlan: "",
            customStudyPlan: "",
            cumulativeGPA: "",
            dstMathematics: "",
            dstEnglish: "",
            dstScitech: "",
            comSciCredit: "",
            comSciTitle: "",
            g12MathCredit: "",
            g12MathTitle: "",
            g12SciCredit: "",
            g12SciTitle: "",
            g12EnCredit: "",
            g12EnTitle: "",
        };
        
        setFormData(updatedData);
        
        const newChangedData = {
            ...changedData,
            graduateDate: "",
            graduateYear: "",
            gedMathematics: "",
            gedScience: "",
            gedSocialStudies: "",
            gedLanguageArts: "",
            docCopyTrans: "",
            docCopyName: "",
            docCopySize: "",
            customAcademicType: "",
            academicProvince: "",
            schoolName: "",
            studyPlan: "",
            customStudyPlan: "",
            cumulativeGPA: "",
            dstMathematics: "",
            dstEnglish: "",
            dstScitech: "",
            comSciCredit: "",
            comSciTitle: "",
            g12MathCredit: "",
            g12MathTitle: "",
            g12SciCredit: "",
            g12SciTitle: "",
            g12EnCredit: "",
            g12EnTitle: "",
        };
        
        setChangedData(newChangedData);
        onChange(newChangedData);
    }

    return (
        <div className="flex justify-center py-5 bg-white">
            {isOcrLoading && <OCRLoadingModal open={isOcrLoading}/>}
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
                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-x-4">
                            {renderRadioButton("studying", currentTexts.studyingStatus, formData.academicType === "GED")}
                            {renderRadioButton("graduated", currentTexts.graduatedStatus)}
                        </div>
                    </div>

                    {/* อัปโหลดเอกสาร */}
                    {formData.docCopyTrans !== "" ? (
                        <div className="mb-4">
                            <div className="border border-gray-300 rounded-lg p-3 flex flex-wrap items-center gap-4 shadow-sm">
                                <div className="flex justify-between items-center w-full gap-4">
                                <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                                <div className="flex flex-col">
                                    <span
                                        className="text-[#008A90] font-medium truncate max-w-[250px] md:max-w-[400px] cursor-pointer hover:underline"
                                        title={formData.docCopyName}
                                        onClick={() => openPdfInNewTab(formData.docCopyTrans, formData.docCopyName)}
                                    >
                                    {formData.docCopyName}
                                    </span>
                                    <span className="text-[#565656] text-xs md:text-sm">
                                    {formData.docCopySize}
                                    </span>
                                </div>
                                <button className="ml-auto" onClick={() => handleDeleteDocCopy()}>
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11" cy="11" r="10" stroke="#D92D20" strokeWidth="2" fill="none" />
                                    <path d="M15.5833 11.9173H6.41667C5.86667 11.9173 5.5 11.5507 5.5 11.0007C5.5 10.4507 5.86667 10.084 6.41667 10.084H15.5833C16.1333 10.084 16.5 10.4507 16.5 11.0007C16.5 11.5507 16.1333 11.9173 15.5833 11.9173Z" fill="#D92D20" />
                                    </svg>
                                </button>
                                </div> 
                            </div>
                        </div>
                        ): (
                        <div className="mt-4">{renderFileUpload()}</div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-[350px_350px] lg:gap-x-[100px] gap-y-1 mb-1">
                        {/* Dropdown เลือกระดับการศึกษา */}
                        <div className="w-full sm:w-[350px]">
                            <CustomSelect
                                label={currentTexts.degree}
                                options={filteredDegreeOptions} // ใช้ตัวเลือกที่ผ่านการกรองแล้ว
                                value={formData.academicType}
                                onChange={(selectedOption) =>
                                    handleChange("academicType", selectedOption ? selectedOption.value : "")
                                }
                                placeholder={currentTexts.degreePlaceholder}
                            />
                        </div>

                        {/* แสดงฟิลด์ระบุเพิ่มเติมเมื่อเลือก "อื่นๆ" */}
                        {formData.academicType === "other" && (
                            <div className="w-full sm:w-[350px]">
                                <FormField
                                    label={currentTexts.other}
                                    value={formData.customAcademicType || ""}
                                    onChange={(value) => handleChange("customAcademicType", value)}
                                    type="text"
                                    placeholder={currentTexts.other}
                                    required
                                />
                            </div>
                        )}
                    </div>
                    {/* แสดงฟิลด์ปีที่สำเร็จการศึกษา กรณีที่เลือกจบการศึกษา */}
                    {formData.currentStatus === "graduated" &&
                        (["GED", "Grade12/13", "other"].includes(formData.academicType)) && (
                            <div className="mb-4 sm:w-[350px]">
                                <CustomSelect
                                    label={currentTexts.graduationYear}
                                    options={graduationYearOptions}
                                    value={formData.graduateYear}
                                    onChange={(selectedOption) =>
                                        handleChange("graduateYear", selectedOption ? selectedOption.value : "")
                                    }
                                    placeholder={currentTexts.graduationYearPlaceholder}
                                />
                            </div>
                        )}
                    {/* แสดงฟอร์มเฉพาะเมื่อเลือก มัธยมศึกษาตอนปลาย (ม.6), Grade 12, 13, ปวช. */}
                    {isHighSchoolOrVocational && (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-[350px_350px] lg:gap-x-[100px] gap-y-1 mb-1">

                                {/* กรณีเป็น ม.6 หรือ ปวช. แสดง "Thailand" */}
                                {isThaiEducation ? (
                                    <div className="w-full sm:w-[350px]">
                                        <label className="block text-[#565656] mb-1">
                                            {currentTexts?.country || "ประเทศที่ตั้งสถานศึกษา"} <span className="text-red-500">*</span>
                                        </label>
                                        <p className="text-[#565656] font-medium indent-1">{currentTexts.countryInfo}</p>
                                    </div>
                                ) : (
                                    /* กรณีเป็น Grade 12/Year 13 ให้เลือกประเทศได้ */
                                    <div className="w-full sm:w-[350px]">
                                        <CustomSelect
                                            label={currentTexts.country}
                                            options={countries}
                                            value={formData.academicCountry}
                                            onChange={(selectedOption) => handleChange("academicCountry", selectedOption?.value || "")}
                                            placeholder={currentTexts.countryPlaceholder}
                                        />
                                    </div>
                                )}

                                {/* จังหวัดที่ตั้งสถานศึกษา (แสดงเฉพาะเมื่อเป็นไทย) */}
                                {shouldShowProvince && (
                                    <div className="w-full sm:w-[350px]">
                                        <FormField
                                            label={currentTexts.province}
                                            value={formData.academicProvince}
                                            onChange={(value) => handleChange("academicProvince", value)}
                                            placeholder={currentTexts.provincePlaceholder}
                                        />
                                    </div>
                                )}

                                {/* ฟิลด์วันที่จบการศึกษา (แสดงเฉพาะ ม.6 หรือ ปวช. ที่จบแล้ว) */}
                                {shouldShowGraduationDate && (
                                    <div className="mb-4 w-sm:w-[350px]">
                                        <label className="block text-[#565656] mb-1">{currentTexts.graduationDate} <span className="text-red-500">*</span></label>
                                        <DateInput
                                            selected={displayDate}
                                            onChange={(date) => handleChange("graduateDate", date)}
                                            placeholderText={currentTexts.graduationDatePlaceholder}
                                            mode="expiry"
                                        />
                                    </div>
                                )}

                            </div>
                            {/* ชื่อสถานศึกษา */}
                            <div className="mb-4 w-full sm:w-[350px]">
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
                                <div className="grid grid-cols-1 lg:grid-cols-[350px_350px] lg:gap-x-[100px] gap-y-1 mb-1">
                                    {/* Dropdown เลือกสาขา */}
                                    <div className="w-full sm:w-[350px]">
                                        <CustomSelect
                                            label={currentTexts.major}
                                            options={[...majorList]}
                                            value={formData.studyPlan}
                                            onChange={(selectedOption) =>
                                                handleChange("studyPlan", selectedOption ? selectedOption.value : "")
                                            }
                                            placeholder={currentTexts.majorPlaceholder}
                                        />
                                    </div>

                                    {/* ฟิลด์ระบุเพิ่มเติมเมื่อเลือก "อื่นๆ" */}
                                    {formData.studyPlan === "other" && (
                                        <div className="w-full sm:w-[350px]">
                                            <FormField
                                                label={currentTexts.other}
                                                value={formData.customStudyPlan || ""}
                                                onChange={(value) => handleChange("customStudyPlan", value)}
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
                                <div className="w-full sm:w-[350px]">
                                    <FormField
                                        label={currentTexts.cumulativeGPA}
                                        value={formData.cumulativeGPA || ""}
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
                                        { key: "dstMathematics", textKey: "mathematicsGPA", placeholderKey: "mathematicsGPAPlaceholder", infoKey: "mathematicsGPAInfo" },
                                        { key: "dstEnglish", textKey: "englishGPA", placeholderKey: "englishGPAPlaceholder", infoKey: "englishGPAInfo" },
                                        { key: "dstScitech", textKey: "scienceGPA", placeholderKey: "scienceGPAPlaceholder", infoKey: "scienceGPAInfo" }
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
                            {renderSubjectField("comSciTitle", "comSciCredit", "infoComputerScienceSubject")}
                        </div>
                    )}

                    {/* หมวดหมู่วิชาตามเกณฑ์ (เฉพาะ Grade 12/Year 13) */}
                    {shouldShowSubjectFields && (
                        <>
                            {renderSubjectField("g12MathTitle", "g12MathCredit", "infoMathtotalCredit")}
                            {renderSubjectField("g12SciTitle", "g12SciCredit", "infoSciencetotalCredit")}
                            {renderSubjectField("g12EnTitle", "g12EnCredit", "infoEnglishtotalCredit")}
                        </>
                    )}
                    {/* แสดงฟอร์มเฉพาะเมื่อเลือก GED*/}
                    {formData.academicType === "GED" && (
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
                            <div className="grid grid-cols-1 lg:grid-cols-[350px_350px] lg:gap-x-[100px] gap-y-1 mb-1">
                                {[
                                    { key: "gedMathematics", label: currentTexts.mathScore, placeholder: currentTexts.mathScorePlaceholder },
                                    { key: "gedScience", label: currentTexts.scienceScore, placeholder: currentTexts.scienceScorePlaceholder },
                                    { key: "gedSocialStudies", label: currentTexts.socialStudiesScore, placeholder: currentTexts.socialStudiesScorePlaceholder },
                                    { key: "gedLanguageArts", label: currentTexts.languageArtsScore, placeholder: currentTexts.languageArtsScorePlaceholder }
                                ].map(({ key, label, placeholder }) => (
                                    <div key={key} className="flex justify-center sm:justify-start w-full">
                                        <div className="w-full sm:w-[350px]">
                                            <FormField
                                                label={label}
                                                value={formData[key]}
                                                onChange={(value) => handleChange(key, validateTestScore(value, formData.academicType, formData[key]))}
                                                onKeyDown={(event) => preventInvalidTestScoreInput(event, formData[key], formData.degacademicTyperee)}
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
