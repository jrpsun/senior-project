//Training Page
'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import FileUpload from '../../components/form/FileUpload';
import { BackButton, NextButton } from "../common/button";
import FormField from "../form/FormField";
import CustomSelect from "../form/CustomSelect";
//import Talent from "@components/components/Talent";
import { useLanguage } from "../../hooks/LanguageContext";
import { trainingTexts, trainingYearOptions, trainingModeOptions } from "../../translation/TrainingInfo";
import Popup from '../../components/common/popup'; // เพิ่ม import popup
import { authFetch } from '@components/lib/auth';
import { OCRLoadingModal } from '../OCRLoading';

const Training = ({ setTrain, appId }: any) => {
  const { language } = useLanguage();
  const currentTexts = trainingTexts[language] || trainingTexts["ENG"];
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [countries, setCountries] = useState([]); //
  const [formData, setFormData] = useState([{
    trainingId: "",
    applicantId: "",
    nameOfCourse: "",
    institution: "",
    trainingYear: "",
    trainingMode: "",
    trainingCountry: "",
    trainingCer: "",
    trainingCerName: "",
    trainingCerSize: "",
  }])

  useEffect(() => {
    if (appId) {
      fetchTrining();
    }
  }, [appId])

  useEffect(() => {
      console.log("Updated Training formData:", formData);
    }, [formData]); 

  const generateLongId = () => {
    const part1 = Date.now().toString(36); // เวลาปัจจุบันในฐาน 36
    const part2 = Math.random().toString(36).substring(2); // สุ่มส่วนแรก
    const part3 = Math.random().toString(36).substring(2); // สุ่มส่วนเพิ่ม
    const part4 = performance.now().toString(36).replace('.',''); // เวลาแบบละเอียด
    return part1 + part2 + part3 + part4;
  }

  const fetchTrining = async() => {
    const response = await authFetch(`${process.env.API_BASE_URL}/applicant/training/${appId}`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json()
    if (data.length === 0) {
      setFormData([{
        trainingId: generateLongId(),
        applicantId: appId,
        nameOfCourse: "",
        institution: "",
        trainingYear: "",
        trainingMode: "",
        trainingCountry: "",
        trainingCer: "",
        trainingCerName: "",
        trainingCerSize: "",
    }])} 
    else {
      setFormData(data)
    }
  }

  // Function to add a new container
  const addContainer = () => {
    const id = generateLongId()
    setFormData([...formData, {
      trainingId: id,
      applicantId: appId,
      nameOfCourse: "",
      institution: "",
      trainingYear: "",
      trainingMode: "",
      trainingCountry: "",
      trainingCer: "",
      trainingCerName: "",
    trainingCerSize: "",
    }]);
  };

  // Function to open the popup before deleting
  const confirmDelete = (id: string) => {
    setSelectedId(id);
    setPopupOpen(true);
  };

  // Function to remove a specific container
  const removeContainer = async () => {
    if (selectedId !== null) {
      console.log("selectedId", selectedId)
      try {
        const res = await fetch(`${process.env.API_BASE_URL}/applicant/training/${selectedId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const result = await res.json();
          console.log('Delete successful:', result);
        } else {
          console.log('Delete failed:', res.status);
        }
        setFormData(formData.filter(container => container.trainingId !== selectedId));
        setTrain(formData.filter(container => container.trainingId !== selectedId))
      } catch (error) {
        console.error('Error deleting data:', error);
      }
      setPopupOpen(false); // ปิด popup หลังลบ
    }
  };

  const handleChange = (trainingId: string, field: string, value: string) => {
    const updatedFormData = formData.map(container =>
      container.trainingId === trainingId ? { ...container, [field]: value } : container
    );

    setFormData(updatedFormData);
    
    setTrain(updatedFormData)
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("/data/country-list.json"); // ใช้ path ที่ถูกต้อง
        interface Country {
          alpha2: string;
          name: string;
          enName: string;
        }

        const countryData = response.data.map((country: Country) => ({
          value: country.alpha2,
          label: language === "TH" ? country.name : country.enName
        }));

        countryData.sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label, language === "TH" ? "th" : "en"));

        setCountries(countryData);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountries();
  }, [language]);

  const [isOcrLoading, setOcrLoading] = useState(false);

  const handleFileUpload = (trainingId: string, field: string, file: File) => {
    if (!file) return;

    const isImage = file.type.match('image.*');
    const isPDF = file.type === 'application/pdf';

    if (!isImage && !isPDF) {
        alert('กรุณาเลือกไฟล์ภาพหรือ PDF เท่านั้น');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('ขนาดไฟล์ไม่ควรเกิน 5MB');
      return;
    }

    const reader = new FileReader();

    setOcrLoading(true)
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      try {
        const fileTrain = new FormData();
        fileTrain.append("file", file);
        console.log("loading...")
        const res = await fetch(`${process.env.API_BASE_URL}/upload/certificate/training`, {
          method: 'POST',
          body: fileTrain
        });
        console.log("ok")
        if (!res.ok) {throw new Error(`OCR Award failed`);}

        const result = await res.json()
        console.log("result:", result)

        const updatedData = formData.map(item =>
          item.trainingId === trainingId
            ? {
              ...item,
              nameOfCourse: result[0].nameOfCourse || "",
              institution: result[0].institution || "",
              trainingYear: result[0].trainingYear || "",
              trainingMode: result[0].trainingMode || "",
              trainingCer: base64String || "",
              trainingCerName: file.name,
              trainingCerSize: String(file.size)
              }
            : item
        );
        
        setFormData(updatedData);
        setTrain(updatedData);

      } catch (error) {
        console.error('OCR Error:', error);
        alert('การอ่านข้อมูล Award ล้มเหลว');
      } finally {
        setOcrLoading(false)
      }
    } 
    reader.readAsDataURL(file);
  }

  return (
    <div>
      {isOcrLoading && <OCRLoadingModal open={isOcrLoading}/>}
      {formData.map(container => (
        <div key={container.trainingId}>
          <div className="flex justify-center pt-10 bg-[#FFFFFF] p-6">
            <div className="w-[1100px] max-w-none bg-white rounded-lg p-6 border border-gray-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-[#008A90] mb-4">
                  {currentTexts.trainingTitle}
                </h2>
                <button onClick={() => confirmDelete(container.trainingId)}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="10" stroke="#D92D20" strokeWidth="2" fill="none" />
                    <path d="M15.5833 11.9173H6.41667C5.86667 11.9173 5.5 11.5507 5.5 11.0007C5.5 10.4507 5.86667 10.084 6.41667 10.084H15.5833C16.1333 10.084 16.5 10.4507 16.5 11.0007C16.5 11.5507 16.1333 11.9173 15.5833 11.9173Z" fill="#D92D20" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                {container.trainingCer !== "" ? (
                  container.trainingCer.startsWith("data:image/") ? (
                    <div className="flex items-center mb-4">
                      <img
                        src={container.trainingCer}
                        alt="Uploaded"
                        className="w-full max-w-sm rounded-lg shadow-md object-contain"
                      />
                    </div>
                  ) : container.trainingCer.startsWith("data:application/pdf") ? (
                    <div className="mb-4">
                      <div className="border border-gray-300 rounded-lg p-3 flex flex-wrap items-center gap-4 shadow-sm">
                        <div className="flex items-center w-full gap-4">
                          <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                          <div className="flex flex-col">
                            <span className="text-[#008A90] font-medium truncate max-w-[250px] md:max-w-[400px]">
                              {container.trainingCerName}
                            </span>
                            <span className="text-[#565656] text-xs md:text-sm">
                              {container.trainingCerSize} bytes
                            </span>
                          </div>
                        </div> 
                      </div>
                    </div>
                  ) : null
                ) : (
                  <FileUpload
                    label={currentTexts.trainingCertificate}
                    onChange={(file) => handleFileUpload(container.trainingId, "trainingCer", file)}
                    fileType="jpg., png., jpeg., pdf."
                    maxSize="5 MB"
                    accept="jpg., png., jpeg., pdf."
                    infoMessage={<p>{currentTexts.uploadCertificate}</p>}
                    required={false}
                  />
              )}

              </div>
              <div className='flex flex-col gap-y-5'>
                <div className="flex flex-col md:flex-row md:space-x-9">
                  <div className="w-[325px]">
                    <FormField
                      label={currentTexts.programName}
                      value={container.nameOfCourse}
                      onChange={(value) => handleChange(container.trainingId, "nameOfCourse", value)}
                      placeholder={currentTexts.enterProgramName}
                    />
                  </div>
                  <div className="w-[325px]">
                    <FormField
                      label={currentTexts.institution}
                      value={container.institution}
                      onChange={(value) => handleChange(container.trainingId, "institution", value)}
                      placeholder={currentTexts.enterInstitution}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="w-full">
                    <CustomSelect
                      label={currentTexts.trainingYear}
                      options={trainingYearOptions[language] || trainingYearOptions["ENG"]}
                      value={container.trainingYear}
                      onChange={(selectedOption) => handleChange(container.trainingId, "trainingYear", selectedOption ? selectedOption.value : "")}
                      placeholder={currentTexts.selectYear}
                      width="100%"
                      required={false}

                    />
                  </div>
                  <div className="w-full">
                    <CustomSelect
                      label={currentTexts.trainingMode}
                      options={trainingModeOptions[language] || trainingModeOptions["ENG"]}
                      value={container.trainingMode}
                      onChange={(selectedOption) => handleChange(container.trainingId, "trainingMode", selectedOption ? selectedOption.value : "")}
                      placeholder={currentTexts.selectMode}
                      width="100%"
                      required={false}
                    />
                  </div>
                  {/* แสดงช่องเลือกประเทศเมื่อเลือก Offline */}
                  <div className="w-full">
                    {container.trainingMode === "offline" && (
                      <CustomSelect
                        label={currentTexts.country}
                        options={countries} // aใช้ข้อมูลประเทศจาก JSON
                        value={container.trainingCountry}
                        onChange={(selectedOption) => handleChange(container.trainingId, "trainingCountry", selectedOption ? selectedOption.value : "")}
                        placeholder={currentTexts.selectCountry}
                        width="100%"
                        required={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <button className="flex items-center justify-center w-[1100px] max-w-none border border-[#008A90] rounded-md py-2 px-4 hover:bg-teal-50 transition" onClick={addContainer}>
          <div className="flex items-center gap-2 text-[#008A90]">
            <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.33333 0.105469V5.10547H10V1.77214H28.3333V20.1055H25V21.7721H30V0.105469H8.33333ZM0 8.4388V30.1055H21.6667V8.4388H0ZM1.66667 10.1055H20V28.4388H1.66667V10.1055ZM10 13.4388V18.4388H5V20.1055H10V25.1055H11.6667V20.1055H16.6667V18.4388H11.6667V13.4388H10Z" fill="#008A91" />
            </svg>
            <span className="text-[#008A90] font-medium">{currentTexts.addTraining}</span>
          </div>
        </button>
      </div>

      <Popup
        type="deleteConfirmation"
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={removeContainer}
      />

    </div>

  );
};

export default Training;
