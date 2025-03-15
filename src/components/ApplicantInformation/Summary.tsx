import React from "react";
import { useLanguage } from "../../hooks/LanguageContext";
import { summaryTexts } from "@components/translation/summary";
import GeneralInfo from "./summary/GeneralInfo";
import EducationInfo from "./summary/EducationInfo";
import Awards from "./summary/Award";
import Training from "./summary/Training";
import AdditionalDoc from "./summary/AdditionalDoc";

const Summary = () => {
  const { language } = useLanguage();
  
  return (
      <div className="py-5 bg-white w-full">
          <div className="bg-white rounded-lg w-full max-w-[1700px] lg:max-w-screen-2xl p-3">
              <h2 className="text-[24px] md:text-[28px] lg:text-[30px] leading-[32px] md:leading-[36px] lg:leading-[40px] text-[#565656] mb-6 whitespace-normal text-left w-full">
                  <span className="text-[#008A90] font-bold">
                      {summaryTexts[language].title}
                  </span>
                  <span className="block md:inline"> {summaryTexts[language].subtitle}</span>
              </h2>
              <GeneralInfo />
              <EducationInfo />
              <Awards />
              <Training />
              <AdditionalDoc />
          </div>
      </div>
  );
};

export default Summary;
