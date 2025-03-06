import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, setMonth, setYear } from "date-fns";
import { enUS } from "date-fns/locale";

interface DateInputProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText: string;
  mode: "birthdate" | "expiry"; // ใช้ mode แยกเงื่อนไข วันเกิด / หมดอายุ
}

const DateInput: React.FC<DateInputProps> = ({ selected, onChange, placeholderText, mode }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState<Date>(selected || today); // ให้ dropdown แสดงค่าปัจจุบันเริ่มต้น

  return (
    <div className="relative w-full">
      <DatePicker
        selected={selected}
        onChange={(date) => {
          onChange(date);
          if (date) setViewDate(date); // อัปเดต dropdown ให้ตรงกับวันที่เลือก
        }}
        locale={enUS} // ใช้ภาษาอังกฤษ (ปี ค.ศ.)
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholderText}
        className="p-2 w-full border rounded-lg text-[#565656] bg-white"
        wrapperClassName="w-full"
        startDate={viewDate} // ให้ DatePicker เปิดขึ้นมาแสดงเดือนและปีของ viewDate

        showMonthDropdown // ให้เลือกเดือนจาก dropdown
        showYearDropdown // ให้เลือกปีจาก dropdown
        scrollableYearDropdown // ให้ dropdown ปีเลื่อนง่ายขึ้น
        yearDropdownItemNumber={100} // แสดงตัวเลือกปี 100 ปี

        minDate={mode === "birthdate" ? new Date(1900, 0, 1) : undefined} // วันเกิดต้องย้อนหลังได้ถึง 1900
        maxDate={mode === "birthdate" ? today : undefined} // วันเกิดเลือกอนาคตไม่ได้, วันหมดอายุเลือกได้หมด

        renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled, changeMonth, changeYear }) => (
          <div className="flex justify-between items-center px-2 py-1">
            <button 
              onClick={decreaseMonth} 
              disabled={prevMonthButtonDisabled}
              className="text-black hover:text-gray-700"
            >
              &lt;
            </button>
            <div className="flex items-center gap-2">
              {/* Dropdown เลือกเดือน */}
              <select
                className="text-black font-semibold bg-transparent border-none focus:outline-none"
                value={date.getMonth()}
                onChange={(e) => {
                  const newMonth = parseInt(e.target.value, 10);
                  changeMonth(newMonth);
                  setViewDate(setMonth(viewDate, newMonth)); //อัปเดต dropdown ให้ลิงก์กับปฏิทิน
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {format(setMonth(new Date(), i), "MMMM")}
                  </option>
                ))}
              </select>

              {/* Dropdown เลือกปี */}
              <select
                className="text-black font-semibold bg-transparent border-none focus:outline-none"
                value={date.getFullYear()}
                onChange={(e) => {
                  const newYear = parseInt(e.target.value, 10);
                  changeYear(newYear);
                  setViewDate(setYear(viewDate, newYear)); // อัปเดต dropdown ให้ลิงก์กับปฏิทิน
                }}
              >
                {Array.from({ length: 120 }, (_, i) => (
                  <option key={i} value={today.getFullYear() - i}>
                    {today.getFullYear() - i}
                  </option>
                ))}
              </select>
            </div>
            <button 
              onClick={increaseMonth} 
              disabled={nextMonthButtonDisabled}
              className="text-black hover:text-gray-700"
            >
              &gt;
            </button>
          </div>
        )}
      />

      {/* ไอคอนปฏิทิน */}
      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        <img src="/images/Calendar.svg" alt="ปฏิทิน" width={16} height={16} />
      </span>
    </div>
  );
};

export default DateInput;
