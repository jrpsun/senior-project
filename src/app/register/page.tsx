"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import Image from "next/image";
import { useForm } from "../../hooks/useForm";
import FormField from "../../components/form/FormField";
import { formatIdCard, validateThaiCharacters, validateEnglishCharacters, validateEmail } from "../../utils/validation";
import CustomSelect from "../../components/form/CustomSelect";
import Popup from "../../components/common/popup";

const initialFormData = {
  password: "",
  confirmPassword: "",
  acceptTerms: false,
  nationality: null,
  language: "TH",
  idType: "citizen",
  idNumber: "",
  firstNameThai: "",
  lastNameThai: "",
  firstNameEnglish: "",
  lastNameEnglish: "",
  email: "",
  title: null,
};

export default function RegisterPage() {
  const router = useRouter();
  const { formData, errors, setErrors, handleChange, validateForm } = useForm(initialFormData);
  const [nationalities, setNationalities] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetch("/data/country-list.json")
      .then((res) => res.json())
      .then((data) => {
        setNationalities(
          data.map((nation: { alpha2: any; name: any }) => ({
            value: nation.alpha2,
            label: nation.name,
          }))
        );
      })
      .catch((error) => console.error("Error fetching nationalities:", error));
  }, []);

  const handleRegisterClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const isValid = validateForm();

    if (!formData.acceptTerms) {
      setErrors((prev) => ({ ...prev, acceptTerms: "กรุณายอมรับนโยบายความเป็นส่วนตัว" }));
      return;
    }

    if (isValid) {
      window.scrollTo(0, 0);
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  };

  const handleConfirmRegistration = () => {
    setIsPopupOpen(false);

    const isUserExists = false; // เปลี่ยนเป็น false ให้ไปหน้า summary ได้
    if (isUserExists) {
      setIsErrorPopupOpen(true);
    } else {
      // ✅ สร้าง URL parameters
      const queryParams = new URLSearchParams({
        nationality: formData.nationality || "",
        idType: formData.idType || "",
        idNumber: formData.idNumber || "",
        title: formData.title || "",
        firstNameThai: formData.firstNameThai || "",
        lastNameThai: formData.lastNameThai || "",
        firstNameEnglish: formData.firstNameEnglish || "",
        lastNameEnglish: formData.lastNameEnglish || "",
        email: formData.email || "",
      }).toString();

      router.push(`/register/summary?${queryParams}`);
    }
  };

  const titleOptions = [
    { value: "mr", label: "นาย" },
    { value: "mrs", label: "นาง" },
    { value: "miss", label: "นางสาว" },
  ];

  const preventThaiInput = (event: { key: string; preventDefault: () => void }) => {
    const thaiPattern = /[\u0E00-\u0E7F]/; // ตรวจสอบตัวอักษรภาษาไทย
    if (thaiPattern.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleSelectChange = (field: keyof typeof initialFormData, selectedOption: { value: any } | null) => {
    const value = selectedOption ? selectedOption.value : null;
    handleChange(field, value);

    if (field === "nationality") {
      const isThai = value === "TH";
      handleChange("idNumber", ""); // เคลียร์ค่าหมายเลข
      handleChange("idType", isThai ? "citizen" : "passport"); // อัปเดตประเภทเอกสาร
    }
  };

  return (
    <div className="flex min-h-screen relative bg-[#FFFFFF]">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <button
          className={`px-3 py-1 text-sm font-medium ${formData.language === "TH" ? "text-[#008A90] font-bold" : "text-gray-500"}`}
          onClick={() => handleChange("language", "TH")}
        >
          TH
        </button>
        <span className="text-gray-400"> | </span>
        <button
          className={`px-3 py-1 text-sm font-medium ${formData.language === "EN" ? "text-[#008A90] font-bold" : "text-gray-500"}`}
          onClick={() => handleChange("language", "EN")}
        >
          EN
        </button>
      </div>

      {/* Left Area: Background Image */}
      <div className="hidden md:block w-1/2 fixed h-screen">
        <Image
          src="/logo_ict.png"
          alt="มหาวิทยาลัยมหิดล โลโก้"
          width={200}
          height={80}
          className="absolute top-6 left-6 z-50"
        />
        <div
          className="absolute inset-0 bg-cover bg-center brightness-100"
          style={{ backgroundImage: "url('/images/background.png')" }}
        />
      </div>

      {/* Right Area: Form */}
      <div className="w-full md:w-1/2 ml-auto min-h-screen h-auto overflow-y-auto flex flex-col items-center justify-start">
        <div className="bg-white p-10 rounded-lg w-full max-w-[527px]  min-h-[700px]">
          <h2 className="text-2xl font-bold text-center text-gray-900 !block !relative z-10 min-h-[50px]">
            {isPopupOpen ? "ยืนยันการลงทะเบียน" : "ลงทะเบียนบัญชีผู้ใช้ใหม่"}
          </h2>
          <form className="flex flex-col gap-4">
            {/* Nationality */}
            <div className="relative w-full">
              <CustomSelect
                label="สัญชาติ"
                options={nationalities}
                value={formData.nationality}
                onChange={(selectedOption) => handleSelectChange("nationality", selectedOption)}
                placeholder="เลือกสัญชาติ"
                error={errors.nationality} // error ถูกส่งไปแล้ว
                width="460px"
              />
            </div>

            {/* ID Document */}
            <div className="w-full space-y-2">
              <label className="block text-[#565656] mb-1">
                เอกสารยืนยันตัวตน <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-x-1">
                <label className={`flex items-center whitespace-nowrap ${formData.nationality && formData.nationality !== "TH" ? "text-[#C4C4C4]" : "text-[#565656]"}`}>
                  <input
                    type="radio"
                    name="id_type"
                    value="citizen"
                    checked={formData.idType === "citizen"}
                    onChange={() => handleChange("idType", "citizen")}
                    disabled={formData.nationality !== "TH"}
                    className="mr-1"
                  />

                  หมายเลขบัตรประชาชน
                </label>
                <label className={`flex items-center whitespace-nowrap ${formData.nationality === "TH" ? "text-[#C4C4C4]" : "text-[#565656]"}`}>
                  <input
                    type="radio"
                    name="id_type"
                    value="passport"
                    checked={formData.idType === "passport"}
                    onChange={() => handleChange("idType", "passport")}
                    disabled={formData.nationality === "TH"}
                    className="mr-1"
                  />

                  หมายเลขพาสปอร์ต (สำหรับชาวต่างชาติ)
                </label>
              </div>
              <FormField
                label="ระบุหมายเลข"
                value={formData.idNumber}
                onChange={(value) => handleChange("idNumber", formData.idType === "citizen" ? formatIdCard(value.replace(/\D/g, "")) : value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 13).toUpperCase())}
                error={errors.idNumber}
                placeholder="ระบุหมายเลข"
                required
              />
            </div>

            {/* Title */}
            <div className="relative w-full">
              <CustomSelect
                label="คำนำหน้า"
                options={titleOptions}
                value={formData.title}
                onChange={(selectedOption: SingleValue<{ value: string; label: string }> | null) => handleChange("title", selectedOption ? selectedOption.value : null)}
                placeholder="เลือกคำนำหน้า"
                width="224px"
                error={errors.title}
              />

            </div>

            {/* Thai Name */}
            <div className="relative flex gap-3 w-full">
              <FormField
                label="ชื่อจริง (ไทย)"
                value={formData.firstNameThai}
                onChange={(value) => handleChange("firstNameThai", validateThaiCharacters(value))}
                error={errors.firstNameThai}
                placeholder="ระบุชื่อจริง (ไทย)"
                required={formData.nationality === "TH"}
              />
              <FormField
                label="นามสกุล (ไทย)"
                value={formData.lastNameThai}
                onChange={(value) => handleChange("lastNameThai", validateThaiCharacters(value))}
                error={errors.lastNameThai}
                placeholder="ระบุนามสกุล (ไทย)"
                required={formData.nationality === "TH"}
              />
            </div>

            {/* English Name */}
            <div className="relative flex gap-3 w-full">
              <FormField
                label="ชื่อจริง (อังกฤษ)"
                value={formData.firstNameEnglish}
                onChange={(value) => handleChange("firstNameEnglish", validateEnglishCharacters(value))}
                error={errors.firstNameEnglish}
                placeholder="ระบุชื่อจริง (อังกฤษ)"
                required
              />
              <FormField
                label="นามสกุล (อังกฤษ)"
                value={formData.lastNameEnglish}
                onChange={(value) => handleChange("lastNameEnglish", validateEnglishCharacters(value))}
                error={errors.lastNameEnglish}
                placeholder="ระบุนามสกุล (อังกฤษ)"
                required
              />
            </div>

            {/* Email */}
            <FormField
              label="อีเมล"
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
              onBlur={() => {
                if (formData.email && !validateEmail(formData.email)) {
                  setErrors((prev) => ({ ...prev, email: "รูปแบบอีเมลไม่ถูกต้อง" }));
                }
              }}
              error={errors.email}
              placeholder="ระบุอีเมล"
              type="email"
              required
            />

            {/* Password */}
            <div>
              <label className="block text-[#565656]">
                รหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full min-w-[460px] max-w-md">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onKeyDown={preventThaiInput}
                  onBlur={() => {
                    let passwordError = null;
                    if (formData.password.length < 8) {
                      passwordError = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
                    }
                    setErrors((prev) => ({
                      ...prev,
                      password: passwordError || "",
                    }));
                  }}
                  className={`w-full p-2 border 
        ${errors.password ? "border-red-500" : "border-[#C4C4C4]"} 
        text-[#565656] rounded-[10px] hover:border-[#A3A3A3] 
        focus:border-[#A3A3A3] focus:ring-0 outline-none transition duration-200 
        mt-1 pr-12 min-h-[44px]`}
                  placeholder="ระบุรหัสผ่าน"
                />

                {/* ปุ่ม Hide/Unhide อยู่ตรงกลาง */}
                <button
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center justify-center text-gray-500 h-full w-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Image
                    src={showPassword ? "/images/Unhide_Password.svg" : "/images/Hide_Password.svg"}
                    alt="แสดง/ซ่อนรหัสผ่าน"
                    width={24}
                    height={30}
                  />
                </button>
              </div>

              {/* Error Message */}
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}

              {/* Info Message */}
              <p className="text-[#B3B3B3] text-sm mt-1 flex items-center">
                <Image
                  src="/images/Info_Message.svg"
                  alt="Info Icon"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                รหัสผ่านจะต้องมีความยาวไม่น้อยกว่า 8 ตัวอักษร
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[#565656]">
                ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full min-w-[460px] max-w-md">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  onKeyDown={preventThaiInput} // ป้องกันภาษาไทย
                  onBlur={() => {
                    let confirmPasswordError = null;

                    if (formData.confirmPassword.length < 8) {
                      confirmPasswordError = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
                    } else if (formData.confirmPassword !== formData.password) {
                      confirmPasswordError = "รหัสผ่านไม่ตรงกัน";
                    }

                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: confirmPasswordError || "",
                    }));
                  }}
                  className={`w-full p-2 border 
        ${errors.confirmPassword ? "border-red-500" : "border-[#C4C4C4]"} 
        text-[#565656] rounded-[10px] hover:border-[#A3A3A3] 
        focus:border-[#A3A3A3] focus:ring-0 outline-none transition duration-200 
        mt-1 pr-12 min-h-[44px]`}
                  placeholder="ระบุรหัสผ่านอีกครั้ง"
                />

                {/* ปุ่ม Hide/Unhide อยู่กลางเป๊ะ */}
                <button
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center justify-center text-gray-500 h-full w-10"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Image
                    src={showConfirmPassword ? "/images/Unhide_Password.svg" : "/images/Hide_Password.svg"}
                    alt="แสดง/ซ่อนรหัสผ่าน"
                    width={24}
                    height={24}
                  />
                </button>
              </div>

              {/* Error Message (แสดงแค่ 1 ข้อ) */}
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 min-h-[20px]">
                  {errors.confirmPassword}
                </p>
              )}

              {/* Info Message */}
              <p className="text-[#B3B3B3] text-sm mt-1 flex items-center">
                <Image
                  src="/images/Info_Message.svg"
                  alt="Info Icon"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                รหัสผ่านจะต้องมีความยาวไม่น้อยกว่า 8 ตัวอักษร
              </p>
            </div>

            {/* Checkbox ยอมรับนโยบายความเป็นส่วนตัว */}
            <div className="mt-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleChange("acceptTerms", e.target.checked)}
                  className="w-5 h-5 accent-[#008A90] border-gray-300 rounded focus:ring-[#008A90]"
                />
                <label htmlFor="acceptTerms" className="ml-2 text-[#565656] text-sm">
                  ฉันได้อ่านและยอมรับ{" "}
                  <a href="/privacy-policy" className="text-[#008A90] underline">
                    นโยบายความเป็นส่วนตัว
                  </a>{" "}
                  ทั้งหมดแล้ว
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>
              )}
            </div>


            {/* Register Button */}
            <div className="mt-0.5">
              <button
                disabled={isPopupOpen}
                onClick={handleRegisterClick}
                className="w-[200px] bg-[#008A90] text-white py-3 px-6 rounded-[10px] font-medium hover:bg-[#00757a] transition mx-auto block"
              >
                ลงทะเบียน
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-0.5">
              <span className="text-[#475467]">มีบัญชีแล้ว?</span>
              <a href="/login" className="text-[#008A90] font-semibold ml-2 hover:underline">
                เข้าสู่ระบบ
              </a>
            </div>
          </form>
        </div>
      </div>
      {/* Popups */}
      <Popup type="confirmation" isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} onConfirm={handleConfirmRegistration} />
      <Popup type="success" isOpen={isSuccessPopupOpen} onClose={() => setIsSuccessPopupOpen(false)} />
      <Popup type="error" isOpen={isErrorPopupOpen} onClose={() => setIsErrorPopupOpen(false)} />
    </div>
  );
}