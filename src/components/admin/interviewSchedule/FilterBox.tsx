import React from "react";
import SearchField from "@components/components/form/searchField";
import Image from "next/image";

interface FilterState {
  course?: string;
  round?: string;
  admitStatus?: string;
  docStatus?: string;
  paymentStatus?: string;
  applicantId?: string;
  name?: string;
  grouping?: string;
  committee?: string;
  interviewRoom?: string;
}

interface Option {
  label: string;
  value: string;
}

interface FilterBoxProps {
  filterValues: FilterState;
  setFilterValues: (values: FilterState) => void;
  onSearch: () => void;
  onReset: () => void;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  courseOptions: Option[];
  roundOptions: Option[];
  admitStatusOptions: string[];
  docStatusOptions: string[];
  paymentStatusOptions: string[];
  allRoomOptions: Option[];
  committeeOptions: Option[];
}

const FilterBox: React.FC<FilterBoxProps> = ({
  filterValues,
  setFilterValues,
  onSearch,
  onReset,
  isExpanded,
  setIsExpanded,
  courseOptions,
  roundOptions,
  admitStatusOptions,
  docStatusOptions,
  paymentStatusOptions,
  allRoomOptions,
  committeeOptions,
}) => {
  const handleDropdownChange = (key: keyof FilterState) => (option: string | Option | null) => {
    if (typeof option === "object" && option !== null && "value" in option) {
      setFilterValues({ ...filterValues, [key]: option.value });
    } else if (typeof option === "string") {
      setFilterValues({ ...filterValues, [key]: option });
    } else {
      setFilterValues({ ...filterValues, [key]: "" });
    }
  };

  const handleTextChange = (key: keyof FilterState) => (value: string | { value: string } | null | undefined) => {
    if (typeof value === "object" && value !== null && "value" in value) {
      setFilterValues({ ...filterValues, [key]: value.value });
    } else {
      setFilterValues({ ...filterValues, [key]: value ?? undefined });
    }
  };

  return (
    <div className="relative max-w-[1600px] w-full mx-auto p-5 rounded-lg shadow-md mb-6 px-4 md:px-8 z-10 mt-5">
      <h2 className="text-[24px] font-semibold text-[#565656] mb-4">ค้นหาผู้สมัคร</h2>
      <hr className="mb-4 border-gray-300" />

      <div className="flex flex-wrap items-end gap-2 mb-4">
        <div className="w-[180px] z-20">
          <SearchField
            label="หลักสูตร"
            type="dropdown"
            value={filterValues.course || ""}
            onChange={handleDropdownChange("course")}
            options={courseOptions}
            placeholder="เลือกหลักสูตร"
          />
        </div>

        <div className="w-[280px] z-20 relative">
          <SearchField
            label="รอบรับสมัคร"
            type="dropdown"
            value={filterValues.round || ""}
            onChange={handleDropdownChange("round")}
            options={roundOptions}
            placeholder="เลือกรอบรับสมัคร"
          />
        </div>

        <div className="w-[240px] z-20">
          <SearchField
            label="สถานะการสมัคร"
            type="dropdown"
            value={filterValues.admitStatus || ""}
            onChange={handleDropdownChange("admitStatus")}
            options={admitStatusOptions.map(value => ({ label: value, value }))}
            placeholder="เลือกสถานะการสมัคร"
          />
        </div>

        <div className="w-[240px]">
          <SearchField
            label="สถานะเอกสาร"
            type="dropdown"
            value={filterValues.docStatus || ""}
            onChange={handleDropdownChange("docStatus")}
            options={docStatusOptions.map(value => ({ label: value, value }))}
            placeholder="เลือกสถานะเอกสาร"
          />
        </div>

        <div className="w-[270px]">
          <SearchField
            label="สถานะการชำระเงิน"
            type="dropdown"
            value={filterValues.paymentStatus || ""}
            onChange={handleDropdownChange("paymentStatus")}
            options={paymentStatusOptions.map(value => ({ label: value, value }))}
            placeholder="เลือกสถานะการชำระเงิน"
          />
        </div>

        <div className="flex gap-1 flex-wrap items-end">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-[30px] h-[40px] flex items-center justify-center border border-[#565656] rounded-md"
          >
            <Image
              src={
                isExpanded
                  ? "/images/admin/searchBar/show_less_icon.svg"
                  : "/images/admin/searchBar/show_more_icon.svg"
              }
              alt={isExpanded ? "แสดงน้อยลง" : "แสดงเพิ่มเติม"}
              width={37}
              height={37}
              className="w-37 h-37"
            />
          </button>
          <button
            className="px-1.5 h-[40px] border border-gray-400 rounded-md text-[#565656] bg-white flex items-center gap-1"
            onClick={onReset}
          >
            <Image src="/images/admin/searchBar/clear_icon.svg" alt="reset" width={16} height={16} className="w-4 h-4" />
            ล้างค่า
          </button>
          <button
            className="px-2 h-[40px] rounded-md bg-[#008A90] hover:bg-[#009198] text-white flex items-center gap-1"
            onClick={onSearch}
          >
            <Image src="/images/admin/searchBar/search_icon.svg" alt="search" width={16} height={16} className="w-4 h-4" />
            ค้นหารายการ
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-wrap gap-2">
          <div className="w-[180px]">
            <SearchField
              label="เลขที่สมัคร"
              value={filterValues.applicantId || ""}
              onChange={handleTextChange("applicantId")}
              placeholder="กรุณากรอกข้อมูล"
            />
          </div>
          <div className="w-[280px]">
            <SearchField
              label="ชื่อ-นามสกุล ผู้สมัคร"
              value={filterValues.name || ""}
              onChange={handleTextChange("name")}
              placeholder="กรุณากรอกข้อมูล"
            />
          </div>
          <div className="w-[240px]">
            <SearchField
              label="ห้องสัมภาษณ์"
              type="dropdown"
              value={filterValues.interviewRoom || ""}
              onChange={handleDropdownChange("interviewRoom")}
              options={allRoomOptions}
              placeholder="เลือกห้องสัมภาษณ์"
            />
          </div>

          <div className="w-[240px]">
            <SearchField
              label="กรรมการสัมภาษณ์"
              type="dropdown"
              value={filterValues.committee || ""}
              onChange={handleDropdownChange("committee")}
              options={committeeOptions}
              placeholder="เลือกกรรมการ"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBox;
