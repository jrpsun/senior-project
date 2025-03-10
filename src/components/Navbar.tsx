"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ใช้ตรวจสอบหน้าเว็บปัจจุบัน
import { useLanguage } from "../hooks/LanguageContext";

// ฟังก์ชันสำหรับคืนค่า SVG ไอคอนของแต่ละเมนู
const getMenuIcon = (label: string) => {
  switch (label) {
    case "แก้ไขข้อมูล":
    case "Edit Information":
      return <Image src="/images/Navbar/EditInfo.svg" alt="EditInfo Icon" width={25} height={25} />;
    case "ติดตามสถานะการสมัคร":
    case "Applicant Status":
      return <Image src="/images/Navbar/FollowStatus.svg" alt="FollowStatus Icon" width={25} height={25} />;
    case "ชำระค่าสมัคร":
    case "Payment":
      return <Image src="/images/Navbar/Payment.svg" alt="Payment Icon" width={25} height={25} />;
    case "เปลี่ยนรหัสผ่าน":
    case "Change Password":
      return <Image src="/images/Navbar/ChangePassword.svg" alt="ChangePassword Icon" width={25} height={25} />;
    case "ออกจากระบบ":
    case "Logout":
      return <Image src="/images/Navbar/Logout.svg" alt="Logout Icon" width={25} height={25} />;
    default:
      return null;
  }
};
// รายการเมนู Dropdown
const menuItems = {
  TH: [
    { href: "/edit-profile", label: "แก้ไขข้อมูล" },
    { href: "/follow-status", label: "ติดตามสถานะการสมัคร" },
    { href: "/payment", label: "ชำระค่าสมัคร" },
    { href: "/change-password", label: "เปลี่ยนรหัสผ่าน" },
    { href: "/logout", label: "ออกจากระบบ" },
  ],
  EN: [
    { href: "/edit-profile", label: "Edit Information" },
    { href: "/follow-status", label: "Applicant Status" },
    { href: "/payment", label: "Payment" },
    { href: "/change-password", label: "Change Password" },
    { href: "/logout", label: "Logout" },
  ],
};

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isPrivacyPolicyPage = pathname === "/privacy-policy";
  const { language, setLanguage } = useLanguage() as { language: "TH" | "EN"; setLanguage: (lang: "TH" | "EN") => void };
  const userName = language === "TH" ? "จิรภัทร สุวรรณลมัย" : "Jirapat Suwanlamai";

  return (
    <div className="bg-white text-black">
      <div className="flex justify-between items-center p-5">
        {/* โลโก้ */}
        <Image
          src={language === "EN" ? "/logo_ict_en.png" : "/logo_ict_th.png"}
          alt="Mahidol ICT Logo"
          width={200}
          height={30}
        />
        {/* แสดงเมนู Profile & Dropdown เฉพาะเมื่อไม่ใช่หน้า Privacy Policy */}
        {!isPrivacyPolicyPage && (
          <div className="flex items-center relative ml-auto">
            {/* โปรไฟล์ผู้ใช้ */}
            <div className="flex items-center gap-4">
              <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.7627 0C7.47836 0 0.762695 6.71567 0.762695 15C0.762695 23.2843 7.47836 30 15.7627 30C24.047 30 30.7627 23.2843 30.7627 15C30.7627 6.71567 24.047 0 15.7627 0ZM15.7627 7.33567C18.729 7.33567 21.1427 9.74933 21.1427 12.7157C21.1427 15.6823 18.729 18.0957 15.7627 18.0957C12.796 18.0957 10.3827 15.6823 10.3827 12.7157C10.3827 9.74933 12.796 7.33567 15.7627 7.33567ZM15.7627 27.9477C12.051 27.9477 8.7217 26.3193 6.4437 23.74C7.5027 21.8233 9.15836 20.248 11.127 19.293C11.7967 18.9683 12.5784 18.9737 13.272 19.3067C14.053 19.682 14.891 19.872 15.763 19.872C16.6347 19.872 17.473 19.6817 18.254 19.3067C18.9484 18.9733 19.73 18.9683 20.399 19.293C22.3677 20.2477 24.023 21.8233 25.082 23.74C22.8037 26.319 19.4744 27.9477 15.7627 27.9477Z" fill="black" />
              </svg>
              <span className="font-medium">{userName}</span>
            </div>

            {/* Dropdown เมนู */}
            <div className="relative">
              <button onClick={() => setDropdownOpen(true)} className="flex items-center px-3 py-2 bg-white">
                <Image src="/images/dropdown_button.svg" alt="Dropdown Button" width={15} height={10} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-[5px] shadow-lg p-2" onMouseLeave={() => setDropdownOpen(false)}>
                  {menuItems[language].map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="grid grid-cols-[30px_auto] items-center gap-[1px] px-2 py-2 font-light hover:bg-gray-100 rounded"
                    >
                      {getMenuIcon(item.label)}
                      <span className="whitespace-nowrap font-light">{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dropdown เปลี่ยนภาษา */}
        <div className="relative flex items-center gap-2">
          <Image src="/globe.svg" alt="Language Icon" width={25} height={25} />

          <div className="relative">
            <button onClick={() => setLangDropdownOpen(true)} className="flex items-center px-1 py-2 bg-white">
              <span className="mr-2">{language}</span> {/* เปลี่ยนค่าเป็นภาษา */}
              <Image src="/images/dropdown_button.svg" alt="Dropdown Button" width={15} height={10} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-white border rounded-[5px] shadow-lg p-2 z-50" onMouseLeave={() => setLangDropdownOpen(false)}>
                {["TH", "EN"].map((lang) => (
                  <button key={lang} className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      setLanguage(lang as "TH" | "EN"); // เปลี่ยนภาษา
                      setLangDropdownOpen(false);
                    }}>
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/*เส้นขอบด้านล่าง */}
      <div className="bg-[#D1D5DB] h-[1px]"></div>
    </div>
  );
};

export default Navbar;