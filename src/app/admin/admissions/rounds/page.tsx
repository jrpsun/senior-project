"use client";
import React, { useState, useRef, useEffect } from "react";
import SideBar from "../../../../components/SideBar";
import AdminNavbar from "../../../../components/adminNavbar";
import Image from "next/image";
import SearchField from "../../../../components/form/searchField";
import { PopupAdmin, PopupMenu } from "../../../../components/common/admin/popupAdmin";
import AlertAdmin from "../../../../components/common/admin/alertAdmin";


const PermissionPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const menuRef = useRef(null);
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

  const handleSearch = () => {
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
      sortOrder === "recent" ? b.lastUsedDate - a.lastUsedDate : a.lastUsedDate - b.lastUsedDate
    );

    setSortedPermissions(updatedPermissions);
  };
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
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "recent" ? "oldest" : "recent");
  };
  // เปิด PopupMenu ตรงตำแหน่งของปุ่ม
  const handleOpenMenu = (event: React.MouseEvent, user) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();

    setMenuPosition({
      top: rect.bottom + window.scrollY + 8, // เว้นจากปุ่มลงมา 8px
      left: rect.left + window.scrollX - 260, // เลื่อนเมนูไปทางซ้าย (250px เป็นขนาดเมนู + 10px เว้นระยะ)
    });

    setSelectedUser(user);
    setIsMenuOpen(true);
  };

  // ปิด PopupMenu
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };
  // ฟังก์ชันแสดง Alert
  const handleShowAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  // ฟังก์ชันปิด Alert
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  // ฟังก์ชันบันทึกข้อมูลเมื่อเพิ่มผู้ใช้ใหม่
  const handleSaveAddUser = (newUser) => {

    // อัปเดต State (ในของจริงควรอัปเดตผ่าน API)
    const updatedPermissions = [...permissions, newUser];
    setSortedPermissions(updatedPermissions);

    // แสดง Alert หลังจากเพิ่มสำเร็จ
    handleShowAlert(`เพิ่มผู้ใช้ "${newUser.title} ${newUser.username} ${newUser.lastName}" สำเร็จ!`);

    setIsOpen(false); // ปิด PopupAdmin
  };

  const handleEditUser = () => {
    setIsEditMode(true);
    setIsOpen(true);
    handleCloseMenu(); // ปิดเมนูเมื่อกดแก้ไข
  };

  // ฟังก์ชันบันทึกข้อมูลเมื่อแก้ไขผู้ใช้
  const handleSaveEditUser = () => {
    if (!selectedUser) return;

    // อัปเดตค่าผู้ใช้ที่แก้ไข
    setPermissions(prevPermissions =>
      prevPermissions.map(user =>
        user.id === selectedUser.id ? selectedUser : user
      )
    );

    // แสดง Alert
    handleShowAlert(`ข้อมูล "${selectedUser.title} ${selectedUser.username} ${selectedUser.lastName}" อัปเดตเรียบร้อย`);

    setIsOpen(false); // ปิด Popup
    setSelectedUser(null);
  };

  // เปิด Popup แก้ไขบทบาท (ลบ handleShowAlert ออก)
  const handleEditRole = (user) => {
    setSelectedUser(user);
    setIsEditRoleOpen(true);
    handleCloseMenu();
  };

  // ฟังก์ชันบันทึกข้อมูลเมื่อแก้ไขบทบาท
  const handleSaveRole = () => {
    if (!selectedUser) return;

    // อัปเดตบทบาทของผู้ใช้
    const updatedPermissions = permissions.map((user) =>
      user.id === selectedUser.id ? selectedUser : user
    );

    setSortedPermissions(updatedPermissions);

    // แสดง Alert หลังจากแก้ไขบทบาทสำเร็จ
    handleShowAlert(`บทบาทของ "${selectedUser.title} ${selectedUser.username} ${selectedUser.lastName}" อัปเดตเรียบร้อย`);

    setIsEditRoleOpen(false);
    setSelectedUser(null);
  };
  // เปิด Popup ลบผู้ใช้
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeletePopupOpen(true);
    handleCloseMenu();
  };

  //  ลบผู้ใช้และแสดง Alert
  const confirmDeleteUser = () => {
    if (!selectedUser) return;

    handleShowAlert(`ลบผู้ใช้งาน "${selectedUser.username} ${selectedUser.lastName}" เรียบร้อย`);

    setIsDeletePopupOpen(false);
    setSelectedUser(null);
  };

  const monthMapping = {
    "ม.ค.": "01", "ก.พ.": "02", "มี.ค.": "03", "เม.ย.": "04",
    "พ.ค.": "05", "มิ.ย.": "06", "ก.ค.": "07", "ส.ค.": "08",
    "ก.ย.": "09", "ต.ค.": "10", "พ.ย.": "11", "ธ.ค.": "12"
  };

  const parseThaiDate = (thaiDate) => {
    if (!thaiDate) return new Date(0);
    const parts = thaiDate.split(" ");
    if (parts.length < 4) return new Date(0);

    const [day, thaiMonth, thaiYear, time] = parts;
    const month = monthMapping[thaiMonth];
    const year = parseInt(thaiYear, 10) - 543;
    const [hour, minute] = time.replace("น.", "").trim().split(".");

    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
  };

  const [sortedPermissions, setSortedPermissions] = useState([]);
  useEffect(() => {
    const updatedPermissions = permissions.map(user => ({
      ...user,
      lastUsedDate: parseThaiDate(user.lastUsed)
    }));
    updatedPermissions.sort((a, b) =>
      sortOrder === "recent" ? b.lastUsedDate - a.lastUsedDate : a.lastUsedDate - b.lastUsedDate
    );

    setSortedPermissions(updatedPermissions);
  }, [sortOrder])
    ;
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleCloseMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    handleSearch();
  }, [sortOrder]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {showAlert && <AlertAdmin message={alertMessage} onClose={handleCloseAlert} />}
      {/* Navbar */}
      <AdminNavbar isCollapsed={isCollapsed} className="relative z-40" />

      <div className="flex flex-row flex-1 relative">
        {/* Sidebar */}
        <div className="relative z-50">
          <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
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
                onChange={(value) => setSearchData({ ...searchData, username: value })}
                placeholder="กรุณากรอกข้อมูล"
              />

              <SearchField
                label="นามสกุลผู้ใช้งาน"
                value={searchData.lastName}
                onChange={(value) => setSearchData({ ...searchData, lastName: value })}
                placeholder="กรุณากรอกข้อมูล"
              />

              <SearchField
                label="อีเมล"
                value={searchData.email}
                onChange={(value) => setSearchData({ ...searchData, email: value })}
                placeholder="กรุณากรอกข้อมูล"
              />

              <SearchField
                label="บทบาท"
                type="dropdown"
                value={searchData.role}
                onChange={(selectedOption) =>
                  setSearchData({ ...searchData, role: selectedOption ? selectedOption.value : null })
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
              ผู้ใช้งานทั้งหมด <span className="text-[#6B7280] font-normal">{sortedPermissions.length}</span>
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

          {/* Popup สำหรับเพิ่มข้อมูลผู้ใช้ */}
          {isOpen && !isEditMode && (<PopupAdmin isOpen={isOpen} onClose={() => setIsOpen(false)} isEdit={false} onSave={handleSaveAddUser} />)}
          {/* Popup สำหรับแก้ไขข้อมูลผู้ใช้ */}
          {isOpen && isEditMode && selectedUser && (<PopupAdmin isOpen={isOpen} onClose={() => setIsOpen(false)} isEdit={true} userData={selectedUser} onSave={handleSaveEditUser} />)}

          {/* Popup แก้ไขบทบาท */}
          {isEditRoleOpen && (<PopupAdmin isOpen={isEditRoleOpen} onClose={() => setIsEditRoleOpen(false)} isEditRole={true} userData={selectedUser} onSave={handleSaveRole} />)}
          {/* Popup ลบผู้ใช้งาน */}
          <PopupAdmin isOpen={isDeletePopupOpen} onClose={() => setIsDeletePopupOpen(false)} isDelete={true} onDeleteConfirm={confirmDeleteUser} userData={selectedUser} />

          {/* ตารางแสดงรายการสิทธิ์ */}
          <div className="overflow-x-auto">
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
                      src={sortOrder === "recent" ? "/images/admin/last_active_recent.svg" : "/images/admin/last_active_oldest.svg"}
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
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-[#565656] whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-3 text-[#565656] whitespace-nowrap">
                      {user.title} {user.username} {user.lastName}
                    </td>
                    <td className="px-6 py-3 text-[#565656] whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-3 text-[#565656] whitespace-nowrap">{user.phone}</td>
                    <td className="px-6 py-3 text-[#565656] whitespace-nowrap">
                      {user.role.map((role) => (
                        <span
                          key={role}
                          className={`mr-2 
                  ${role === "กรรมการหลักสูตร" ? "text-[#008A90]" : ""}
                  ${role === "กรรมการสัมภาษณ์" ? "text-[#4F46E5]" : ""}
                  ${role === "ประชาสัมพันธ์ (PR)" ? "text-[#DAA520]" : ""}
                  ${role === "ฝ่ายการศึกษา" ? "text-[#166534]" : ""}`}
                        >
                          {role}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-3 text-[#565656] whitespace-nowrap">{user.lastUsed}</td>
                    <td className="px-6 py-3 text-center relative whitespace-nowrap">
                      <button className="text-[#565656] hover:text-gray-900 flex items-center justify-center" style={{ minWidth: "24px", minHeight: "24px" }}
                        onClick={(event) => handleOpenMenu(event, user)}>
                        <Image src="/images/admin/select_menu_icon.svg" alt="Menu" width={3.5} height={10} />
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
              onEditRole={() => handleEditRole(selectedUser)}
              onDelete={() => handleDeleteUser(selectedUser)}
              position={menuPosition}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionPage;
