import React from "react";
import { useLanguage } from "../../../../../hooks/LanguageContext";
import { generalInfoTexts} from "../../../../../translation/generalInfo";
import { EmergencyContactInterface } from "@components/types/generalInfoType";
import ReportProb from "@components/components/common/admin/reportProb";

/*interface EmergencyContactProps {
    firstName: string;
    middleName?: string;
    lastName: string;
    firstNameEng: string;
    middleNameEng?: string;
    lastNameEng: string;
    relationship: string;
    phoneNumber: string;
    email: string;
}*/

interface EmergencyContactProps {
    props:EmergencyContactInterface;
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
    setReport: any;
}

const EmergencyContactSummary: React.FC<EmergencyContactProps> = ({ props, isVisible, setIsVisible, setReport }) => {
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
                            <p className="text-[#565656] text-left pl-6">{props?.contactFirstNameTH}</p>
                        </div>
                        {props?.contactMiddleNameTH && (
                            <div>
                                <p className="text-[#565656] font-bold">{texts.middleName}</p>
                                <p className="text-[#565656] text-left pl-6">{props?.contactMiddleNameTH}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-[#565656] font-bold">{texts.lastName}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.contactLastNameTH}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <p className="text-[#565656] font-bold">{texts.firstNameEng}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.contactFirstNameEN}</p>
                        </div>
                        {props?.contactMiddleNameEN && (
                            <div>
                                <p className="text-[#565656] font-bold">{texts.middleNameEng}</p>
                                <p className="text-[#565656] text-left pl-6">{props?.contactMiddleNameEN}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-[#565656] font-bold">{texts.lastNameEng}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.contactLastNameEN}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <p className="text-[#565656] font-bold">{texts.relationship}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.relationship}</p>
                        </div>
                        <div>
                            <div className="flex flex-cols gap-2">
                                <p className="text-[#565656] font-bold">{texts.phone}</p>
                                <ReportProb isVisible={isVisible} problem={texts.phone} setReport={setReport} reportColumn={"phoneEmer"}/>
                            </div>
                            <p className="text-[#565656] text-left pl-6">{props?.contactPhone}</p>
                        </div>
                        <div>
                            <p className="text-[#565656] font-bold">{texts.email}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.contactEmail}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyContactSummary;
