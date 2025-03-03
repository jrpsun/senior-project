"use client";

// ติดตั้ง datepicker ด้วย npm install react-datepicker และ npm install date-fns
// ติดตั้ง axios ด้วย npm install axios
import { useEffect, useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import CustomSelect from "../../form/CustomSelect";
import FormField from "../../form/FormField";
import FileUpload from "../../form/FileUpload";


const PersonalInfo: React.FC = () => {
  const [provinces, setProvinces] = useState<{ value: string; label: string }[]>([]);
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
  const [districts, setDistricts] = useState<{ value: string; label: string }[]>([]);
  const [formData, setFormData] = useState({
    postalCode: "",
    profileImage: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    firstNameEng: "",
    middleNameEng: "",
    lastNameEng: "",
    nickname: "",
    nicknameEng: "",
    nationality: "",
    idCardNumber: "",
    idCardExpiry: "",
    birthDate: "",
    age: "",
    gender: "",
    district: "",
  });
  const genderOptions = [
    { value: "male", label: "ชาย" },
    { value: "female", label: "หญิง" },
  ];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedDistricts, setSelectedDistricts] = useState<string | null>(null);
  const [amphures, setAmphures] = useState<{ value: string; label: string }[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedAmphure, setSelectedAmphure] = useState<string | null>(null);
  const [postalCode, setPostalCode] = useState<string>("");
  const [subDistrict, setsubDistrict] = useState<string>(""); 

  // ดึงข้อมูลประเทศจาก API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("/data/country-list.json");
        const countryOptions = response.data.map((nation: { alpha2: string; name: string }) => ({
          value: nation.alpha2,
          label: nation.name,
        }));
        setCountries(countryOptions);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);
  useEffect(() => {
    // โหลดข้อมูลจังหวัดจาก API
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json");
        setProvinces(response.data.map((p: any) => ({ value: p.id, label: p.name_th })));
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  // ดึงข้อมูลจังหวัดจาก API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json");

        const provinceOptions = response.data.map((province: { id: string; name_th: string }) => ({
          value: province.id,
          label: province.name_th,
        }));

        setProvinces(provinceOptions);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  // ดึงข้อมูลอำเภอตามจังหวัดที่เลือก
  useEffect(() => {
    if (!selectedProvince) return; // ถ้ายังไม่เลือกจังหวัด ไม่ต้องโหลดอำเภอ

    const fetchAmphures = async () => {
      try {
        const response = await axios.get("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json");

        const filteredAmphures = response.data
          .filter((amphure: { province_id: string }) => amphure.province_id === selectedProvince)
          .map((amphure: { id: string; name_th: string }) => ({
            value: amphure.id,
            label: amphure.name_th,
          }));

        setAmphures(filteredAmphures);
        setSelectedAmphure(null); // รีเซ็ตค่าที่เลือกของอำเภอ
      } catch (error) {
        console.error("Error fetching amphures:", error);
      }
    };

    fetchAmphures();
  }, [selectedProvince]);


  return (
    <div className="flex justify-center py-10 bg-[white] min-h-screen">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-6">
        <div className="p-8 bg-white rounded-lg w-full max-w-5xl mx-auto">
          <h2 className="text-2xl text-[#008A90] font-semibold mb-6">ข้อมูลส่วนตัว</h2>
          {/* อัปโหลดรูปภาพ */}
          <div className="mb-4">
            <label className="block text-[#565656]  mb-2">รูปภาพ <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap md:flex-nowrap items-start gap-4 md:gap-6">
              {/* กรอบอัปโหลดรูป */}
              <div className="w-28 h-36 md:w-40 md:h-48 lg:w-48 lg:h-56 border-2 border-dashed border-[#008A90] p-4 flex flex-col items-center justify-center cursor-pointer"
                onClick={() => document.getElementById('profileImageUpload')?.click()}>
                <Upload className="text-[#008A90] w-6 h-6" />
                <span className="text-[#008A90] mt-2 text-sm">อัพโหลดภาพ</span>
                <input type="file" id="profileImageUpload" className="hidden" onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, profileImage: e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : "" })} />
              </div>
              <div className="text-[#565656] text-sm leading-6">
                <p>รูปแบบไฟล์: JPG, JPEG</p>
                <p>ขนาดไฟล์: ไม่เกิน 150KB</p>
                <p>ขนาดรูปที่แนะนำ: 230×312 พิกเซล</p>
                <p>รูปถ่ายไม่เกิน 6 เดือน หน้าตรง ชัดเจน ครึ่งตัวในชุดสุภาพ</p>
              </div>
            </div>
          </div>
          {/* คำนำหน้า*/}
          <div className="mb-4">
            <label className="block text-[#565656]  mb-1">คำนำหน้า <span className="text-red-500">*</span></label>
            <p className="text-[#565656]   indent-5">นาย</p>
          </div>

          {/* ชื่อภาษาไทย*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-[#565656]  mb-1">
                ชื่อจริง (ภาษาไทย) <span className="text-red-500">*</span>
              </label>
              <p className="text-[#565656]  indent-5">จิรภัทร</p>
            </div>
            <div>
              <label className="block text-[#565656]  mb-1">ชื่อกลาง (ภาษาไทย)</label>
              <input
                type="text"
                name="middleName"
                placeholder="ระบุชื่อกลาง (ภาษาไทย)"
                className="border p-1.5 rounded-[10px] w-full text-[#565656] border-[#C4C4C4]"
              />
            </div>
            <div>
              <label className="block text-[#565656]  mb-1">
                นามสกุล (ภาษาไทย) <span className="text-red-500">*</span>
              </label>
              <p className="text-[#565656]  indent-5">สุวรรณลมัย</p>
            </div>
            <div>
              <label className="block text-[#565656]  mb-1">ชื่อเล่น (ภาษาไทย)</label>
              <input
                type="text"
                name="nickname"
                placeholder="ระบุชื่อเล่น (ภาษาไทย)"
                className="border p-1.5 rounded-[10px] w-full text-[#565656] border-[#C4C4C4]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-[#565656]  mb-1">
                ชื่อจริง (ภาษาอังกฤษ) <span className="text-red-500">*</span>
              </label>
              <p className="text-[#565656]  indent-5">Jirapat</p>
            </div>
            <div>
              <label className="block text-[#565656]  mb-1">ชื่อกลาง (ภาษาอังกฤษ)</label>
              <input
                type="text"
                name="middleName"
                placeholder="ระบุชื่อกลาง (ภาษาอังกฤษ)"
                className="border p-1.5 rounded-[10px] w-full text-[#565656] border-[#C4C4C4]"
              />
            </div>
            <div>
              <label className="block text-[#565656]  mb-1">
                นามสกุล (ภาษาอังกฤษ) <span className="text-red-500">*</span>
              </label>
              <p className="text-[#565656]  indent-5">Suwanlamai</p>
            </div>
            <div>
              <label className="block text-[#565656]  mb-1">ชื่อเล่น (ภาษาอังกฤษ)</label>
              <input
                type="text"
                name="nickname"
                placeholder="ระบุชื่อเล่น (ภาษาอังกฤษ)"
                className="border p-1.5 rounded-[10px] w-full text-[#565656] border-[#C4C4C4]"
              />
            </div>
          </div>

          {/* สัญชาติ*/}
          <div className="mb-4">
            <label className="block text-[#565656]  mb-1">สัญชาติ <span className="text-red-500">*</span></label>
            <p className="text-[#565656]   indent-5">ไทย</p>
          </div>
          {/* อัปโหลดบัตรประชาชน */}
          <FileUpload
            label="สำเนาบัตรประชาชน"
            onChange={(file) => console.log(file)}
            fileType="PDF"
            maxSize="5 MB"
            accept=".pdf"
            infoMessage={
              <>
                <p>
                  กรุณาอัปโหลดสำเนาบัตรประชาชน พร้อมรับรองสำเนาถูกต้อง (ไฟล์ประเภท PDF ขนาดไม่เกิน 5 MB)
                </p>
              </>
            }
          />

          {/* หมายเลขบัตรประชาชน และ วันหมดอายุ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* หมายเลขบัตรประชาชน */}
            <div>
              <label className="block text-[#565656] mb-1">
                หมายเลขบัตรประชาชน <span className="text-red-500">*</span>
              </label>
              <p className="text-[#565656] font-medium indent-2">1 9057 42603 312</p>
            </div>
            {/* วันหมดอายุของบัตรประชาชน */}
            <div className="w-full max-w-xs md:max-w-sm">
              <label className="block text-[#565656] mb-1">
                วันหมดอายุของบัตรประชาชน <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={expiryDate}
                  onChange={(date) => setExpiryDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="เลือกวันหมดอายุของบัตรประชาชน"
                  className="p-1.5 rounded-[10px] w-full text-[#565656] border-[#C4C4C4] pr-12 placeholder-[#C4C4C4]"
                  wrapperClassName="w-full"
                />
                {/* ไอคอนปฏิทิน */}
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.15625 0.65625C4.15625 0.292578 3.86367 0 3.5 0C3.13633 0 2.84375 0.292578 2.84375 0.65625V1.75H1.75C0.784766 1.75 0 2.53477 0 3.5V3.9375V5.25V12.25C0 13.2152 0.784766 14 1.75 14H10.5C11.4652 14 12.25 13.2152 12.25 12.25V5.25V3.9375V3.5C12.25 2.53477 11.4652 1.75 10.5 1.75H9.40625V0.65625C9.40625 0.292578 9.11367 0 8.75 0C8.38633 0 8.09375 0.292578 8.09375 0.65625V1.75H4.15625V0.65625ZM1.3125 5.25H10.9375V12.25C10.9375 12.4906 10.7406 12.6875 10.5 12.6875H1.75C1.50937 12.6875 1.3125 12.4906 1.3125 12.25V5.25Z" fill="#6B7280" />
                  </svg>
                </span>
              </div>
            </div>

            {/* วัน/เดือน/ปีเกิด */}
            <div className="w-full max-w-xs md:max-w-sm">
              <label className="block text-[#565656] mb-1">
                วัน/เดือน/ปีเกิด (พ.ศ.) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={expiryDate}
                  onChange={(date) => setExpiryDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="เลือกวันเกิด"
                  className="p-1.5 rounded-[10px] w-full text-[#565656] border-[#C4C4C4] pr-12 placeholder-[#C4C4C4]"
                  wrapperClassName="w-full"
                />
                {/* ไอคอนปฏิทิน */}
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.15625 0.65625C4.15625 0.292578 3.86367 0 3.5 0C3.13633 0 2.84375 0.292578 2.84375 0.65625V1.75H1.75C0.784766 1.75 0 2.53477 0 3.5V3.9375V5.25V12.25C0 13.2152 0.784766 14 1.75 14H10.5C11.4652 14 12.25 13.2152 12.25 12.25V5.25V3.9375V3.5C12.25 2.53477 11.4652 1.75 10.5 1.75H9.40625V0.65625C9.40625 0.292578 9.11367 0 8.75 0C8.38633 0 8.09375 0.292578 8.09375 0.65625V1.75H4.15625V0.65625ZM1.3125 5.25H10.9375V12.25C10.9375 12.4906 10.7406 12.6875 10.5 12.6875H1.75C1.50937 12.6875 1.3125 12.4906 1.3125 12.25V5.25Z" fill="#6B7280" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* อายุ และ เพศ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* อายุ */}
            <div>
              <label className="block text-[#565656] mb-1">อายุ</label>
              <p className="text-[#565656] font-medium">-</p>
            </div>

            {/* เพศ */}
            <div className="mb-4 w-full max-w-xs md:max-w-md lg:max-w-lg">
              <CustomSelect
                label="เพศ"
                options={genderOptions}
                value={selectedGender}
                onChange={(selectedOption) => setSelectedGender(selectedOption ? selectedOption.value : null)}
                placeholder="เลือกเพศ"
                width="100%"
              />
            </div>
          </div>
          <h2 className="text-2xl text-[#008A90] font-semibold mb-6">ที่อยู่ตามทะเบียนบ้าน</h2>
          <FileUpload
            label="สำเนาทะเบียนบ้าน"
            onChange={(file) => console.log(file)}
            fileType="PDF"
            maxSize="5 MB"
            accept=".pdf"
            infoMessage={
              <>
                <p>
                  กรุณาอัปโหลดสำเนาทะเบียนบ้าน พร้อมรับรองสำเนาถูกต้อง (ไฟล์ประเภท PDF ขนาดไม่เกิน 5 MB)
                </p>
              </>
            }
          />
          <div>
            {/* ประเทศ */}
            <div className="mb-4 w-full max-w-xs md:max-w-md lg:max-w-lg">
              <CustomSelect
                label="ประเทศ"
                options={countries}
                value={formData.nationality}
                onChange={(selectedOption) => setFormData({ ...formData, nationality: selectedOption ? selectedOption.value : "" })}
                placeholder="เลือกประเทศ"
                width="300px"
                height="1.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* เลขที่*/}
            <div>
              <label className="block text-[#565656]  mb-1">เลขที่</label>
              <input
                type="text"
                name="houseNumber"
                placeholder="ระบุเลขที่"
                className="border p-1.5 rounded-[10px] w-full text-[#565656] border-[#C4C4C4]"
              />
            </div>
            {/* หมู่*/}
            <div>
              <label className="block text-[#565656]  mb-1">หมู่</label>
              <input
                type="text"
                name="moo"
                placeholder="ระบุหมู่"
                className="border p-1.5 rounded-[10px] w-full text-[#565656] border-[#C4C4C4]"
              />
            </div>
            {/* หมู่บ้าน/อาคาร */}
            <div>
              <label className="block text-[#565656]  mb-1">หมู่บ้าน/อาคาร</label>
              <input
                type="text"
                name="moo"
                placeholder="ระบุหมู่บ้าน/อาคาร"
                className="border p-1.5 rounded-[10px] w-full text-[#565656] border-[#C4C4C4]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* ตรอก/ซอย*/}
            <div>
              <label className="block text-[#565656]  mb-1">ตรอก/ซอย</label>
              <input
                type="text"
                name="alley"
                placeholder="ระบุตรอก/ซอย"
                className="border p-1.5 rounded-[10px] w-full text-[#565656] border-[#C4C4C4]"
              />
            </div>
            {/* หมู่*/}
            <div>
              <label className="block text-[#565656]  mb-1">หมู่</label>
              <input
                type="text"
                name="moo"
                placeholder="ระบุหมู่"
                className="border p-1.5 rounded-[10px] w-full text-[#565656] border-[#C4C4C4]"
              />
            </div>
            <div className="w-full">
              <FormField
                label="ตำบล/แขวง"
                value={subDistrict}
                onChange={setsubDistrict}
                placeholder="ระบุตำบล/แขวง"
              />
            </div>
          </div>
          {/* จังหวัด - อำเภอ/เขต - รหัสไปรษณีย์ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {/* จังหวัด */}
            <div className="w-full">
              <CustomSelect
                label="จังหวัด"
                options={provinces}
                value={selectedProvince}
                onChange={(selectedOption) => setSelectedProvince(selectedOption ? selectedOption.value : null)}
                placeholder="เลือกจังหวัด"
                width="100%"
              />
            </div>

            {/* อำเภอ/เขต */}
            <div className="w-full">
              <CustomSelect
                label="อำเภอ/เขต"
                options={amphures}
                value={selectedAmphure}
                onChange={(selectedOption) => setSelectedAmphure(selectedOption ? selectedOption.value : null)}
                placeholder="เลือกอำเภอ"
                width="100%"
                isDisabled={!selectedProvince} // ปิดการใช้งานหากยังไม่เลือกจังหวัด
              />
            </div>

            {/* รหัสไปรษณีย์ */}
            <div className="w-full">
              <FormField
                label="รหัสไปรษณีย์"
                value={postalCode}
                onChange={setPostalCode}
                placeholder="ระบุรหัสไปรษณีย์"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
