"use client";
import React, { useState, useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload } from "lucide-react";
import { useLanguage } from "../../hooks/LanguageContext";

interface FileMultiUploadProps {
  label: string;
  onChange: (files: File[]) => void;
  fileType?: string;
  maxSize?: string;
  recommendedSize?: string;
  accept?: string;
  infoMessage?: React.ReactNode;
  required?: boolean;
}

const FileMultiUpload: React.FC<FileMultiUploadProps> = ({
  label,
  onChange,
  fileType = "PDF",
  maxSize = "5 MB",
  accept = ".pdf",
  infoMessage,
  required = true,
}) => {
  const { language } = useLanguage();
  const [file, setFile] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // ตรวจสอบว่าภาษาที่เลือกมีอยู่ใน `translations` หรือไม่
  const selectedLanguage = ["TH", "ENG"].includes(language) ? language : "ENG";

  const translations = React.useMemo(() => ({
    TH: {
      selectFile: "เลือกไฟล์อัปโหลด หรือ ลากวาง",
      fileType: "ไฟล์ประเภท",
      maxSize: "ขนาดไม่เกิน",
      recommendedSize: "ขนาดแนะนำ: ",
      errorFileType: "ประเภทไฟล์ไม่รองรับ! กรุณาอัปโหลดไฟล์ที่ถูกต้อง.",
      errorFileSize: "ไฟล์ต้องมีขนาดไม่เกิน 5 MB.",
    },
    ENG: {
      selectFile: "Select a file to upload or drag and drop",
      fileType: "File Type",
      maxSize: "Maximum size",
      recommendedSize: "Recommended size: ",
      errorFileType: "Invalid file type! Please upload a valid file.",
      errorFileSize: "File must not exceed 5 MB.",
    },
  }), []);

  const allowedExtensions = accept.replace(/\./g, "").split(", ");
  const maxFileSize = 5 * 1024 * 1024; // 5 MB
  const mimeTypes = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
  };

  // แปลง `accept` ให้เป็น Object ที่รองรับ `useDropzone`
  const acceptedMimeTypes = accept.split(", ").reduce((acc, ext) => {
    const cleanExt = ext.replace(".", "").toLowerCase();
    if (cleanExt in mimeTypes) {
      if (cleanExt in mimeTypes) {
        acc[mimeTypes[cleanExt as keyof typeof mimeTypes]] = [`.${cleanExt}`];
      }
    }
    return acc;
  }, {} as { [key: string]: string[] });



  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      setError(translations[selectedLanguage].errorFileType);
      return;
    }
  
    // ตรวจสอบทีละไฟล์
    const validFiles = acceptedFiles.filter((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      return ext && allowedExtensions.includes(ext) && file.size <= maxFileSize;
    });
  
    if (validFiles.length === 0) {
      setError(translations[selectedLanguage].errorFileType);
      return;
    }

    setError("");
    onChange(validFiles); // <-- ส่งทั้งหมด
  }, [onChange, selectedLanguage, allowedExtensions, maxFileSize, translations]);


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedMimeTypes,
    maxSize: maxFileSize,
    multiple: true,
  });


  return (
    <div className="mb-6">
      <label className="block text-[#565656] font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {infoMessage && (
        <div className="flex items-start gap-2 text-sm text-[#B3B3B3] mb-2">
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 whitespace-nowrap"
          >
            <path
              d="M10.0804 0.0176134C4.55191 0.003686 0.044976 4.46514 0.0137688 9.98192C-0.0174547 15.5105 4.42992 20.0035 9.94663 20.0175C15.4752 20.0314 19.9821 15.5699 20.0133 10.0531C20.0563 4.52454 15.5971 0.0315615 10.0804 0.0176134ZM9.93497 2.71126C10.4193 2.71041 10.8207 2.8869 11.151 3.2289C11.4931 3.55907 11.658 3.97224 11.6573 4.45658C11.6566 4.94092 11.4907 5.34285 11.1476 5.68604C10.8164 6.01738 10.4027 6.18349 9.9302 6.18432C9.43405 6.18519 9.03263 6.02051 8.6905 5.69035C8.36019 5.36016 8.18356 4.94701 8.18422 4.46267C8.1849 3.96652 8.36265 3.56456 8.70569 3.23319C9.03693 2.89003 9.45063 2.71211 9.93497 2.71126ZM7.10548 7.19339L11.7008 7.18533L11.689 15.7499L13.0712 15.7474L13.0696 16.8461L7.0922 16.8565L7.09371 15.7579L8.46403 15.7555L8.47429 8.28961L7.10397 8.29202L7.10548 7.19339Z"
              fill="#008A91"
            />
          </svg>
          <div className="flex-1">{infoMessage}</div>
        </div>
      )}

      <div {...getRootProps()} className="border-2 border-dashed border-[#008A90] p-6 flex flex-col items-center justify-center w-full h-32 cursor-pointer">
        <input {...getInputProps()} />
        <Upload className="text-[#008A90] w-6 h-6" />
        <span className="text-[#008A90] mt-2 font-medium">
          {translations[selectedLanguage]?.selectFile ?? "Select a file to upload or drag and drop"}
        </span>
        <p className="text-[#B3B3B3] text-sm mt-1">
          {translations[selectedLanguage]?.fileType ?? "File Type"} &nbsp;
          {fileType}, &nbsp;
          {translations[selectedLanguage]?.maxSize ?? "Maximum size"} &nbsp;
          {maxSize}
        </p>

      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {/* {file && (
        <div className="flex justify-center items-center mt-2">
          <p className="text-[#008A90] text-center">
            <a
              href={fileUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {file.name}
            </a>
          </p>
        </div>
      )} */}
    </div>
  );
};

export default FileMultiUpload;
