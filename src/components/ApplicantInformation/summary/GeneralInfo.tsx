import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../hooks/LanguageContext";
import { generalInfoTexts } from "../../../translation/generalInfo";
import { summaryTexts } from "../../../translation/summary";
import PersonalInfoSummary from "./Info/generalInfo/PersonalInfoSummary";
import ContactSummary from "./Info/generalInfo/ContactSummary";
import EmergencyContactSummary from "./Info/generalInfo/EmergancyContactSummary";
import SubscriptionSummary from "./Info/generalInfo/SubscriptionSummary";
import { ApplicantGeneralInformationResponse, ContactInfoInterface, EmergencyContactInterface, GeneralInfoInterface } from "@components/types/generalInfoType";

const GeneralInfo = () => {
    const { language } = useLanguage();
    const texts = generalInfoTexts[language] || generalInfoTexts["ENG"];
    const titletexts = summaryTexts[language] || summaryTexts["ENG"];
    const [isVisible, setIsVisible] = useState(false)

    const [generalData, setGeneralData] = useState<ApplicantGeneralInformationResponse | null>(null);

    const formatDate = (dateStr?: string) =>
        dateStr ? new Date(dateStr).toISOString().split("T")[0] : "";

    const fetchGeneralData = async () => {
        try {
            const res = await fetch(`${process.env.API_BASE_URL}/applicant/general/0000001`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            })
      
            if (!res.ok) throw new Error("Failed to fetch general data");
      
            const result = await res.json();
            const parsedData = {
                ...result,
                general_info: {
                    ...result.general_info,
                    birthDate: formatDate(result?.general_info?.birthDate),
                    idCardExpDate: formatDate(result?.general_info?.idCardExpDate),
                    passportExpDate: formatDate(result?.general_info?.passportExpDate),
                },
                admission_channel: {
                  onlineChannel: JSON.parse(result?.admission_channel?.onlineChannel || "[]"),
                  offlineChannel: JSON.parse(result?.admission_channel?.offlineChannel || "[]"),
                },
              };
            
              setGeneralData(parsedData);
          } catch (error) {
            console.error("Error fetching general information:", error);
          }
    }

    useEffect(() => {
        fetchGeneralData();
    },[])

    useEffect(() => {
        console.log("general summary:", generalData);
    },[generalData])

    return (
        <div className="space-y-6">
            <div className="mb-4 bg-[#008A90] text-white text-[22px] md:text-[22px] font-medium py-3 px-6 rounded-lg w-full">
                {titletexts.generalInfo || "General Information"}
            </div>

            <PersonalInfoSummary
                props={generalData?.general_info as GeneralInfoInterface}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            />

            <ContactSummary
                props={generalData?.contact_info as ContactInfoInterface}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            />
            <EmergencyContactSummary
                props={generalData?.emergency_contact as EmergencyContactInterface}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            />

            <SubscriptionSummary
                onlineSources={generalData?.admission_channel.onlineChannel || [""]}
                offlineSources={generalData?.admission_channel.offlineChannel || [""]}
            />
        </div>
    );
};

export default GeneralInfo;
