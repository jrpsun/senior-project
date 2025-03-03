import { useState } from "react";
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

export const useForm = (initialState: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" })); // ล้าง error ของช่องนั้นๆ
  };

  /** ตรวจสอบความถูกต้องของฟิลด์รหัสผ่าน */
  const validatePasswords = () => {
    const newErrors: FormErrors = {};

    // ตรวจสอบว่ารหัสผ่านถูกกรอกหรือไม่
    if (!formData.password.trim()) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else {
      const passwordErrors = validatePassword(formData.password, true); // Assuming isPasswordTouched is true
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors[0]; // แสดง Error แค่ข้อแรกที่ตรวจพบ
      }
    }

    // ตรวจสอบยืนยันรหัสผ่าน
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";
    } else {
      const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
      if (confirmPasswordError) {
        newErrors.confirmPassword = confirmPasswordError;
      }
    }

    return newErrors;
  };

  /** ตรวจสอบความถูกต้องของแบบฟอร์มทั้งหมด */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nationality) newErrors.nationality = "กรุณาเลือกสัญชาติ";
    if (!formData.title) newErrors.title = "กรุณาเลือกคำนำหน้า";

    if (formData.nationality === "TH") {
      if (!formData.firstNameThai.trim()) newErrors.firstNameThai = "กรุณากรอกชื่อจริง (ไทย)";
      if (!formData.lastNameThai.trim()) newErrors.lastNameThai = "กรุณากรอกนามสกุล (ไทย)";
    }

    if (!formData.firstNameEnglish.trim()) newErrors.firstNameEnglish = "กรุณากรอกชื่อจริง (อังกฤษ)";
    if (!formData.lastNameEnglish.trim()) newErrors.lastNameEnglish = "กรุณากรอกนามสกุล (อังกฤษ)";

    if (!formData.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (!formData.idNumber.trim()) newErrors.idNumber = "กรุณากรอกหมายเลขบัตรประชาชน/พาสปอร์ต";
    if (!formData.acceptTerms) newErrors.acceptTerms = "กรุณายอมรับนโยบายความเป็นส่วนตัว";

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
