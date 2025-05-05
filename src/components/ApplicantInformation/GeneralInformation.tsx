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
  AdmissionChannelInterface,
  ApplicantRegistrationsInfoResponse
} from "@components/types/generalInfoType";
import { authFetch } from "@components/lib/auth";


const GeneralInformation = ({ onUpdate, appId, admId, name }: { onUpdate: any, appId: string, admId: string, name: string }) => {
  const [data, setData] = useState<ApplicantGeneralInformationResponse | null>(null);
  const [regisData, setRegisData] = useState<ApplicantRegistrationsInfoResponse | null>(null);
  
  
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
      ...updatedChanges.contactInfo,
      ...updatedChanges.emergencyContact,
      ...updatedChanges.newsSubscription,
      ...updatedChanges.personalInfo
    };
    
    console.log("general conbine", combinedChanges)
    // ส่งข้อมูลทั้งหมดที่รวมแล้วขึ้นไป
    onUpdate('generalInfo', combinedChanges);
  };

  const fetchGeneralInfoData = async () => {
    const response = await authFetch(`${process.env.API_BASE_URL}/applicant/general/${appId}/${admId}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error("Failed to fetch general data");
    const result = await response.json();
    setData(result)
    console.log("success fetchGeneralInfoData")
    console.log("result", result)
  }

  const fetchRegistrationData = async() => {
    const response = await authFetch(`${process.env.API_BASE_URL}/applicant/registrations/${appId}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error("Failed to fetch registrations data");
    const result = await response.json();
    setRegisData(result)
    console.log("success fetchRegistrationData")
  }

  useEffect(() => {
    if (appId) {
      fetchGeneralInfoData();
      fetchRegistrationData();
    }
  }, [appId]);

  return (
    <div className="flex flex-col gap-4 pb-10">
      <PersonalInfo 
        data={data?.general_info as GeneralInfoInterface}
        regisData={regisData as ApplicantRegistrationsInfoResponse}
        appId={appId}
        onChange={(data) => handleChildUpdate('personalInfo', data)}
      />
      <ContactInfo 
        data={data?.contact_info as ContactInfoInterface}
        email={regisData?.applicantEmail as string}
        onChange={(data) => handleChildUpdate('contactInfo', data)}
      />
      <EmergencyContact data={data?.emergency_contact as EmergencyContactInterface} onChange={(data) => handleChildUpdate('emergencyContact', data)}/>
      <NewsSubscription data={data?.admission_channel as AdmissionChannelInterface} onChange={(data) => handleChildUpdate('newsSubscription', data)}/>
    </div>
  );
};

export default GeneralInformation;
