"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useLanguage } from "../../hooks/LanguageContext";
import programTexts from "../../translation/programs";
import courseDataRaw from "../../data/courseData";

export default function CourseList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [program, setProgram] = useState("DST"); // ค่า default เป็น DST
  const { language } = useLanguage();
  const [courseData, setCourseData] = useState([]);
  const [filter, setFilter] = useState("all");

  const texts = programTexts[language] ?? programTexts["TH"];

  useEffect(() => {
    console.log("Current Language in CourseList:", language);

    if (!courseDataRaw || !texts) return;

    const updatedCourses = courseDataRaw.map((course) => ({
      ...course,
      name: course.name?.[language] ?? course.name, // ป้องกัน undefined
      status: course.status?.[language] ?? "", // ป้องกัน undefined
      timeLeft: course.timeLeft?.[language] ?? "",
      period: course.period?.[language] ?? "",
      round: course.round?.[language] ?? "",
    }));

    console.log("Updated CourseData:", updatedCourses);
    setCourseData(updatedCourses);
  }, [language]);

  // ตรวจสอบ texts และ texts.filterOptions
  if (!texts || !texts.filterOptions) {
    return <div>Loading...</div>;
  }

  // ตรวจสอบว่ามีค่าใน texts.filterOptions ก่อนกรอง
  const filteredCourses = courseData.filter((course) => {
    if (!course.status) return false; // ถ้าไม่มี status ให้ข้าม
    if (filter === "all") return true;
    return course.status.includes(texts.filterOptions[filter]);
  });
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col p-0 gap-10 pt-10">
          {/* หัวข้อ */}
          <h2 className="font-bold text-2xl sm:text-3xl text-[#111827] leading-7 text-center">
            {texts?.title ?? "โครงการรับสมัคร"}
          </h2>

          {/* แถบขั้นตอนการสมัคร */}
          <div className="flex flex-col md:flex-row items-center justify-start w-full max-w-[800px] gap-4 md:gap-2 ml-6 mx-auto">
            {texts?.steps?.map((label, index) => (
              <div key={index} className="flex items-center gap-2 flex-none">
                {/* หมายเลขขั้นตอน */}
                <div
                  className={`w-[32px] h-[32px] rounded-full flex items-center justify-center 
        ${index === 0 ? "bg-[#008A91] text-white" : "bg-[#D1D5DB] text-white"}`}
                >
                  {index + 1}
                </div>

                {/* ข้อความของแต่ละขั้นตอน */}
                <span
                  className={`font-normal text-lg md:text-xl 
        ${index === 0 ? "text-[#008A91]" : "text-[#6B7280]"}`}
                >
                  {label ?? `ขั้นตอนที่ ${index + 1}`}
                </span>

                {/* เส้นคั่นระหว่างแต่ละขั้นตอน */}
                {index < texts.steps.length - 1 && (
                  <div className="hidden md:block bg-[#D1D5DB] h-[2px] flex-grow md:w-[250px]"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Dropdown ตัวกรองหลักสูตร */}
        <div className="flex w-full mt-[20px] mb-[20px]">
          <div className="ml-auto relative border-[#E5E7EB] rounded-[10px] p-[2px] text-[#565656] border-2">
            <select
              name="filter"
              id="filter"
              value={filter} // ใช้ key ของ filter
              onChange={(e) => setFilter(e.target.value)} // setFilter ตรงๆ เป็น key
              className="text-left px-2 py-[3px] bg-white border-none focus:outline-none appearance-none w-[165px]"
            >
              {Object.entries(texts.filterOptions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value} {/* แสดงข้อความที่แปลแล้ว */}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-[#565656]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>


        {/* รายการหลักสูตร */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 xl:gap-8 w-full max-w-[1200px] mx-auto px-4 lg:px-6 xl:px-8 mt-5">
          {filteredCourses.map((course, index) => (
            <div
              key={index}
              className={`flex flex-col p-[22px_26px] gap-4 rounded-lg min-h-[240px] h-full ${course.shadow}`}
            >
              {/* หัวข้อหลักสูตร */}
              <div className="flex justify-between w-full">
                <div className="font-bold text-[20px] text-[#565656]">{course.name}</div>

                {/* ปรับขนาดกล่อง timeLeft ให้กว้างขึ้น และให้ข้อความอยู่ตรงกลาง */}
                <div className={`ml-auto rounded-[15px] p-1 min-w-[110px] px-4 text-[14px] flex items-center justify-center ${course.statusColor}`}>
                  {course.timeLeft}
                </div>
              </div>

              {/* รายละเอียดหลักสูตร */}
              <div className="text-[16px] text-[#4B5563]">{course.round}</div>

              {/* ปฏิทิน & ช่วงเวลาสมัคร */}
              <div className="flex items-center gap-1">
                <img src="/images/applicant-info/calendar.svg" alt="Calendar Icon" width={13} height={14} />
                <span className="text-[14px] text-[#6B7280]">{course.period}</span>
              </div>

              {/* ปุ่มสมัครเรียน และดูรายละเอียด */}
              <div className="flex justify-between w-full mt-auto">

                {/* ปุ่มสมัครเรียน */}
                <button
                    onClick={() => router.push(`/CourseList?program=${program}`)}
                    disabled={["Closed for Application", "ปิดรับสมัคร"].includes(course.status)}
                    className={`flex items-center px-6 py-2 gap-2 rounded-lg ${
                      ["Closed", "ปิด"].includes(course.status) ? "bg-[#D1D5DB] text-[#6B7280] cursor-not-allowed" : "bg-[#008A91] text-white"
                    }`}
                  >
                    <img src="/images/applicant-info/apply_icon.svg" alt="Apply Icon" width={20} height={16} />
                    {texts.apply}
                  </button>


                {/* ปุ่มดูรายละเอียด */}
                <button className="flex items-center gap-2">
                  <img src="/images/applicant-info/more_info_icon.svg" alt="More Info Icon" width={20} height={16} />
                  <span className="text-[16px] text-[#565656]">{texts.details}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
