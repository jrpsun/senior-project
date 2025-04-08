'use client';
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../../../hooks/LanguageContext"; // Import Hook สำหรับการเลือกภาษา
import { generalInfoTexts } from "../../../../../translation/generalInfo";
import { GeneralInfoInterface } from "@components/types/generalInfoType";
import ReportProb from "@components/components/common/admin/reportProb";

/*interface PersonalInfoProps {
    profileImage: string;
    nationality: string;
    prefix: string;
    firstName: string;
    middleName: string;
    lastName: string;
    firstNameEng: string;
    middleNameEng: string;
    lastNameEng: string;
    nickname: string;
    nicknameEng: string;
    idCardCopy?: { name: string; size: string; url: string };
    passportCopy?: { name: string; size: string; url: string };
    idCardNumber: string;
    idCardExpiry: string;
    passportNumber: string;
    passportExpiry: string;
    birthDate: string;
    age: string;
    gender: string;
    houseRegCopy?: { name: string; size: string; url: string };
    //  ฟิลด์สำหรับที่อยู่ประเทศไทย
    houseNumber: string;
    moo: string;
    alley: string;
    street: string;
    village: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
    country: string;
    // ฟิลด์สำหรับที่อยู่ต่างประเทศ
    addressLine1?: string;  // ที่อยู่บรรทัดที่ 1
    addressLine2?: string;  // ที่อยู่บรรทัดที่ 2
    stateProvince?: string; // รัฐ/จังหวัด/ภูมิภาค
    city?: string;          // เมือง
}*/

interface PersonalInfoProps {
    props: GeneralInfoInterface;
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
}

const PersonalInfoSummary: React.FC<PersonalInfoProps> = ({ props, isVisible, setIsVisible }) => {
    const { language } = useLanguage(); // ดึงภาษาปัจจุบันจาก Context
    const texts = generalInfoTexts[language] ?? generalInfoTexts["ENG"];

    return (
        <div className="flex justify-center flex-col py-5 bg-[white] ml-[25px]">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
                <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6">{texts.titlePersonalInfo}</h2>

                    {/* รูปภาพ */}
                    <div className="mb-4">
                        <p className="text-[#565656] font-bold">{texts.uploadImage}</p>
                        <img src={`${props?.applicantPicture}`} alt="Profile" className="w-32 h-32 rounded-md object-cover" />
                    </div>

                    {/* ข้อมูลส่วนตัว */}
                    <div className="mb-4">
                        <p className="text-[#565656] font-bold">{texts.title}</p>
                        <p className="text-[#565656] text-left pl-6">{props?.prefix}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                        <div>
                            <p className="text-[#565656] font-bold">{texts.firstName}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.firstnameTH}</p>
                        </div>
                        <div>
                            <p className="text-[#565656] font-bold">{texts.middleName}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.middlenameTH}</p>
                        </div>
                        <div>
                            <p className="text-[#565656] font-bold">{texts.lastName}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.lastnameTH}</p>
                        </div>
                        <div>
                            <p className="text-[#565656] font-bold">{texts.nickname}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.nicknameTH}</p>
                        </div>

                        <div>
                            <p className="text-[#565656] font-bold">{texts.firstNameEng}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.firstnameEN}</p>
                        </div>
                        <div>
                            <p className="text-[#565656] font-bold">{texts.middleNameEng}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.middlenameEN}</p>
                        </div>
                        <div>
                            <p className="text-[#565656] font-bold">{texts.lastNameEng}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.lastnameEN}</p>
                        </div>
                        <div>
                            <p className="text-[#565656] font-bold">{texts.nicknameEng}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.nicknameEN}</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="text-[#565656] font-bold">{texts.nationality}</p>
                        <p className="text-[#565656] text-left pl-6">{props?.nationality}</p>
                    </div>

                    {/*สำเนาบัตรประชาชน */}
                    {props?.docCopyIdCardName && (
                        <div className="mb-4">
                            <h3 className="text-[#565656] font-semibold">{texts.uploadIdCard}</h3>
                            <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                            <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-4 shadow-sm">
                                <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                                <div className="flex flex-col">
                                    <a
                                        href={props?.docCopyIdCard}
                                        download
                                        className="text-[#008A90] font-medium hover:underline truncate max-w-[250px] md:max-w-[400px] inline-block"
                                        title={props?.docCopyIdCardName}
                                    >
                                        {props?.docCopyIdCardName}
                                    </a>
                                    <span className="text-[#565656] text-xs md:text-sm">{props?.docCopyIdCardSize}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* กรณีเป็นชาวต่างชาติ แสดงสำเนาพาสปอร์ต */}
                    {props?.nationality !== "Thai" && props?.docCopyPassportName && (
                        <div className="mb-4">
                            <h3 className="text-[#565656] font-semibold">{texts.uploadPassport}</h3>
                            <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                            <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-4 shadow-sm">
                                <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                                <div className="flex flex-col">
                                    <a href={props?.docCopyHouseRegis}
                                        download
                                        className="text-[#008A90] font-medium hover:underline truncate max-w-[250px] md:max-w-[400px] inline-block"
                                        title={props?.docCopyPassportName}>
                                        {props?.docCopyPassportName}
                                    </a>
                                    <span className="text-[#565656] text-xs md:text-sm">{props?.docCopyPassportSize}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ข้อมูลบัตรประชาชน หรือ พาสปอร์ต */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-6">
                        {props?.nationality === "ไทย" || props?.nationality === "Thai" ? (
                            <>
                                {/* กรณีเป็นคนไทย แสดงเลขบัตรประชาชน */}
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.idCardNumber}</p>
                                    <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                                    <p className="text-[#565656] text-left pl-6">{props?.idCardNumber || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.idCardExpiry}</p>
                                    <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                                    <p className="text-[#565656] text-left pl-6">{props?.idCardExpDate || "-"}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* กรณีเป็นชาวต่างชาติ แสดงเลขพาสปอร์ต */}
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.passportNumber}</p>
                                    <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                                    <p className="text-[#565656] text-left pl-6">{props?.passportId || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.passportExpiry}</p>
                                    <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                                    <p className="text-[#565656] text-left pl-6">{props?.passportExpDate || "-"}</p>
                                </div>
                            </>
                        )}

                        {/* วันเกิด แสดงเหมือนกันทั้งไทยและต่างชาติ */}
                        <div>
                            <p className="text-[#565656] font-bold">{texts.birthDate}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.birthDate || "-"}</p>
                        </div>
                    </div>
                    {/* อายุและเพศ */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-6">
                        <div className="flex-1">
                            <p className="text-[#565656] font-bold">{texts.age}</p>
                            <p className="text-[#565656] text-left pl-6">{props?.age}</p> {/* TODO: some func to cal age*/}
                        </div>
                        <div className="flex-1">
                            <p className="text-[#565656] font-bold">{texts.gender}</p>
                            <p className="text-[#565656] text-left pl-2">{props?.gender}</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3 mt-[15px]">
                <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
                    <h2 className="text-2xl text-[#008A90] font-semibold mt-6">{texts.titleAddress}</h2>
                    <div className="mb-4">
                        <p className="text-[#565656] font-bold">{texts.country}</p>
                        <p className="text-[#565656] text-left pl-6">{props?.country}</p>
                    </div>

                    {/* 🔹 สำเนาทะเบียนบ้าน */}
                    {props?.docCopyHouseRegisName && (
                        <div className="mb-4">
                            <h3 className="text-[#565656] font-semibold">{texts.uploadHouseReg}</h3>
                            <ReportProb isVisible={isVisible} setIsVisible={setIsVisible}/>
                            <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-4 shadow-sm">
                                <img src="/images/summary/doc_icon.svg" alt="Document Icon" className="w-6 h-6 md:w-7 md:h-7" />
                                <div className="flex flex-col">
                                    <a
                                        href={props?.docCopyHouseRegis}
                                        download
                                        className="text-[#008A90] font-medium hover:underline truncate max-w-[250px] md:max-w-[400px] inline-block"
                                        title={props?.docCopyHouseRegisName}
                                    >
                                        {props?.docCopyHouseRegisName}
                                    </a>
                                    <span className="text-[#565656] text-xs md:text-sm">{props?.docCopyHouseRegisSize}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ข้อมูลที่อยู่ */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-4">
                        {props?.country === "ไทย" || props?.country === "TH" ? (
                            <>
                                {/* กรณีอยู่ในประเทศไทย */}
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.houseNumber}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.houseNumber || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.moo}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.moo || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.village}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.village || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.alley}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.soi || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.street}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.street || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.subDistrict}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.subDistrict || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.district}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.district || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.province}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.province || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.postalCode}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.postalCode || "-"}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* กรณีอยู่ต่างประเทศ */}
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.addressLine1}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.addr1 || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.addressLine2}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.addr2 || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.stateProvince}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.province || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.city}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.city || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-[#565656] font-bold">{texts.postalCode}</p>
                                    <p className="text-[#565656] text-left pl-6">{props?.postalCode || "-"}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoSummary;
