import React from "react";
// เพิ่ม alert 
// - ข้อมูลไม่ครบถ้วน 
// - บันทึกข้อมูล 

// - alert Upload ไม่ถูกต้อง แล้วล้างค่าเกียรติบัตร
const Alert = ({ message, onClose }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-lg p-4 border border-red-500 bg-white rounded-lg shadow-md">
      <img
                src="/images/error_icon.svg"
                alt="Error Icon"
                width={20}
                height={20}
                className="mr-2"
              />

      {/* ปุ่มปิด */}
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
      <img
                src="/images/error_icon.svg"
                alt="Error Icon"
                width={20}
                height={20}
                className="mr-2"
              />
      </button>
    </div>
  );
};

export default Alert;
