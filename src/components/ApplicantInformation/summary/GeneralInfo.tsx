import React from "react";
import { useLanguage } from "../../../hooks/LanguageContext";
import { generalInfoTexts } from "../../../translation/generalInfo";
import { summaryTexts } from "../../../translation/summary";
import PersonalInfoSummary from "./Info/generalInfo/PersonalInfoSummary";
import ContactSummary from "./Info/generalInfo/ContactSummary";
import EmergencyContactSummary from "./Info/generalInfo/EmergancyContactSummary";
import SubscriptionSummary from "./Info/generalInfo/SubscriptionSummary";

const GeneralInfo = () => {
    const { language } = useLanguage();
    const texts = generalInfoTexts[language] || generalInfoTexts["ENG"];
    const titletexts = summaryTexts[language] || summaryTexts["ENG"];

    return (
        <div className="space-y-6">
            <div className="mb-4 bg-[#008A90] text-white text-[22px] md:text-[22px] font-medium py-3 px-6 rounded-lg w-full">
                {titletexts.generalInfo || "General Information"}
            </div>

            <PersonalInfoSummary
                profileImage="/path/to/profile-image.jpg"
                nationality="ไทย"
                title={texts.titleText || "Mr."}
                firstName="ทดสอบ"
                middleName=""
                lastName="ระบบสมัคร"
                firstNameEng="Test"
                middleNameEng=""
                lastNameEng="Raboobsamak"
                nickname="เทส เทส"
                nicknameEng="Test Test"
                idCardCopy={{
                    name: "Copy_ID_Card_Test_Raboobsamak.pdf",
                    size: "500 KB",
                    url: "/path/to/Copy_ID_Card_Test_Raboobsamak.pdf",
                }}
                idCardNumber="1 9057 42603 31 2"
                idCardExpiry="31/12/2025"
                birthDate="31/12/2007"
                age="18 ปี 0 เดือน"
                gender="ชาย"
                houseRegCopy={{
                    name: "Copy_Registration Address_Test_Raboobsamak.pdf",
                    size: "600 KB",
                    url: "/path/to/Copy_Registration Address_Test_Raboobsamak.pdf",
                }}
                houseNumber="111"
                moo="1"
                alley=""
                street="ถนนเยาวราช"
                subDistrict="แขวงสัมพันธวงศ์"
                district="เขตสัมพันธวงศ์"
                province="กรุงเทพมหานคร"
                postalCode="10110"
                country="ไทย"
            />

            <ContactSummary
                phoneNumber="088-888-8888"
                email="test.raboobsamak@gmail.com"
                line=""
                facebook=""
                instagram=""
            />

            <EmergencyContactSummary
                firstName="ดวงใจ"
                middleName=" "
                lastName="ใจดี"
                firstNameEng="Duagjai"
                middleNameEng=" "
                lastNameEng="Jaidee"
                relationship="แม่"
                phoneNumber="099-999-9999"
                email=" "
            />

            <SubscriptionSummary
                onlineSources={["Facebook", "Website ICT Mahidol", "Line Official"]}
                offlineSources={["MU Open House", "Dek-D TCAS"]}
            />
        </div>
    );
};

export default GeneralInfo;
