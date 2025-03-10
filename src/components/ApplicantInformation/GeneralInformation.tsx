import React from "react";
import PersonalInfo from "./general-info/PersonalInfo";
import ContactInfo from "./general-info/ContactInfo";
import EmergencyContact from "./general-info/EmergencyContact";
import NewsSubscription from "./general-info/NewSubscription";
import { useLanguage } from "../../hooks/LanguageContext";
import { generalInfoTexts } from "../../translation/generalInfo";
import Button from "../common/button";


const GeneralInformation = () => {
  const { language } = useLanguage();
  const currentTexts = generalInfoTexts[language as keyof typeof generalInfoTexts] || generalInfoTexts["ENG"];

  return (
    <div className="flex flex-col gap-4 pb-10">
      <PersonalInfo />
      <ContactInfo />
      <EmergencyContact />
      <NewsSubscription />

      {/* ปุ่มถัดไป */}
      <div className="flex justify-center mt-20">
        <Button variant="next" icon="/images/next_arrow.svg">
          {currentTexts.NextButton}
        </Button>
      </div>
    </div>
  );
};

export default GeneralInformation;
