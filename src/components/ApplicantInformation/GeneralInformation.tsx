"use client"
import React, { useEffect, useState } from "react";
import PersonalInfo from "./general-info/PersonalInfo";
import ContactInfo from "./general-info/ContactInfo";
import EmergencyContact from "./general-info/EmergencyContact";
import NewsSubscription from "./general-info/NewSubscription";

import {
  ApplicantGeneralInformationResponse,
  GeneralInfoInterface,
  ContactInfoInterface,
  EmergencyContactInterface,
  AdmissionChannelInterface
} from "@components/types/generalInfoType";


const GeneralInformation = ({ onUpdate }) => {
  const [data, setData] = useState<ApplicantGeneralInformationResponse | null>(null);
  
  const [allChanges, setAllChanges] = useState({
    personalInfo: {},
    contactInfo: {},
    emergencyContact: {},
    newsSubscription: {}
  });

  const handleChildUpdate = (key: string, data: any) => {
    console.log("field : value, ", key, data);
    
    // อัพเดตข้อมูลใน allChanges
    const updatedChanges = {
      ...allChanges,
      [key]: data  // เก็บข้อมูลใหม่ของแต่ละ component
    };
    
    setAllChanges(updatedChanges);
    
    // รวมข้อมูลจากทุก component
    const combinedChanges = {
      ...updatedChanges.personalInfo,
      ...updatedChanges.contactInfo,
      ...updatedChanges.emergencyContact,
      ...updatedChanges.newsSubscription
    };
    
    // ส่งข้อมูลทั้งหมดที่รวมแล้วขึ้นไป
    onUpdate('generalInfo', combinedChanges);
  };

  const fetchGeneralInfoData = async () => {
    try {
      const res = await fetch(`${process.env.API_BASE_URL}/applicant/general/1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) throw new Error("Failed to fetch data");

      const result = await res.json();
      console.log("result:", result)
      setData(result)
    } catch (error) {
      console.error("Error fetching general information:", error);
    }
  }

  useEffect(() => {
    fetchGeneralInfoData()
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-10">
      <PersonalInfo data={data?.general_info as GeneralInfoInterface} onChange={(data) => handleChildUpdate('personalInfo', data)}/>
      <ContactInfo data={data?.contact_info as ContactInfoInterface} onChange={(data) => handleChildUpdate('contactInfo', data)}/>
      <EmergencyContact data={data?.emergency_contact as EmergencyContactInterface} onChange={(data) => handleChildUpdate('emergencyContact', data)}/>
      <NewsSubscription data={data?.admission_channel as AdmissionChannelInterface} onChange={(data) => handleChildUpdate('newsSubscription', data)}/>
    </div>
  );
};

export default GeneralInformation;
