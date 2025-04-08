//Award Page
'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import FileUpload from '../../components/form/FileUpload';
import FormField from "../form/FormField";
import CustomSelect from "../form/CustomSelect";
import Talent from "@components/components/Talent";
import { useLanguage } from "../../hooks/LanguageContext";
import { awardTexts, YearOptions, competitionLevelOptions } from "../../translation/AwardInfo";
import Popup from '../../components/common/popup';
import { AwardResponse } from '@components/types/AwardType';
//import Alert from '../../components/common/alert';

const Award = ({ setAward, setTalent }: any) => {
  const { language } = useLanguage();
  const currentTexts = awardTexts[language] || awardTexts["ENG"];
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>("");
  const [formData, setFormData] = useState([{
      rewardId: "",
      applicantId: "",
      nameOfCompetition: "",
      rewardYear: "",
      rewardLevel: "",
      rewardAwards: "",
      project: "",
      rewardCer: "",
      rewardCerName: "",
      rewardCerSize: "",
  }])

  const generateLongId = () => {
    const part1 = Date.now().toString(36); // เวลาปัจจุบันในฐาน 36
    const part2 = Math.random().toString(36).substring(2); // สุ่มส่วนแรก
    const part3 = Math.random().toString(36).substring(2); // สุ่มส่วนเพิ่ม
    const part4 = performance.now().toString(36).replace('.',''); // เวลาแบบละเอียด
    return part1 + part2 + part3 + part4;
  }

  useEffect(() => {
    fetchAward();
  },[])

  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]); 

  const fetchAward = async () => {
    try {
      const res = await fetch(`${process.env.API_BASE_URL}/applicant/reward/0000001`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: AwardResponse[] = await res.json()
      console.log("data", data)
      setFormData(data)

    } catch (error){
      console.error('Failed to fetch rewards:', error);
      throw error;
    }
  }

  // Function to add a new container
  const addContainer = () => {
    const id = generateLongId()
    setFormData([...formData, {
      rewardId: id,
      applicantId: "0000001",
      nameOfCompetition: "",
      rewardYear: "",
      rewardLevel: "",
      rewardAwards: "",
      project: "",
      rewardCer: "",
      rewardCerName: "",
      rewardCerSize: "",
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
        const res = await fetch(`${process.env.API_BASE_URL}/applicant/reward/${selectedId}`, {
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
        setFormData(formData.filter(container => container.rewardId !== selectedId));
        setAward(formData.filter(container => container.rewardId !== selectedId))
      } catch (error) {
        console.error('Error deleting data:', error);
      }

      setPopupOpen(false); // ปิด popup หลังลบ
    }
  };

  const handleChange = (rewardId: string, field: string, value: string) => {
    const updatedFormData = formData.map(container =>
      container.rewardId === rewardId ? { ...container, [field]: value } : container
    );

    setFormData(updatedFormData);
    
    setAward(updatedFormData)
  };

  const handleFileUpload = (rewardId: string, field: string, file: File) => {
    console.log("handleFileUpload")
    if (!file) return;
    console.log("have file")
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
    console.log("file pass")
    const reader = new FileReader();
    console.log("reader")
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      console.log("onLoad")
      try {
        const fileAward = new FormData();
        fileAward.append("file", file);
        console.log("loading...")
        const res = await fetch(`${process.env.API_BASE_URL}/upload/certificate/reward`, {
          method: 'POST',
          body: fileAward
        });
        console.log("ok")
        if (!res.ok) {throw new Error(`OCR Award failed`);}

        const result = await res.json()
        console.log("result:", result)

        const updatedData = formData.map(item =>
          item.rewardId === rewardId
            ? {
                ...item,
                rewardAwards: result[0].rewardAwards || "",
                rewardLevel: result[0].rewardLevel || "",
                nameOfCompetition: result[0].NameOfCompetition || "",
                project: result[0].project || "",
                rewardYear: result[0].rewardYear || "",
                rewardCer: base64String || "",
                rewardCerName: file.name,
                rewardCerSize: String(file.size)
              }
            : item
        );
        
        setFormData(updatedData);
        setAward(updatedData);

      } catch (error) {
        console.error('OCR Error:', error);
        alert('การอ่านข้อมูล Award ล้มเหลว');
      }
    }
    reader.readAsDataURL(file);
  }


  return (
    <div>
      {/* แสดง Alert เมื่อพบปัญหา OCR */}
      {/*alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage("")} />*/}
      {formData.map(container => (
        <div key={container.rewardId}>
          <div className="flex justify-center pt-10 bg-[#FFFFFF] p-6">
            <div className="sm:w-[1100px] max-w-none bg-white rounded-lg p-6 border border-gray-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-[#008A90] mb-4">
                  {currentTexts.rewardAndWorks}
                </h2>

                <button onClick={() => confirmDelete(container.rewardId)}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="10" stroke="#D92D20" strokeWidth="2" fill="none" />
                    <path d="M15.5833 11.9173H6.41667C5.86667 11.9173 5.5 11.5507 5.5 11.0007C5.5 10.4507 5.86667 10.084 6.41667 10.084H15.5833C16.1333 10.084 16.5 10.4507 16.5 11.0007C16.5 11.5507 16.1333 11.9173 15.5833 11.9173Z" fill="#D92D20" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <FileUpload
                  label={currentTexts.uploadCertificate}
                  onChange={(file) => {handleFileUpload(container.rewardId, "rewardCer", file);}}
                  fileType="jpg., png., jpeg., pdf."
                  maxSize="5 MB"
                  accept="jpg., png., jpeg., pdf."
                  infoMessage={<p>{currentTexts.uploadCertificateInfo}</p>}
                  required={false}
                />
              </div>

              <div className='flex flex-col gap-y-5'>
                <div className="w-[330px]">
                  <FormField
                    label={currentTexts.competitionName}
                    value={container.nameOfCompetition || ""}
                    onChange={(value) => handleChange(container.rewardId, "nameOfCompetition", value)}
                    placeholder={currentTexts.enterCompetitionName}
                  />
                </div>
                <div className="flex flex-col md:flex-row md:space-x-8">
                  <div className="w-[330px]">
                    <CustomSelect
                      label={currentTexts.competitionYear}
                      options={YearOptions[language] || YearOptions["ENG"]}
                      value={container.rewardYear || ""}
                      onChange={(selectedOption) => handleChange(container.rewardId, "rewardYear", selectedOption ? selectedOption.value : "")}
                      placeholder={currentTexts.selectCompetitionYear}
                      width="100%"
                      required={false}
                    />
                  </div>
                  <div className="w-[330px]">
                    <CustomSelect
                      label={currentTexts.competitionLevel}
                      options={competitionLevelOptions[language] || competitionLevelOptions["ENG"]}
                      value={container.rewardLevel || ""}
                      onChange={(selectedOption) => handleChange(container.rewardId, "rewardLevel", selectedOption ? selectedOption.value : "")}
                      placeholder={currentTexts.selectCompetitionLevel}
                      width="100%"
                      required={false}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-8">
                  <div className="w-[330px]">
                    <FormField
                      label={currentTexts.awardsReceived}
                      value={container.rewardAwards || ""}
                      onChange={(value) => handleChange(container.rewardId, "rewardAwards", value)}
                      placeholder={currentTexts.enterAwardsReceived}
                      required={false}
                    />
                  </div>
                  <div className="w-[350px]">
                    <FormField
                      label={currentTexts.projectWorks}
                      value={container.project || ""}
                      onChange={(value) => handleChange(container.rewardId, "project", value)}
                      placeholder={currentTexts.enterProjectWorks}
                      required={false}
                    />
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
            <span className="text-[#008A90] font-medium">{currentTexts.addAwards}</span>
          </div>
        </button>
      </div>

      <div><Talent setTalent={setTalent}/></div>

      <Popup
        type="deleteConfirmation"
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={removeContainer}
      />
    </div>
  );
};

export default Award;