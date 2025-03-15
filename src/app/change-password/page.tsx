"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../hooks/LanguageContext";
import { usePasswordForm } from "../../hooks/usePasswordForm";
import Navbar from "../../components/Navbar";
import Popup from "../../components/common/popup";
import { validatePassword, validateConfirmPassword, preventThaiInput } from "../../utils/validation";

const PasswordInput = ({
    label,
    value,
    onChange,
    onBlur,
    error,
    showPassword,
    setShowPassword,
    placeholder,
    infoMessage,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    error?: string;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    placeholder: string;
    infoMessage?: string;
}) => (
    <div>
        <label className="block text-[#565656]">
            {label} <span className="text-red-500">*</span>
        </label>
        <div className="relative w-full">
            <input
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                onKeyDown={preventThaiInput}
                className={`w-full p-2 border ${error ? "border-red-500" : "border-gray-300"} text-gray-700 rounded-lg mt-1 pr-12`}
                placeholder={placeholder}
            />
            <button
                type="button"
                className="absolute right-3 inset-y-0 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
            >
                <img
                    src={showPassword ? "/images/Hide_Password.svg" : "/images/Unhide_Password.svg"}
                    alt="Toggle Password Visibility"
                    width={24}
                    height={24}
                />
            </button>
        </div>

        {infoMessage && (
            <p className="text-[#B3B3B3] text-sm mt-1 flex items-center">
                <img src="/images/Info_Message.svg" alt="Info Icon" width={20} height={20} className="mr-2" />
                {infoMessage}
            </p>
        )}

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);


export default function ChangePassword() {
    const router = useRouter();
    const { language, setLanguage } = useLanguage();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isCheckingPassword, setIsCheckingPassword] = useState(false);
    const [isErrorPopupOpen, setErrorPopupOpen] = useState(false);

    const { formData, errors, setErrors, handleChange, validateForm } = usePasswordForm(language);

    const storedPassword = "Password123";

    const checkCurrentPassword = async (currentPassword: string) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(currentPassword === storedPassword);
            }, 1500);
        });
    };

    const texts = {
        TH: {
            passwordInfo: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
            confirmPasswordError: "รหัสผ่านไม่ตรงกัน",
            submit: "ตกลง",
            back: "กลับ",
            changePassword: "เปลี่ยนรหัสผ่าน",
        },
        ENG: {
            passwordInfo: "Password must be at least 8 characters long",
            confirmPasswordError: "Passwords do not match",
            submit: "Submit",
            back: "Back",
            changePassword: "Change Password",
        },
    };

    const currentTexts = texts[language] || texts["ENG"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCheckingPassword(true);

        const isCorrectPassword = await checkCurrentPassword(formData.currentPassword);

        if (!isCorrectPassword) {
            setErrors((prev) => ({
                ...prev,
                currentPassword: language === "TH"
                    ? "รหัสผ่านปัจจุบันไม่ถูกต้อง"
                    : "Incorrect current password",
            }));
            setIsCheckingPassword(false);
            setErrorPopupOpen(true);
            setIsCheckingPassword(false);
            return; // หยุดทำงานหากรหัสผ่านผิด
        }

        const isValid = validateForm();

        if (isValid) {
            setPopupOpen(true);
        }

        setIsCheckingPassword(false);
    };

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            <div className="pl-20 pt-4 text-sm text-gray-500">
                <button
                    onClick={() => router.push("/programs")}
                    className="text-gray-400 hover:text-[#008A90] hover:underline transition"
                >
                    {language === "TH" ? "หน้าแรก" : "Home"}
                </button>
                <span className="mx-1 text-gray-400">/</span>
                <span className="text-[#008A91] font-medium">
                    {currentTexts.changePassword}
                </span>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-10">
                <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">
                    {currentTexts.changePassword}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <PasswordInput
                        label={language === "TH" ? "รหัสผ่านปัจจุบัน" : "Current Password"}
                        value={formData.currentPassword}
                        onChange={(value) => handleChange("currentPassword", value)}
                        error={errors.currentPassword}
                        showPassword={showCurrentPassword}
                        setShowPassword={setShowCurrentPassword}
                        placeholder={language === "TH" ? "กรอกรหัสผ่านปัจจุบัน" : "Enter Current Password"}
                    />

                    <PasswordInput
                        label={language === "TH" ? "ตั้งค่ารหัสผ่านใหม่" : "New Password"}
                        value={formData.password}
                        onChange={(value) => handleChange("password", value)}
                        onBlur={() => {
                            const errorsArray = validatePassword(formData.password, true, language);
                            setErrors((prev) => ({
                                ...prev,
                                password: errorsArray.length > 0 ? errorsArray[0] : "",
                            }));
                        }}
                        
                        error={errors.password}
                        showPassword={showNewPassword}
                        setShowPassword={setShowNewPassword}
                        placeholder={language === "TH" ? "กรอกรหัสผ่านใหม่" : "Enter New Password"}
                        infoMessage={currentTexts.passwordInfo}
                    />

                    <PasswordInput
                        label={language === "TH" ? "ยืนยันรหัสผ่าน" : "Confirm Password"}
                        value={formData.confirmPassword}
                        onChange={(value) => handleChange("confirmPassword", value)}
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
                        error={errors.confirmPassword}
                        showPassword={showConfirmPassword}
                        setShowPassword={setShowConfirmPassword}
                        placeholder={language === "TH" ? "ระบุรหัสผ่านอีกครั้ง" : "Enter New Password again"}
                        infoMessage={currentTexts.passwordInfo}
                    />

                    <div className="flex justify-center gap-4 mt-6">
                        <button type="submit" className="px-8 py-3 bg-[#008A91] text-white rounded-lg" disabled={isCheckingPassword}>
                            {isCheckingPassword ? (language === "TH" ? "กำลังตรวจสอบ..." : "Checking...") : currentTexts.submit}
                        </button>

                    </div>
                </form>
            </div>

            <Popup type="successInfo" isOpen={isPopupOpen} onClose={() => router.push("/login")} />
            <Popup
    type="errorPasswordInfo"
    isOpen={isErrorPopupOpen}
    onClose={() => setErrorPopupOpen(false)}
/>
        </div>
    );
}
