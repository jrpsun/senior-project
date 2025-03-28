"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@components/hooks/LanguageContext";
import Image from "next/image";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { language, setLanguage } = useLanguage();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
            return;
        }

        if (username === "admin" && password === "admin1234") {
            setError(null);
            router.push("/admin/dashboard");
        } else {
            setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
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
                    disabled
                    className="px-3 py-1 text-sm font-medium text-gray-400 cursor-not-allowed"
                >
                    EN
                </button>
            </div>
            {/* Background Image */}
            <div className="hidden md:block w-1/2 relative">
                {/* โลโก้มหาวิทยาลัยที่มุมบนซ้าย */}
                
                <Image
                    src="/logo_ict_th.png"
                    alt="มหาวิทยาลัยมหิดล โลโก้"
                    width={200}
                    height={60}
                    className="absolute top-6 left-6 z-50"
                />

                {/* ภาพพื้นหลัง */}
                <div
                    className="absolute inset-0 bg-cover bg-center brightness-100"
                    style={{ backgroundImage: "url('/images/background.png')" }}
                />
            </div>

            {/* Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white mt-[-120px]">
                <div className="bg-white p-10 rounded-lg w-full max-w-md shadow-lg">

                    {/* โลโก้แอดมินหรือไอคอน */}
                    <div className="flex justify-center mb-4">
                        <Image src="/images/admin/admission_logo.png" alt="Admin Logo" width={180} height={200} />
                    </div>

                    <h2 className="text-2xl font-semibold text-center text-gray-900">
                        เข้าสู่ระบบผู้ดูแลระบบ
                    </h2>

                    {/* คำอธิบายใต้หัวข้อ */}
                    <p className="text-center text-gray-500 text-sm mt-2">
                        เข้าสู่ระบบเพื่อจัดการข้อมูลของผู้สมัคร
                    </p>

                    {/* เส้นแบ่ง */}
                    <hr className="my-6 border-gray-300 w-3/4 mx-auto" />



                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <form onSubmit={handleLogin}>
                        {/* ชื่อผู้ใช้ */}
                        <div className="mt-4">
                            <label className="block text-gray-700">ชื่อผู้ใช้</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-[10px] mt-1 text-gray-900 placeholder-gray-400"
                                placeholder="กรอกชื่อผู้ใช้"
                            />
                        </div>

                        {/* รหัสผ่าน */}
                        <div className="mt-4">
                            <label className="block text-gray-700">รหัสผ่าน</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-[10px] mt-1 pr-10 text-gray-900 placeholder-gray-400"
                                    placeholder="กรอกรหัสผ่าน"
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

                        {/* ปุ่มเข้าสู่ระบบ */}
                        <div className="mt-8 flex justify-center">
                            <button type="submit" className="w-[250px] bg-[#008A90] text-white py-3 px-6 rounded-[10px]  font-medium hover:bg-[#00757a] transition">
                                เข้าสู่ระบบ
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}
