"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../hooks/LanguageContext";
import Navbar from "../../components/Navbar";
import { ViewDetailButton, PaymentButton, InterviewInfoButton } from "../../components/common/button";
import useStatusData from "../../components/common/statusList";

export default function ApplicationStatus() {
  const router = useRouter();
  const { language } = useLanguage();
  const { getStatusById } = useStatusData();

  const applications = [
    {
      id: "0000025",
      course: {
        TH: "สาขาเทคโนโลยีสารสนเทศและการสื่อสาร (ICT) หลักสูตรนานาชาติ - ICT Portfolio",
        EN: "Information and Communication Technology (ICT) - ICT Portfolio",
      },
      period: {
        TH: "01 ม.ค. 68 - 31 มี.ค. 68",
        EN: "01 Jan 25 - 31 Mar 25",
      },
      statusId: "01",
      documentStatusId: "02",
      paymentStatusId: "01",
    },
    {
      id: "0000017",
      course: {
        TH: "สาขาวิชาการและเทคโนโลยีดิจิทัล (DST) หลักสูตรไทย MU - Portfolio (TCAS 1) ปีการศึกษา 2568",
        EN: "Digital Science and Technology (DST) - Thai Program MU - Portfolio (TCAS 1) 2025",
      },
      period: {
        TH: "01 ม.ค. 68 - 31 มี.ค. 68",
        EN: "01 Jan 25 - 31 Mar 25",
      },
      statusId: "06",
      documentStatusId: "03",
      paymentStatusId: "03",
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pl-20 pt-4 text-sm text-gray-500">
        <button
          onClick={() => router.push("/programs")}
          className="text-gray-400 hover:text-[#008A90] hover:underline transition"
        >
          {language === "TH" ? "หน้าแรก" : "Home"}
        </button>
        <span className="mx-1 text-gray-400">/</span>
        <span className="text-[#008A91] font-medium">
          {language === "TH" ? "ตรวจสอบสถานะการสมัคร" : "Applicat Status"}
        </span>
      </div>

      {/* Main Content */}
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <h1 className="text-left text-3xl font-bold text-[#008A90] mb-8 flex items-center justify-start">
          <svg className="mr-4" width="32" height="45" viewBox="0 0 32 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.9369 0C12.4673 0 9.51233 2.34668 8.42497 5.625H5.3123C2.38223 5.625 0 8.14746 0 11.25V39.375C0 42.4775 2.38223 45 5.3123 45H26.5615C29.4916 45 31.8738 42.4775 31.8738 39.375V11.25C31.8738 8.14746 29.4916 5.625 26.5615 5.625H23.4488C22.3615 2.34668 19.4065 0 15.9369 0ZM15.9369 5.625C16.6414 5.625 17.317 5.92132 17.8151 6.44876C18.3132 6.97621 18.593 7.69158 18.593 8.4375C18.593 9.18342 18.3132 9.89879 17.8151 10.4262C17.317 10.9537 16.6414 11.25 15.9369 11.25C15.2324 11.25 14.5568 10.9537 14.0587 10.4262C13.5606 9.89879 13.2807 9.18342 13.2807 8.4375C13.2807 7.69158 13.5606 6.97621 14.0587 6.44876C14.5568 5.92132 15.2324 5.625 15.9369 5.625ZM25.3164 23.9941L14.6918 35.2441C13.9116 36.0703 12.6499 36.0703 11.878 35.2441L6.55737 29.6191C5.77712 28.793 5.77712 27.457 6.55737 26.6396C7.33761 25.8223 8.59928 25.8135 9.37123 26.6396L13.2724 30.7705L22.4943 21.0059C23.2745 20.1797 24.5362 20.1797 25.3081 21.0059C26.0801 21.832 26.0884 23.168 25.3081 23.9854L25.3164 23.9941Z" fill="#008A91" />
          </svg>
          {language === "TH" ? "ตรวจสอบสถานะการสมัคร" : "Check Application Status"}
        </h1>
        <div className="bg-yellow-50 text-[#008A90] border-l-4 border-[#008A90] p-4 flex items-center mb-8">
          <svg className="mr-2" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.54247 0.0341307C4.11959 0.00878598 0.525679 3.56641 0.515126 7.9798C0.50459 12.4026 4.07425 16.0085 8.48768 16.0338C12.9106 16.0592 16.5045 12.5016 16.515 8.08816C16.535 3.66533 12.9559 0.0594617 8.54247 0.0341307ZM8.43314 2.1887C8.82061 2.18926 9.1422 2.33149 9.40733 2.60594C9.6819 2.87096 9.81483 3.20192 9.81556 3.58939C9.8163 3.97687 9.6846 4.29799 9.41105 4.57166C9.14694 4.83589 8.81642 4.96772 8.4384 4.96716C8.04147 4.96659 7.71991 4.83381 7.44534 4.5688C7.18023 4.30379 7.03784 3.97282 7.03711 3.58534C7.03636 3.18842 7.17751 2.86731 7.45107 2.60309C7.71517 2.32941 8.04567 2.18813 8.43314 2.1887ZM6.18124 5.76717L9.8575 5.77253L9.87045 12.6242L10.9762 12.6258L10.9778 13.5047L6.19586 13.4977L6.1942 12.6188L7.29046 12.6204L7.27916 6.64767L6.1829 6.64608L6.18124 5.76717Z" fill="#008A91" />
          </svg>

          <span>{language === "TH" ? "กรุณาชำระเงินภายในวันที่ 31 มีนาคม 2568" : "Please complete your payment no later than March 31, 2025."}</span>
        </div>


        <div className="overflow-x-auto">
          {/* ตารางจะแสดงเฉพาะบนจอใหญ่ */}
          <table className="hidden md:table w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#F9FAFB] text-[#565656]">
                <th className="border px-4 py-2 w-[300px]">{language === "TH" ? "หลักสูตร" : "Course"}</th>
                <th className="border px-4 py-2 w-[270px]">{language === "TH" ? "ช่วงเวลาสมัคร" : "Application Date"}</th>
                <th className="border px-4 py-2 w-[125px]">{language === "TH" ? "เลขที่สมัคร" : "ID"}</th>
                <th className="border px-4 py-2 w-[255px]">{language === "TH" ? "สถานะการสมัคร" : "Application Status"}</th>
                <th className="border px-4 py-2 w-[265px]">{language === "TH" ? "สถานะเอกสาร" : "Document Status"}</th>
                <th className="border px-4 py-2 w-[250px]">{language === "TH" ? "สถานะการชำระเงิน" : "Payment Status"}</th>
                <th className="border px-4 py-2 w-[400px]"></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => {
                const appStatus = getStatusById("application", app.statusId) ?? {};
                const docStatus = getStatusById("documents", app.documentStatusId) ?? {};
                const payStatus = getStatusById("payment", app.paymentStatusId) ?? {};

                return (
                  <tr key={index} className="text-[#565656] text-sm align-middle">
                    <td className="border px-4 py-2">{app.course[language]}</td>
                    <td className="border px-4 py-2">{app.period[language]}</td>
                    <td className="border px-4 py-2 text-center">{app.id}</td>
                    <td className="border px-4 py-2 text-center">
                      <span className={`${appStatus?.style || ""}`}>{language === "TH" ? appStatus?.labelTH : appStatus?.labelEN}</span>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <span className={`${docStatus?.style || ""}`}>{language === "TH" ? docStatus?.labelTH : docStatus?.labelEN}</span>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <span className={`${payStatus?.style || ""}`}>{language === "TH" ? payStatus?.labelTH : payStatus?.labelEN}</span>
                    </td>

                    <td className="border px-4 py-2 h-full text-center align-middle">
                      <div className="flex justify-center items-center gap-2">
                        <ViewDetailButton onClick={() => router.push(`/application/${app.id}`)}>
                          {language === "TH" ? "ดูใบสมัคร" : "View Detail"}
                        </ViewDetailButton>
                        {payStatus?.id === "01" && (
                          <PaymentButton onClick={() => setPopupOpen(true)}>
                            {language === "TH" ? "ชำระเงิน" : "Payment"}
                          </PaymentButton>
                        )}
                        {appStatus?.id === "06" && (
                          <InterviewInfoButton onClick={() => router.push(`/interview/${app.id}`)}>
                            {language === "TH" ? "ดูข้อมูลสัมภาษณ์" : "Interview Info"}
                          </InterviewInfoButton>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile Responsive List (แสดงเฉพาะบนมือถือ) */}
          <div className="block md:hidden space-y-4">
            {applications.map((app, index) => {
              const appStatus = getStatusById("application", app.statusId) ?? {};
              const docStatus = getStatusById("documents", app.documentStatusId) ?? {};
              const payStatus = getStatusById("payment", app.paymentStatusId) ?? {};

              return (
                <div key={index} className="border border-gray-300 p-4 rounded-lg shadow-md bg-white">
                  <p className="text-base font-semibold text-[#565656]">
                    {language === "TH" ? "หลักสูตร" : "Course"}: {app.course[language]}
                  </p>
                  <p className="text-base text-[#565656]">
                    {language === "TH" ? "ช่วงเวลาสมัคร" : "Application Period"}: {language === "TH" ? app.period.TH : app.period.EN}
                  </p>
                  <p className="text-base text-[#565656]">
                    {language === "TH" ? "เลขที่สมัคร" : "Application ID"}: {app.id}
                  </p>

                  {/* เพิ่มช่องว่างให้ปุ่มสถานะ */}
                  <div className=" mt-2 flex flex-wrap inline-flex gap-1">
                    <span className={`text-lg font-medium px-1 py-2 rounded-full inline-block ${appStatus?.style || ""}`}>
                      {language === "TH" ? appStatus?.labelTH : appStatus?.labelEN}
                    </span>
                    <span className={`text-lg font-medium px-1 py-2 rounded-full inline-block  ${docStatus?.style || ""}`}>
                      {language === "TH" ? docStatus?.labelTH : docStatus?.labelEN}
                    </span>
                    <span className={`text-lg font-medium px-1 py-2 rounded-full inline-block ${payStatus?.style || ""}`}>
                      {language === "TH" ? payStatus?.labelTH : payStatus?.labelEN}
                    </span>
                  </div>

                  {/* ปรับให้ปุ่มอยู่ชิดซ้าย */}
                  <div className="mt-4 flex flex-wrap justify-start gap-3">
                    <ViewDetailButton className="text-lg" onClick={() => router.push(`/application/${app.id}`)}>
                      {language === "TH" ? "ดูใบสมัคร" : "View Detail"}
                    </ViewDetailButton>
                    {payStatus?.id === "01" && (
                      <PaymentButton className="text-lg" onClick={() => router.push(`/application/${app.id}`)}>
                        {language === "TH" ? "ชำระเงิน" : "Payment"}
                      </PaymentButton>
                    )}
                    {appStatus?.id === "06" && (
                      <InterviewInfoButton className="text-lg" onClick={() => router.push(`/interview/${app.id}`)}>
                        {language === "TH" ? "ดูข้อมูลสัมภาษณ์" : "Interview Info"}
                      </InterviewInfoButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}