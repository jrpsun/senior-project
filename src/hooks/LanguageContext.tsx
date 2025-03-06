"use client";

import React, { createContext, useContext, useState } from "react";

// สร้าง Context สำหรับภาษา
const LanguageContext = createContext<{
  language: "TH" | "ENG";
  setLanguage: (lang: "TH" | "ENG") => void;
} | undefined>(undefined); // ป้องกัน `undefined`

// Provider สำหรับใช้ครอบ Component ทั้งหมด
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<"TH" | "ENG">("TH");

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook สำหรับใช้ใน Component อื่น ๆ
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
