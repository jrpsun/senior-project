"use client";

import { useState } from "react";
import FormField from "../../form/FormField";
import CustomSelect from "../../form/CustomSelect";

const EmergencyContact: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    firstNameEng: "",
    middleNameEng: "",
    lastNameEng: "",
    relationship: "",
    phoneNumber: "",
    email: "",
  });

  const relationshipOptions = [
    { value: "parent", label: "บิดา / มารดา" },
    { value: "sibling", label: "พี่น้อง" },
    { value: "relative", label: "ญาติ" },
    { value: "friend", label: "เพื่อน" },
    { value: "other", label: "อื่น ๆ" },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex justify-center py-10 bg-[white] ">
    <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-6">
    <div className="p-8 bg-white rounded-lg w-full max-w-5xl mx-auto">
          <h2 className="text-2xl text-[#008A90] font-semibold mb-6">
            บุคคลที่สามารถติดต่อได้ในกรณีฉุกเฉิน
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* คำนำหน้า */}
            <CustomSelect
              label="คำนำหน้า"
              options={[
                { value: "mr", label: "นาย" },
                { value: "mrs", label: "นาง" },
                { value: "ms", label: "นางสาว" },
              ]}
              value={formData.title}
              onChange={(selectedOption) =>
                handleChange("title", selectedOption ? selectedOption.value : "")
              }
              placeholder="เลือกคำนำหน้า"
              width="100%"
            />

            {/* ชื่อจริง (ภาษาไทย) */}
            <FormField
              label="ชื่อจริง (ภาษาไทย)"
              value={formData.firstName}
              onChange={(value) => handleChange("firstName", value)}
              placeholder="ระบุชื่อจริง"
              required
            />

            {/* นามสกุล (ภาษาไทย) */}
            <FormField
              label="นามสกุล (ภาษาไทย)"
              value={formData.lastName}
              onChange={(value) => handleChange("lastName", value)}
              placeholder="ระบุนามสกุล"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* ชื่อจริง (ภาษาอังกฤษ) */}
            <FormField
              label="ชื่อจริง (ภาษาอังกฤษ)"
              value={formData.firstNameEng}
              onChange={(value) => handleChange("firstNameEng", value)}
              placeholder="ระบุชื่อจริง"
              required
            />

            {/* นามสกุล (ภาษาอังกฤษ) */}
            <FormField
              label="นามสกุล (ภาษาอังกฤษ)"
              value={formData.lastNameEng}
              onChange={(value) => handleChange("lastNameEng", value)}
              placeholder="ระบุนามสกุล"
              required
            />

            {/* ความสัมพันธ์ */}
            <CustomSelect
              label="ความสัมพันธ์"
              options={relationshipOptions}
              value={formData.relationship}
              onChange={(selectedOption) =>
                handleChange("relationship", selectedOption ? selectedOption.value : "")
              }
              placeholder="เลือกความสัมพันธ์"
              width="100%"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* หมายเลขโทรศัพท์ */}
            <FormField
              label="หมายเลขมือถือ"
              value={formData.phoneNumber}
              onChange={(value) => handleChange("phoneNumber", value)}
              placeholder="ระบุหมายเลขมือถือ"
              required
              type="tel"
            />

            {/* อีเมล */}
            <FormField
              label="อีเมล"
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
              placeholder="ระบุอีเมล"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact;
