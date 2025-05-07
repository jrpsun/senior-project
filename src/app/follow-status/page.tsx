"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "../../hooks/LanguageContext";
import Navbar from "../../components/Navbar";
import { ViewDetailButton, PaymentButton } from "../../components/common/button";
import { InterviewInfoButton } from "../../components/common/button";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { TokenApplicantPayload } from "@components/types/token";
import Modal from "@components/components/common/popup-login";
import { authFetch } from "@components/lib/auth";
import LoadingSpinner from "@components/components/LoadingSpinner";
import useStatusData from "../../components/common/statusList";
import { getStatusById, getStatusByLabel } from "@components/utils/status";


interface ApplicantStatus {
  admissionId?: string;
  course?: string;
  startDate?: string;
  endDate?:string;
  program?:string;
  applicant_number?: string;
  admissionStatus?: string;
  docStatus?: string;
  paymentStatus?: string;
}


export default function ApplicationStatus() {
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [appId, setAppId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [applications, setApplications] = useState<ApplicantStatus[]>([]);


  useEffect(() => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setShowModal(true);
          return;
        }
    
        const decoded: TokenApplicantPayload & { exp: number } = jwtDecode(token);
        const now = Date.now() / 1000;
    
        if (decoded.exp < now) {
          localStorage.removeItem("access_token");
          setShowModal(true);
          return;
        }
    
        setAppId(decoded.appId);
      } catch {
        localStorage.removeItem("access_token");
        setShowModal(true);
      }
  }, []);

  const fetchFollowStatus = async() => {
    setLoading(true);
    const response = await authFetch(`${process.env.API_BASE_URL}/applicant/follow-status/${appId}`, {
      method: 'GET',
    });

    const data = await response.json();
    setApplications(data)
    setLoading(false);
  }

  useEffect(() => {
    if (appId) {
      fetchFollowStatus();
    }
  }, [appId])

  // const applications = [
  //   {
  //     id: "0000025",
  //     course: {
  //       TH: "สาขาเทคโนโลยีสารสนเทศและการสื่อสาร (ICT) หลักสูตรนานาชาติ - ICT Portfolio",
  //       EN: "Information and Communication Technology (ICT) - ICT Portfolio",
  //     },
  //     period: {
  //       TH: "01 ม.ค. 68 - 31 มี.ค. 68",
  //       EN: "01 Jan 25 - 31 Mar 25",
  //     },
  //     statusId: "01",
  //     documentStatusId: "02",
  //     paymentStatusId: "01",
  //   },
  //   {
  //     id: "0000017",
  //     course: {
  //       TH: "สาขาวิชาการและเทคโนโลยีดิจิทัล (DST) หลักสูตรไทย MU - Portfolio (TCAS 1) ปีการศึกษา 2568",
  //       EN: "Digital Science and Technology (DST) - Thai Program MU - Portfolio (TCAS 1) 2025",
  //     },
  //     period: {
  //       TH: "01 ม.ค. 68 - 31 มี.ค. 68",
  //       EN: "01 Jan 25 - 31 Mar 25",
  //     },
  //     statusId: "06",
  //     documentStatusId: "03",
  //     paymentStatusId: "03",
  //   }
  // ];

  function toThaiDate(dateStr: string): string {
    const monthsThaiShort = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ]

    const [year, month, day] = dateStr.split("-").map(Number);
    const thaiYear = year + 543;
    const thaiMonth = monthsThaiShort[month - 1];

    return `${day} ${thaiMonth} ${thaiYear}`;
  }

  return (
    <div className="bg-white min-h-screen">
      {showModal && <Modal role="applicant"/>}
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

        {loading ? (
          <LoadingSpinner />
        ):(
        <div className="overflow-x-auto">
          {/* ตารางจะแสดงเฉพาะบนจอใหญ่ */}
          <table className="hidden md:table w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#F9FAFB] text-[#565656]">
                <th className="border px-4 py-2 w-[300px]">{language === "TH" ? "หลักสูตร" : "Course"}</th>
                <th className="border px-4 py-2 w-[350px]">{language === "TH" ? "ช่วงเวลาสมัคร" : "Application Date"}</th>
                <th className="border px-4 py-2 w-[125px]">{language === "TH" ? "เลขที่สมัคร" : "ID"}</th>
                <th className="border px-4 py-2 w-[255px]">{language === "TH" ? "สถานะการสมัคร" : "Application Status"}</th>
                <th className="border px-4 py-2 w-[265px]">{language === "TH" ? "สถานะเอกสาร" : "Document Status"}</th>
                <th className="border px-4 py-2 w-[250px]">{language === "TH" ? "สถานะการชำระเงิน" : "Payment Status"}</th>
                <th className="border px-4 py-2 w-[400px]"></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => {
                  const appStatus = getStatusByLabel("application", app.admissionStatus || "") ?? {};
                  const docStatus = getStatusByLabel("documents", app.docStatus || "") ?? {};
                  const payStatus = getStatusByLabel("payment", app.paymentStatus || "") ?? {};
                return (
                  <tr key={index} className="text-[#565656] text-sm align-middle">
                    <td className="border px-4 py-2">{app.course}</td>
                    <td className="border px-4 py-2">{toThaiDate(app.startDate || "")} - {toThaiDate(app.endDate || "")}</td>
                    <td className="border px-4 py-2 text-center">{app.applicant_number}</td>
                    <td className="border px-4 py-2 text-center">
                      <span className={`${appStatus?.style || ""}`}>{app.admissionStatus}</span>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <span className={`${docStatus?.style || ""}`}>{app.docStatus}</span>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <span className={`${payStatus?.style || ""}`}>{app.paymentStatus}</span>
                    </td>

                    <td className="border px-4 py-2 h-full text-center align-middle">
                      <div className="flex justify-center items-center gap-2">
                        <ViewDetailButton onClick={() => router.push(`/apply/ApplicationInfo?id=${app.admissionId}&program=${app.program}`)}>
                          {language === "TH" ? "ดูใบสมัคร" : "View Detail"}
                        </ViewDetailButton>
                        {app.paymentStatus === "01 - ยังไม่ได้ชำระเงิน" && (
                          <PaymentButton onClick={() => setPopupOpen(true)}>
                            {language === "TH" ? "ชำระเงิน" : "Payment"}
                          </PaymentButton>
                        )}
                        {app.admissionStatus === "06 - รอสัมภาษณ์" && (
                          <InterviewInfoButton onClick={() => console.log("interview")}>
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
              const appStatus = getStatusByLabel("application", app.admissionStatus || "") ?? {};
              const docStatus = getStatusByLabel("documents", app.docStatus || "") ?? {};
              const payStatus = getStatusByLabel("payment", app.paymentStatus || "") ?? {};

              return (
                <div key={index} className="border border-gray-300 p-4 rounded-lg shadow-md bg-white">
                  <p className="text-base font-semibold text-[#565656]">
                    {language === "TH" ? "หลักสูตร" : "Course"}: {app.course}
                  </p>
                  <p className="text-base text-[#565656]">
                    {language === "TH" ? "ช่วงเวลาสมัคร" : "Application Period"}: {toThaiDate(app.startDate || "")} - {toThaiDate(app.endDate || "")}
                  </p>
                  <p className="text-base text-[#565656]">
                    {language === "TH" ? "เลขที่สมัคร" : "Application ID"}: {app.applicant_number}
                  </p>

                  {/* เพิ่มช่องว่างให้ปุ่มสถานะ */}
                  <div className=" mt-2 flex flex-wrap inline-flex gap-1">
                    <span className={`text-lg font-medium px-1 py-2 rounded-full inline-block${appStatus?.style || ""}`}>
                      {app.admissionStatus}
                    </span>
                    <span className={`text-lg font-medium px-1 py-2 rounded-full inline-block ${docStatus?.style || ""}`}>
                      {app.docStatus}
                    </span>
                    <span className={`text-lg font-medium px-1 py-2 rounded-full inline-block ${payStatus?.style || ""}`}>
                      {app.paymentStatus}
                    </span>
                  </div>

                  {/* ปรับให้ปุ่มอยู่ชิดซ้าย */}
                  <div className="mt-4 flex flex-wrap justify-start gap-3">
                    <ViewDetailButton className="text-lg" onClick={() => router.push(`/apply/ApplicationInfo?id=${app.admissionId}`)}>
                      {language === "TH" ? "ดูใบสมัคร" : "View Detail"}
                    </ViewDetailButton>
                    {app.paymentStatus === "01 - ยังไม่ได้ชำระเงิน" && (
                      <PaymentButton className="text-lg" onClick={() => console.log("payment")}>
                        {language === "TH" ? "ชำระเงิน" : "Payment"}
                      </PaymentButton>
                    )}
                    {app.admissionStatus === "06 - รอสัมภาษณ์" && (
                      <InterviewInfoButton onClick={() => console.log("interview")}>
                        {language === "TH" ? "ดูข้อมูลสัมภาษณ์" : "Interview Info"}
                      </InterviewInfoButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>)}
      </div>
    </div>
  );
}