"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [citizenId, setCitizenId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("TH");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!citizenId || !password) {
      setError("กรุณากรอกหมายเลขบัตรประชาชนและรหัสผ่าน");
      return;
    }

    if (citizenId === "1234567890123" && password === "test1234") {
      setError(null);
      router.push("/dashboard");
    } else {
      setError("เลขบัตรประชาชนหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* 🔹 ปุ่มเปลี่ยนภาษา */}
      <div className="absolute top-4 right-4">
        <button
          className={`px-3 py-1 text-sm font-medium ${language === "TH" ? "text-[#008A90] font-bold" : "text-gray-500"
            }`}
          onClick={() => setLanguage("TH")}
        >
          TH
        </button>
        <span className="text-gray-400"> | </span>
        <button
          className={`px-3 py-1 text-sm font-medium ${language === "EN" ? "text-[#008A90] font-bold" : "text-gray-500"
            }`}
          onClick={() => setLanguage("EN")}
        >
          EN
        </button>
      </div>

      {/* Background Image with Logo */}
      <div className="hidden md:block w-1/2 relative">
        {/* โลโก้มหาวิทยาลัยที่มุมบนซ้าย */}
        <img
          src="logo_ict.png"
          alt="มหาวิทยาลัยมหิดล โลโก้"
          width="180"
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
            เข้าสู่ระบบ
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* หมายเลขบัตรประชาชน */}
            <div>
              <label className="block text-gray-700">
                เลขบัตรประชาชน / Passport
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={citizenId}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 13); // รับเฉพาะตัวเลขและจำกัด 13 หลัก
                  setCitizenId(value);
                }}
                maxLength={13}
                className="w-full p-2 border border-gray-300 rounded-[10px] mt-1 text-gray-900 placeholder-[#C4C4C4]"
                placeholder="ระบุเลขบัตรประชาชน / Passport"
              />

            </div>

            {/* รหัสผ่าน */}
            <div>
              <label className="block text-gray-700">รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[ก-๙]/g, ""); // ลบตัวอักษรภาษาไทยออก
                    setPassword(value);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-[10px] mt-1 pr-10 text-gray-900 placeholder-[#C4C4C4]"
                  placeholder="ระบุรหัสผ่าน"
                />

                {/* ปุ่มแสดง/ซ่อนรหัสผ่าน */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={
                      showPassword
                        ? "/images/Unhide_Password.svg"
                        : "/images/Hide_Password.svg"
                    }
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
                จำรหัสผ่าน
              </label>
              <a href="/forgot-password" className="text-[#008A90]">
                ลืมรหัสผ่าน
              </a>
            </div>

            <button
              type="submit"
              className="w-[250px] bg-[#008A90] text-white py-3 px-6 rounded text-sm font-medium hover:bg-[#00757a] transition mx-auto block"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          {/* ปุ่มลงทะเบียน */}
          <div className="flex justify-center items-center text-sm text-gray-600 mt-6">
            <span className="font-bold">ยังไม่ได้ลงทะเบียน?</span>
            <a href="/register" className="text-[#008A90] ml-1 font-bold">
              ลงทะเบียน
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
