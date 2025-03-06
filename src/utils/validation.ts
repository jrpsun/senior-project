export const validateEmail = (value: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(value);
};

export const validateThaiCharacters = (value: string): string => {
  return value.replace(/[^ก-๙\s]/g, "");
};

export const validateEnglishCharacters = (value: string): string => {
  return value.replace(/[^a-zA-Z\s]/g, "");
};

export const formatIdCard = (id: string) => {
  const cleaned = id.replace(/\D/g, "").slice(0, 13);
  return cleaned.replace(/^(\d{1,1})(\d{0,4})(\d{0,5})(\d{0,2})(\d{0,1})$/, 
      (_match, p1, p2, p3, p4, p5) => {
          let formatted = p1;
          if (p2) formatted += `-${p2}`;
          if (p3) formatted += `-${p3}`;
          if (p4) formatted += `-${p4}`;
          if (p5) formatted += `-${p5}`;
          return formatted;
      }
  );
};

export const preventThaiInput = (event: KeyboardEvent | React.KeyboardEvent<HTMLInputElement>) => {
  const thaiPattern = /[\u0E00-\u0E7F]/;
  if (thaiPattern.test(event.key)) {
      event.preventDefault();
  }
};

export const preventEnglishInput = (event: KeyboardEvent | React.KeyboardEvent<HTMLInputElement>) => {
  const thaiPattern = /[\u0E00-\u0E7F]/;
  if (thaiPattern.test(event.key)) {
    event.preventDefault();
  }
};

/** ตรวจสอบรหัสผ่าน และรองรับการเปลี่ยนภาษา */
export const validatePassword = (value: string, isTouched: boolean, language: "TH" | "ENG" = "ENG"): string[] => {
  if (!language) language = "ENG"; // ป้องกัน undefined language
  const errors: string[] = [];
  const texts = {
      TH: {
          empty: "กรุณากรอกรหัสผ่าน",
          short: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
          onlyEnglish: "รหัสผ่านต้องเป็นภาษาอังกฤษเท่านั้น",
          invalidChars: "รหัสผ่านสามารถใช้เฉพาะ A-Z, a-z, 0-9 และ *!#&@$ เท่านั้น"
      },
      ENG: {
          empty: "Please enter a password",
          short: "Password must be at least 8 characters long",
          onlyEnglish: "Password must be in English only",
          invalidChars: "Password can only contain A-Z, a-z, 0-9, and *!#&@$"
      }
  };

  if (!value && isTouched) errors.push(texts[language].empty);
  if (value.length < 8) errors.push(texts[language].short);
  if (/[\u0E00-\u0E7F]/.test(value)) errors.push(texts[language].onlyEnglish);
  if (!/^[a-zA-Z0-9*!#&@._]+$/.test(value)) errors.push(texts[language].invalidChars);

  return errors; // ตอนนี้รีเทิร์นค่า errors ถูกต้องแล้ว
};

/** ตรวจสอบการยืนยันรหัสผ่าน และรองรับการเปลี่ยนภาษา */
export const validateConfirmPassword = (password: string = "", confirmPassword: string = "", language: "TH" | "ENG" = "ENG"): string | null => {
  if (!language) language = "ENG"; // ป้องกัน undefined language
  const texts = {
      TH: {
          empty: "กรุณากรอกยืนยันรหัสผ่าน",
          short: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
          mismatch: "รหัสผ่านไม่ตรงกัน"
      },
      ENG: {
          empty: "Please confirm your password",
          short: "Password must be at least 8 characters long",
          mismatch: "Passwords do not match"
      }
  };

  if (!confirmPassword.trim()) return texts[language].empty;
  if (confirmPassword.length < 8) return texts[language].short;
  if (password.length >= 8 && confirmPassword !== password) return texts[language].mismatch;
  
  return null;
};


export const allowOnlyNumbers = (value: string): string => value.replace(/\D/g, ""); // รับเฉพาะตัวเลข 0-9
export const allowHouseNumber = (value: string): string => value.replace(/[^0-9/.]/g, ""); // รับตัวเลข + . และ /

export const preventNonNumericInput = (event: KeyboardEvent | React.KeyboardEvent<HTMLInputElement>) => {
  if (!/^[0-9]$/.test(event.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(event.key)) {
    event.preventDefault();
  }
};

export const preventNonHouseNumberInput = (event: KeyboardEvent | React.KeyboardEvent<HTMLInputElement>) => {
  if (!/^[0-9/.]$/.test(event.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(event.key)) {
    event.preventDefault();
  }
};
export const formatPhoneNumber = (value: string): string => {
  // ลบอักขระที่ไม่ใช่ตัวเลขทั้งหมด และจำกัดความยาวสูงสุดที่ 10 ตัว
  const cleaned = value.replace(/\D/g, "").slice(0, 10);
  
  // จัดรูปแบบให้อยู่ในรูปแบบ XXX-XXX-XXXX
  if (cleaned.length > 6) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length > 3) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }

  return cleaned;
};

export const allowEnglishAndSpecialCharactersOnly = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9\-_\.@]/g, "");
};

