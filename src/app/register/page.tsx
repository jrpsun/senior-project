"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "../../hooks/useForm";
import FormField from "../../components/form/FormField";
import { formatIdCard, validateThaiCharacters, validateEnglishCharacters, validateEmail, validatePassword, validateConfirmPassword } from "../../utils/validation";
import CustomSelect from "../../components/form/CustomSelect";
import Popup from "../../components/common/popup";
import { useLanguage } from "@components/hooks/LanguageContext";
import { SingleValue } from "react-select";
import { texts } from "../../translation/register";


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
  const { language, setLanguage } = useLanguage(); // ดึง language ก่อน
  const { formData, errors, setErrors, handleChange, validateForm } = useForm(initialFormData, language);
  const [nationalities, setNationalities] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetch("/data/nationalities.json")
      .then((res) => res.json())
      .then((data) => {

        // เรียงตาม A-Z (English) ก่อน แล้วค่อย ก-ฮ (Thai)
        const sortedNationalities = data.sort((a, b) => {
          const langKey = language === "ENG" ? "English" : "Thai";
          return a[langKey].localeCompare(b[langKey], "th");
        });

        // แปลงข้อมูลสำหรับ Dropdown
        setNationalities(
          sortedNationalities.map((nation) => ({
            value: nation.English, // ใช้ค่า English เป็นค่า value
            label: language === "ENG" ? nation.English : nation.Thai, // แสดงผลตามภาษาที่เลือก
          }))
        );
      })
      .catch((error) => console.error("Error fetching nationalities:", error));
  }, [language]);

  useEffect(() => {
    if (formData.nationality === "Thai") {
      // ถ้าเลือกไทย → บังคับเลือก citizen (บัตรประชาชน)
      handleChange("idType", "citizen");
      handleChange("idNumber", ""); // เคลียร์ค่า ID Number
    } else if (formData.nationality !== null) {
      // ถ้าเลือกสัญชาติอื่น → บังคับเลือก passport
      handleChange("idType", "passport");
      handleChange("idNumber", ""); // เคลียร์ค่า ID Number
    }
  }, [formData.nationality]);


  const handleRegisterClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const isValid = validateForm();

    if (!formData.acceptTerms) {
      setErrors((prev) => ({
        ...prev,
        acceptTerms: texts[language].acceptTermsError ?? "กรุณายอมรับนโยบายความเป็นส่วนตัว",
      }));
    }

    if (isValid) {
      window.scrollTo(0, 0);
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  };


  const handleConfirmRegistration = () => {
    console.log("fsdsd", formData)
  };

  const titleOptions = {
    TH: [
      { value: "mr", label: "นาย" },
      { value: "mrs", label: "นาง" },
      { value: "miss", label: "นางสาว" },
    ],
    ENG: [
      { value: "mr", label: "Mr." },
      { value: "mrs", label: "Mrs." },
      { value: "miss", label: "Miss" },
    ],
  };

  const preventThaiInput = (event: { key: string; preventDefault: () => void }) => {
    const thaiPattern = /[\u0E00-\u0E7F]/; // ตรวจสอบตัวอักษรภาษาไทย
    if (thaiPattern.test(event.key)) {
      event.preventDefault();
    }
  };


  return (
    <div className="flex min-h-screen relative bg-[#FFFFFF]">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <button
          className={`px-3 py-1 text-sm font-medium ${language === "TH" ? "text-[#008A90] font-bold" : "text-gray-500"}`}
          onClick={() => setLanguage("TH")}
        >
          TH
        </button>
        <span className="text-gray-400"> | </span>
        <button
          className={`px-3 py-1 text-sm font-medium ${language === "ENG" ? "text-[#008A90] font-bold" : "text-gray-500"}`}
          onClick={() => setLanguage("ENG")}
        >
          EN
        </button>
      </div>

      {/* Left Area: Background Image */}
      <div className="hidden md:block w-1/2 fixed h-screen">
        <Image
          src={language === "ENG" ? "/logo_ict_en.png" : "/logo_ict_th.png"}
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
            {isPopupOpen ? texts[language].confirmRegister : texts[language].registerTitle}
          </h2>
          <form className="flex flex-col gap-4">
            {/* Nationality */}
            <div className="relative w-full">
              <CustomSelect
                label={texts[language].nationality}
                options={nationalities}
                value={formData.nationality}
                onChange={(selectedOption) => handleChange("nationality", selectedOption?.value || null)}
                placeholder={texts[language].selectNationality}
              />
            </div>

            {/* ID Document */}
            <div className="w-full space-y-2">
              <label className="block text-[#565656]">{texts[language].idDocument} <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap items-center gap-x-1">
                {/* หมายเลขบัตรประชาชน */}
                <label className={`flex items-center whitespace-nowrap ${formData.nationality !== "Thai" ? "text-[#C4C4C4]" : "text-[#565656]"}`}>
                  <input
                    type="radio"
                    name="id_type"
                    value="citizen"
                    checked={formData.nationality === "Thai" || formData.idType === "citizen"}
                    onChange={() => handleChange("idType", "citizen")}
                    disabled={formData.nationality !== "Thai"}
                    className="mr-1"
                  />

                  {texts[language].idCard}
                </label>

                <label className={`flex items-center whitespace-nowrap ${formData.nationality === "Thai" ? "text-[#C4C4C4]" : "text-[#565656]"}`}>
                  <input
                    type="radio"
                    name="id_type"
                    value="passport"
                    checked={formData.nationality !== "Thai" || formData.idType === "passport"}
                    onChange={() => handleChange("idType", "passport")}
                    disabled={formData.nationality === "Thai"}
                    className="mr-1"
                  />

                  {texts[language].passport} {/* เปลี่ยนตามภาษา */}
                </label>
              </div>

              <FormField
                /*เพิ่มกรณีชาวต่างชาติ เป็นหมายเลขพาสปอร์ต */
                label={formData.idType === "citizen" ? texts[language].idCard : texts[language].passport}
                value={formData.idNumber}
                onChange={(value) =>
                  handleChange(
                    "idNumber",
                    formData.idType === "citizen"
                      ? formatIdCard(value.replace(/\D/g, "")) // ใช้ formatIdCard
                      : value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 13).toUpperCase() // สำหรับพาสปอร์ต (อักษร + ตัวเลข)
                  )
                }
                error={errors.idNumber}
                placeholder={texts[language].enterId}
                required
              />
            </div>

            {/* Title */}
            <div className="relative w-full">
              <CustomSelect
                label={texts[language].title} // เปลี่ยน label ตามภาษา
                options={titleOptions[language] || []} // ตรวจสอบให้แน่ใจว่า `options` ไม่เป็น undefined
                value={formData.title}
                onChange={(selectedOption: SingleValue<{ value: string; label: string }> | null) =>
                  handleChange("title", selectedOption ? selectedOption.value : null)
                }
                placeholder={texts[language].selectTitle} // เปลี่ยน placeholder ตามภาษา
                width="224px"
                error={errors.title}
              />
            </div>

            {/* Thai Name: แสดงเฉพาะกรณีที่สัญชาติเป็นไทย */}
            {formData.nationality === "Thai" && (
              <div className="relative flex gap-3 w-full">
                <FormField
                  label={texts[language].firstNameThaiLabel} // Label เปลี่ยนตามภาษา
                  placeholder={texts[language].firstNameThaiPlaceholder} // Placeholder เปลี่ยนตามภาษา
                  value={formData.firstNameThai}
                  onChange={(value) => handleChange("firstNameThai", validateThaiCharacters(value))}
                  error={errors.firstNameThai}
                  required
                />
                <FormField
                  label={texts[language].lastNameThaiLabel} // Label เปลี่ยนตามภาษา
                  placeholder={texts[language].lastNameThaiPlaceholder} // Placeholder เปลี่ยนตามภาษา
                  value={formData.lastNameThai}
                  onChange={(value) => handleChange("lastNameThai", value)}
                  error={errors.lastNameThai}
                  required
                />
              </div>
            )}


            {/* English Name */}
            <div className="relative flex gap-3 w-full">
              <FormField
                label={texts[language].firstNameEngLabel}
                value={formData.firstNameEnglish}
                onChange={(value) => handleChange("firstNameEnglish", validateEnglishCharacters(value))}
                error={errors.firstNameEnglish}
                placeholder={texts[language].firstNameEngPlaceholder}
                required
              />
              <FormField
                label={texts[language].lastNameEngLabel}
                value={formData.lastNameEnglish}
                onChange={(value) => handleChange("lastNameEnglish", validateEnglishCharacters(value))}
                error={errors.lastNameEnglish}
                placeholder={texts[language].lastnameEngPlaceholder}
                required
              />
            </div>

            {/* Email */}
            <FormField
              label={texts[language].email}
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
              onBlur={() => {
                if (formData.email && !validateEmail(formData.email)) {
                  setErrors((prev) => ({
                    ...prev,
                    email: texts[language].invalidEmail || "รูปแบบอีเมลไม่ถูกต้อง",
                  }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
                }
              }}
              error={errors.email}
              placeholder={texts[language].emailPlaceholder}
              type="email"
              required
            />

            {/* Password */}
            <div>
              <label className="block text-[#565656]">
                {texts[language].password} <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full min-w-[460px] max-w-md">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onKeyDown={preventThaiInput}
                  onBlur={() => {
                    const errorsArray = validatePassword(formData.password, true, language);
                    setErrors((prev) => ({
                      ...prev,
                      password: errorsArray.length > 0 ? errorsArray[0] : "",
                    }));
                  }}

                  className={`w-full p-2 border 
        ${errors.password ? "border-red-500" : "border-[#C4C4C4]"} 
        text-[#565656] rounded-[10px] hover:border-[#A3A3A3] 
        focus:border-[#A3A3A3] focus:ring-0 outline-none transition duration-200 
        mt-1 pr-12 min-h-[44px]`}
                  placeholder={texts[language].passwordPlaceholder}
                />

                {/* ปุ่ม Hide/Unhide อยู่ตรงกลาง */}
                <button
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center justify-center text-gray-500 h-full w-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Image
                    src={showPassword ? "/images/Hide_Password.svg" : "/images/Unhide_Password.svg"}
                    alt="แสดง/ซ่อนรหัสผ่าน"
                    width={24}
                    height={24}
                  />
                </button>

              </div>

              {/* Error Message */}
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 error-message">
                  {errors.password}
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
                {texts[language].passwordInfo} {/* เปลี่ยนข้อความตามภาษา */}
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[#565656]">
                {texts[language].confirmPassword} <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full min-w-[460px] max-w-md">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  onKeyDown={preventThaiInput} // ป้องกันภาษาไทย
                  onBlur={() => {
                    const confirmPasswordError = validateConfirmPassword(
                      formData.password,
                      formData.confirmPassword,
                      language
                    );
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
                  placeholder={texts[language].confirmPasswordPlaceholder}
                />

                {/* ปุ่ม Hide/Unhide อยู่กลางเป๊ะ */}
                <button
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center justify-center text-gray-500 h-full w-10"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Image
                    src={showConfirmPassword ? "/images/Hide_Password.svg" : "/images/Unhide_Password.svg"}
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
                {texts[language].passwordInfo} {/* เปลี่ยนข้อความตามภาษา */}
              </p>

            </div>

            {/* Checkbox ยอมรับนโยบายความเป็นส่วนตัว */}
            <div className="mt-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleChange("acceptTerms", e.target.checked)}
                  className="w-5 h-5 accent-[#008A90] border-gray-300 rounded focus:ring-[#008A90] mt-1"
                />
                <label htmlFor="acceptTerms" className="ml-2 text-[#565656] text-sm leading-6">
                  {texts[language].acceptTerms_1}{" "}
                  <a href="/privacy-policy" className="text-[#008A90] underline">
                    {texts[language].privacyPolicy}
                  </a>{" "}
                  {texts[language].acceptTerms_2}
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>
              )}
            </div>

            {/* Register Button */}
            <div className={`mt-${formData.nationality !== "Thai" ? "10" : "0.5"}`}>
              <button
                disabled={isPopupOpen}
                onClick={handleRegisterClick}
                className="w-[200px] bg-[#008A90] text-white py-3 px-6 rounded-[10px] font-medium hover:bg-[#00757a] transition mx-auto block"
              >
                {texts[language].register} {/* เปลี่ยนข้อความตามภาษา */}
              </button>
            </div>


            {/* Login Link */}
            <div className="text-center mt-0.5">
              <span className="text-[#475467]">{texts[language].alreadyAccount}</span>
              <a href="/login" className="text-[#008A90] font-semibold ml-2 hover:underline">
                {texts[language].login}
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