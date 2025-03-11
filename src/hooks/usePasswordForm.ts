import { useState } from "react";
import { validatePassword, validateConfirmPassword } from "../utils/validation";

interface PasswordFormData {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

export const usePasswordForm = (language: "TH" | "ENG") => {
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof PasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" })); 
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = language === "TH" ? "กรุณากรอกรหัสผ่านปัจจุบัน" : "Please enter your current password";
    }

    const passwordErrors = validatePassword(formData.password, true, language);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0]; 
    }

    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword, language);
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    setErrors,
    handleChange,
    validateForm,
  };
};
