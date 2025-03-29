"use client";

// ติดตั้ง datepicker ด้วย npm install react-datepicker และ npm install date-fns
// ติดตั้ง axios ด้วย npm install axios
// ใช้ Use Effect
import { useEffect, useState } from "react";
import { useLanguage } from "../../../hooks/LanguageContext";
import axios from "axios";
import { Upload } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import CustomSelect from "../../form/CustomSelect";
import FormField from "../../form/FormField";
import FileUpload from "../../form/FileUpload";
import { generalInfoTexts, genderOptions } from "../../../translation/generalInfo";
import { validateThaiCharacters, preventThaiInput, validateEnglishCharacters, preventEnglishInput, allowHouseNumber, allowOnlyNumbers, preventNonHouseNumberInput, preventNonNumericInput } from "../../../utils/validation";
import DateInput from "../../common/date";
import { GeneralInfoInterface } from "@components/types/generalInfoType";


const fetchData = async (url: string, isLocal: boolean = false) => {
  try {
    const response = isLocal ? await fetch(url) : await axios.get(url);
    if (isLocal && response instanceof Response) {
      return await response.json();
    }
    if (isLocal && response instanceof Response) {
      return await response.json();
    }
    if (!isLocal && 'data' in response) {
      return response.data;
    }
    throw new Error("Unexpected response format");
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return [];
  }
};

interface CountryOrNationality {
  alpha2?: string;
  English?: string;
  name?: string;
  enName?: string;
  Thai?: string;
}

const sortByLanguage = (data: CountryOrNationality[], lang: string, type: "country" | "nationality") => {
  return data
    .map((item) => ({
      value: type === "country" ? item.alpha2 : item.English, // ใช้ "alpha2" สำหรับประเทศ และ "English" สำหรับสัญชาติ
      label: lang === "TH" ? (type === "country" ? item.name : item.Thai) : (type === "country" ? item.enName : item.English),
    }))
    .filter((item) => item.label !== undefined)
    .sort((a, b) => a.label!.localeCompare(b.label!, lang === "TH" ? "th" : "en"));
};

interface PersonalInfoProps {
  data: GeneralInfoInterface;
  onChange: (data: any) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, onChange }) => {
  const { language } = useLanguage();
  const currentTexts = generalInfoTexts[language as keyof typeof generalInfoTexts] || generalInfoTexts["ENG"];
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
  const [nationalities, setNationalities] = useState<{ value: string; label: string }[]>([]);
  const [provinces, setProvinces] = useState<{ value: string; label: string }[]>([]);
  const [districts, setDistricts] = useState<{ value: string; label: string; province_id: string }[]>([]);
  const [subDistricts, setSubDistricts] = useState<{ value: string; label: string; postalCode: number; amphure_id: string }[]>([]);
  const [changedData, setChangedData] = useState({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newChangedData = { ...changedData, [field]: value };
    setChangedData(newChangedData);
    onChange(newChangedData);
  };

  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [passportexpiryDate, setpassportExpiryDate] = useState<Date | null>(null);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [postalCode, setPostalCode] = useState<string>("");

  const [formData, setFormData] = useState({
    postalCode: "",
    profileImage: "",
    title: "",
    firstnameTH: "",
    middlenameTH: "",
    lastnameTH: "",
    firstnameEN: "",
    middlenameEN: "",
    lastnameEN: "",
    nicknameTH: "",
    nicknameEN: "",
    nationality: "",
    idCardNumber: "",
    idCardExpiry: "",
    birthDate: "",
    age:"",
    gender: "",
    houseNumber: "",
    moo: "",
    village: "",
    soi: "",
    street: "",
    subDistrict: "",
    district: "",
    province: "",
    city: "",
    country: "",
    addr1: "",
    addr2: "",
  });

  // โหลดข้อมูลจังหวัด อำเภอ ตำบล และประเทศ/สัญชาติ
  useEffect(() => {
    console.log("formData", formData)
    if (data) {
      setFormData({
        postalCode: data?.nationality || "",
        profileImage: "",
        title: "",
        firstnameTH: data?.firstnameTH || "",
        middlenameTH: data?.middlenameTH || "",
        lastnameTH: data?.lastnameTH || "",
        firstnameEN: data?.firstnameEN || "",
        middlenameEN: data?.middlenameEN || "",
        lastnameEN: data?.lastnameEN || "",
        nicknameTH: data?.nicknameTH || "",
        nicknameEN: data?.nicknameEN || "",
        nationality: data?.nationality || "", //
        idCardNumber: data?.idCardNumber || "", //
        idCardExpiry: "",
        birthDate: "",
        age:"",
        gender: data?.gender || "",
        houseNumber: data?.houseNumber || "",
        moo: data?.moo || "",
        village: data?.village || "",
        soi: data?.soi || "",
        street: data?.street || "",
        subDistrict: data?.subDistrict || "",
        district: data?.district || "",
        province: data?.province || "",
        city: data?.city || "",
        country: data?.country || "",
        addr1: data?.addr1 || "",
        addr2: data?.addr2 || "",
      })
      setChangedData({});
    }
    const loadData = async () => {
      try {
        // โหลดจังหวัด อำเภอ ตำบล
        const [provincesData, districtsData, subDistrictsData] = await Promise.all([
          fetchData("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json"),
          fetchData("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json"),
          fetchData("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"),
        ]);

        setProvinces(
          provincesData.map((p: { id: number; name_th: string; name_en: string }) => ({
            value: p.id.toString(),
            label: language === "TH" ? p.name_th : p.name_en,
          }))
        );

        setDistricts(
          districtsData.map((d: { id: number; province_id: number; name_th: string; name_en: string }) => ({
            value: d.id.toString(),
            label: language === "TH" ? d.name_th : d.name_en,
            province_id: d.province_id.toString(),
          }))
        );

        setSubDistricts(
          subDistrictsData.map((s: { id: number; amphure_id: number; name_th: string; name_en: string; zip_code: number }) => ({
            value: s.id.toString(),
            label: language === "TH" ? s.name_th : s.name_en,
            amphure_id: s.amphure_id.toString(),
            postalCode: s.zip_code,
          }))
        );

        // โหลดข้อมูลประเทศและสัญชาติ
        const [countriesData, nationalitiesData] = await Promise.all([
          fetchData("/data/country-list.json", true),
          fetchData("/data/nationalities.json", true),
        ]);

        setCountries(
          sortByLanguage(countriesData, language, "country").filter(
            (item) => item.value !== undefined && item.label !== undefined
          ) as { value: string; label: string }[]
        );
        setNationalities(
          sortByLanguage(nationalitiesData, language, "nationality").filter(
            (item) => item.value !== undefined && item.label !== undefined
          ) as { value: string; label: string }[]
        );

      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [language, data]);


  // ฟังก์ชันเปลี่ยนค่า จังหวัด-อำเภอ-ตำบล
  const handleProvinceChange = (selectedOption: { value: string } | null) => {
    setSelectedProvince(selectedOption ? selectedOption.value : null);
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);
    setPostalCode("");
  };

  const handleDistrictChange = (selectedOption: { value: string } | null) => {
    setSelectedDistrict(selectedOption ? selectedOption.value : null);
    setSelectedSubDistrict(null);
    setPostalCode("");
  };

  const handleSubDistrictChange = (selectedOption: { value: string } | null) => {
    setSelectedSubDistrict(selectedOption ? selectedOption.value : null);
    const subDistrict = subDistricts.find((s) => s.value === selectedOption?.value);
    setPostalCode(subDistrict ? subDistrict.postalCode.toString() : "");
  };

  // กรองอำเภอ และ ตำบล ตามจังหวัดที่เลือก
  const filteredDistricts = districts.filter((d) => selectedProvince && d.province_id === selectedProvince);
  const filteredSubDistricts = subDistricts.filter((s) => selectedDistrict && s.amphure_id === selectedDistrict);

  return (
    <div className="flex justify-center py-5 bg-[white]">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3">
        <div className="p-6 bg-white rounded-lg w-full max-w-5xl mx-auto">
          <h2 className="text-2xl text-[#008A90] font-semibold mb-6">{currentTexts.titlePersonalInfo}</h2>
          {/* อัปโหลดรูปภาพ */}
          <div className="mb-4">
            <label className="block text-[#565656] mb-2">{currentTexts.uploadImage} <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap md:flex-nowrap items-start gap-4 md:gap-6">
              {/* กรอบอัปโหลดรูป */}
              <div
                className="w-28 h-36 md:w-40 md:h-48 lg:w-48 lg:h-56 border-2 border-dashed border-[#008A90] p-4 flex flex-col items-center justify-center cursor-pointer text-center"
                onClick={() => document.getElementById('profileImageUpload')?.click()}
              >
                <Upload className="text-[#008A90] w-6 h-6" />
                <span className="text-[#008A90] mt-2 text-sm md:text-base lg:text-lg break-words leading-tight">
                  {currentTexts.uploadImage}
                </span>
                <input
                  type="file"
                  id="profileImageUpload"
                  className="hidden"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      profileImage: e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : ""
                    })
                  }
                />
              </div>

              <div className="text-[#565656] text-sm leading-6">
                {currentTexts.imageRequirements.map((req, index) => (
                  <p key={index}>{req}</p>
                ))}
              </div>
            </div>
          </div>
          {/* คำนำหน้า*/}
          <div className="mb-4">
            <label className="block text-[#565656] mb-1">{currentTexts.title} <span className="text-red-500">*</span></label>
            <p className="text-[#565656]   indent-5">{currentTexts.titleText}</p>
          </div>

          {/* ชื่อภาษาไทย*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-[#565656] mb-1">
                {currentTexts.firstName} {formData.nationality === "Thai" && <span className="text-red-500">*</span>}
              </label>
              <p className="text-[#565656] indent-5">{formData.firstnameTH}</p>
            </div>

            <FormField
              label={currentTexts.middleName}
              value={formData.middlenameTH || ""}
              onChange={(value) => handleChange("middlenameTH", validateThaiCharacters(value))}
              placeholder={currentTexts.enterMiddleName}
              onKeyDown={(e) => preventThaiInput(e)}
            />

            <div>
              <label className="block text-[#565656] mb-1">
                {currentTexts.lastName} {formData.nationality === "Thai" && <span className="text-red-500">*</span>}
              </label>
              <p className="text-[#565656] indent-5">{formData.lastnameTH}</p>
            </div>

            <FormField
              label={currentTexts.nickname}
              value={formData.nicknameTH || ""}
              onChange={(value) => handleChange("nicknameTH", validateThaiCharacters(value))}
              placeholder={currentTexts.enterNickname}
              onKeyDown={(e) => preventThaiInput(e)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-[#565656] mb-1">{currentTexts.firstNameEng} <span className="text-red-500">*</span></label>
              <p className="text-[#565656]  indent-5">{formData.firstnameEN}</p>
            </div>
            <FormField
              label={currentTexts.middleNameEng}
              value={formData.middlenameEN || ""}
              onChange={(value) => handleChange("middlenameEN", validateEnglishCharacters(value))}
              placeholder={currentTexts.enterMiddleNameEng}
              onKeyDown={(e) => preventEnglishInput(e)} // ป้องกันภาษาไทย
            />
            <div>
              <label className="block text-[#565656] mb-1">{currentTexts.lastNameEng} <span className="text-red-500">*</span></label>
              <p className="text-[#565656]  indent-5">{formData.lastnameEN}</p>
            </div>
            <FormField
              label={currentTexts.nicknameEng}
              value={formData.nicknameEN || ""}
              onChange={(value) => handleChange("nicknameEN", validateEnglishCharacters(value))}
              placeholder={currentTexts.enterNicknameEng}
              onKeyDown={(e) => preventEnglishInput(e)} // ป้องกันภาษาไทย
            />
          </div>
          {/* สัญชาติ */}
          <div className="w-full max-w-[315px] md:max-w-[250px]">
            <CustomSelect
              label={currentTexts.nationality}
              options={nationalities}
              value={formData.nationality || ""}
              onChange={(selectedOption) => handleChange("nationality", selectedOption ? selectedOption.value : "TH")}
              placeholder={currentTexts.selectNationality}
            />
          </div>


          <div className="mb-4"></div>
          {/* อัปโหลดเอกสาร */}
          {/* กรณีสัญชาติไทย แสดงบัตรประชาชน */}
          {/* แสดงเอกสารที่ต้องอัปโหลดตามสัญชาติ */}
          {formData.nationality === "Thai" ? (
            <>
              <FileUpload
                label={currentTexts?.uploadIdCard || "สำเนาบัตรประชาชน"}
                onChange={(file) => console.log(file)}
                fileType="pdf"
                maxSize="5 MB"
                accept=".pdf"
                infoMessage={
                  <p>
                    {currentTexts?.uploadIdCardInfo ||
                      "กรุณาอัปโหลดสำเนาบัตรประชาชน พร้อมรับรองสำเนาถูกต้อง (ไฟล์ประเภท pdf ขนาดไม่เกิน 5 MB)"}
                  </p>
                }
              />

              {/* หมายเลขบัตรประชาชน และ วันหมดอายุ */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {/* หมายเลขบัตรประชาชน */}
                <div>
                  <label className="block text-[#565656] mb-1">
                    {currentTexts?.idCardNumber || "หมายเลขบัตรประชาชน"} <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[#565656] font-medium indent-2">{formData.idCardNumber}</p>
                </div>

                {/* วันหมดอายุของบัตรประชาชน */}
                <div className="w-full max-w-xs md:max-w-sm">
                  <label className="block text-[#565656] mb-1">
                    {currentTexts?.idCardExpiry || "วันหมดอายุของบัตรประชาชน"} <span className="text-red-500">*</span>
                  </label>
                  <DateInput
                    selected={expiryDate}
                    onChange={setExpiryDate}
                    placeholderText={currentTexts?.SelectidCardExpiry || "เลือกวันหมดอายุของบัตรประชาชน"}
                    mode="expiry"
                  />

                </div>

                {/* วัน/เดือน/ปีเกิด */}
                <div className="w-full max-w-xs md:max-w-sm">
                  <label className="block text-[#565656] mb-1">
                    {currentTexts?.birthDate || "วัน/เดือน/ปีเกิด"} <span className="text-red-500">*</span>
                  </label>
                  <DateInput
                    selected={birthDate}
                    onChange={setBirthDate}
                    placeholderText={currentTexts?.SelectBirthDate || "เลือกวันเกิด"}
                    mode="birthdate"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <FileUpload
                label={currentTexts?.uploadPassport || "สำเนาหนังสือเดินทาง"}
                onChange={(file) => console.log(file)}
                fileType="pdf"
                maxSize="5 MB"
                accept=".pdf"
                infoMessage={
                  <p>
                    {currentTexts?.uploadPassportInfo ||
                      "กรุณาอัปโหลดสำเนาหนังสือเดินทาง พร้อมรับรองสำเนาถูกต้อง (ไฟล์ประเภท pdf ขนาดไม่เกิน 5 MB)"}
                  </p>
                }
              />

              {/* หมายเลขพาสปอร์ต */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {/* หมายเลขหนังสือเดินทาง */}
                <div>
                  <label className="block text-[#565656] mb-1">
                    {currentTexts?.passportNumber || "หมายเลขหนังสือเดินทาง"} <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[#565656] font-medium indent-2">A12345678</p>
                </div>

                {/* วันหมดอายุของหนังสือเดินทาง */}
                <div className="w-full max-w-xs md:max-w-sm">
                  <label className="block text-[#565656] mb-1">
                    {currentTexts?.passportExpiry || "วันหมดอายุของหนังสือเดินทาง"} <span className="text-red-500">*</span>
                  </label>
                  <DateInput
                      selected={passportexpiryDate}
                      onChange={setpassportExpiryDate}
                      placeholderText={currentTexts?.SelectPassportExpiry || "เลือกวันหมดอายุของหนังสือเดินทาง"} mode={"birthdate"}                  />
                </div>

                {/* วัน/เดือน/ปีเกิด */}
                <div className="w-full max-w-xs md:max-w-sm">
                  <label className="block text-[#565656] mb-1">
                    {currentTexts?.birthDate || "วัน/เดือน/ปีเกิด"} <span className="text-red-500">*</span>
                  </label>
                  <DateInput
                    selected={birthDate}
                    onChange={setBirthDate}
                    placeholderText={currentTexts?.SelectBirthDate || "เลือกวันเกิด"}
                    mode="birthdate"
                  />
                </div>
              </div>
            </>
          )}
          {/* อายุ และ เพศ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* อายุ */}
            <div>
              <label className="block text-[#565656] mb-1">
                {currentTexts?.age || "อายุ"}
              </label>
              <p className="text-[#565656] font-medium">-</p>
            </div>
            {/* เพศ */}
            <div className="mb-4 w-full max-w-xs md:max-w-md lg:max-w-lg">
              <CustomSelect
                label={currentTexts?.gender || "เพศ"}
                options={genderOptions[language as keyof typeof genderOptions] || genderOptions["ENG"]}
                value={formData.gender || ""}
                onChange={(selectedOption) =>
                  handleChange("gender", selectedOption ? selectedOption.value : "")
                }
                placeholder={currentTexts?.selectGender || "เลือกเพศ"}
                width="100%"
              />
            </div>
          </div>

          <h2 className="text-2xl text-[#008A90] font-semibold mb-6">{currentTexts.titleAddress}</h2>
          {formData.country === "TH" && (
            <FileUpload
              label={currentTexts?.uploadHouseReg || "สำเนาทะเบียนบ้าน"}
              onChange={(file) => console.log(file)}
              fileType="pdf"
              maxSize="5 MB"
              accept=".pdf"
              infoMessage={
                <p>
                  {currentTexts?.uploadHouseRegInfo ||
                    "กรุณาอัปโหลดสำเนาทะเบียนบ้าน พร้อมรับรองสำเนาถูกต้อง (ไฟล์ประเภท pdf ขนาดไม่เกิน 5 MB)"}
                </p>
              }
            />
          )}
          {/* เลือกประเทศ */}
          <div className="w-full max-w-full sm:max-w-[315px]">
            <CustomSelect
              label={currentTexts.country}
              options={countries}
              value={formData.country || ""}
              onChange={(selectedOption) => handleChange("country", selectedOption ? selectedOption.value : "")}
              placeholder={currentTexts.selectCountry}
              width="100%"
            />
          </div>
          
          {/* แสดงเฉพาะกรณีเลือก "ประเทศไทย (TH)" */}
          {formData.country === "TH" ? (
            <>
              {/* ฟอร์มที่อยู่แบบไทย */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <FormField
                  label={currentTexts.houseNumber}
                  value={formData.houseNumber || ""}
                  onChange={(value) => handleChange("houseNumber", allowHouseNumber(value))}
                  placeholder={currentTexts.houseNumberPlaceholder}
                  onKeyDown={preventNonHouseNumberInput}
                />
                <FormField
                  label={currentTexts.moo}
                  value={formData.moo || ""}
                  onChange={(value) => handleChange("moo", allowOnlyNumbers(value))}
                  placeholder={currentTexts.mooPlceholder}
                  onKeyDown={preventNonNumericInput}
                />
                <FormField label={currentTexts.village} value={formData.village || ""} onChange={(value) => handleChange("village", value)} placeholder={currentTexts.villagePlaceholder} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <FormField label={currentTexts.alley} value={formData.soi || ""} onChange={(value) => handleChange("soi", value)} placeholder={currentTexts.alleyPlaceholder} />
                <FormField label={currentTexts.street} value={formData.street || ""} onChange={(value) => handleChange("street", value)} placeholder={currentTexts.streetPlaceholder} />
              </div>

              {/* จังหวัด - อำเภอ - ตำบล - รหัสไปรษณีย์ */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {/* จังหวัด */}
                <CustomSelect
                  label={currentTexts.province}
                  options={provinces}
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  placeholder={currentTexts.selectProvince}
                />

                {/* อำเภอ */}
                <CustomSelect
                  label={currentTexts.district}
                  options={filteredDistricts}
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  placeholder={currentTexts.selectDistrict}
                  isDisabled={!selectedProvince}
                />

                {/* ตำบล */}
                <CustomSelect
                  label={currentTexts.subDistrict}
                  options={filteredSubDistricts}
                  value={selectedSubDistrict}
                  onChange={handleSubDistrictChange}
                  placeholder={currentTexts.subDistrictPlaceholder}
                  isDisabled={!selectedDistrict}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <FormField
                  label={currentTexts.postalCode}
                  value={postalCode}
                  onChange={(value) => setPostalCode(allowOnlyNumbers(value))}
                  placeholder={currentTexts.postalCodePlaceholder}
                  onKeyDown={preventNonNumericInput}
                />

              </div>

            </>
          ) : (
            <>
              {/* ฟอร์มที่อยู่แบบต่างประเทศ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField label={language === "TH" ? "ที่อยู่บรรทัดที่ 1" : "Address Line 1"} value={formData.addr1 || ""} onChange={(value) => handleChange("addr1", value)} placeholder={language === "TH" ? "ระบุที่อยู่บรรทัดที่ 1" : "Enter Address Line 1"} />
                <FormField label={language === "TH" ? "ที่อยู่บรรทัดที่ 2" : "Address Line 2"} value={formData.addr2 || ""} onChange={(value) => handleChange("addr2", value)} placeholder={language === "TH" ? "ระบุที่อยู่บรรทัดที่ 2" : "Enter Address Line 2"} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FormField label={language === "TH" ? "รัฐ/จังหวัด/ภูมิภาค" : "State/Province/Region"} value={formData.province || ""} onChange={(value) => handleChange("province", value)} placeholder={language === "TH" ? "เลือกจังหวัด" : "Select State/Province/Region"} />
                <FormField label={language === "TH" ? "เมือง" : "City"} value={formData.city || ""} onChange={(value) => handleChange("city", value)} placeholder={language === "TH" ? "ระบุเมือง" : "Enter City"} />
                <FormField label={language === "TH" ? "รหัสไปรษณีย์" : "Postal Code"} value={formData.postalCode || ""} onChange={(value) => handleChange("postalCode", value)} placeholder={language === "TH" ? "ระบุรหัสไปรษณีย์" : "Enter Postal Code"} />
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;

