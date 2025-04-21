//Talent Page
'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import FileUpload from '../components/form/FileUpload';
import FormField from "../components/form/FormField";
import CustomSelect from "../components/form/CustomSelect";
import { useLanguage } from "../hooks/LanguageContext";
import { talentTexts, talentTypeOptions, YearOptions } from "../translation/AwardInfo";
import Popup from '../components/common/popup'; // เพิ่ม import popup
import { TalentResponse } from '@components/types/TalentTypes';
import { authFetch } from '@components/lib/auth';

const Talent = ({ setTalent, appId }: any) => {
  const { language } = useLanguage();
  const currentTexts = talentTexts[language] || talentTexts["ENG"];
  const currentTalentOptions = talentTypeOptions[language] || talentTypeOptions["ENG"];
  const currentYearOptions = YearOptions[language] || YearOptions["ENG"];
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState([{
    talentId: "",
    applicantId: "",
    kindOfTalent: "",
    nameOfCompetition: "",
    talentYear: "",
    talentAwards: "",
    url: "",
    moreDetails: "",
    talentCer: "",
    talentCerName: "",
    talentCerSize: "",
  }])

  useEffect(() => {
    console.log("Talent formData:", formData)
  }, [formData])

  const generateLongId = () => {
    const part1 = Date.now().toString(36); // เวลาปัจจุบันในฐาน 36
    const part2 = Math.random().toString(36).substring(2); // สุ่มส่วนแรก
    const part3 = Math.random().toString(36).substring(2); // สุ่มส่วนเพิ่ม
    const part4 = performance.now().toString(36).replace('.',''); // เวลาแบบละเอียด
    return part1 + part2 + part3 + part4;
  }

  const fetchTalent = async() => {
    const response = await authFetch(`${process.env.API_BASE_URL}/applicant/talent/${appId}`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json()
    setFormData(data)
  }

  useEffect(() => {
    if (appId) {
      fetchTalent();
    }
  },[appId])


  // Function to add a new container
  const addContainer = () => {
    const id = generateLongId()
    setFormData([...formData, {
      talentId: id,
      applicantId: appId,
      kindOfTalent: "",
      nameOfCompetition: "",
      talentYear: "",
      talentAwards: "",
      url: "",
      moreDetails: "",
      talentCer: "",
      talentCerName: "",
      talentCerSize: "",
    }])
  };

  // Function to open the popup before deleting
  const confirmDelete = (id: string) => {
    setSelectedId(id);
    setPopupOpen(true);
  };

  // Function to remove a specific container
  const removeContainer = async() => {
    if (selectedId !== null) {
      try {
        const res = await fetch(`${process.env.API_BASE_URL}/applicant/talent/${selectedId}`, {
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
        setFormData(formData.filter(container => container.talentId !== selectedId));
        setTalent(formData.filter(container => container.talentId !== selectedId))
      } catch (error) {
        console.error('Error deleting data:', error);
      }
      setPopupOpen(false);
    }
  };

  const handleChange = (talentId: string, field: string, value: string) => {
    const updatedFormData = formData.map(container =>
      container.talentId === talentId ? { ...container, [field]: value } : container
    );

    setFormData(updatedFormData);
    
    setTalent(updatedFormData)
  };

  const handleFileUpload = (talentId: string, file: File) => {
    console.log("File", file)
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

    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      console.log("onLoad")
      try {
        const fileTalent = new FormData();
        fileTalent.append("file", file);
        console.log("loading...")
        const res = await fetch(`${process.env.API_BASE_URL}/upload/certificate/talent`, {
          method: 'POST',
          body: fileTalent
        });
        console.log("ok")
        if (!res.ok) {throw new Error(`OCR Award failed`);}

        const result = await res.json()
        console.log("result:", result)

        const updatedData = formData.map(item =>
          item.talentId === talentId
            ? {
              ...item,
              kindOfTalent: result[0].kindOfTalent || "",
              nameOfCompetition: result[0].nameOfCompetition || "",
              talentYear: result[0].talentYear || "",
              talentAwards: result[0].talentAwards || "",
              talentCer: base64String || "",
              talentCerName: file.name,
              talentCerSize: String(file.size)
              }
            : item
        );
        
        setFormData(updatedData);
        setTalent(updatedData);

      } catch (error) {
        console.error('OCR Error:', error);
        alert('การอ่านข้อมูล Award ล้มเหลว');
      }
    }
    reader.readAsDataURL(file);

  }

  return (
    <div>
      {formData.map(container => (
        <div key={container.talentId}>
          <div className="flex justify-center pt-10 bg-[#FFFFFF] p-6">
            <div className="w-[1100px] max-w-none bg-white rounded-lg p-6 border border-gray-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-[#008A90] mb-4">
                  {currentTexts.talentInformation}
                </h2>
                <button onClick={() => confirmDelete(container.talentId)}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="10" stroke="#D92D20" strokeWidth="2" fill="none" />
                    <path d="M15.5833 11.9173H6.41667C5.86667 11.9173 5.5 11.5507 5.5 11.0007C5.5 10.4507 5.86667 10.084 6.41667 10.084H15.5833C16.1333 10.084 16.5 10.4507 16.5 11.0007C16.5 11.5507 16.1333 11.9173 15.5833 11.9173Z" fill="#D92D20" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <FileUpload
                  label={currentTexts.certificatesOrAwards}
                  onChange={(file) => handleFileUpload(container.talentId, file)}
                  fileType="jpg., png., jpeg., pdf."
                  maxSize="5 MB"
                  accept="jpg., png., jpeg., pdf."
                  infoMessage={<p>{currentTexts.uploadCertificateInfo}</p>}
                  required={false}
                />
              </div>
              <div className="flex flex-col gap-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="w-full">
                    <CustomSelect
                      label={currentTexts.talentType}
                      options={currentTalentOptions}
                      value={container.kindOfTalent}
                      onChange={(selectedOption) => handleChange(container.talentId, "kindOfTalent", selectedOption ? selectedOption.value : "")}
                      placeholder={currentTexts.selectTalentType}
                      width="100%"
                      required={false}
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      label={currentTexts.nameOfWorkActivity}
                      value={container.nameOfCompetition}
                      onChange={(value) => handleChange(container.talentId, "nameOfCompetition", value)}
                      placeholder={currentTexts.enterNameOfWorkActivity}
                    />
                  </div>
                  <div className="w-full">
                    <CustomSelect
                      label={currentTexts.yearOfWorkActivity}
                      options={currentYearOptions}
                      value={container.talentYear}
                      onChange={(selectedOption) => handleChange(container.talentId, "talentYear", selectedOption ? selectedOption.value : "")}
                      placeholder={currentTexts.selectYearOfWorkActivity}
                      width="100%"
                      required={false}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-9">
                  <div className="w-[325px]">
                    <FormField
                      label={currentTexts.awardsReceived}
                      value={container.talentAwards}
                      onChange={(value) => handleChange(container.talentId, "talentAwards", value)}
                      placeholder={currentTexts.enterAwardsReceived}
                    />
                  </div>
                  <div className="w-[325px]">
                    <FormField
                      label={currentTexts.talentUrlLink}
                      value={container.url}
                      onChange={(value) => handleChange(container.talentId, "url", value)}
                      placeholder={currentTexts.enterTalentUrlLink}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <FormField
                    label={currentTexts.remark}
                    value={container.moreDetails}
                    onChange={(value) => handleChange(container.talentId, "moreDetails", value)}
                    placeholder={currentTexts.provideAdditionalDetails}
                    type="textarea"
                  />
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
            <span className="text-[#008A90] font-medium">{currentTexts.addTalentInformation}</span>
          </div>
        </button>
      </div>
      {/* Popup Confirmation */}
      <Popup
        type="deleteConfirmation"
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={removeContainer}
      />
    </div>
  );
};

export default Talent;
