"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import FormField from "../../form/FormField";
import CustomSelect from "../../form/CustomSelect";
import "react-datepicker/dist/react-datepicker.css";

interface PopupAdmissionRoundProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: () => void;
  initialData?: any;
  isDeleteMode?: boolean;
  courseMapping: Record<string, string>;
  courseMappingReverse: Record<string, string>;
}

const PopupAdmissionRound: React.FC<PopupAdmissionRoundProps> = ({
  isOpen,
  onClose,
  onDelete,
  onSave,
  initialData,
  isDeleteMode = false
}) => {
  const [formData, setFormData] = useState({
    course: null,
    roundName: "",
    academicYear: null,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        course: initialData.course
          ? {
            value: initialData.course.value?.value || initialData.course.value || initialData.course,
            label: initialData.course.label?.label || initialData.course.label || initialData.course
          }
          : null,
        roundName: initialData.roundName || "",
        academicYear: initialData.academicYear
          ? {
            value: initialData.academicYear.value?.value || initialData.academicYear.value || initialData.academicYear,
            label: initialData.academicYear.label?.label || initialData.academicYear.label || initialData.academicYear
          }
          : null,
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
      });
    } else {
      setFormData({
        course: null,
        roundName: "",
        academicYear: null,
        startDate: "",
        endDate: "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [formData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "object" && value !== null ? { value: value.value, label: value.label } : value,
    }));
  };


  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-[525px] w-full relative">
          <button
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition z-50"
            onClick={onClose}
          >
            <Image src="/images/close_icon.svg" alt="Close" width={24} height={24} className="w-[20px] h-[20px]" />
          </button>
          {isDeleteMode ? (
            // โหมด "ยืนยันการลบ"
            <>

              <Dialog.Title className="text-[18px] text-[#565656] font-bold mb-4 flex items-center">
                <Image src="/images/Info_Message.svg" alt="Warning" width={24} height={24} className="mr-2" />
                คุณแน่ใจหรือไม่ว่าต้องการลบรอบรับสมัครนี้?
              </Dialog.Title>
              <p className="text-[#565656] text-[15px] mb-6">เมื่อดำเนินการลบแล้ว ข้อมูลที่เกี่ยวข้องจะถูกลบถาวร และไม่สามารถกู้คืนได้</p>

              {/* ปุ่มยืนยันการลบ */}
              <div className="flex justify-end space-x-2 w-full">
                <button
                  className="px-4 py-2 border border-[#B3B3B3] rounded-[8px] text-[15px] text-[#565656] w-full md:w-auto min-w-[100px] text-center"
                  onClick={onClose}
                >
                  ยกเลิก
                </button>
                <button
                  className="px-4 py-2 bg-[#D92D20] text-[15px] text-white rounded-[8px] flex items-center gap-2 w-full md:w-auto min-w-[110px] justify-center"
                  onClick={() => {
                    onDelete?.();
                    onClose();
                  }}
                >
                  <Image src="/images/admin/permission/confirm_delete_user.svg" alt="Delete" width={18} height={18} />
                  ยืนยันการลบ
                </button>
              </div>

            </>
          ) : (
            // โหมด "เพิ่ม/แก้ไขรอบรับสมัคร"
            <>

              <Dialog.Title className="text-xl text-[#565656] font-bold">
                {initialData ? "แก้ไขรอบรับสมัคร" : "เพิ่มรอบรับสมัคร"}
              </Dialog.Title>

              <div className="mt-4 space-y-3">
                {/* หลักสูตร */}
                <CustomSelect
                  label="หลักสูตร (Program/Course)"
                  options={[
                    { value: "หลักสูตร DST (ไทย)", label: "หลักสูตร DST (ไทย)" },
                    { value: "หลักสูตร ICT (นานาชาติ)", label: "หลักสูตร ICT (นานาชาติ)" }
                  ]}
                  value={formData.course?.value || null}
                  onChange={(option) => handleChange("course", option ? { value: option.value, label: option.label } : null)}
                  placeholder="เลือกหลักสูตร"
                  required={false}
                  boldLabel={true}
                />

                {/* ชื่อรอบรับสมัคร */}
                <FormField
                  label="ชื่อรอบรับสมัคร (Round Name)"
                  value={formData.roundName || ""}
                  onChange={(value) => handleChange("roundName", value)}
                  placeholder="ระบุชื่อรอบรับสมัคร"
                  required={false}
                  boldLabel={true}
                />
                {/* ปีการศึกษา */}
                <CustomSelect
                  label="ปีการศึกษา (Academic Year)"
                  options={Array.from({ length: 5 }, (_, i) => {
                    const currentYear = new Date().getFullYear() + 543;
                    const year = currentYear - 2 + i; // ปีที่ -2 ถึง +2
                    return { value: String(year), label: String(year) };
                  })}
                  value={formData.academicYear?.value || null}
                  onChange={(option) => handleChange("academicYear", option ? { value: option.value, label: option.label } : null)}
                  placeholder="เลือกปีการศึกษา"
                  required={false}
                  boldLabel={true}
                />

                {/* วันที่เริ่มต้น - วันที่สิ้นสุด */}
                <div className="flex gap-4">
                  <FormField
                    label="วันที่เริ่มต้น"
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(value) => handleChange("startDate", value || "")}
                    required={false}
                    boldLabel={true}
                  />
                  <FormField
                    label="วันที่สิ้นสุด"
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(value) => handleChange("endDate", value || "")}
                    required={false}
                    boldLabel={true}
                  />
                </div>
              </div>

              {/* ปุ่ม บันทึก & ยกเลิก */}
              <div className="mt-6 flex justify-center space-x-2 w-full">
                <button
                  className="px-4 py-2 border border-[#B3B3B3] rounded-[8px] text-[#565656] w-full md:w-auto min-w-[120px] text-center"
                  onClick={onClose}
                >
                  ยกเลิก
                </button>
                <button
                  className="px-4 py-2 bg-[#008A90] text-white rounded-[8px] flex items-center gap-2 w-full md:w-auto min-w-[120px] justify-center"
                  onClick={() => onSave(formData)}
                >
                  <Image src="/images/admin/save_icon.svg" alt="Save" width={18} height={18} />
                  บันทึก
                </button>
              </div>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PopupAdmissionRound;
