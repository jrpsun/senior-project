"use client";

import { useEffect, useState } from "react";
import CheckboxDropdown from "../../common/checkbox";
import { useLanguage } from "../../../hooks/LanguageContext"; 
import { generalInfoTexts, offlineOptions, onlineOptions } from "../../../translation/generalInfo"; 
import Image from "next/image";
import { AdmissionChannelInterface } from "@components/types/generalInfoType";

interface AdmissionChannelProps {
  data: AdmissionChannelInterface;
  onChange: (data: any) => void;
}

const SubscriptionForm: React.FC<AdmissionChannelProps> = ({ data, onChange }) => {
  const { language } = useLanguage();
  const currentLanguage = language || "ENG"; 
  const currentTexts = generalInfoTexts[currentLanguage] || generalInfoTexts["ENG"]; 

  const [onlineSources, setOnlineSources] = useState<string[]>([]);
  const [offlineSources, setOfflineSources] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      // setOnlineSources(data?.onlineChannel)
      // setOfflineSources(data?.offlineChannel)
    }
  },[data])

  return (
    <div className="flex justify-center py-5 bg-[white]">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
        <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
          {/* หัวข้อเปลี่ยนตามภาษา */}
          <h2 className="text-2xl text-[#008A90] font-semibold">
            {currentTexts.titleSubscription}
          </h2>
          <p className="text-[#B3B3B3] text-sm mt-1 flex items-center">
            <Image
              src="/images/Info_Message.svg"
              alt="Info Icon"
              width={20}
              height={20}
              className="mr-2"
            />
            {currentTexts.HeaderInfo} {/* เปลี่ยนข้อความตามภาษา */}
          </p>

          {/* ช่องทางออนไลน์ */}
          <div className="relative w-full overflow-visible mb-6">
            <CheckboxDropdown
              label={
                <span>
                  {currentTexts.onlineSources} <span className="text-red-500">*</span>
                </span>
              }
              options={onlineOptions[currentLanguage] || onlineOptions["ENG"]}
              selected={onlineSources}
              onChange={setOnlineSources}
              placeholder={currentTexts.onlineSourcesPlaceholder} 
              otherPlaceholder={currentTexts.otherInput}
            />
            <p className="text-sm text-[#B3B3B3] mt-1">{currentTexts.SelectSourcesInfo}</p>
          </div>

          {/* ช่องทางออฟไลน์ */}
          <div className="relative w-full overflow-visible">
            <CheckboxDropdown
              label={
                <span>
                  {currentTexts.offlineSources} <span className="text-red-500">*</span>
                </span>
              }
              options={offlineOptions[currentLanguage] || offlineOptions["ENG"]}
              selected={offlineSources}
              onChange={setOfflineSources}
              placeholder={currentTexts.offlineSourcesPlaceholder}
              otherPlaceholder={currentTexts.otherInput}
            />
            <p className="text-sm text-[#B3B3B3] mt-1">{currentTexts.SelectSourcesInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;
