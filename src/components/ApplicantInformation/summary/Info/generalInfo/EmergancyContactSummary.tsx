import React from "react";
import { useLanguage } from "../../../../../hooks/LanguageContext";
import { generalInfoTexts} from "../../../../../translation/generalInfo";

interface EmergencyContactProps {
    firstName: string;
    middleName?: string;
    lastName: string;
    firstNameEng: string;
    middleNameEng?: string;
    lastNameEng: string;
    relationship: string;
    phoneNumber: string;
    email: string;
}

const EmergencyContactSummary: React.FC<EmergencyContactProps> = ({
    firstName,
    middleName,
    lastName,
    firstNameEng,
    middleNameEng,
    lastNameEng,
    relationship,
    phoneNumber,
    email
}) => {
    const { language } = useLanguage();
    const texts = generalInfoTexts[language] ?? generalInfoTexts["ENG"];

    return (
        <div className="flex justify-center py-5 bg-white">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
                        {texts.titleEmergency}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-[#565656] font-bold">{texts.firstName}</p>
                            <p className="text-[#565656] text-left pl-6">{firstName}</p>
                        </div>
                        {middleName && (
                            <div>
                                <p className="text-[#565656] font-bold">{texts.middleName}</p>
                                <p className="text-[#565656] text-left pl-6">{middleName}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-[#565656] font-bold">{texts.lastName}</p>
                            <p className="text-[#565656] text-left pl-6">{lastName}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <p className="text-[#565656] font-bold">{texts.firstNameEng}</p>
                            <p className="text-[#565656] text-left pl-6">{firstNameEng}</p>
                        </div>
                        {middleNameEng && (
                            <div>
                                <p className="text-[#565656] font-bold">{texts.middleNameEng}</p>
                                <p className="text-[#565656] text-left pl-6">{middleNameEng}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-[#565656] font-bold">{texts.lastNameEng}</p>
                            <p className="text-[#565656] text-left pl-6">{lastNameEng}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <p className="text-[#565656] font-bold">{texts.relationship}</p>
                            <p className="text-[#565656] text-left pl-6">{relationship}</p>
                        </div>
                        <div>
                            <p className="text-[#565656] font-bold">{texts.phone}</p>
                            <p className="text-[#565656] text-left pl-6">{phoneNumber}</p>
                        </div>
                        <div>
                            <p className="text-[#565656] font-bold">{texts.email}</p>
                            <p className="text-[#565656] text-left pl-6">{email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyContactSummary;
