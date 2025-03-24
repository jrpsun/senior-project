"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import FormField from "../../form/FormField";
import CustomSelect from "../../form/CustomSelect";
import CheckboxDropdown from "../../common/checkbox";
import { formatPhoneNumber } from "../../../utils/validation";

interface PopupAdminProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  isEditRole?: boolean;
  isDelete?: boolean;
  onSave?: (formData: any) => void;
  onDeleteConfirm?: () => void;
  onDelete: () => void;
  userData?: {
    title: string;
    username: string;
    lastName: string;
    email: string;
    phone: string;
    role?: string[];
  };
}

const PopupMenu: React.FC<PopupMenuProps> = ({ isOpen, onClose, onEdit, onEditRole, onDelete, position }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="absolute z-[9999]" style={{ top: position.top, left: position.left }}>
      <Dialog.Panel className="bg-white shadow-lg rounded-lg p-2 w-auto min-w-[250px] border border-gray-300">
        {/* แก้ไขข้อมูล */}
        <button className="flex items-center w-full px-4 py-2 text-[#565656] hover:bg-gray-100" onClick={onEdit}>
          <Image src="/images/admin/permission/edit_icon.svg" alt="Edit" width={16} height={16} className="mr-2" />
          แก้ไขข้อมูล
        </button>

        {/* แก้ไขบทบาท */}
        <button className="flex items-center w-full px-4 py-2 text-[#565656] hover:bg-gray-100" onClick={onEditRole}>
          <Image src="/images/admin/permission/key_icon.svg" alt="Role" width={16} height={16} className="mr-2" />
          แก้ไขบทบาท/สิทธิ์การเข้าถึง
        </button>

        {/* ลบผู้ใช้งาน */}
        <button className="flex items-center justify-between w-full px-4 py-2 text-[#565656] hover:bg-gray-100" onClick={onDelete}>
          <div className="flex items-center">
            <Image src="/images/admin/permission/trash_icon.svg" alt="Delete" width={16} height={16} className="mr-2" />
            ลบผู้ใช้งาน
          </div>
          <Image src="/images/admin/permission/warning_icon.svg" alt="Warning" width={16} height={16} />
        </button>
      </Dialog.Panel>
    </Dialog>
  );
};

const PopupAdmin: React.FC<PopupAdminProps> = ({ isOpen, onClose, isEdit = false, isEditRole = false, isDelete = false, onDeleteConfirm, userData  ,onSave = () => {} }) => {
  const [formData, setFormData] = useState({
    title: "",
    username: "",
    lastName: "",
    email: "",
    phone: "",
    role: [] as string[],
    course: "",
    roundName: "",
    academicYear: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if ((isEdit || isEditRole) && userData) {
      setFormData({
        title: userData.title || "",
        username: userData.username || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        role: userData.role || [],
      });
    } else {
      setFormData({
        title: "",
        username: "",
        lastName: "",
        email: "",
        phone: "",
        role: [],
      });
    }
  }, [isEdit, isEditRole, userData]);



  const handleChange = (field: string, value: string) => {
    if (field === "phone") {
      value = formatPhoneNumber(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-[525px] w-full relative">
          {/* ปุ่มปิดที่มุมขวาบน */}
          <button
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition z-50"
            onClick={onClose}
          >
            <Image
              src="/images/close_icon.svg"
              alt="Close"
              width={24}
              height={24}
              className="w-[20px] h-[20px]"
            />
          </button>
          {/* Popup ยืนยันการลบผู้ใช้งาน */}
          {isDelete ? (
            <>
              <Dialog.Title className="text-[18px] text-[#565656] font-bold mb-4 flex items-center">
                <Image src="/images/Info_Message.svg" alt="Warning" width={24} height={24} className="mr-2" />
                คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้?
              </Dialog.Title>
              <p className="text-[#565656] text-[15px] mb-6">การลบผู้ใช้งานจะทำให้ข้อมูลของผู้ใช้งานนี้ไม่สามารถกู้คืนได้</p>

              {/* ปุ่มยืนยันการลบ */}
              <div className="flex justify-end space-x-2 w-full">
                <button
                  className="px-4 py-2 border border-[#B3B3B3] rounded-[8px] text-[15px] text-[#565656] w-full md:w-auto min-w-[100px] text-center"
                  onClick={onClose}
                >
                  ยกเลิก
                </button>
                <button
                  className="px-4 py-2 bg-[#D92D20] text-[15px] text-white rounded-[8px] flex items-center gap-2 w-full md:w-auto min-w-[110px] justify-center"
                  onClick={onDeleteConfirm}
                >
                  <Image src="/images/admin/permission/confirm_delete_user.svg" alt="Delete" width={18} height={18} />
                  ยืนยันการลบ
                </button>
              </div>
            </>

          ) : isEditRole ? (
            <>
              {/* ถ้าเป็นโหมดแก้ไขบทบาท ให้เปลี่ยน UI */}
              <Dialog.Title className="text-xl text-[#565656] font-bold mb-4">แก้ไขบทบาท</Dialog.Title>
              <CheckboxDropdown
                label="บทบาท"
                options={[
                  { value: "กรรมการหลักสูตร", label: "กรรมการหลักสูตร" },
                  { value: "กรรมการสัมภาษณ์", label: "กรรมการสัมภาษณ์" },
                  { value: "ประชาสัมพันธ์ (PR)", label: "ประชาสัมพันธ์ (PR)" },
                  { value: "ฝ่ายการศึกษา", label: "ฝ่ายการศึกษา" },
                ]}
                selected={formData.role}
                onChange={(selected) => setFormData((prev) => ({ ...prev, role: selected }))}
                placeholder="เลือกบทบาท"
              />
            </>
          ) : (
            <>
              {/* เปลี่ยนชื่อ Popup ตามโหมด */}
              <Dialog.Title className="text-xl text-[#565656] font-bold">
                {isEdit ? "แก้ไขข้อมูลผู้ใช้งาน" : "เพิ่มผู้ใช้งาน"}
              </Dialog.Title>

              <div className="mt-4 space-y-3">
                {/* คำหน้าชื่อ */}
                <CustomSelect
                  label="คำนำหน้า"
                  options={[
                    { value: "นาย", label: "นาย" },
                    { value: "นาง", label: "นาง" },
                    { value: "นางสาว", label: "นางสาว" },
                    { value: "ดร.", label: "ดร." },
                    { value: "อาจารย์", label: "อาจารย์" },
                    { value: "อาจารย์ ดร.", label: "อาจารย์ ดร." },
                    { value: "ผศ. ดร.", label: "ผู้ช่วยศาสตราจารย์ ดร. (ผศ. ดร.)" },
                    { value: "รศ. ดร.", label: "รองศาสตราจารย์ ดร. (รศ. ดร.)" },
                    { value: "ศาสตราจารย์ ดร.", label: "ศาสตราจารย์ ดร." },
                    { value: "ศ.เกียรติคุณ ดร.", label: "ศาสตราจารย์เกียรติคุณ ดร." },
                    { value: "ว่าที่ร้อยตรี", label: "ว่าที่ร้อยตรี" },
                    { value: "Dr.", label: "Dr." },
                    { value: "Mr.", label: "Mr." },
                    { value: "Miss.", label: "Miss." },
                    { value: "Mrs.", label: "Mrs." }
                  ]}
                  value={formData.title}
                  onChange={(option) => handleChange("title", option ? option.value : "")}
                  placeholder="กรุณาเลือกคำนำหน้า"
                  required={false}
                  boldLabel={true}
                />

                {/* ชื่อผู้ใช้งาน */}
                <FormField
                  label="ชื่อผู้ใช้งาน"
                  value={formData.username}
                  onChange={(value) => handleChange("username", value)}
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  boldLabel={true}
                />

                {/* นามสกุล */}
                <FormField
                  label="นามสกุล"
                  value={formData.lastName}
                  onChange={(value) => handleChange("lastName", value)}
                  placeholder="กรอกนามสกุล"
                  boldLabel={true}
                />

                {/* อีเมล */}
                <FormField
                  label="อีเมล"
                  value={formData.email}
                  onChange={(value) => handleChange("email", value)}
                  placeholder="กรอกอีเมล"
                  boldLabel={true}
                />

                {/* เบอร์โทรศัพท์ */}
                <FormField
                  label="เบอร์โทรศัพท์"
                  value={formData.phone}
                  onChange={(value) => handleChange("phone", value)}
                  placeholder="กรอกเบอร์โทรศัพท์"
                  boldLabel={true}
                />

                {/* บทบาท */}
                {!isEdit && (
                  <CheckboxDropdown
                    label="บทบาท"
                    options={[
                      { value: "กรรมการหลักสูตร", label: "กรรมการหลักสูตร" },
                      { value: "กรรมการสัมภาษณ์", label: "กรรมการสัมภาษณ์" },
                      { value: "ประชาสัมพันธ์ (PR)", label: "ประชาสัมพันธ์ (PR)" },
                      { value: "เจ้าหน้าที่งานการศึกษา", label: "เจ้าหน้าที่งานการศึกษา" },
                    ]}
                    selected={formData.role}
                    onChange={(selected) => handleChange("role", selected)}
                    placeholder="กรุณาเลือกบทบาท"
                    boldLabel={true}
                  />
                )}
              </div>
            </>
          )}
          {/* ปุ่ม ยกเลิก & บันทึก */}
          {!isDelete && (
            <div className="mt-6 flex justify-center space-x-2 w-full">
              <button
                className="px-4 py-2 border border-[#B3B3B3] rounded-[8px] text-[#565656] w-full md:w-auto min-w-[120px] text-center"
                onClick={onClose}
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-2 bg-[#008A90] text-white rounded-[8px] flex items-center gap-2 w-full md:w-auto min-w-[120px] justify-center"
                onClick={() => {
                  if (onSave) {
                    onSave(formData);
                  }
                }}
              >
                <Image src="/images/admin/save_icon.svg" alt="Save" width={18} height={18} />
                บันทึก
              </button>
            </div>
          )}

        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export { PopupAdmin, PopupMenu };
