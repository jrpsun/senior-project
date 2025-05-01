"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../hooks/LanguageContext";
import { summaryTexts } from "@components/translation/summary";
import GeneralInfo from "./summary/GeneralInfo";
import EducationInfo from "./summary/EducationInfo";
import Awards from "./summary/Award";
import Training from "./summary/Training";
import AdditionalDoc from "./summary/AdditionalDoc";
import { BackButton, ConfirmApplicationButton, PrintDocumentButton, CancelApplicationButton } from "../common/button";
import Popup from "../common/popup";

const Summary = ({onOpenPopup, appId, admId}: any) => {
    const router = useRouter();
    const { language } = useLanguage() as { language: "TH" | "EN" };
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [isSuccessOpen, setSuccessOpen] = useState(false);
    const [isCancelOpen, setCancelOpen] = useState(false);
    const [isCancelSuccessOpen, setCancelSuccessOpen] = useState(false); // true = แสดง popup ยืนยันการสมัครหลังจากกดปุ่มยืนยันการสมัคร (คิดสักอย่างใน applicationInfo)
    const [isConfirmed, setIsConfirmed] = useState(false); // true = กดยืนยันการสมัคร (ข้อมูลการสมัคร+แถบเลือกหน้าหาย)

    return (
        <div className="py-5 bg-white w-full ">
        {isConfirmed && (
            <div className="text-sm text-gray-500 pl-4 pt-4">
                <a
                    onClick={() => router.push("/programs")}
                    className="text-gray-400 hover:text-[#008A90] hover:underline cursor-pointer transition"
                >
                    {language === "TH" ? "หน้าแรก" : "Home"}
                </a>
                <span className="mx-1 text-gray-400">/</span>
                <a
                    onClick={() => router.push("/follow-status")}
                    className="text-gray-400 hover:text-[#008A90] hover:underline cursor-pointer transition"
                >
                    {language === "TH" ? "ดูข้อมูลการสมัคร" : "Application Details"}
                </a>
                <span className="mx-1 text-gray-400">/</span>
                <span className="text-[#565656]">
                    {language === "TH"
                        ? "รอบ MU – Portfolio (TCAS 1) ปีการศึกษา 2568"
                        : "MU – Portfolio (TCAS 1) Academic Year 2025"}
                </span>
                <span className="mx-1 text-gray-400">/</span>
                <span className="text-[#565656]">
                    {language === "TH" ? "เลขที่สมัคร 0000025" : "Application Number 0000025"}
                </span>
            </div>
        )}
            <div className="bg-white rounded-lg w-full max-w-[1700px] lg:max-w-screen-2xl p-3">
                {!isConfirmed ? (
                    // แสดงเมนูเดิมถ้ายังไม่กดยืนยัน
                    <>
                        <h2 className="text-[24px] md:text-[28px] lg:text-[30px] leading-[32px] md:leading-[36px] lg:leading-[40px] text-[#565656] mb-6 whitespace-normal text-left w-full">
                            <span className="text-[#008A90] font-bold">
                                {summaryTexts[language].title}
                            </span>
                            <span className="block md:inline"> {summaryTexts[language].subtitle}</span>
                        </h2>
                        <GeneralInfo appId={appId} admId={admId}/>
                        <EducationInfo appId={appId} admId={admId}/>
                        <Awards appId={appId} admId={admId}/>
                        <Training appId={appId} admId={admId}/>
                        <AdditionalDoc appId={appId} admId={admId}/>
                    </>
                ) : (
                    // แสดงข้อมูลใหม่เมื่อกดยืนยันสมัครแล้ว
                    <div>
                        <h2 className="text-[24px] md:text-[28px] lg:text-[30px] leading-[32px] md:leading-[36px] lg:leading-[40px] text-[#565656] mb-6 whitespace-normal text-left w-full">
                            <span className="text-[#008A90] font-bold">
                                {summaryTexts[language].title}
                            </span>
                            <span className="block md:inline"> {summaryTexts[language].subtitle}</span>
                        </h2>
                        <div className="flex flex-col items-end mt-4">
                            <p className="text-[#565656] text-right">
                                {summaryTexts[language].submissionDate}
                            </p>

                            {/* ปุ่มเพิ่มเติม จัดชิดขวา */}
                            <div className="flex gap-4 mt-2">
                                <PrintDocumentButton>{summaryTexts[language].iconPrint}</PrintDocumentButton>
                                <CancelApplicationButton onClick={() => setCancelOpen(true)}>
                                    {summaryTexts[language].iconCancel}
                                </CancelApplicationButton>
                            </div>
                        </div>
                        <p className="text-[20px] text-[#565656] mt-2">
                            {summaryTexts[language].applicationNumber}
                        </p>
                        <GeneralInfo appId={appId} admId={admId}/>
                        <EducationInfo appId={appId} admId={admId}/>
                        <Awards appId={appId} admId={admId}/>
                        <Training appId={appId} admId={admId}/>
                        <AdditionalDoc appId={appId} admId={admId}/>
                    </div>
                )}
            </div>

            {/* ปุ่มกดยืนยัน */}
            {/* {!isConfirmed && (
                <div className="flex justify-center mt-6 mb-6 gap-x-4">
                    <BackButton>{summaryTexts[language].BackButton}</BackButton>
                    <ConfirmApplicationButton onClick={() => setConfirmOpen(true)}>
                        {summaryTexts[language].ConfirmApplicationButton}
                    </ConfirmApplicationButton>
                </div>
            )} */}
            {/* ปุ่มย้อนกลับเมื่อสมัครสำเร็จแล้ว */}
            {/* {isConfirmed && (
                <div className="flex justify-center mt-6 mb-6">
                    <BackButton onClick={() => router.push("/programs")}>
                        {language === "TH" ? "ย้อนกลับ" : "Back"}
                    </BackButton>
                </div>
            )} */}

            {/* Popup ยืนยันการสมัคร */}
            <Popup
                type="confirmApplication"
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => {
                    setConfirmOpen(false); // ปิด popup ยืนยัน
                    setSuccessOpen(true); // เปิด popup สมัครสำเร็จ
                }}
            />

            {/* Popup การสมัครสำเร็จ */}
            <Popup
                type="applicationSuccess"
                isOpen={isSuccessOpen}
                onClose={() => {
                    setSuccessOpen(false);
                    setIsConfirmed(true); // อัปเดต state ว่าสมัครแล้ว
                }}
            />

            {/* Popup ยืนยันการยกเลิกการสมัคร */}
            <Popup
                type="cancelApplication"
                isOpen={isCancelOpen}
                onClose={() => setCancelOpen(false)}
                onConfirm={() => {
                    setCancelOpen(false);
                    setCancelSuccessOpen(true);
                    setIsConfirmed(false);
                }}
            />
            {/* Popup ยกเลิกสมัครสำเร็จ */}
            <Popup
                type="cancelSuccess"
                isOpen={isCancelSuccessOpen}
                onClose={() => setCancelSuccessOpen(false)}
            />
        </div>
    );
};

export default Summary;