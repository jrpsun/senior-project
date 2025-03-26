import React from "react";
import Link from "next/link";

interface ApplicantHeaderProps {
    title: string;
    applicantId: string;
    applicantName: string;
    activeTab: string;
    statuses: {
        label: string;
        value: string;
        color: string;
    }[];
}
const tabsList = [
    { label: "ข้อมูลทั่วไป", href: "#" },
    { label: "ข้อมูลการศึกษา", href: "#" },
    { label: "รางวัลและผลงาน", href: "#" },
    { label: "การฝึกอบรม", href: "#" },
    { label: "เอกสารเพิ่มเติม", href: "#" },
    { label: "ผลการคัดกรองเบื้องต้น", href: "#" },
  ];

const ApplicantHeader: React.FC<ApplicantHeaderProps> = ({
    title,
    applicantId,
    applicantName,
    statuses,
    activeTab,
}) => {
    return (
        <div className="w-full pb-4 mb-6">
            <div className="mb-3 mt-3">
                <h1 className="text-2xl font-bold text-[#565656] leading-snug break-words">
                    {title}
                    <span className="font-normal text-[#565656]"> เลขที่สมัคร {applicantId} {applicantName}</span>
                </h1>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
                {statuses.map((status, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span className=" text-[#565656] whitespace-nowrap">{status.label}:</span>
                        <span
                            className={` font-medium px-3 py-1 rounded-full ${status.color} whitespace-nowrap`}
                        >
                            {status.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-8 pl-10">
        {tabsList.map((tab, index) => (
          <Link key={index} href={tab.href} passHref legacyBehavior>
            <a
              className={`pb-2 border-b-2 transition-all whitespace-nowrap ${
                tab.label === activeTab
                  ? "text-[#008A90] font-semibold border-[#008A90]"
                  : "text-[#565656] border-transparent hover:text-[#008A90]"
              }`}
            >
              {tab.label}
            </a>
          </Link>
        ))}
      </div>

        </div>
    );
};

export default ApplicantHeader;