"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [language, setLanguage] = useState("TH");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError(language === "TH" ? "ไม่พบบัญชีผู้ใช้งาน กรุณาตรวจสอบอีเมลอีกครั้ง" : "User account not found. Please check your email again");
      setSuccessMessage(null);
      return;
    }

    setSuccessMessage(
      language === "TH"
        ? "เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลของคุณแล้ว"
        : "Please check your email to reset your password"
    );
    setError(null);
    setIsEmailSubmitted(true);
  };

  const renderLanguageButtons = () => (
    <div className="absolute top-4 right-4">
      {isAlertVisible && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}
      <button
        className={`px-3 py-1 text-sm font-medium ${language === "TH" ? "text-[#008A90] font-bold" : "text-gray-500"}`}
        onClick={() => setLanguage("TH")}
      >
        TH
      </button>
      <span className="text-gray-400"> | </span>
      <button
        className={`px-3 py-1 text-sm font-medium ${language === "EN" ? "text-[#008A90] font-bold" : "text-gray-500"}`}
        onClick={() => setLanguage("EN")}
      >
        EN
      </button>
    </div>
  );

  const renderLogo = () => (
    <div className="hidden md:block w-1/2 relative">
      <img
        src="logo_ict.png"
        alt="มหาวิทยาลัยมหิดล โลโก้"
        width="180"
        height="60"
        className="absolute top-6 left-6 z-50"
      />
      <div
        className="absolute inset-0 bg-cover bg-center brightness-100"
        style={{ backgroundImage: "url('/images/background.png')" }}
      />
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleResetPassword} className="mb-6" noValidate>
      {isEmailSubmitted ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      ) : (
        <>
          <div className="mb-4 text-left">
            <label className="block text-gray-700 font-medium mb-2">
              {language === "TH" ? "อีเมล" : "Email"} <span className="text-red-500"> *</span>
            </label>
            <input
              type="email"
              className={`w-full p-2 border rounded-[10px] mt-1 text-gray-900 placeholder-[#C4C4C4] h-[44px] focus:outline-none bg-white ${error ? "border-red-500" : "border-gray-300"
                }`}
              placeholder={language === "TH" ? "ระบุอีเมล" : "Enter your email"}
              value={email}
              onChange={(e) => {
                const thaiPattern = /[฀-๿]/;
                if (!thaiPattern.test(e.target.value)) {
                  setEmail(e.target.value);
                  setError(null);
                }
              }}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-[220px] bg-[#008A90] text-white font-medium py-3 rounded-lg hover:bg-[#007a80]"
          >
            {language === "TH" ? "ขอรีเซ็ตรหัสผ่าน" : "Request a password reset"}
          </button>
        </>
      )}
    </form>
  );

  const renderFooter = () => (
    <div className="text-center text-gray-600 text-sm">
      <p>
        {language === "TH" ? "หากไม่ได้รับอีเมล ติดต่อได้ที่" : "If you didn't receive an email, contact us at"}
        <a href="mailto:ict@mahidol.ac.th" className="text-[#008A90] hover:underline ml-1"> ict@mahidol.ac.th</a>
      </p>
      <p>
        <span>{language === "TH" ? "หรือ " : "or "}</span>
        <span className="text-[#008A90]">+66 02-4410909 </span>
        <span>{language === "TH" ? "หรือ " : "or "}</span>
        <span>{language === "TH" ? "Line official account: " : "Line official account: "}</span>
        <a href="https://line.me/R/ti/p/@ictmahidol" className="text-[#008A90] hover:underline">@ictmahidol</a>
      </p>
    </div>
  );

  return (
    <div className="flex min-h-screen relative">
      {renderLanguageButtons()}
      {renderLogo()}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-lg w-full max-w-md">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg width="138" height="170" viewBox="0 0 138 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M124.2 74.4062H13.8C6.21 74.4062 0 80.7792 0 88.5683V155.838C0 163.627 6.21 170 13.8 170H124.2C131.79 170 138 163.627 138 155.838V88.5683C138 80.7792 131.79 74.4062 124.2 74.4062ZM86.25 150.527C81.075 154.068 75.21 155.838 69 155.838C66.93 155.838 64.86 155.484 62.79 155.13C54.51 153.36 47.61 148.757 43.125 141.676L54.51 133.887C56.925 137.781 61.065 140.614 65.55 141.322C70.035 142.384 74.52 141.322 78.66 138.489C86.595 133.179 88.665 121.849 83.49 114.06C81.075 110.165 76.935 107.333 72.45 106.625C67.965 105.563 63.48 106.625 59.34 109.457C58.305 110.165 57.615 110.873 56.925 111.582L69 123.973H37.95V92.1088L46.92 101.314C48.3 99.8979 50.025 98.4817 51.405 97.4196C58.305 92.8169 66.585 91.0466 74.865 92.4628C83.145 94.2331 90.045 98.8358 94.53 105.917C104.19 120.787 100.395 140.614 86.25 150.527Z" fill="#008A91" />
                <path d="M17.2498 60.2442H31.0498C33.1198 60.2442 34.4998 59.1821 34.4998 57.0578V56.7037C34.4998 36.5228 51.4048 19.8824 71.4148 21.2986C89.6998 22.7148 103.5 39.0012 103.5 58.1199V57.0578C103.5 59.1821 104.88 60.2442 106.95 60.2442H120.75C122.82 60.2442 124.2 59.1821 124.2 57.0578V56.7037C124.2 24.4851 97.9798 -1.36066 66.2398 0.0555484C36.9148 1.47175 14.4898 26.9634 13.7998 57.0578C14.1448 58.828 15.5248 60.2442 17.2498 60.2442Z" fill="#008A91" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#1D2939] font-bold mb-2">
              {language === "TH" ? "ลืมรหัสผ่าน" : "Forgot Password"}
            </h2>
            <p className="text-gray-600 mb-6">
              {language === "TH"
                ? "รีเซ็ตรหัสผ่านด้วยอีเมลที่ใช้งาน"
                : "Reset your password using your registered email"}
            </p>
            {renderForm()}
            <div className="text-center mb-6">
              <hr className="border-gray-300 mb-4 w-[200px] mx-auto" />
              <Link href="/login" className="text-[#008A90] text-sm font-medium flex items-center justify-center gap-2 hover:underline">
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.439341 10.9393C-0.146446 11.5251 -0.146446 12.4749 0.439341 13.0607L9.98528 22.6066C10.5711 23.1924 11.5208 23.1924 12.1066 22.6066C12.6924 22.0208 12.6924 21.0711 12.1066 20.4853L3.62132 12L12.1066 3.51472C12.6924 2.92893 12.6924 1.97919 12.1066 1.3934C11.5208 0.807611 10.5711 0.807611 9.98528 1.3934L0.439341 10.9393ZM24.5 10.5L1.5 10.5V13.5L24.5 13.5V10.5Z" fill="#008A91" />
                </svg>
                {language === "TH" ? "กลับไปหน้าเข้าสู่ระบบ" : "Back to Login Page"}
              </Link>
            </div>
            <hr className="border-gray-300 w-full mx-auto mb-4" />
            {renderFooter()}
          </div>
        </div>
      </div>
    </div>
  );
}
