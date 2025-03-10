
"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <div className="mr-[200px] ml-[200px]">
        <div className="flex flex-col p-0 gap-16 pt-10">
          <div className="font-bold text-[36px] leading-7 text-center">
            โครงการรับสมัคร
          </div>
          <div className="flex flex-row items-center justify-between w-full gap-2">
            <div className="flex items-center gap-2 flex-none">
              <div className="w-[32px] h-[32px] bg-[#008A91] rounded-full text-white flex items-center justify-center">
                1
              </div>
              <div className="font-normal text-xl leading-4 text-[#008A91]">
                เลือกหลักสูตร
              </div>
            </div>
            <div className="bg-[#D1D5DB] w-[275px] p-[1px] flex-grow"></div>
            <div className="flex flex-row items-center gap-2 flex-none">
              <div className="w-[32px] h-[32px] bg-[#D1D5DB] rounded-full text-[#4B5563] flex items-center justify-center">
                2
              </div>
              <div className="font-normal text-xl leading-4 text-[#6B7280]">
                กรอกข้อมูลส่วนตัว
              </div>
            </div>
            <div className="bg-[#D1D5DB] w-[275px] p-[1px] flex-grow"></div>
            <div className="flex flex-row items-center gap-2 flex-none">
              <div className="w-[32px] h-[32px] bg-[#D1D5DB] rounded-full text-[#4B5563] flex items-center justify-center">
                3
              </div>
              <div className="font-normal text-xl leading-4 text-[#6B7280]">
                อัปโหลดเอกสาร
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full mt-[20px]">
          <div className="ml-auto border-[#E5E7EB] rounded-xl p-1 text-[#565656] border-2">
            <select name="" id="" className="text-center">
              <option value="">แสดงทั้งหมด</option>
              <option value="">เปิดรับสมัคร</option>
              <option value="">กำลังจะเปิดรับสมัคร</option>
              <option value="">ปิดรับสมัคร</option>
            </select>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center pr-[100px] pl-[100px] mt-[20px]">
          {/* DST เปิดรับสมัคร  */}
          <div className="flex flex-col p-[22px_26px] gap-4 bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.05)] rounded-lg">
            <div className="flex flex-row justify-between w-full">
              <div className="flex font-bold text-[20px] items-start">
                หลักสูตร DST (ไทย)
              </div>
              <div className="flex ml-auto bg-[#008A91] rounded-xl p-1 text-[14px] text-[#E5E7EB]">
                เหลือเวลาอีก 54 วัน
              </div>
            </div>
            <div className="text-[16px] text-[#4B5563]">
              รอบ 1 MU - Portfolio (TCAS 1) ปีการศึกษา 2568
            </div>
            <div className="flex flex-row gap-1 mr-auto">
              <div className="flex items-center mb-1">
                <svg
                  className="w-[13px] h-[14px]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 13 14"
                  fill="none"
                >
                  <g clipPath="url(#clip0_186_10021)">
                    <g clipPath="url(#clip1_186_10021)">
                      <path
                        d="M4.15625 0.65625C4.15625 0.292578 3.86367 0 3.5 0C3.13633 0 2.84375 0.292578 2.84375 0.65625V1.75H1.75C0.784766 1.75 0 2.53477 0 3.5V3.9375V5.25V12.25C0 13.2152 0.784766 14 1.75 14H10.5C11.4652 14 12.25 13.2152 12.25 12.25V5.25V3.9375V3.5C12.25 2.53477 11.4652 1.75 10.5 1.75H9.40625V0.65625C9.40625 0.292578 9.11367 0 8.75 0C8.38633 0 8.09375 0.292578 8.09375 0.65625V1.75H4.15625V0.65625ZM1.3125 5.25H10.9375V12.25C10.9375 12.4906 10.7406 12.6875 10.5 12.6875H1.75C1.50937 12.6875 1.3125 12.4906 1.3125 12.25V5.25Z"
                        fill="#6B7280"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_186_10021">
                      <rect width="12.25" height="14" fill="white" />
                    </clipPath>
                    <clipPath id="clip1_186_10021">
                      <path d="M0 0H12.25V14H0V0Z" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="flex text-[14px] text-[#6B7280]">
                1 ม.ค. - 31 มี.ค. 2568
              </div>
            </div>
            <div className="flex flex-row justify-between w-full">
              <button
                onClick={() => router.push("/apply/ApplicationInfo")}
                className="flex flex-row items-center bg-[#008A91] p-[10px_38px] gap-2 rounded-[8px]"
              >
                <div>
                  <svg
                    className="w-[20px] h-[16px]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 16"
                    fill="none"
                  >
                    <path
                      d="M8.43687 7.88934C10.6119 7.88934 12.3756 6.12559 12.3756 3.95059C12.3756 1.77559 10.6119 0.0118408 8.43687 0.0118408C6.26187 0.0118408 4.49813 1.77559 4.49813 3.95059C4.50063 6.12497 6.26312 7.88684 8.43687 7.88934ZM8.43687 0.949341C10.0944 0.949341 11.4381 2.29309 11.4381 3.95059C11.4381 5.60809 10.0944 6.95184 8.43687 6.95184C6.77937 6.95184 5.43563 5.60809 5.43563 3.95059C5.4375 2.29372 6.78 0.951216 8.43687 0.949341ZM8.43687 9.26997C4.71437 9.28559 1.6025 11.8843 0.801875 15.3656L0.791875 15.4187C0.785 15.4487 0.78125 15.4831 0.78125 15.5187C0.78125 15.7775 0.99125 15.9875 1.25 15.9875C1.47312 15.9875 1.66 15.8312 1.70688 15.6218L1.7075 15.6187C2.41 12.5012 5.15562 10.2075 8.4375 10.2075C11.7194 10.2075 14.4644 12.5012 15.1587 15.5725L15.1675 15.6187C15.2125 15.8312 15.3988 15.9881 15.6213 15.9881C15.6581 15.9881 15.6944 15.9837 15.7288 15.9756L15.7256 15.9762C15.9381 15.9287 16.0944 15.7418 16.0944 15.5181C16.0944 15.4825 16.0906 15.4481 16.0831 15.415L16.0838 15.4181C15.2719 11.8843 12.1613 9.28559 8.44 9.26934H8.43812L8.43687 9.26997ZM19.0656 4.92309C18.9825 4.84747 18.8719 4.80122 18.75 4.80122C18.6131 4.80122 18.49 4.85934 18.4044 4.95247V4.95309L15.4506 8.18184L14.7019 7.43872C14.6169 7.35372 14.5 7.30122 14.37 7.30122C14.1106 7.30122 13.9006 7.51122 13.9006 7.77059C13.9006 7.90122 13.9538 8.01872 14.04 8.10372L15.135 9.19059L15.1456 9.19497L15.15 9.20434C15.2312 9.28059 15.3406 9.32747 15.4613 9.32747C15.5863 9.32747 15.6994 9.27684 15.7819 9.19559C15.7869 9.19122 15.7944 9.19309 15.7994 9.18809L15.8025 9.18059L15.8119 9.17372L19.0956 5.58497C19.1719 5.50184 19.2188 5.39059 19.2188 5.26872C19.2188 5.13184 19.16 5.00872 19.0669 4.92309L19.0662 4.92247L19.0656 4.92309Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div className="h-[24px] text-center text-white text-[16px] leading-[24px] font-normal">
                  สมัครเรียน
                </div>
              </button>
              <button className="flex flex-row items-center gap-2">
                <div className="flex bg-[#008A91] rounded-full text-white w-[20px] h-[20px] items-center justify-center">
                  <svg
                    className="w-[9px] h-[10px] fill-current text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 9 10"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.01944 9.77082C0.836146 9.62777 0.735987 9.43594 0.740974 9.23748C0.745961 9.03902 0.855687 8.85016 1.04604 8.71241L6.28307 5.00798L1.04604 1.30355C0.947171 1.23621 0.86731 1.15466 0.811188 1.06373C0.755066 0.972795 0.723826 0.874328 0.719319 0.774162C0.714811 0.673997 0.737128 0.57417 0.784946 0.480599C0.832765 0.387029 0.905113 0.301616 0.997703 0.229424C1.09029 0.157231 1.20124 0.0997276 1.32397 0.0603199C1.4467 0.0209122 1.57872 0.000402451 1.71221 5.72205e-06C1.84569 -0.000391006 1.97792 0.0193338 2.10106 0.0580111C2.22421 0.0966892 2.33576 0.153532 2.42911 0.225172L8.41352 4.46879C8.51005 4.53865 8.58683 4.6224 8.63928 4.71504C8.69172 4.80768 8.71875 4.90732 8.71875 5.00798C8.71875 5.10864 8.69172 5.20827 8.63928 5.30092C8.58683 5.39356 8.51005 5.47731 8.41352 5.54717L2.42911 9.79079C2.23859 9.92841 1.9831 10.0036 1.71877 9.99987C1.45444 9.99612 1.20291 9.91374 1.01944 9.77082Z"
                    />
                  </svg>
                </div>
                <div className="flex text-[16px]">ดูรายละเอียด</div>
              </button>
            </div>
          </div>
          {/* ICT  */}
          <div className="flex flex-col p-[22px_26px] gap-4 bg-[#F9FAFB] opacity-75 border-2 border-[#E5E7EB] rounded-2xl">
            <div className="flex flex-row justify-between w-full">
              <div className="flex font-bold text-[20px] items-start">
                หลักสูตร ICT (นานาชาติ)
              </div>
              <div className="flex ml-auto bg-[#E5E7EB] rounded-xl p-1 text-[14px] text-[#4B5563]">
                ปิดรับสมัคร
              </div>
            </div>
            <div className="text-[16px] text-[#4B5563]">
              รอบ 1 ICT - Portfolio
            </div>
            <div className="flex flex-row gap-1 mr-auto">
              <div className="flex items-center mb-1">
                <svg
                  className="w-[13px] h-[14px]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 13 14"
                  fill="none"
                >
                  <g clipPath="url(#clip0_186_10021)">
                    <g clipPath="url(#clip1_186_10021)">
                      <path
                        d="M4.15625 0.65625C4.15625 0.292578 3.86367 0 3.5 0C3.13633 0 2.84375 0.292578 2.84375 0.65625V1.75H1.75C0.784766 1.75 0 2.53477 0 3.5V3.9375V5.25V12.25C0 13.2152 0.784766 14 1.75 14H10.5C11.4652 14 12.25 13.2152 12.25 12.25V5.25V3.9375V3.5C12.25 2.53477 11.4652 1.75 10.5 1.75H9.40625V0.65625C9.40625 0.292578 9.11367 0 8.75 0C8.38633 0 8.09375 0.292578 8.09375 0.65625V1.75H4.15625V0.65625ZM1.3125 5.25H10.9375V12.25C10.9375 12.4906 10.7406 12.6875 10.5 12.6875H1.75C1.50937 12.6875 1.3125 12.4906 1.3125 12.25V5.25Z"
                        fill="#6B7280"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_186_10021">
                      <rect width="12.25" height="14" fill="white" />
                    </clipPath>
                    <clipPath id="clip1_186_10021">
                      <path d="M0 0H12.25V14H0V0Z" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="flex text-[14px] text-[#6B7280]">
                ช่วงเวลารับสมัครถัดไป 1 เมษายน - 30 มีนาคม 2568
              </div>
            </div>
            <div className="flex flex-row justify-between w-full">
              <button className="flex flex-row items-center bg-[#D1D5DB] p-[10px_38px] gap-2 rounded-[8px]">
                <div>
                  <svg
                    className="w-[20px] h-[16px] "
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 16"
                    fill="none"
                  >
                    <path
                      d="M8.43687 7.88934C10.6119 7.88934 12.3756 6.12559 12.3756 3.95059C12.3756 1.77559 10.6119 0.0118408 8.43687 0.0118408C6.26187 0.0118408 4.49813 1.77559 4.49813 3.95059C4.50063 6.12497 6.26312 7.88684 8.43687 7.88934ZM8.43687 0.949341C10.0944 0.949341 11.4381 2.29309 11.4381 3.95059C11.4381 5.60809 10.0944 6.95184 8.43687 6.95184C6.77937 6.95184 5.43563 5.60809 5.43563 3.95059C5.4375 2.29372 6.78 0.951216 8.43687 0.949341ZM8.43687 9.26997C4.71437 9.28559 1.6025 11.8843 0.801875 15.3656L0.791875 15.4187C0.785 15.4487 0.78125 15.4831 0.78125 15.5187C0.78125 15.7775 0.99125 15.9875 1.25 15.9875C1.47312 15.9875 1.66 15.8312 1.70688 15.6218L1.7075 15.6187C2.41 12.5012 5.15562 10.2075 8.4375 10.2075C11.7194 10.2075 14.4644 12.5012 15.1587 15.5725L15.1675 15.6187C15.2125 15.8312 15.3988 15.9881 15.6213 15.9881C15.6581 15.9881 15.6944 15.9837 15.7288 15.9756L15.7256 15.9762C15.9381 15.9287 16.0944 15.7418 16.0944 15.5181C16.0944 15.4825 16.0906 15.4481 16.0831 15.415L16.0838 15.4181C15.2719 11.8843 12.1613 9.28559 8.44 9.26934H8.43812L8.43687 9.26997ZM19.0656 4.92309C18.9825 4.84747 18.8719 4.80122 18.75 4.80122C18.6131 4.80122 18.49 4.85934 18.4044 4.95247V4.95309L15.4506 8.18184L14.7019 7.43872C14.6169 7.35372 14.5 7.30122 14.37 7.30122C14.1106 7.30122 13.9006 7.51122 13.9006 7.77059C13.9006 7.90122 13.9538 8.01872 14.04 8.10372L15.135 9.19059L15.1456 9.19497L15.15 9.20434C15.2312 9.28059 15.3406 9.32747 15.4613 9.32747C15.5863 9.32747 15.6994 9.27684 15.7819 9.19559C15.7869 9.19122 15.7944 9.19309 15.7994 9.18809L15.8025 9.18059L15.8119 9.17372L19.0956 5.58497C19.1719 5.50184 19.2188 5.39059 19.2188 5.26872C19.2188 5.13184 19.16 5.00872 19.0669 4.92309L19.0662 4.92247L19.0656 4.92309Z"
                      fill="#6B7280"
                    />
                  </svg>
                </div>
                <div className="h-[24px] text-center text-[#6B7280] text-[16px] leading-[24px] font-normal">
                  สมัครเรียน
                </div>
              </button>
              <button className="flex flex-row items-center gap-2">
                <div className="flex bg-[#008A91] rounded-full text-white w-[20px] h-[20px] items-center justify-center">
                  <svg
                    className="w-[9px] h-[10px] fill-current text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 9 10"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.01944 9.77082C0.836146 9.62777 0.735987 9.43594 0.740974 9.23748C0.745961 9.03902 0.855687 8.85016 1.04604 8.71241L6.28307 5.00798L1.04604 1.30355C0.947171 1.23621 0.86731 1.15466 0.811188 1.06373C0.755066 0.972795 0.723826 0.874328 0.719319 0.774162C0.714811 0.673997 0.737128 0.57417 0.784946 0.480599C0.832765 0.387029 0.905113 0.301616 0.997703 0.229424C1.09029 0.157231 1.20124 0.0997276 1.32397 0.0603199C1.4467 0.0209122 1.57872 0.000402451 1.71221 5.72205e-06C1.84569 -0.000391006 1.97792 0.0193338 2.10106 0.0580111C2.22421 0.0966892 2.33576 0.153532 2.42911 0.225172L8.41352 4.46879C8.51005 4.53865 8.58683 4.6224 8.63928 4.71504C8.69172 4.80768 8.71875 4.90732 8.71875 5.00798C8.71875 5.10864 8.69172 5.20827 8.63928 5.30092C8.58683 5.39356 8.51005 5.47731 8.41352 5.54717L2.42911 9.79079C2.23859 9.92841 1.9831 10.0036 1.71877 9.99987C1.45444 9.99612 1.20291 9.91374 1.01944 9.77082Z"
                    />
                  </svg>
                </div>
                <div className="flex text-[16px]">ดูรายละเอียด</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
