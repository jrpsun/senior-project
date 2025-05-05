"use client";

import Modal from "@components/components/common/popup-login";
import LoadingSpinner from "@components/components/LoadingSpinner";
import { authFetch } from "@components/lib/auth";
import { TokenApplicantPayload } from "@components/types/token";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Home() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [appId, setAppId] = useState("");
  const [admision, setAdmission] = useState<string[]>([""]);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState([{
    admissionId: "",
    program: "",
    roundName: "",
    academicYear: "",
    startDate: "",
    endDate: "",
  }])

  const calculateStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // ตรวจสอบความถูกต้องของวันที่
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        status: "ไม่สามารถคำนวณสถานะ",
        disabled: true,
        dateRange: "รูปแบบวันที่ไม่ถูกต้อง",
      };
    }
  
    const timeDiff = end.getTime() - now.getTime();
    const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
  
    let status = "";
    let disabled = false;
    let text = "";
  
    if (now < start) {
      status = "กำลังจะเปิดรับสมัคร";
      text = "กำลังจะเปิดรับสมัคร"
      disabled = true;
    } else if (now >= start && now <= end) {
      status = "เปิดรับสมัคร";
      text = `เหลืออีก ${hoursLeft} ชม.`;
      disabled = false;
    } else {
      status = "ปิดรับสมัคร";
      text = "ปิดรับสมัคร"
      disabled = true;
    }
  
    return {
      status,
      text,
      disabled,
      dateRange: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
    };
  };

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

  useEffect(() => {
    setLoading(true);
    fetchAdmission();
    if (appId) {
        fetchApplicantAdmission();
    }
    setLoading(false);
  },[appId])

  const fetchAdmission = async() => {
      const response = await authFetch(`${process.env.API_BASE_URL}/admission`, {
        method: 'GET',
      });

      const data = await response.json();
      console.log("data", data)
      setFormData(data)
  }

  const fetchApplicantAdmission = async() => {
    const response = await authFetch(`${process.env.API_BASE_URL}/applicant/get-admission-id/${appId}`, {
        method: 'GET',
    })
    const id = await response.json();
    setAdmission(id)
  }

  const filteredFormData = formData.filter((data) => {
    const courseStatus = calculateStatus(data.startDate, data.endDate);
    if (!filterStatus) return true;
    return courseStatus.status === filterStatus;
  });

  const handleApplyClick = async (disabled: boolean, admisionId: string, program: string) => {
    if (!disabled) {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/updated-admission-id/${appId}/${admisionId}`, {
            method: 'POST',
        })
        router.push(`/CourseList?program=${program}&id=${admisionId}`);
    }
  };

  const handleApplicant = async(admisionId: string, program: string) => {
    router.push(`/apply/ApplicationInfo?program=${program}&id=${admisionId}`);
  }

  return (
    <div>
    {showModal && <Modal role="applicant"/>}
    <div className='mr-[200px] ml-[200px]'>
        <div className='flex flex-col p-0 gap-16 pt-10'>
            <div className='font-bold text-[36px] leading-7 text-center'>โครงการรับสมัคร</div>
            {/* <div className='flex flex-row items-center justify-between w-full gap-2'>
                <div className='flex items-center gap-2 flex-none'>
                    <div className='w-[32px] h-[32px] bg-[#008A91] rounded-full text-white flex items-center justify-center'>
                        1
                    </div>
                    <div className='font-normal text-xl leading-4 text-[#008A91]'>เลือกหลักสูตร</div>
                </div>
                <div className='bg-[#D1D5DB] w-[275px] p-[1px] flex-grow'></div>
                <div className='flex flex-row items-center gap-2 flex-none'>
                    <div className='w-[32px] h-[32px] bg-[#D1D5DB] rounded-full text-[#4B5563] flex items-center justify-center'>
                        2
                    </div>
                    <div className='font-normal text-xl leading-4 text-[#6B7280]'>กรอกข้อมูลส่วนตัว</div>
                </div>
            </div> */}
        </div>
        <div className='flex w-full mt-[20px]'>
            <div className='ml-auto border-[#E5E7EB] rounded-xl p-1 text-[#565656] border-2'>
                <select
                    className="text-center"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    >
                    <option value="">แสดงทั้งหมด</option>
                    <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
                    <option value="กำลังจะเปิดรับสมัคร">กำลังจะเปิดรับสมัคร</option>
                    <option value="ปิดรับสมัคร">ปิดรับสมัคร</option>
                </select>
            </div>
        </div>
        
        {loading ? (
        <LoadingSpinner />
        ) : (
        <div className="flex flex-wrap justify-center gap-10 mt-2">
        {filteredFormData.map((data, index) => {
            const courseStatus = calculateStatus(data.startDate, data.endDate);

          return (
            <div
              key={index}
              className={`flex flex-col p-6 gap-4 ${
                courseStatus.disabled
                  ? "bg-[#F9FAFB] opacity-75 border border-[#E5E7EB] rounded-2xl"
                  : "bg-white shadow-md rounded-xl"
              }`}
              style={{
                flex: "1 1 300px",
                maxWidth: "350px",
              }}
            >
              <div className="flex justify-between items-start">
                <div className="font-bold text-lg">{data.program}</div>
                <div
                  className={`rounded-xl px-2 py-1 text-sm ${
                    courseStatus.disabled
                      ? "bg-[#E5E7EB] text-[#4B5563]"
                      : "bg-[#008A91] text-white"
                  }`}
                >
                  {courseStatus.text}
                </div>
              </div>

              <div className="text-gray-600 text-base">{data.roundName}</div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-[14px] h-[14px]" viewBox="0 0 13 14" fill="none">
                  <path
                    d="M4.15625 0.65625C4.15625 0.292578 3.86367 0 3.5 0C3.13633 0 2.84375 0.292578 2.84375 0.65625V1.75H1.75C0.784766 1.75 0 2.53477 0 3.5V3.9375V5.25V12.25C0 13.2152 0.784766 14 1.75 14H10.5C11.4652 14 12.25 13.2152 12.25 12.25V5.25V3.9375V3.5C12.25 2.53477 11.4652 1.75 10.5 1.75H9.40625V0.65625C9.40625 0.292578 9.11367 0 8.75 0C8.38633 0 8.09375 0.292578 8.09375 0.65625V1.75H4.15625V0.65625ZM1.3125 5.25H10.9375V12.25C10.9375 12.4906 10.7406 12.6875 10.5 12.6875H1.75C1.50937 12.6875 1.3125 12.4906 1.3125 12.25V5.25Z"
                    fill="#6B7280"
                  />
                </svg>
                <span>{courseStatus.dateRange}</span>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                {admision.includes(data.admissionId) ? (
                  <button
                    onClick={() => handleApplicant(data.admissionId, data.program)}
                    disabled={courseStatus.disabled}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm ${
                      courseStatus.disabled ? "bg-gray-300 cursor-not-allowed" : "bg-[#008A91]"
                    }`}
                  >
                  ดูใบสมัคร
                </button>
                ):(
                  <button
                    onClick={() => handleApplyClick(courseStatus.disabled, data.admissionId, data.program)}
                    disabled={courseStatus.disabled}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm ${
                      courseStatus.disabled ? "bg-gray-300 cursor-not-allowed" : "bg-[#008A91]"
                    }`}
                  >
                    สมัครเรียน
                </button>
                )}
                <button className="flex items-center gap-2 text-sm text-[#008A91]">
                  <div className="bg-[#008A91] rounded-full w-5 h-5 flex items-center justify-center text-white">
                    <svg className="w-[9px] h-[10px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 10" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.01944 9.77082C0.836146 9.62777 0.735987 9.43594 0.740974 9.23748C0.745961 9.03902 0.855687 8.85016 1.04604 8.71241L6.28307 5.00798L1.04604 1.30355C0.947171 1.23621 0.86731 1.15466 0.811188 1.06373C0.755066 0.972795 0.723826 0.874328 0.719319 0.774162C0.714811 0.673997 0.737128 0.57417 0.784946 0.480599C0.832765 0.387029 0.905113 0.301616 0.997703 0.229424C1.09029 0.157231 1.20124 0.0997276 1.32397 0.0603199C1.4467 0.0209122 1.57872 0.000402451 1.71221 5.72205e-06C1.84569 -0.000391006 1.97792 0.0193338 2.10106 0.0580111C2.22421 0.0966892 2.33576 0.153532 2.42911 0.225172L8.41352 4.46879C8.51005 4.53865 8.58683 4.6224 8.63928 4.71504C8.69172 4.80768 8.71875 4.90732 8.71875 5.00798C8.71875 5.10864 8.69172 5.20827 8.63928 5.30092C8.58683 5.39356 8.51005 5.47731 8.41352 5.54717L2.42911 9.79079C2.23859 9.92841 1.9831 10.0036 1.71877 9.99987C1.45444 9.99612 1.20291 9.91374 1.01944 9.77082Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          );
        })}
      </div>)}

    </div>
    </div> 
  );
}
