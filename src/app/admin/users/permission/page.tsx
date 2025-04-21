"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import SideBar from "../../../../components/SideBar";
import AdminNavbar from "../../../../components/adminNavbar";
import Image from "next/image";
import SearchField from "../../../../components/form/searchField";
import { PopupAdmin, PopupMenu } from "../../../../components/common/admin/popupAdmin";
import AlertAdmin from "../../../../components/common/admin/alertAdmin";
import { AdminPermission } from "@components/types/adminPermission";
import { generateAdmissionBody } from "@components/utils/apiBody";


const PermissionPage = () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
  const [admins, setAdmins] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState(true);


  async function fetchData() {
    try {
      const [res_admins] = await Promise.all([
        fetch(`${API_BASE_URL}/education-department/get-all-admins`)
      ]);

      if (!res_admins.ok) {
        throw new Error("Failed to fetch one or more resources");
      }

      const data_admins = await res_admins.json();

      setAdmins(data_admins.admins || []);

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    adminId?: string;
    prefix?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    roles?: string[];
    lastSeen?: string;
  } | null>(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [searchData, setSearchData] = useState({
    username: "",
    lastName: "",
    email: "",
    role: "",
  });
  const parseThaiDate = React.useCallback((thaiDate: string): Date => {
    const monthMapping = {
      "ม.ค.": "01", "ก.พ.": "02", "มี.ค.": "03", "เม.ย.": "04",
      "พ.ค.": "05", "มิ.ย.": "06", "ก.ค.": "07", "ส.ค.": "08",
      "ก.ย.": "09", "ต.ค.": "10", "พ.ย.": "11", "ธ.ค.": "12"
    };

    if (!thaiDate) return new Date(0);
    const parts = thaiDate.split(" ");
    if (parts.length < 4) return new Date(0);

    const [day, thaiMonth, thaiYear, time] = parts;
    const month = monthMapping[thaiMonth as keyof typeof monthMapping];
    const year = parseInt(thaiYear, 10) - 543;
    const [hour, minute] = time.replace("น.", "").trim().split(".");

    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
  }, []);



  // Removed duplicate declaration of sortOrder
  // ข้อมูลสิทธิ์ตัวอย่าง (Mock Data)
  const [permissions, setPermissions] = useState([
    { id: 1, title: "อาจารย์ ดร.", username: "พิสุทธิ์ธร", lastName: "คณาวัฒนาวงศ์", email: "pisutthorn.kana@university.ac.th", phone: "089-123-4567", role: ["กรรมการหลักสูตร", "กรรมการสัมภาษณ์"], lastUsed: "27 ม.ค. 2568 17.25 น." },
    { id: 2, title: "อาจารย์ ดร.", username: "พรรณวดี", lastName: "ชัยวัฒน์กุล", email: "pwanwadee.chai@university.ac.th", phone: "081-987-6543", role: ["กรรมการหลักสูตร", "กรรมการสัมภาษณ์"], lastUsed: "26 ม.ค. 2568 17.25 น." },
    { id: 3, title: "อาจารย์ ดร.", username: "อารดา", lastName: "วรรณวิจิตรสุทธิกุล", email: "arada.wan@university.ac.th", phone: "082-345-6789", role: ["กรรมการหลักสูตร", "กรรมการสัมภาษณ์"], lastUsed: "25 ม.ค. 2568 17.25 น." },
    { id: 4, title: "อาจารย์ ดร.", username: "วรินทรา", lastName: "สุขศิริคุณาภิวัฒน์", email: "warintra.suk@university.ac.th", phone: "090-123-7890", role: ["กรรมการหลักสูตร", "กรรมการสัมภาษณ์"], lastUsed: "24 ม.ค. 2568 17.25 น." },
    { id: 5, title: "อาจารย์ ดร.", username: "วรพงษ์", lastName: "พัฒนเกียรติ", email: "worapong.pattana@university.ac.th", phone: "088-456-1234", role: ["กรรมการหลักสูตร", "กรรมการสัมภาษณ์"], lastUsed: "23 ม.ค. 2568 17.25 น." },
    { id: 6, title: "อาจารย์ ดร.", username: "ชนากานต์", lastName: "ภัทรานนท์", email: "chanakarn.p@university.ac.th", phone: "089-123-4567", role: ["กรรมการหลักสูตร", "กรรมการสัมภาษณ์"], lastUsed: "22 ม.ค. 2568 17.25 น." },
    { id: 7, title: "นางสาว", username: "ปวีณา", lastName: "ธีระประภา", email: "paveena.tera@university.ac.th", phone: "086-789-2345", role: ["ประชาสัมพันธ์ (PR)"], lastUsed: "21 ม.ค. 2568 17.25 น." },
    { id: 8, title: "นาง", username: "เบญจวรรณ", lastName: "ศีลประภากุล", email: "benjawan.sel@university.ac.th", phone: "085-678-3456", role: ["ประชาสัมพันธ์ (PR)"], lastUsed: "20 ม.ค. 2568 17.25 น." },
    { id: 9, title: "นาย", username: "เกษมศักดิ์", lastName: "วิริยะกิจ", email: "kasemsak.wiriya@university.ac.th", phone: "084-567-8901", role: ["ฝ่ายการศึกษา"], lastUsed: "18 ม.ค. 2568 17.25 น." },
    { id: 10, title: "นางสาว", username: "นรินทร์พร", lastName: "สุขประเสริฐ", email: "narin.porn@university.ac.th", phone: "083-456-7890", role: ["ฝ่ายการศึกษา"], lastUsed: "14 ม.ค. 2568 17.25 น." },
  ]);
  const [sortOrder, setSortOrder] = useState("recent");

  const handleSearch = useCallback(() => {
    const filteredData = permissions.filter(user => {
      const nameMatch = searchData.username
        ? user.username?.toLowerCase().includes(searchData.username.toLowerCase())
        : true;

      const lastNameMatch = searchData.lastName
        ? user.lastName?.toLowerCase().includes(searchData.lastName.toLowerCase())
        : true;

      const emailMatch = searchData.email
        ? user.email?.toLowerCase().includes(searchData.email.toLowerCase())
        : true;

      const roleMatch = searchData.role
        ? user.role.some(role => role.includes(searchData.role))
        : true;

      return nameMatch && lastNameMatch && emailMatch && roleMatch;
    });

    const updatedPermissions = filteredData.map(user => ({
      ...user,
      lastUsedDate: parseThaiDate(user.lastUsed)
    }));

    updatedPermissions.sort((a, b) =>
      sortOrder === "recent"
        ? (b.lastUsedDate?.getTime() || 0) - (a.lastUsedDate?.getTime() || 0)
        : (a.lastUsedDate?.getTime() || 0) - (b.lastUsedDate?.getTime() || 0)
    );

    setSortedPermissions(updatedPermissions);
  }, [permissions, searchData, sortOrder, parseThaiDate]);



  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "recent" ? "oldest" : "recent");
  };
  // เปิด PopupMenu ตรงตำแหน่งของปุ่ม
  const handleOpenMenu = (event: React.MouseEvent, user: typeof permissions[number]) => {

    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const menuHeight = 150; // ปรับตามขนาดของเมนูจริง
    const viewportHeight = window.innerHeight;

    let topPosition = rect.bottom + window.scrollY + 8; // ตำแหน่งปกติ

    // ถ้าตำแหน่งเมนูเลยหน้าจอ ให้เลื่อนขึ้นด้านบนแทน
    if (topPosition + menuHeight > viewportHeight + window.scrollY) {
      topPosition = rect.top + window.scrollY - menuHeight - 8;
    }

    setMenuPosition({
      top: topPosition,
      left: rect.left + window.scrollX - 260, // ปรับให้เมนูไม่ชิดขวาเกินไป
    });

    setSelectedUser(user);
    setIsMenuOpen(true);
  };


  // ปิด PopupMenu
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };
  // ฟังก์ชันแสดง Alert
  const handleShowAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  // ฟังก์ชันปิด Alert
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  // ฟังก์ชันบันทึกข้อมูลเมื่อเพิ่มผู้ใช้ใหม่
  const handleSaveAddUser = async (newUser: {
    adminId?: string;
    prefix: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roles: string[];
    lastSeen?: string;
    username: string;
    password: string;
  }) => {
    console.log('new user', newUser)
    try {
      for (const role of newUser.roles) {
        let userType = "";

        if (role === "กรรมการหลักสูตร") {
          userType = "course-committee";
        } else if (role === "กรรมการสัมภาษณ์") {
          userType = "interview-committee";
        } else if (role === "เจ้าหน้าที่งานการศึกษา") {
          userType = "education-department";
        } else {
          userType = "public-relations";
        }

        const response = await fetch(`${API_BASE_URL}/${userType}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(generateAdmissionBody(newUser, role, "create")),
        });

        if (!response.ok) {
          throw new Error("Failed to add new user round.");
        }
      }

      setAlertMessage("เพิ่มผู้ใช้สำเร็จ!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding new user, details:", error);
      alert("สร้างข้อมูลล้มเหลว กรุณาลองใหม่");
    }
  };



  const handleEditUser = () => {
    setIsEditMode(true);
    setIsOpen(true);
    handleCloseMenu(); // ปิดเมนูเมื่อกดแก้ไข
  };

  // ฟังก์ชันบันทึกข้อมูลเมื่อแก้ไขผู้ใช้
  const handleSaveEditUser = async (updatedUser: {
    adminId: string;
    prefix: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roles: string[];
    lastSeen?: string;
    username: string;
    password: string;
  }) => {
    try {
      for (const role of updatedUser.roles) {
        let userType = "";

        if (role === "Course Committee") {
          userType = "course-committee";
        } else if (role === "Interview Committee") {
          userType = "interview-committee";
        } else if (role === "Education Department") {
          userType = "education-department";
        } else {
          userType = "public-relations";
        }

        const response = await fetch(`${API_BASE_URL}/${userType}/${updatedUser.adminId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(generateAdmissionBody(updatedUser, role, "edit")),
        });

        if (!response.ok) {
          throw new Error("Failed to edit user round.");
        }
      }

      setAlertMessage("แก้ไขผู้ใช้สำเร็จ!");
      window.location.reload();
    } catch (error) {
      console.error("Error editing new user, details:", error);
      alert("แก้ไขข้อมูลล้มเหลว กรุณาลองใหม่");
    }
  };


  // เปิด Popup แก้ไขบทบาท (ลบ handleShowAlert ออก)
  const handleEditRole = (user: typeof permissions[number]) => {
    setSelectedUser(user);
    console.log('edit role user', user)
    setIsEditRoleOpen(true);
    handleCloseMenu();
  };


  // ฟังก์ชันบันทึกข้อมูลเมื่อแก้ไขบทบาท
  const mapRoleToUserType = (role: string) => {
    switch (role) {
      case "กรรมการหลักสูตร":
      case "Course Committee":
        return "course-committee";
      case "กรรมการสัมภาษณ์":
      case "Interview Committee":
        return "interview-committee";
      case "เจ้าหน้าที่งานการศึกษา":
      case "Education Department":
        return "education-department";
      case "ประชาสัมพันธ์":
      case "Public Relations":
      default:
        return "public-relations";
    }
  };

  const handleSaveRole = async (roleEditUser: {
    adminId: string;
    prefix: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roles: string[];
    lastSeen?: string;
    username: string;
    password: string;
  }) => {
    console.log('this is role edited user', roleEditUser)
    try {
      for (const role of selectedUser.roles) {
        const userType = mapRoleToUserType(role);
        const response = await fetch(`${API_BASE_URL}/${userType}/${selectedUser?.adminId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to delete user from ${userType}`);
        }
      }

      for (const role of roleEditUser.roles) {
        const userType = mapRoleToUserType(role);
        const response = await fetch(`${API_BASE_URL}/${userType}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(generateAdmissionBody(roleEditUser, role, "role")),
        });

        if (!response.ok) {
          throw new Error(`Failed to create user in ${userType}`);
        }
      }

      setAlertMessage("ปรับปรุงบทบาทของผู้ใช้สำเร็จ!");
      window.location.reload();
    } catch (error) {
      console.error("Error handling user roles:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };


  // เปิด Popup ลบผู้ใช้
  const handleDeleteUser = (user: typeof permissions[number]) => {
    setSelectedUser(user);
    setIsDeletePopupOpen(true);
  };

  //  ลบผู้ใช้และแสดง Alert
  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    console.log('select for delete', selectedUser)
    try {
      for (const role of selectedUser.roles) {
        let userType = "";

        if (role === "Course Committee") {
          userType = "course-committee";
        } else if (role === "Interview Committee") {
          userType = "interview-committee";
        } else if (role === "Education Department") {
          userType = "education-department";
        } else {
          userType = "public-relations";
        }

        const response = await fetch(`${API_BASE_URL}/${userType}/${selectedUser.adminId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) {
          throw new Error("Failed to delete user round.");
        }
      }

      setAlertMessage("ลบผู้ใช้สำเร็จ!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting new user, details:", error);
      alert("ลบข้อมูลล้มเหลว กรุณาลองใหม่");
    }
  };

  const [sortedPermissions, setSortedPermissions] = useState<AdminPermission[]>([]);

  // useEffect(() => {
  //   const updatedPermissions = permissions.map(user => ({
  //     ...user,
  //     lastUsedDate: parseThaiDate(user.lastUsed)
  //   }));
  //   updatedPermissions.sort((a, b) =>
  //     sortOrder === "recent" ? b.lastUsedDate.getTime() - a.lastUsedDate.getTime() : a.lastUsedDate.getTime() - b.lastUsedDate.getTime()
  //   );

  //   setSortedPermissions(updatedPermissions);
  // }, [sortOrder, parseThaiDate, permissions]);
  useEffect(() => {
    setSortedPermissions(admins)
  })


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {showAlert && <AlertAdmin message={alertMessage} onClose={handleCloseAlert} />}
      {/* Navbar */}
      <AdminNavbar isCollapsed={isCollapsed} />

      <div className="flex flex-row flex-1 relative">
        {/* Sidebar */}
        <div className="relative z-50">
          <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} userRole="admin" />
        </div>

        {/* Main Content */}
        <div
          className={`flex flex-col w-full p-6 mt-[64px] transition-all bg-white ${isCollapsed ? "ml-[80px]" : "ml-[300px]"
            }`}
        >
          {/* ส่วนแจ้งเตือนหรือไกด์ไลน์ */}
          <div className="flex items-center bg-white border-l-4 border-teal-600 text-[#565656] p-2  mb-6 mt-5">
            <Image src="/images/info_Message.svg" alt="Info" width={20} height={20} className="mr-2" />
            <span>สร้างและกำหนดบทบาทให้ผู้ใช้งาน พร้อมสิทธิ์การเข้าถึงระบบ</span>
          </div>
          {/* ส่วนค้นหาผู้ใช้งาน */}
          <div className="relative max-w-[1600px] w-full mx-auto p-5 rounded-lg shadow-md mb-6 px-4 md:px-8 z-10">
            <h1 className="text-2xl font-bold text-[#565656] mb-3">ค้นหาผู้ใช้งาน</h1>
            <hr className="mb-4 border-gray-300" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* ฟิลด์ SearchField ที่มีปัญหา */}
              <SearchField
                label="ชื่อผู้ใช้งาน"
                value={searchData.username}
                onChange={(value) => setSearchData({ ...searchData, username: value ? String(value) : "" })}
                placeholder="กรุณากรอกข้อมูล"
              />

              <SearchField
                label="นามสกุลผู้ใช้งาน"
                value={searchData.lastName}
                onChange={(value) => setSearchData({ ...searchData, lastName: value ? String(value) : "" })}
                placeholder="กรุณากรอกข้อมูล"
              />

              <SearchField
                label="อีเมล"
                value={searchData.email}
                onChange={(value) => setSearchData({ ...searchData, email: value ? String(value) : "" })}
                placeholder="กรุณากรอกข้อมูล"
              />
              <SearchField
                label="บทบาท"
                type="dropdown"
                value={searchData.role}
                onChange={(selectedOption) =>
                  setSearchData({
                    ...searchData,
                    role:
                      typeof selectedOption === "object" && selectedOption !== null
                        ? selectedOption.value
                        : ""
                  })
                }

                options={[
                  { value: "กรรมการหลักสูตร", label: "กรรมการหลักสูตร" },
                  { value: "ประชาสัมพันธ์ (PR)", label: "ประชาสัมพันธ์ (PR)" },
                  { value: "กรรมการสัมภาษณ์", label: "กรรมการสัมภาษณ์" },
                  { value: "ฝ่ายการศึกษา", label: "ฝ่ายการศึกษา" },
                ]}
                placeholder="เลือกบทบาท"
              />

              {/* ปุ่มค้นหา */}
              <div className="mt-7">
                <button
                  onClick={handleSearch}
                  className="bg-[#008A90] hover:bg-[#009198] text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Image src="/images/admin/search_icon_button.svg" alt="Search" width={18} height={18} /> ค้นหารายการ
                </button>
              </div>
            </div>
          </div>
          {/* ส่วนหัวของตาราง พร้อมปุ่มเพิ่มผู้ใช้งาน */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 px-6">
            {/* แสดงจำนวนผู้ใช้ทั้งหมด */}
            <h2 className="text-lg font-bold text-[#565656] whitespace-nowrap">
              ผู้ใช้งานทั้งหมด <span className="text-[#6B7280] font-bold">{sortedPermissions.length}</span>
            </h2>

            {/* ปุ่มเพิ่มผู้ใช้งาน */}
            <div className="mt-2 md:mt-0 md:self-end">
              <button
                className="bg-[#008A90] hover:bg-[#009198] text-white px-7 py-1.5 rounded-lg flex items-center gap-2 md:mr-20"
                onClick={() => {
                  setIsEditMode(false);
                  setSelectedUser(null);
                  setIsOpen(true);
                }}
              >
                <span className="text-2xl text-white">+</span> เพิ่มผู้ใช้งาน
              </button>
            </div>
          </div>
          {/* Popup เพิ่ม/แก้ไขข้อมูลผู้ใช้ */}
          {isOpen && (
            <PopupAdmin
              isOpen={isOpen}
              onClose={() => {
                setIsOpen(false);
                setIsEditMode(false); // รีเซ็ตโหมดเพิ่ม/แก้ไข
                setSelectedUser(null);
              }}
              isEdit={isEditMode} // ถ้าแก้ไข = true, ถ้าเพิ่ม = false
              isEditRole={false}
              onSave={(formData) => {
                if (isEditMode) {
                  handleSaveEditUser({ ...formData, id: selectedUser?.adminId || 0 }); // เซฟข้อมูลที่แก้ไข
                } else {
                  handleSaveAddUser(formData); // เซฟผู้ใช้ใหม่
                }
              }}
              onDelete={() => { }} // Provide a placeholder or appropriate function
              userData={selectedUser || undefined} // ถ้าเป็นโหมดเพิ่ม userData จะเป็น undefined
            />
          )}

          {isEditRoleOpen && selectedUser && (
            <PopupAdmin
              isOpen={isEditRoleOpen} // เปิดเฉพาะตอนแก้ไขบทบาท
              onClose={() => setIsEditRoleOpen(false)}
              isEdit={false}
              isEditRole={true}
              onSave={(formData) => handleSaveRole(formData)}
              onDelete={() => { }} // Add a placeholder or appropriate function for onDelete
              userData={selectedUser} // ใช้ข้อมูลผู้ใช้ที่ถูกเลือก
            />
          )}

          {isDeletePopupOpen && (
            <PopupAdmin
              isOpen={isDeletePopupOpen}
              onClose={() => setIsDeletePopupOpen(false)}
              isDelete={true}
              onDeleteConfirm={confirmDeleteUser}
              onDelete={() => setIsDeletePopupOpen(false)} // Provide a placeholder or appropriate function
              userData={selectedUser || undefined}
            />
          )}

          {/* ตารางแสดงรายการสิทธิ์ */}

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full min-w-[1200px] border-collapse">
              <thead className="bg-[#F3F5F6] text-[#565656] text-left">
                <tr>
                  <th className="px-6 py-3 border-b whitespace-nowrap">No</th>
                  <th className="px-6 py-3 border-b whitespace-nowrap">ชื่อ - นามสกุล ผู้ใช้งาน</th>
                  <th className="px-6 py-3 border-b whitespace-nowrap">อีเมล</th>
                  <th className="px-6 py-3 border-b whitespace-nowrap">เบอร์โทรศัพท์</th>
                  <th className="px-6 py-3 border-b whitespace-nowrap">บทบาท</th>
                  <th
                    className="px-6 py-3 border-b flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    onClick={toggleSortOrder}
                  >
                    ใช้งานล่าสุด
                    <Image
                      src={sortOrder === "recent" ? "/images/admin/permission/last_active_recent.svg" : "/images/admin/permission/last_active_oldest.svg"}
                      alt="Sort Icon"
                      width={14}
                      height={14}
                    />
                  </th>
                  <th className="px-6 py-3 border-b whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody>
                {sortedPermissions.map((user, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-[#565656] whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-3 text-[#565656] whitespace-nowrap">
                      {user.prefix} {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-3 text-[#565656] whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-3 text-[#565656] whitespace-nowrap">{user.phoneNumber}</td>
                    <td className="px-6 py-3 text-[#565656] whitespace-nowrap">
                      {user.roles?.map((role, idx) => (
                        <span
                          key={`${user.adminId}-${idx}`}
                          className={`mr-2 
              ${role === "Course Committee" ? "text-[#008A90]" : ""}
              ${role === "Interview Committee" ? "text-[#4F46E5]" : ""}
              ${role === "Public Relations" ? "text-[#DAA520]" : ""}
              ${role === "Education Department" ? "text-[#166534]" : ""}`}
                        >
                          {role}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-3 text-[#565656] whitespace-nowrap">{user.lastSeen}</td>
                    <td className="px-6 py-3 text-center relative whitespace-nowrap">
                      <button
                        className="text-[#565656] hover:text-gray-900 flex items-center justify-center"
                        style={{ minWidth: "24px", minHeight: "24px" }}
                        onClick={(event) => handleOpenMenu(event, user)}
                      >
                        <Image src="/images/admin/permission/select_menu_icon.svg" alt="Menu" width={3.5} height={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {isMenuOpen && menuPosition && (
            <PopupMenu
              isOpen={isMenuOpen}
              onClose={handleCloseMenu}
              onEdit={handleEditUser}
              onEditRole={() => selectedUser && handleEditRole(selectedUser)}
              onDelete={() => selectedUser && handleDeleteUser(selectedUser)}
              position={menuPosition}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionPage;
