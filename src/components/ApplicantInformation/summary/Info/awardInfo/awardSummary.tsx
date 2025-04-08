import React from "react";
import { useLanguage } from "../../../../../hooks/LanguageContext";
import { awardTexts } from "../../../../../translation/AwardInfo";
import ReportProb from "@components/components/common/admin/reportProb";
import { AwardResponse } from "@components/types/AwardType";

interface AwardSummaryProps {
    awards: AwardResponse[];
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
}

const AwardSummary: React.FC<AwardSummaryProps> = ({ awards, isVisible, setIsVisible }) => {
    const { language } = useLanguage();
    const texts = awardTexts[language] || awardTexts["ENG"];

    if (!awards || awards.length === 0) {
        return (
            <div className="flex justify-center py-2 bg-[white] h-[200px]">
                <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl lg:max-w-screen-xl p-1">
                    <div className="p-3 bg-white rounded-lg w-full max-w-6xl mx-auto">
                        <h2 className="text-2xl text-[#008A90] font-semibold mb-6 text-left">
                            {texts.comAwardSumTitle}
                        </h2>

                        <div className="flex justify-center">
                            <p className="text-[#C8C8CC] text-xl font-medium text-center mt-10">
                                {language === "TH"
                                    ? "ไม่มีข้อมูลเกียรติบัตรหรือรางวัล ด้านคอมพิวเตอร์"
                                    : "No Certificate or Award Information in Computer"}
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
                        {texts.comAwardSumTitle}
                    </h2>
                    <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                    {/* --- แสดงเป็นตารางเมื่อหน้าจอใหญ่ (>= md) --- */}
                    <div className="overflow-x-auto w-full hidden md:flex">
                        <table className="w-full max-w-full border-collapse border border-[#B9B9B9]">
                            <thead>
                                <tr className="text-[#565656]">
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.no}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.competitionName}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.competitionYear}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.competitionLevel}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.awardsReceived}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.projectWorks}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.attachment}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {awards.map((award, index) => (
                                    <tr key={index} className="text-center text-[#565656]">
                                        <td className="border border-[#B9B9B9] px-4 py-2 font-bold">{index + 1}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">{award?.nameOfCompetition}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 ">{award?.rewardYear}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">{award?.rewardLevel}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">{award?.rewardAwards}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">{award?.project}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">
                                            <div className="flex items-center gap-2">
                                                <div className="mt-2">
                                                    <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6" />
                                                </div>
                                                <a
                                                    href={award?.rewardCer}
                                                    download
                                                    className="text-[#008A90] hover:underline truncate max-w-[150px] sm:max-w-[200px] inline-block"
                                                    title={award?.rewardCerName}
                                                >
                                                    {award?.rewardCerName}
                                                </a>
                                            </div>
                                            <span className="text-[#565656] text-sm block mt-1 px-8">{award?.rewardCerSize}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* --- แสดงเป็น Card (1 ต่อ 1) เมื่อหน้าจอเล็ก --- */}
                    <div className="md:hidden block space-y-4">
                        {awards.map((award, index) => (
                            <div key={index} className="border border-[#B9B9B9] rounded-lg p-4 shadow-sm">
                                <p className="text-[#565656] font-semibold">{texts.competitionName}: <span className="font-normal">{award?.nameOfCompetition}</span></p>
                                <p className="text-[#565656] font-semibold">{texts.competitionYear}: <span className="font-normal">{award?.rewardYear}</span></p>
                                <p className="text-[#565656] font-semibold">{texts.competitionLevel}: <span className="font-normal">{award?.rewardLevel}</span></p>
                                <p className="text-[#565656] font-semibold">{texts.awardsReceived}: <span className="font-normal">{award?.rewardAwards}</span></p>
                                <p className="text-[#565656] font-semibold">{texts.projectWorks}: <span className="font-normal">{award?.project}</span></p>
                                <p className="text-[#565656] font-semibold flex items-center">
                                    {texts.attachment}:
                                    <a
                                        href={award?.rewardCer}
                                        download
                                        className="text-[#008A90] font-medium hover:underline ml-2 truncate max-w-[200px] sm:max-w-[300px] inline-block"
                                        title={award?.rewardCerName}
                                    >
                                        {award?.rewardCerName}
                                    </a>
                                    <span className="text-[#565656] text-sm ml-2">({award?.rewardCerSize})</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AwardSummary;
