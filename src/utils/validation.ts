const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  thai: /[^ก-๙\s]/g,
  english: /[^a-zA-Z\s]/g,
  numeric: /\D/g,
  houseNumber: /[^0-9/.]/g,
};
const testScoreLimits = {
  IELTS: { min: 0, max: 9, step: 0.5, integerOnly: false },
  Duolingo: { min: 0, max: 160, step: 1, integerOnly: true },
  GED: { min: 0, max: 200, step: 1, integerOnly: true },
  TOEIC: { min: 0, max: 990, step: 1, integerOnly: true },
  SAT: { min: 0, max: 800, step: 10, integerOnly: true },
  TOEFL_IBT: { min: 0, max: 120, step: 1, integerOnly: true }, 
  TOEFL_ITP: { min: 0, max: 677, step: 1, integerOnly: true },
  TOEFL_PBT: { min: 0, max: 677, step: 1, integerOnly: true },
  AP_English: { min: 1, max: 5, step: 1, integerOnly: true },
  IB_HL: { min: 0, max: 7, step: 1, integerOnly: true },
  IB_SL: { min: 0, max: 7, step: 1, integerOnly: true },

  // Math Test Limits
  ACT_Math: { min: 1, max: 36, step: 1, integerOnly: true },
  AP_Calculus: { min: 1, max: 5, step: 1, integerOnly: true },
  IGCSE_Math: { min: 0, max: 100, step: 1, integerOnly: true }, 
  Gaokao_Math: { min: 0, max: 150, step: 1, integerOnly: true },
  IB_HL_CS: { min: 0, max: 7, step: 1, integerOnly: true },
  IB_HL_Math: { min: 0, max: 7, step: 1, integerOnly: true },
  IB_SL_CS: { min: 0, max: 7, step: 1, integerOnly: true },
  IB_SL_Math: { min: 0, max: 7, step: 1, integerOnly: true },
  SAT_Math: { min: 200, max: 800, step: 10, integerOnly: true },
};


export const validateEmail = (value: string) => patterns.email.test(value);
export const validateThaiCharacters = (value: string) => value.replace(patterns.thai, "");
export const validateEnglishCharacters = (value: string) => value.replace(patterns.english, "");


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

// ป้องกันการพิมพ์ภาษาไทย/อังกฤษ
export const preventThaiInput = (event: KeyboardEvent | React.KeyboardEvent<HTMLInputElement>) => {
  if (/[\u0E00-\u0E7F]/.test(event.key)) event.preventDefault();
};
export const preventEnglishInput = (event: KeyboardEvent | React.KeyboardEvent<HTMLInputElement>) => {
  if (!/[\u0E00-\u0E7F]/.test(event.key)) event.preventDefault();
};

const passwordTexts = {
  TH: { empty: "กรุณากรอกรหัสผ่าน", short: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร", mismatch: "รหัสผ่านไม่ตรงกัน" },
  ENG: { empty: "Please enter a password", short: "Password must be at least 8 characters long", mismatch: "Passwords do not match" },
};

export const validatePassword = (value: string, isTouched: boolean, lang: string = "ENG") => {
  const errors: string[] = [];
  
  // ตรวจสอบว่า lang มีค่า TH หรือ ENG เท่านั้น ถ้าไม่ใช่ให้ใช้ ENG
  const selectedLang = lang in passwordTexts ? lang as "TH" | "ENG" : "ENG";
  const texts = passwordTexts[selectedLang];

  if (!value.trim() && isTouched) {
    errors.push(texts.empty);
  } else if (value.length < 8) {
    errors.push(texts.short);
  }

  return errors;
};

export const validateConfirmPassword = (password = "", confirmPassword = "", lang: string = "ENG") => {
  const selectedLang = lang in passwordTexts ? lang as "TH" | "ENG" : "ENG";
  const texts = passwordTexts[selectedLang];

  if (!confirmPassword.trim()) return texts.empty;
  if (confirmPassword.length < 8) return texts.short;
  if (password !== confirmPassword) return texts.mismatch;
  
  return null;
};


export const allowOnlyNumbers = (value: string) => value.replace(patterns.numeric, "");
export const allowHouseNumber = (value: string) => value.replace(patterns.houseNumber, "");

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
export const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(patterns.numeric, "").slice(0, 10);
  return cleaned.length > 6 ? `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}` : 
         cleaned.length > 3 ? `${cleaned.slice(0, 3)}-${cleaned.slice(3)}` : cleaned;
};
export const allowEnglishAndSpecialCharactersOnly = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9\-_\.@]/g, "");
};
export const formatGPAValue = (value: string) => {
  let cleanedValue = value.replace(/[^0-9]/g, "");

  if (!cleanedValue) return "";

  // กรณีกรอก 0.xx ให้คงค่า 0 ไว้
  if (cleanedValue.startsWith("0") && cleanedValue.length > 1) {
    cleanedValue = "0" + cleanedValue.replace(/^0+/, "");
  } else if (cleanedValue.length === 1) {
    return cleanedValue; // คืนค่าเดี่ยวที่กรอกมา เช่น "0", "1", "2"
  }

  const formattedValue =
    cleanedValue.length > 1
      ? `${cleanedValue.slice(0, 1)}.${cleanedValue.slice(1, 3)}`
      : cleanedValue;

  if (parseFloat(formattedValue) > 4.0) return "4.00";

  return formattedValue;
};

export const validateCreditInput = (value: string) => {
  let sanitizedValue = value.replace(/[^0-9.]/g, ""); 
  const [integerPart, decimalPart] = sanitizedValue.split(".");
  if (decimalPart) {
    sanitizedValue = `${integerPart}.${decimalPart.slice(0, 1)}`;
  }
  const numericValue = parseFloat(sanitizedValue);
  if (isNaN(numericValue)) return "";
  if (numericValue > 100) return "100";

  return sanitizedValue;
};
export const validateTestScore = (value: string, testType: keyof typeof testScoreLimits) => {
  const limits = testScoreLimits[testType];
  if (!limits) return "";

  let sanitized = value.replace(/[^0-9.]/g, ""); 
  if (!sanitized) return ""; 

  const { max, step, integerOnly } = limits;

  sanitized = sanitized.startsWith(".") ? "0" + sanitized : sanitized;
  if (!integerOnly && sanitized.split(".").length > 2) return value.slice(0, -1);
  if (sanitized === "0.") return sanitized;

  const score = parseFloat(sanitized);
  if (isNaN(score)) return "";
  
  return score > max ? value.slice(0, -1) 
       : integerOnly ? Math.round(score).toString() 
       : sanitized.includes(".") && !sanitized.endsWith(".") 
       ? (Math.round(score / step) * step).toFixed(1) 
       : sanitized;
};

export const preventInvalidTestScoreInput = (event: KeyboardEvent | React.KeyboardEvent<HTMLInputElement>, value: string, testType: keyof typeof testScoreLimits) => {
  const limits = testScoreLimits[testType];
  if (!limits) return;

  const { max, integerOnly } = limits;
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

  if (allowedKeys.includes(event.key)) return;

  if (!/^[0-9.]$/.test(event.key)) {
    event.preventDefault();
    return;
  }

  // ถ้าเป็น integerOnly และกด ".", ให้ป้องกัน
  if (integerOnly && event.key === ".") {
    event.preventDefault();
    return;
  }

  // ถ้ากด "." แล้วมี "." อยู่แล้ว ห้ามกดซ้ำ
  if (!integerOnly && event.key === "." && value.includes(".")) {
    event.preventDefault();
    return;
  }

  // ตรวจสอบค่าหลังจากพิมพ์ ถ้าเกิน max ให้ป้องกัน
  const newValue = parseFloat(value + event.key);
  if (!isNaN(newValue) && newValue > max) {
    event.preventDefault();
  }
};
