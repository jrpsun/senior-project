import React from "react";
import { useLanguage } from "../../../../hooks/LanguageContext";
import { trainingTexts } from "../../../../translation/TrainingInfo";
import ReportProb from "@components/components/common/admin/reportProb";
import { TrainingResponse } from "@components/types/TrainType";

interface trainingSummaryProps {
    trainings: TrainingResponse[];
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
    setReport: any;
}

const trainingSummary: React.FC<trainingSummaryProps> = ({ trainings, isVisible, setIsVisible, setReport }) => {
    const { language } = useLanguage();
    const texts = trainingTexts[language] || trainingTexts["ENG"];

    if (!trainings || trainings.length === 0) {
        return (
          <div className="flex justify-center py-5 bg-[white]">
             <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-6xl mx-auto">
                <p className="text-[#C8C8CC] text-xl font-medium text-center">
                  {language === "TH"
                    ? "ยังไม่มีข้อมูลการฝึกอบรม"
                    : "No Training Information Available."}
                </p>
              </div>
            </div>
          </div>
        );
    }

    return (
        <div className="flex justify-center py-5 bg-[white]">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-6xl mx-auto">
                    <div className="flex flex-cols gap-4">
                        <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
                            {texts.trainingTitle}
                        </h2>
                        <ReportProb isVisible={isVisible} problem={texts.trainingTitle} setReport={setReport} reportColumn={"training"}/>
                    </div>
                    {/* ตารางสำหรับหน้าจอใหญ่ */}
                    <div className="overflow-x-auto w-full hidden md:flex">
                        <table className="w-full max-w-full border-collapse border border-[#B9B9B9]">
                            <thead>
                                <tr className="text-[#565656]">
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.no}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.programName}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.institution}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.trainingYear}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.trainingMode}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.country}</th>
                                    <th className="border border-[#B9B9B9] px-4 py-2">{texts.attachment}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainings.map((training, index) => (
                                    <tr key={index} className="text-center text-[#565656]">
                                        <td className="border border-[#B9B9B9] px-4 py-2 font-bold">{index + 1}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">{training?.nameOfCourse}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">{training?.institution}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2">{training?.trainingYear}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">{training?.trainingMode}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">{training?.trainingCountry || "-"}</td>
                                        <td className="border border-[#B9B9B9] px-4 py-2 text-left">
                                            <div className="flex items-center gap-2">
                                                <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6" />
                                                <a
                                                    href={training?.trainingCer}
                                                    download
                                                    className="text-[#008A90] hover:underline truncate max-w-[150px] sm:max-w-[200px] inline-block"
                                                    title={training?.trainingCerName}
                                                >
                                                    {training?.trainingCerName}
                                                </a>
                                            </div>
                                            <span className="text-[#565656] text-sm block mt-1 px-8">{training?.trainingCerSize}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* แสดงเป็น Card สำหรับหน้าจอเล็ก */}
                    <div className="md:hidden block space-y-4">
                        {trainings.map((training, index) => (
                            <div key={index} className="border border-[#B9B9B9] rounded-lg p-4 shadow-sm">
                                <p className="text-[#565656] font-semibold">{texts.programName}: <span className="font-normal">{training?.nameOfCourse}</span></p>
                                <p className="text-[#565656] font-semibold">{texts.institution}: <span className="font-normal">{training?.institution}</span></p>
                                <p className="text-[#565656] font-semibold">{texts.trainingYear}: <span className="font-normal">{training?.trainingYear}</span></p>
                                <p className="text-[#565656] font-semibold">{texts.trainingMode}: <span className="font-normal">{training?.trainingMode}</span></p>
                                {training?.trainingCountry && (
                                    <p className="text-[#565656] font-semibold">{texts.country}: <span className="font-normal">{training?.trainingCountry}</span></p>
                                )}
                                <p className="text-[#565656] font-semibold flex items-center">
                                    {texts.attachment}:
                                    <a
                                        href={training?.trainingCer}
                                        download
                                        className="text-[#008A90] font-medium hover:underline ml-2 truncate max-w-[200px] sm:max-w-[300px] inline-block"
                                        title={training?.trainingCerName}
                                    >
                                        {training?.trainingCerName}
                                    </a>
                                    <span className="text-[#565656] text-sm ml-2">({training?.trainingCerSize})</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default trainingSummary;
