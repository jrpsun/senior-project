"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TokenAdminPayload } from "@components/types/token";
import { jwtDecode } from "jwt-decode";

// กำหนดชื่อของหน้าเพื่อนำไปแสดงใน Navbar
const pageTitles = {
    "/admin/users/permission": "การจัดการสิทธิ์ผู้ใช้งาน",
    "/admin/admissions/rounds": "กำหนดรอบรับสมัคร",
    "/admin/dashboard": "แดชบอร์ดผู้ดูแลระบบ",
    "/admin/users": "การจัดการผู้ใช้",
    "/admin/reports": "รายงานระบบ",
    "/admin/settings": "ตั้งค่าระบบ",
    "/admin/applicant": "รายการใบสมัคร",
    "/admin/screening/group": "จัดกลุ่มผู้สมัครสำหรับการคัดกรองเบื้องต้น",
    "/admin/screening/tracking": "ติดตามความคืบหน้าการคัดกรองเบื้องต้น",
    "/admin/screening/candidates": "รายการผู้สมัครสำหรับพิจารณาคัดกรองเบื้องต้น",
    "/admin/screening/summary": "สรุปผลการคัดกรองเบื้องต้น",
    "/admin/interview/schedule": "กำหนดรายละเอียดการสัมภาษณ์",
    "/admin/interview/grouping": "จัดกลุ่มผู้สมัครสัมภาษณ์",
    "/admin/interview/candidates": "รายชื่อผู้สมัครสัมภาษณ์",
    "/admin/interview/tracking": "ติดตามผลการสัมภาษณ์",
    "/admin/interview/summary": "สรุปผลการสัมภาษณ์",
};

// รายการเมนูใน Dropdown ของ Admin
const adminMenuItems = [
    { href: "/admin/change-password", label: "เปลี่ยนรหัสผ่าน", icon: "/images/Navbar/ChangePassword.svg" },
    { href: "/logout", label: "ออกจากระบบ", icon: "/images/Navbar/Logout.svg" },
];

interface AdminNavbarProps {
    isCollapsed: boolean;
    backToPage?: { href: string; label: string };
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ isCollapsed, backToPage }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const pathname = usePathname();
    const isKnownPage = pathname in pageTitles;
    const [name, setName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("access_token")
        if (token) {
            const decoded: TokenAdminPayload = jwtDecode(token!)
            setName(decoded?.sub)
        }
    })


    return (
        <div className="bg-white text-black fixed top-0 z-40 h-[80px] flex items-center transition-all shadow-md"
            style={{ width: `calc(100% - ${isCollapsed ? "80px" : "300px"})`, left: isCollapsed ? "80px" : "300px" }}>

            {/* Title ชิด Sidebar */}
            {!isKnownPage ? (
                <Link href={backToPage?.href || "/camp"}>
                    <span className="text-[16px] hover:underline cursor-pointer text-[#565656] pl-6 flex items-center gap-2">
                        <Image src="/images/admin/adminNavbar/back_icon.svg" alt="Back" width={10} height={10} />
                        กลับสู่หน้ารายการ
                    </span>
                </Link>
            ) : (
                <h1 className="text-xl md:text-[22px] font-bold text-[#565656] pl-6">
                    {isKnownPage ? pageTitles[pathname as keyof typeof pageTitles] : ""}
                </h1>
            )}

            {/* Username & เปลี่ยนภาษา (อยู่ชิดขวาสุด) */}
            <div className="flex items-center gap-6 ml-auto pr-6">
                {/* Admin Profile */}
                <div
                    className="relative flex items-center gap-2 cursor-pointer"
                    onMouseEnter={() => {
                        clearTimeout(window.dropdownTimeout);
                        window.dropdownTimeout = setTimeout(() => setDropdownOpen(true), 200);
                    }}
                    onMouseLeave={() => {
                        clearTimeout(window.dropdownTimeout);
                        window.dropdownTimeout = setTimeout(() => setDropdownOpen(false), 300);
                    }}
                >
                    <Image src="/images/admin/adminNavbar/AdminProfile.svg" alt="Admin" width={30} height={30} />
                    <span className="text-[#008A90] ">
                        {name}
                    </span>

                    <Image src="/images/dropdown_button.svg" alt="Dropdown" width={15} height={10} />
                    {dropdownOpen && (
                        <div className="absolute right-0 top-full w-56 bg-white border rounded-md shadow-lg p-2">
                            {adminMenuItems.map((item, index) => (
                                <Link key={index} href={item.href} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded">
                                    <Image src={item.icon} alt={item.label} width={20} height={20} />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* เปลี่ยนภาษา (Dropdown แสดงเมื่อ hover) */}
                <div
                    className="relative flex items-center gap-2 cursor-pointer"
                    onMouseEnter={() => {
                        clearTimeout(window.langDropdownTimeout);
                        window.langDropdownTimeout = setTimeout(() => setLangDropdownOpen(true), 200);
                    }}
                    onMouseLeave={() => {
                        clearTimeout(window.langDropdownTimeout);
                        window.langDropdownTimeout = setTimeout(() => setLangDropdownOpen(false), 300);
                    }}
                >
                    <Image src="/globe.svg" alt="Language" width={20} height={20} />
                    <span className="text-gray-800">TH</span>
                    <Image src="/images/dropdown_button.svg" alt="Dropdown" width={12} height={8} />

                    {/* Dropdown ภาษา (แสดงเมื่อ hover) */}
                    {langDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-20 bg-white border rounded-md shadow-lg p-2">
                            <button
                                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                            >
                                TH
                            </button>
                            <span
                                className="block w-full px-4 py-2 text-left text-gray-500 cursor-not-allowed"
                            >
                                EN
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNavbar;
