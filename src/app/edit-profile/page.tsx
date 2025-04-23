"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../hooks/LanguageContext";
import Navbar from "../../components/Navbar";
import CustomSelect from "../../components/form/CustomSelect";
import FormField from "../../components/form/FormField";
import Popup from "../../components/common/popup";
import { authFetch } from "@components/lib/auth";
import { TokenApplicantPayload } from "@components/types/token";
import { jwtDecode } from "jwt-decode";
import Modal from "@components/components/common/popup-login";

export default function EditProfile() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { language } = useLanguage() as { language: "TH" | "EN" };
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [appId, setAppId] = useState("")

  const [formData, setFormData] = useState({
    nationality: "",
    idCardNumber: "",
    prefix: "",
    firstNameTH: "",
    lastNameTH: "",
    firstNameEN: "",
    lastNameEN: "",
    email: "",
  });

  const fetchApplicantProfile = async() => {
    const response = await authFetch(`${process.env.API_BASE_URL}/applicant/get-applicant-profile/${appId}`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json()
    setFormData({
      nationality: data?.nationality || "",
      idCardNumber: data?.idCardNumber !== "" ? data.idCardNumber : data?.passportId || "",
      prefix: data?.prefix || "",
      firstNameTH: data?.firstnameTH || "",
      lastNameTH: data?.lastnameTH || "",
      firstNameEN: data?.firstnameEN || "",
      lastNameEN: data?.lastnameEN || "",
      email: data?.applicantEmail || ""
    })
  }

  useEffect(() => {
    if (appId) {
      fetchApplicantProfile();
    }
  },[appId])

  const getTitleOptions = () => ({
    TH: [
      { value: "mr", label: "นาย" },
      { value: "mrs", label: "นาง" },
      { value: "miss", label: "นางสาว" },
    ],
    EN: [
      { value: "mr", label: "Mr." },
      { value: "mrs", label: "Mrs." },
      { value: "miss", label: "Miss" },
    ],
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchEditedProfile();
    setPopupOpen(true);
  };

  const fetchEditedProfile = async() => {
    const response = await authFetch(`${process.env.API_BASE_URL}/applicant/updated-applicant-profile/${appId}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  }

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

  return (
    <div className="bg-white min-h-screen">
      {showModal && <Modal role="applicant"/>}
      <Navbar />

      {/* Breadcrumb */}
      <div className="pl-20 pt-4 text-sm text-gray-500">
        <button
          onClick={() => router.push("/programs")}
          className="text-gray-400 hover:text-[#008A90] hover:underline transition"
        >
          {language === "TH" ? "หน้าแรก" : "Home"}
        </button>
        <span className="mx-1 text-gray-400">/</span>
        <span className="text-[#008A91] font-medium">
          {language === "TH" ? "แก้ไขข้อมูล" : "Edit Profile"}
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* หัวข้อ */}
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">
          {language === "TH" ? "แก้ไขข้อมูล" : "Edit Information"}
        </h2>
        {/* Static Text: สัญชาติ & เลขประจำตัวประชาชน */}
        <div className="text-gray-700 space-y-2 mb-6">
          <p className="font-medium">{language === "TH" ? "สัญชาติ" : "Nationality"}</p>
          <p className="pl-4">
            {formData.nationality}
          </p>

          <p className="font-medium">{language === "TH" ? "เลขประจำตัวประชาชน/ หมายเลขพาสฟอร์ต" : "ID Card Number/ Passport Number"}</p>
          <p className="pl-4">{formData.idCardNumber}</p>
        </div>


        {/* ฟอร์มแก้ไขข้อมูล */}
        <form className="space-y-6">
          {/* คำนำหน้า */}
          <div className="w-[300px] max-w-xs">
            <CustomSelect
              label={language === "TH" ? "คำนำหน้า " : "Title "}
              options={getTitleOptions()[language as "TH" | "EN"] ?? []}
              value={formData.prefix}
              onChange={(selectedOption) => handleChange("prefix", selectedOption ? selectedOption.value : "")}
              placeholder={language === "TH" ? "เลือกคำนำหน้า" : "Select Title"}
            />
          </div>

          {/* ชื่อ - นามสกุล (ไทย) */}
          {formData?.nationality === "Thai" && 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={
                  <>
                    {language === "TH" ? "ชื่อ (ไทย)" : "First Name (TH)"}
                    {formData.nationality === "Thai" && <span className="text-red-500"> *</span>}
                  </>
                }
                value={formData.firstNameTH}
                onChange={(value) => handleChange("firstNameTH", value)}
                placeholder={language === "TH" ? "กรอกชื่อ (ไทย)" : "Enter First Name (TH)"}
              />
              <FormField
                label={
                  <>
                    {language === "TH" ? "นามสกุล (ไทย)" : "Last Name (TH)"}
                    {formData.nationality === "Thai" && <span className="text-red-500"> *</span>}
                  </>
                }
                value={formData.lastNameTH}
                onChange={(value) => handleChange("lastNameTH", value)}
                placeholder={language === "TH" ? "กรอกนามสกุล (ไทย)" : "Enter Last Name (TH)"}
              />
            </div>
          }


          {/* ชื่อ - นามสกุล (อังกฤษ) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label={
                <>
                  {language === "TH" ? "ชื่อ (อังกฤษ)" : "First Name (EN)"} <span className="text-red-500">*</span>
                </>
              }
              value={formData.firstNameEN}
              onChange={(value) => handleChange("firstNameEN", value)}
              placeholder={language === "TH" ? "กรอกชื่อ (อังกฤษ)" : "Enter First Name (EN)"}
            />
            <FormField
              label={
                <>
                  {language === "TH" ? "นามสกุล (อังกฤษ)" : "Last Name (EN)"} <span className="text-red-500">*</span>
                </>
              }
              value={formData.lastNameEN}
              onChange={(value) => handleChange("lastNameEN", value)}
              placeholder={language === "TH" ? "กรอกนามสกุล (อังกฤษ)" : "Enter Last Name (EN)"}
            />
          </div>

          {/* อีเมล */}
          <FormField
            label={
              <>
                {language === "TH" ? "อีเมล" : "Email"} <span className="text-red-500">*</span>
              </>
            }
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            placeholder="example@email.com"
          />

          {/* ปุ่มกลับ */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => router.push("/programs")}
              className="px-8 py-3 border border-[#008A91] text-[#008A91] rounded-lg"
            >
              {language === "TH" ? "กลับ" : "Back"}
            </button>

            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#008A91] text-white rounded-lg hover:bg-[#00757a] transition"
            >
              {language === "TH" ? "ตกลง" : "Submit"}
            </button>

          </div>
        </form>
      </div>
      <Popup
        type="successInfo"
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
      />
    </div>
  );
}
