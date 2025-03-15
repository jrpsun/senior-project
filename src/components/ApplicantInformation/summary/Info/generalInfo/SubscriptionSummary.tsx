import React from "react";
import { useLanguage } from "../../../../../hooks/LanguageContext";
import { generalInfoTexts } from "../../../../../translation/generalInfo";

interface SubscriptionSummaryProps {
    onlineSources: string[];
    offlineSources: string[];
}

const SubscriptionSummary: React.FC<SubscriptionSummaryProps> = ({
    onlineSources,
    offlineSources,
}) => {
    const { language } = useLanguage();
    const texts = generalInfoTexts[language] ?? generalInfoTexts["ENG"];

    return (
        <div className="flex justify-center py-5 bg-white">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
                        {texts.titleSubscription}
                    </h2>

                    {/* ช่องทางออนไลน์ */}
                    <div className="mb-4">
                        <p className="text-[#565656] font-bold">{texts.onlineSources}</p>
                        {onlineSources.length > 0 ? (
                            <ul className="list-disc pl-5 text-[#565656]">
                                {onlineSources.map((source, index) => (
                                    <li key={index}>{source}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">{texts.onlineSourcesPlaceholder}</p>
                        )}
                    </div>

                    {/* ช่องทางออฟไลน์ */}
                    <div>
                        <p className="text-[#565656] font-bold">{texts.offlineSources}</p>
                        {offlineSources.length > 0 ? (
                            <ul className="list-disc pl-5 text-[#565656]">
                                {offlineSources.map((source, index) => (
                                    <li key={index}>{source}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">{texts.offlineSourcesPlaceholder}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionSummary;
