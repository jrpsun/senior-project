"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import forgotPasswordTexts from "../../translation/forgotPassword"; 

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [language, setLanguage] = useState<"TH" | "ENG">("TH");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const texts = forgotPasswordTexts[language];

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(texts.errorMessage);
      setSuccessMessage(null);
      return;
    }

    setSuccessMessage(texts.successMessage);
    setError(null);
    setIsEmailSubmitted(true);
    setIsAlertVisible(true);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Language Switcher */}
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
          className={`px-3 py-1 text-sm font-medium ${language === "ENG" ? "text-[#008A90] font-bold" : "text-gray-500"}`}
          onClick={() => setLanguage("ENG")}
        >
          EN
        </button>
      </div>

      {/* Left Section - Background & Logo */}
      <div className="hidden md:block w-1/2 relative">
        <Image src="/logo_ict.png" alt="มหาวิทยาลัยมหิดล โลโก้" width={180} height={60} className="absolute top-6 left-6 z-50" />
        <div className="absolute inset-0 bg-cover bg-center brightness-100" style={{ backgroundImage: "url('/images/background.png')" }} />
      </div>

      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-lg w-full max-w-md">
          <div className="text-center">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <Image src="/images/forgot-password.svg" alt="Forgot Password Icon" width={138} height={170} />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-2xl text-[#1D2939] font-bold mb-2">{texts.title}</h2>
            <p className="text-gray-600 mb-6">{texts.subtitle}</p>

            {/* Form */}
            <form onSubmit={handleResetPassword} className="mb-6" noValidate>
              {isEmailSubmitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{successMessage}</span>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-left">
                    <label className="block text-gray-700 font-medium mb-2">
                      {texts.emailLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className={`w-full p-2 border rounded-[10px] mt-1 text-gray-900 placeholder-[#C4C4C4] h-[44px] focus:outline-none bg-white ${error ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder={texts.emailPlaceholder}
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
                  <button type="submit" className="w-[220px] bg-[#008A90] text-white font-medium py-3 rounded-lg hover:bg-[#007a80]">
                    {texts.resetButton}
                  </button>
                </>
              )}
            </form>

            {/* Back to Login */}
            <div className="text-center mb-6">
              <hr className="border-gray-300 mb-4 w-[200px] mx-auto" />
              <Link href="/login" className="text-[#008A90] text-sm font-medium flex items-center justify-center gap-2 hover:underline">
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.439341 10.9393C-0.146446 11.5251 -0.146446 12.4749 0.439341 13.0607L9.98528 22.6066C10.5711 23.1924 11.5208 23.1924 12.1066 22.6066C12.6924 22.0208 12.6924 21.0711 12.1066 20.4853L3.62132 12L12.1066 3.51472C12.6924 2.92893 12.6924 1.97919 12.1066 1.3934C11.5208 0.807611 10.5711 0.807611 9.98528 1.3934L0.439341 10.9393ZM24.5 10.5L1.5 10.5V13.5L24.5 13.5V10.5Z" fill="#008A91" />
                </svg>
                {texts.backToLogin}
              </Link>
            </div>

            {/* Contact Info */}
            <hr className="border-gray-300 w-full mx-auto mb-4" />
            <div className="text-center text-gray-600 text-sm">
              <p>
                {texts.contactMessage} <a href={`mailto:${texts.contactEmail}`} className="text-[#008A90] hover:underline ml-1">{texts.contactEmail}</a>
              </p>
              <p className="mt-2">
                <span className="text-[#565656]">{texts.contactPhone.split("+")[0]}</span>
                <span className="text-[#008A90]">+{texts.contactPhone.split("+")[1]}</span>
                <span className="text-[#565656]">{texts.lineAccount.split("Line official account:")[0]}</span>
                <span className="text-[#008A90]">Line official account: </span>
                <a href="https://line.me/R/ti/p/@ictmahidol" className="text-[#008A90] hover:underline">
                  {texts.lineLink}
                </a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
