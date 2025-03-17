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

const Training = () => {
  const { language } = useLanguage();
  const currentTexts = trainingTexts[language] || trainingTexts["ENG"];
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [countries, setCountries] = useState([]); //

  const [containers, setContainers] = useState([{
    id: Date.now(), formData: {
      programName: "",
      institution: "",
      trainingYear: "",
      trainingMode: "",
      country: ""
    }
  }]);

  // Function to add a new container
  const addContainer = () => {
    setContainers([...containers, {
      id: Date.now(), formData: {
        programName: "",
        institution: "",
        trainingYear: "",
        trainingMode: "",
        country: ""
      }
    }]);
  };
  // Function to open the popup before deleting
  const confirmDelete = (id) => {
    setSelectedId(id);
    setPopupOpen(true);
  };

  // Function to remove a specific container
  const removeContainer = () => {
    if (selectedId !== null) {
      setContainers(containers.filter(container => container.id !== selectedId));
      setPopupOpen(false); // ปิด popup หลังลบ
    }
  };

  const handleChange = (id, field, value) => {
    setContainers(containers.map(container =>
      container.id === id ? { ...container, formData: { ...container.formData, [field]: value } } : container
    ));
  };

    useEffect(() => {
      const fetchCountries = async () => {
        try {
          const response = await axios.get("/data/country-list.json"); // ใช้ path ที่ถูกต้อง
          let countryData = response.data.map((country: any) => ({
            value: country.alpha2,
            label: language === "TH" ? country.name : country.enName
          }));
  
          countryData.sort((a, b) => a.label.localeCompare(b.label, language === "TH" ? "th" : "en"));
  
          setCountries(countryData);
        } catch (error) {
          console.error("Error fetching country data:", error);
        }
      };
  
      fetchCountries();
    }, [language]);

  return (
    <div>
      {containers.map(container => (
        <div key={container.id}>
          <div className="flex justify-center pt-10 bg-[#FFFFFF] p-6">
            <div className="w-[1100px] max-w-none bg-white rounded-lg p-6 border border-gray-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-[#008A90] mb-4">
                  {currentTexts.trainingTitle}
                </h2>
                <button onClick={() => confirmDelete(container.id)}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="10" stroke="#D92D20" strokeWidth="2" fill="none" />
                    <path d="M15.5833 11.9173H6.41667C5.86667 11.9173 5.5 11.5507 5.5 11.0007C5.5 10.4507 5.86667 10.084 6.41667 10.084H15.5833C16.1333 10.084 16.5 10.4507 16.5 11.0007C16.5 11.5507 16.1333 11.9173 15.5833 11.9173Z" fill="#D92D20" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <FileUpload
                  label={currentTexts.trainingCertificate}
                  onChange={(file) => handleChange(container.id, "document", file)}
                  fileType="jpg., png., jpeg., pdf."
                  maxSize="5 MB"
                  accept="jpg., png., jpeg., pdf."
                  infoMessage={<p>{currentTexts.uploadCertificate}</p>}
                  required={false}
                />
              </div>
              <div className='flex flex-col gap-y-5'>
                <div className="flex flex-col md:flex-row md:space-x-9">
                  <div className="w-[325px]">
                    <FormField
                      label={currentTexts.programName}
                      value={container.formData.programName}
                      onChange={(value) => handleChange(container.id, "programName", value)}
                      placeholder={currentTexts.enterProgramName}
                    />
                  </div>
                  <div className="w-[325px]">
                    <FormField
                      label={currentTexts.institution}
                      value={container.formData.institution}
                      onChange={(value) => handleChange(container.id, "institution", value)}
                      placeholder={currentTexts.enterInstitution}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="w-full">
                    <CustomSelect
                      label={currentTexts.trainingYear}
                      options={trainingYearOptions[language] || trainingYearOptions["ENG"]}
                      value={container.formData.trainingYear}
                      onChange={(selectedOption) => handleChange(container.id, "trainingYear", selectedOption ? selectedOption.value : "")}
                      placeholder={currentTexts.selectYear}
                      width="100%"
                      required={false}

                    />
                  </div>
                  <div className="w-full">
                    <CustomSelect
                      label={currentTexts.trainingMode}
                      options={trainingModeOptions[language] || trainingModeOptions["ENG"]}
                      value={container.formData.trainingMode}
                      onChange={(selectedOption) => handleChange(container.id, "trainingMode", selectedOption ? selectedOption.value : "")}
                      placeholder={currentTexts.selectMode}
                      width="100%"
                      required={false}
                    />
                  </div>
                  {/* ✅ แสดงช่องเลือกประเทศเมื่อเลือก Offline */}
                  <div className="w-full">
                    {container.formData.trainingMode === "offline" && (
                      <CustomSelect
                        label={currentTexts.country}
                        options={countries} // ✅ ใช้ข้อมูลประเทศจาก JSON
                        value={container.formData.country}
                        onChange={(selectedOption) => handleChange(container.id, "country", selectedOption ? selectedOption.value : "")}
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

      {/* ปุ่ม Back และ Next */}
      <div className="flex justify-center mt-6 mb-6 gap-x-4">
        <BackButton>{currentTexts.back}</BackButton>
        <NextButton>{currentTexts.next}</NextButton>
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
