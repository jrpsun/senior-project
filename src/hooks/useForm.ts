import { useState, useEffect } from "react";
import { validateEmail, validatePassword, validateConfirmPassword } from "../utils/validation";

interface FormData {
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  nationality: string | null;
  language: string;
  idType: string;
  idNumber: string;
  firstNameThai: string;
  lastNameThai: string;
  firstNameEnglish: string;
  lastNameEnglish: string;
  email: string;
  title: string | null;
}

interface FormErrors {
  [key: string]: string;
}

const texts: { [key: string]: { [key: string]: string } } = {
  TH: {
    nationalityError: "กรุณาเลือกสัญชาติ",
    titleError: "กรุณาเลือกคำนำหน้า",
    firstNameThaiError: "กรุณากรอกชื่อจริง (ไทย)",
    lastNameThaiError: "กรุณากรอกนามสกุล (ไทย)",
    firstNameEnglishError: "กรุณากรอกชื่อจริง (อังกฤษ)",
    lastNameEnglishError: "กรุณากรอกนามสกุล (อังกฤษ)",
    emailError: "กรุณากรอกอีเมล",
    emailInvalid: "รูปแบบอีเมลไม่ถูกต้อง",
    idNumberError: "กรุณากรอกหมายเลขบัตรประชาชน/พาสปอร์ต",
    passwordError: "กรุณากรอกรหัสผ่าน",
    passwordShort: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
    confirmPasswordError: "กรุณากรอกยืนยันรหัสผ่าน",
    confirmPasswordMismatch: "รหัสผ่านไม่ตรงกัน",
    acceptTermsError: "กรุณายอมรับนโยบายความเป็นส่วนตัว",
  },
  ENG: {
    nationalityError: "Please select nationality",
    titleError: "Please select a title",
    firstNameThaiError: "Please enter your first name (Thai)",
    lastNameThaiError: "Please enter your last name (Thai)",
    firstNameEnglishError: "Please enter your first name (English)",
    lastNameEnglishError: "Please enter your last name (English)",
    emailError: "Please enter an email",
    emailInvalid: "Invalid email format",
    idNumberError: "Please enter your ID number / passport number",
    passwordError: "Please enter a password",
    passwordShort: "Password must be at least 8 characters long",
    confirmPasswordError: "Please confirm your password",
    confirmPasswordMismatch: "Passwords do not match",
    acceptTermsError: "Please accept the privacy policy",
  },
};

export const useForm = (initialState: FormData, language: "TH" | "ENG") => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof FormData, value: string | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" })); 
  };

  useEffect(() => {
    setErrors(prevErrors => {
      const updatedErrors: FormErrors = {};
      Object.keys(prevErrors).forEach((key) => {
        if (prevErrors[key]) {
          updatedErrors[key] = texts[language][`${key}Error`] ?? prevErrors[key];
        }
      });
      return updatedErrors;
    });
  }, [language]);
  
  
  /** ตรวจสอบความถูกต้องของรหัสผ่าน */
  const validatePasswords = (): FormErrors => {
    const newErrors: FormErrors = {};

    const passwordErrors = validatePassword(formData.password ?? "", true, language);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0]; 
    }

    const confirmPasswordError = validateConfirmPassword(formData.password ?? "", formData.confirmPassword ?? "", language);
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    return newErrors;
  };

  /** ตรวจสอบความถูกต้องของแบบฟอร์มทั้งหมด */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nationality) newErrors.nationality = texts[language].nationalityError;
    if (!formData.title) newErrors.title = texts[language].titleError;

    if (formData.nationality === "TH") {
      if (!formData.firstNameThai.trim()) newErrors.firstNameThai = texts[language].firstNameThaiError;
      if (!formData.lastNameThai.trim()) newErrors.lastNameThai = texts[language].lastNameThaiError;
    }

    if (!formData.firstNameEnglish.trim()) newErrors.firstNameEnglish = texts[language].firstNameEnglishError;
    if (!formData.lastNameEnglish.trim()) newErrors.lastNameEnglish = texts[language].lastNameEnglishError;

    if (!formData.email.trim()) {
      newErrors.email = texts[language].emailError;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = texts[language].emailInvalid;
    }

    if (!formData.idNumber.trim()) newErrors.idNumber = texts[language].idNumberError;
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = texts[language].acceptTermsError;
    }
    
    // ตรวจสอบรหัสผ่าน
    const passwordErrors = validatePasswords();
    setErrors({ ...newErrors, ...passwordErrors });

    return Object.keys({ ...newErrors, ...passwordErrors }).length === 0;
  };

  return {
    formData,
    errors,
    setErrors,
    handleChange,
    validateForm,
  };
};
