import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormField from "../../form/FormField";
import { useLanguage } from "../../../hooks/LanguageContext";
import { educationInfoTexts, MathTestTypeOptions, ScoreOptions } from "../../../translation/educationInfo";
import FileUpload from "../../form/FileUpload";
import CustomSelect from "../../form/CustomSelect";
import DateInput from "../../common/date";
import { validateTestScore, preventInvalidTestScoreInput } from "../../../utils/validation";
import { EducationMathExam } from "@components/types/educationInfoType";

const initialFormValues: EducationMathExam = {
    mathType: "",
    mathScore: "",
    mathExamDate: "",
    mathCer: "",
}

interface EducationLevelProps {
    data: EducationMathExam;
    appId: string;
    name: string;
    onChange: (data: any) => void;
}

const MathTestScore: React.FC<EducationLevelProps> = ({ data, appId, name, onChange}) => {
    const searchParams = useSearchParams(); 

    const { language } = useLanguage();
    const currentLanguage = language || "ENG";
    const currentTexts = educationInfoTexts[currentLanguage] || educationInfoTexts["ENG"];

    const [changedData, setChangedData] = useState({});
    const [displayDate, setDisplayDate] = useState<Date | null>(null);
    const [formData, setFormData] = useState(initialFormValues);
    const program = searchParams.get("program");


    if (program?.includes("ITDS")) return null;

    useEffect(() => {
        if (data) {
            if (data?.mathExamDate) {
                setDisplayDate(new Date(data.mathExamDate))
                console.log("displayDate Math:", displayDate)
            }
            setFormData({
                mathType: data?.mathType || "",
                mathScore: data?.mathScore || "",
                mathExamDate: data?.mathExamDate || "",
                mathCer: data?.mathCer || "",
                mathCerName: data?.mathCerName || "",
                mathCerSize: data?.mathCerSize || "",
            })
        }
    }, [data])

    const handleChange = (field: string, value: string | Date) => {
        let formattedValue = value;

        if (value instanceof Date) {
            formattedValue = value.toISOString().split("T")[0]; // "2025-04-09"
            setDisplayDate(value)
        }
        const updatedData = { ...formData, [field]: formattedValue };

        if (field === "mathType") {
            Object.assign(updatedData, {
                mathScore: "",
                mathExamDate: "",
                mathCer: "",
                mathCerName: "",
                mathCerSize: "",
            });
            setDisplayDate(null)
        } 
        setFormData(updatedData);
    
        const newChangedData = { ...changedData, ...updatedData };
        setChangedData(newChangedData);
        onChange(newChangedData);
    }

    const handleMathCerUpload = async (file: File) => {
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

        reader.onload = (event) => {
            const base64String = event.target?.result as string;
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";

            // อัปเดต formData
            setFormData(prev => ({
                ...prev,
                mathCer: base64String,
                mathCerName: `MathTest_${appId}_${name}`,
                mathCerSize: fileSizeMB
            }));
    
            // อัปเดตข้อมูลที่เปลี่ยนแปลง
            const newChangedData = { 
                ...changedData, 
                mathCer: base64String,
                mathCerName: `MathTest_${appId}_${name}`,
                mathCerSize: fileSizeMB
            };
            setChangedData(newChangedData);
            onChange(newChangedData);
        };
    
        reader.readAsDataURL(file);

    }

    const handleDeleteDocCopy = () => {
        const updatedData = {
            mathScore: "",
            mathExamDate: "",
            mathCer: "",
            mathCerName: "",
            mathCerSize: "",
        };
        
        setFormData(updatedData);
        setDisplayDate(null);
        
        const newChangedData = {
            mathScore: "",
            mathExamDate: "",
            mathCer: "",
            mathCerName: "",
            mathCerSize: "",
        };
        
        setChangedData(newChangedData);
        onChange(newChangedData);
    }

    return (
        <div className="flex justify-center py-5 bg-white">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
                        {currentTexts.mathProficiencyTestScore}
                    </h2>
                    {formData.mathCer !== "" ? (
                        <div className="mb-4">
                            <div className="border border-gray-300 rounded-lg p-3 flex flex-wrap items-center gap-4 shadow-sm">
                                <div className="flex justify-between items-center w-full gap-4">
                                <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                                <div className="flex flex-col">
                                    <span className="text-[#008A90] font-medium truncate max-w-[250px] md:max-w-[400px]">
                                    {formData.mathCerName}
                                    </span>
                                    <span className="text-[#565656] text-xs md:text-sm">
                                    {formData.mathCerSize} bytes
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
                        <FileUpload
                            label={currentTexts.uploadMathTestScore}
                            onChange={(file) => handleMathCerUpload(file)}
                            fileType="pdf"
                            maxSize="5 MB"
                            accept=".pdf"
                            infoMessage={<p>{currentTexts.infouploadMathTestScore}</p>}
                            required={false}
                        />
                    )}
                    <div className="mb-4 grid grid-cols-1 sm:grid-cols-[400px_auto] gap-x-2 gap-y-1 items-center">
                        <div className="sm:w-[400px]">
                            <CustomSelect
                                label={currentTexts.mathTestType}
                                options={MathTestTypeOptions}
                                value={formData.mathType || ""}
                                onChange={(selectedOption) => handleChange("mathType", selectedOption?.value || "")}
                                placeholder={currentTexts.selectmathTestType}
                                required={false}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[400px_400px] lg:gap-x-[50px] gap-y-1 mb-1">
                        <div className="w-full max-w-[400px] mb-4">
                            {["IGCSE_Math"].includes(formData.mathType || "") ? (
                                <CustomSelect
                                    label={currentTexts.score}
                                    options={ScoreOptions}
                                    value={formData.mathScore || ""}
                                    onChange={(selectedOption) => handleChange("mathScore", selectedOption?.value || "")}
                                    placeholder={currentTexts.selectScore}
                                    required={false}
                                />
                            ) : (
                                <FormField
                                    label={currentTexts.score}
                                    value={formData.mathScore || ""}
                                    onChange={(value) => handleChange("mathScore", value)}
                                    type="text"
                                    placeholder={currentTexts.scorePlaceholder}
                                    required={false}
                                    //onKeyDown={(event) => preventInvalidTestScoreInput(event, formData.mathScore, formData.mathType)}

                                />
                            )}
                        </div>
                        <div className="w-full sm:w-[400px] max-w-[400px]">
                            <label className="block text-[#565656]">{currentTexts.testDate}</label>
                            <DateInput
                                selected={displayDate}
                                onChange={(date) => handleChange("mathExamDate", date || "")}
                                placeholderText={currentTexts.selecttestDate}
                                //mode="birthdate" // Set an appropriate mode value
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
                </div>
            </div>
        </div>
    );
};

export default MathTestScore;
