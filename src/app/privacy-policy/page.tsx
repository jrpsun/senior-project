"use client";

import React from "react";
import Image from "next/image"; // เพิ่มการนำเข้า Image
import { Button } from "../../components/common/button";
import Navbar from "../../components/Navbar";
import { Card, CardContent } from "../../components/common/card";
import { useLanguage } from "../../hooks/LanguageContext"; // ใช้ context เพื่อดึงค่าภาษา

const PrivacyPolicyPage = () => {
  const { language } = useLanguage(); // ใช้ context เพื่อดึงค่าภาษา

  // เปลี่ยนเส้นทาง PDF ตามภาษา
  const privacyPolicyPath =
    language === "TH"
      ? "/documents/privacy-policy (TH).pdf"
      : "/documents/privacy-policy (EN).pdf";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center p-6">
        {/* เปลี่ยนหัวข้อเป็นภาษาไทยหรืออังกฤษ */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {language === "TH"
            ? "ประกาศนโยบายความเป็นส่วนตัว"
            : "Privacy Notice"}
        </h1>

        {/* PDF Viewer */}
        <Card className="w-full max-w-4xl bg-white shadow-md rounded-lg">
          <CardContent>
            <iframe
              src={privacyPolicyPath}
              className="w-full h-[600px] border rounded-lg"
              title="Privacy Notice"
            ></iframe>
          </CardContent>
        </Card>

        {/* ปุ่มดาวน์โหลด PDF */}
        <div className="mt-4 w-full max-w-4xl">
          <Card className="w-full bg-white rounded-lg border p-2 h-16">
            <a href={privacyPolicyPath} download className="w-full flex justify-start">
              <Button
                variant="outline"
                className="flex items-center space-x-2 text-[#008A90] border-[#008A90] bg-white hover:bg-white px-3 py-0.5 rounded-md h-7"
              >
                <Image
                  src="/images/privacy-policy/download.svg" // ใช้ icon download (ตรวจสอบให้แน่ใจว่าไฟล์นี้อยู่ใน public/icons/)
                  alt="Download"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                <span>
                  {language === "TH"
                    ? "ดาวน์โหลด ประกาศความเป็นส่วนตัวด้านข้อมูลผู้สมัครเข้าเรียน"
                    : "Download the privacy notice on information for those interested in studying at Mahidol University."}
                </span>
              </Button>
            </a>
          </Card>
        </div>

        {/* ปุ่มย้อนกลับ */}
        <div className="mt-4">
          <Button
            variant="secondary"
            className="flex justify-center items-center text-[#008A90] bg-white border-2 border-[#008A90] hover:text-regular text-[16] font-medium px-10 py-2 rounded-lg "
            onClick={() => window.history.back()}
          >
            <span>{language === "TH" ? "กลับ" : "Back"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
