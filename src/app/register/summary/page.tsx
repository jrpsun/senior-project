"use client"; // ✅ ต้องระบุ use client ที่ไฟล์นี้

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SummaryPage() {
  const searchParams = useSearchParams();

  // ✅ ดึงค่าจาก URL
  const formData = {
    nationality: searchParams.get("nationality"),
    idType: searchParams.get("idType"),
    idNumber: searchParams.get("idNumber"),
    title: searchParams.get("title"),
    firstNameThai: searchParams.get("firstNameThai"),
    lastNameThai: searchParams.get("lastNameThai"),
    firstNameEnglish: searchParams.get("firstNameEnglish"),
    lastNameEnglish: searchParams.get("lastNameEnglish"),
    email: searchParams.get("email"),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center">ข้อมูลที่คุณกรอก</h2>
        <div className="mt-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b py-2 text-gray-700">
              <span className="font-semibold">{key}</span>
              <span>{value || "-"}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/register">
            <button className="bg-[#008A90] text-white px-6 py-2 rounded-lg hover:bg-[#00757a]">
              กลับไปแก้ไข
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
