import React from "react";
import { useLanguage } from "../../../../../hooks/LanguageContext";
import { talentTexts } from "../../../../../translation/AwardInfo";

interface TalentSummaryProps {
    talents: {
        talentType: string;
        talentYear: string;
        talentActivity: string;
        talentAward: string;
        talentURL?: string;
        document?: string;
        documentSize?: string;
    }[];
}

const TalentSummary: React.FC<TalentSummaryProps> = ({ talents }) => {
    const { language } = useLanguage();
    const texts = talentTexts[language] || talentTexts["ENG"];
    
    if (!talents || talents.length === 0) {
        return (
            <div className="flex justify-center py-2 bg-[white] h-[200px]">
                <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl lg:max-w-screen-xl p-1">
                    <div className="p-3 bg-white rounded-lg w-full max-w-6xl mx-auto">
                        <h2 className="text-2xl text-[#008A90] font-semibold mb-6 text-left">
                        {texts.talentSummaryTitle}
                        </h2>
    
                        <div className="flex justify-center">
                            <p className="text-[#C8C8CC] text-xl font-medium text-center mt-10">
                                {language === "TH"
                                       ? "ไม่มีข้อมูลเกียรติบัตรหรือรางวัล ความสามารถพิเศษ"
                                       : "No Certificate or Award Information in Talent"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center py-5 bg-[white]">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-6xl mx-auto">
                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
                        {texts.talentSummaryTitle}
                    </h2>

                    {/* --- แสดงเป็นตารางสำหรับหน้าจอใหญ่ (>= md) --- */}
                    <div className="overflow-x-auto w-full hidden md:flex">
                        <table className="w-full max-w-full border-collapse border border-[#B9B9B9]">
                            <thead>
                                <tr className="text-[#565656]">
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.no}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.talentType}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.year}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.nameOfWorkActivity}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.awardsReceived}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.urlSummary}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.attachment}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {talents.map((talent, index) => (
                                    <tr key={index} className="text-center text-[#565656]">
                                        <td className="border border-[#B9B9B9] px-4 py-2 font-bold">{index + 1}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">{talent.talentType}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2">{talent.talentYear}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">{talent.talentActivity}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">{talent.talentAward}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">
                                            {talent.talentURL ? (
                                                <a href={talent.talentURL} className="text-[#008A90] hover:underline truncate max-w-[150px] sm:max-w-[200px] inline-block">
                                                    {talent.talentURL}
                                                </a>
                                            ) : " "}
                                        </td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">
                                            <div className="flex items-center gap-2">
                                                <div className="mt-2">
                                                    <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6" />
                                                </div>
                                                <a
                                                    href={talent.document}
                                                    download
                                                    className="text-[#008A90] hover:underline truncate max-w-[150px] sm:max-w-[200px] inline-block"
                                                    title={talent.document?.split("/").pop()}
                                                >
                                                    {talent.document?.split("/").pop()}
                                                </a>
                                            </div>
                                            <span className="text-[#565656] text-sm block mt-1 px-8">{talent.documentSize}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- แสดงเป็น Card (1 ต่อ 1) เมื่อหน้าจอเล็ก --- */}
                    <div className="md:hidden block space-y-4">
                        {talents.map((talent, index) => (
                            <div key={index} className="border border-[#B9B9B9] rounded-lg p-4 shadow-sm">
                                <p className="text-[#565656] font-semibold">{texts.talentType}: <span className="font-normal">{talent.talentType}</span></p>
                                <p className="text-[#565656] font-semibold">{texts.year}: <span className="font-normal">{talent.talentYear}</span></p>
                                <p className="text-[#565656] font-semibold">{texts.nameOfWorkActivity}: <span className="font-normal">{talent.talentActivity}</span></p>
                                <p className="text-[#565656] font-semibold">{texts.awardsReceived}: <span className="font-normal">{talent.talentAward}</span></p>
                                {talent.talentURL && (
                                    <p className="text-[#565656] font-semibold">{texts.talentUrlLink}:
                                        <a href={talent.talentURL} className="text-[#008A90] hover:underline ml-2 truncate max-w-[200px] inline-block">
                                            {talent.talentURL}
                                        </a>
                                    </p>
                                )}
                                {talent.document && (
                                    <p className="text-[#565656] font-semibold flex items-center">
                                        {texts.attachment}:
                                        <a href={talent.document} download className="text-[#008A90] font-medium hover:underline ml-2 truncate max-w-[200px] inline-block">
                                            {talent.document.split("/").pop()}
                                        </a>
                                        <span className="text-[#565656] text-sm ml-2">({talent.documentSize})</span>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TalentSummary;
