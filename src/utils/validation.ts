// utils/validation.ts
export const validateEmail = (value: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(value);
  };
  
  export const validateThaiCharacters = (value: string): string => {
    return value.replace(/[^ก-๙\s]/g, ""); // Only allow Thai characters and spaces
  };
  
  export const validateEnglishCharacters = (value: string): string => {
    return value.replace(/[^a-zA-Z\s]/g, ""); // Only allow English characters and spaces
  };
  export const formatIdCard = (id: string) => {
    const cleaned = id.replace(/\D/g, "").slice(0, 13);
    return cleaned.replace(/^(\d{1,1})(\d{0,4})(\d{0,5})(\d{0,2})(\d{0,1})$/, 
      (_match: any, p1: any, p2: any, p3: any, p4: any, p5: any) => {
        let formatted = p1;
        if (p2) formatted += `-${p2}`;
        if (p3) formatted += `-${p3}`;
        if (p4) formatted += `-${p4}`;
        if (p5) formatted += `-${p5}`;
        return formatted;
      }
    );
  };
  export const preventThaiInput = (event: KeyboardEvent) => {
    const thaiPattern = /[\u0E00-\u0E7F]/; // ตัวอักษรภาษาไทย
    if (thaiPattern.test(event.key)) {
      event.preventDefault();
    }
  };
  
  export const validatePassword = (value: string, isPasswordTouched: boolean): string[] => {
    if (!value && isPasswordTouched) return ["กรุณากรอกรหัสผ่าน"];
    if (value.length < 8) return ["รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"];
    if (/[\u0E00-\u0E7F]/.test(value)) return ["รหัสผ่านต้องเป็นภาษาอังกฤษเท่านั้น"];
    if (!/^[a-zA-Z0-9*!#&@._]+$/.test(value)) return ["รหัสผ่านสามารถใช้เฉพาะ A-Z, a-z, 0-9 และ *!#&@$ เท่านั้น"];
    return [];
  };
  
  export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword.trim()) return "กรุณากรอกยืนยันรหัสผ่าน";
    if (confirmPassword.length < 8) return "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    if (password.length >= 8 && confirmPassword !== password) return "รหัสผ่านไม่ตรงกัน";
    return null;
};


  