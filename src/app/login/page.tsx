"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@components/hooks/LanguageContext";
import { loginTexts } from "../../translation/login";
import Image from "next/image";

export default function LoginPage() {
  const [citizenId, setCitizenId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!citizenId || !password) {
      setError(loginTexts[language].errorMessage);
      return;
    }

    if (citizenId === "1234567890123" && password === "test1234") {
      setError(null);
      router.push("/dashboard");
    } else {
      setError(loginTexts[language].invalidCredentials);
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* ปุ่มเปลี่ยนภาษา */}
      <div className="absolute top-4 right-4">
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

      {/* Background Image with Logo */}
      <div className="hidden md:block w-1/2 relative">
        {/* โลโก้มหาวิทยาลัยที่มุมบนซ้าย */}
        <Image
          src={language === "ENG" ? "/logo_ict_en.png" : "/logo_ict_th.png"}
          alt="มหาวิทยาลัยมหิดล โลโก้"
          width="200"
          height="60"
          className="absolute top-6 left-6 z-50"
        />

        {/* ภาพพื้นหลัง */}
        <div
          className="absolute inset-0 bg-cover bg-center brightness-100"
          style={{ backgroundImage: "url('/images/background.png')" }}
        />
      </div>


      {/* Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white mt-[-20px]">
        <div className="bg-white p-8 rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900">
            {loginTexts[language].loginTitle}
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* หมายเลขบัตรประชาชน */}
            <div>
              <label className="block text-gray-700">{loginTexts[language].citizenId}</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={citizenId}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 13);
                  setCitizenId(value);
                }}
                maxLength={13}
                className="w-full p-2 border border-gray-300 rounded-[10px] mt-1 text-gray-900 placeholder-[#C4C4C4]"
                placeholder={loginTexts[language].enterCitizenId}
              />
            </div>

            {/* รหัสผ่าน */}
            <div>
              <label className="block text-gray-700">{loginTexts[language].password}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[ก-๙]/g, "");
                    setPassword(value);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-[10px] mt-1 pr-10 text-gray-900 placeholder-[#C4C4C4]"
                  placeholder={loginTexts[language].enterPassword}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Image
                    src={showPassword ? "/images/Hide_Password.svg" : "/images/Unhide_Password.svg"}
                    alt="แสดง/ซ่อนรหัสผ่าน"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </div>

            {/* จำรหัสผ่าน & ลืมรหัสผ่าน */}
            <div className="flex justify-between items-center text-sm mt-6 pb-6">
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2 accent-[#008A90]"
                />
                {loginTexts[language].rememberMe}
              </label>
              <a href="/forgot-password" className="text-[#008A90]">
                {loginTexts[language].forgotPassword}
              </a>
            </div>

            <button type="submit" className="w-[250px] bg-[#008A90] text-white py-3 px-6 rounded text-sm font-medium hover:bg-[#00757a] transition mx-auto block">
              {loginTexts[language].loginButton}
            </button>
          </form>

          {/* ปุ่มลงทะเบียน */}
          <div className="flex justify-center items-center text-sm text-gray-600 mt-6">
            <span className="font-bold">{loginTexts[language].notRegistered}</span>
            <a href="/register" className="text-[#008A90] ml-1 font-bold">
              {loginTexts[language].register}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
