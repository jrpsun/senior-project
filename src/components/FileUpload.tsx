'use client';
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError("Only PDF files under 5MB are allowed.");
      return;
    }

    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setError("");
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-teal-500 w-full max-w-4xl p-6 text-center cursor-pointer rounded-lg"
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-teal-500 mx-auto mb-2" />
        <p className="text-teal-600 font-semibold">
          <span className="text-teal-700 underline">Choose</span> or Drag file
        </p>
        <p className="text-gray-500 text-sm mt-1">
          File Type <strong>.pdf</strong>, size not exceed <strong>5MB</strong>
        </p>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {file && <p className="text-teal-600 mt-2">Selected: {file.name}</p>}
    </div>
  );
}
