import React from "react";
import PersonalInfo from "./general-info/PersonalInfo";
import ContactInfo from "./general-info/ContactInfo";
import EmergencyContact from "./general-info/EmergencyContact";
import NewsSubscription from "./general-info/NewSubscription";
const GeneralInformation = () => {
  return (
    <div>
      <PersonalInfo />
      <ContactInfo />
      <EmergencyContact/>
      <NewsSubscription/>
    </div>
  );
};

export default GeneralInformation;
