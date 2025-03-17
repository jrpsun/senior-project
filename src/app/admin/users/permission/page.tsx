"use client";
import React, { useState } from "react";
import SideBar from "../../../../components/SideBar";
import AdminNavbar from "../../../../components/adminNavbar";

const PermissionPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // ควบคุม Sidebar

  return (
    <div className="flex flex-col h-screen bg-white"> {/* พื้นหลังสีขาว */}
      {/* Navbar (ส่ง isCollapsed ไปด้วย) */}
      <AdminNavbar isCollapsed={isCollapsed} />

      <div className="flex flex-row flex-1">
        {/* Sidebar (ส่ง isCollapsed และ setIsCollapsed) */}
        <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content */}
        <div
          className={`flex flex-col w-full p-6 mt-[64px] transition-all bg-white ${isCollapsed ? "ml-[80px]" : "ml-[300px]"}`}
        >
          <p>เนื้อหาสำหรับการจัดการสิทธิ์ของผู้ใช้</p>
        </div>
      </div>
    </div>
  );
};

export default PermissionPage;
