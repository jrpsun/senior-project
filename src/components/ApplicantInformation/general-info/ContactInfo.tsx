"use client";

import { useState } from "react";
import FormField from "../../form/FormField";

const ContactInfo: React.FC = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "test.raboobsamak@gmail.com",
    line: "",
    facebook: "",
    instagram: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex justify-center py-10 bg-[white] ">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-6">
      <div className="p-8 bg-white rounded-lg w-full max-w-5xl mx-auto">
          <h2 className="text-2xl text-[#008A90] font-semibold mb-6">ข้อมูลติดต่อ</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* หมายเลขโทรศัพท์ */}
            <FormField
              label="หมายเลขมือถือ"
              value={formData.phoneNumber}
              onChange={(value) => handleChange("phoneNumber", value)}
              placeholder="ระบุหมายเลขมือถือ"
              required
              type="tel"
            />

            {/* อีเมล (อ่านอย่างเดียว) */}
            <div className="flex flex-col">
              <label className="block text-[#565656] mb-1">
                อีเมล <span className="text-red-500">*</span>
              </label>
              <p className="text-[#565656] font-medium bg-gray-100 border border-gray-300 rounded-[10px] px-3 py-2">
                {formData.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Line ID */}
            <FormField
              label="Line (ถ้ามี)"
              value={formData.line}
              onChange={(value) => handleChange("line", value)}
              placeholder="Line"
            />

            {/* Facebook */}
            <FormField
              label="Facebook (ถ้ามี)"
              value={formData.facebook}
              onChange={(value) => handleChange("facebook", value)}
              placeholder="Facebook"
            />

            {/* Instagram */}
            <FormField
              label="Instagram (ถ้ามี)"
              value={formData.instagram}
              onChange={(value) => handleChange("instagram", value)}
              placeholder="Instagram"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
