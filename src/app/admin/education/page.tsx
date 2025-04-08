"use client";
import { useState } from "react";

import React from 'react';
import Sidebar from "@components/components/SideBar";
import AdminNavbar from "@components/components/adminNavbar";
import Image from 'next/image';



const applicant = [
  { round: 'DST01', applicantId: '0000001', name: 'กันต์ชนก แก้วโมลา', course: 'DST', admitStatus: '01-ยังไม่ยื่นใบสมัคร', docStatus: '01-ยังไม่มีเอกสาร', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'kanchanok.kae@study.mu.edu', phoneNumber: '0675934787' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'DST01', applicantId: '0000003', name: 'กันต์ชนก แก้วโมรา', course: 'DST', admitStatus: '01-ยังไม่ยื่นใบสมัคร', docStatus: '01-ยังไม่มีเอกสาร', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'kanchanok.kaer@study.mu.edu', phoneNumber: '0675934797' },
  { round: 'ICT01', applicantId: '0000004', name: 'สมหญิง สมชาย', course: 'ICT', admitStatus: '09-ยกเลิกการสมัคร', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackDawg153@gmail.com', phoneNumber: '0373861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '02-รอตรวจสอบเอกสาร', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'DST01', applicantId: '0000001', name: 'กันต์ชนก แก้วโมลา', course: 'DST', admitStatus: '01-ยังไม่ยื่นใบสมัคร', docStatus: '01-ยังไม่มีเอกสาร', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'kanchanok.kae@study.mu.edu', phoneNumber: '0675934787' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'DST01', applicantId: '0000003', name: 'กันต์ชนก แก้วโมรา', course: 'DST', admitStatus: '01-ยังไม่ยื่นใบสมัคร', docStatus: '01-ยังไม่มีเอกสาร', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'kanchanok.kaer@study.mu.edu', phoneNumber: '0675934797' },
  { round: 'ICT01', applicantId: '0000004', name: 'สมหญิง สมชาย', course: 'ICT', admitStatus: '08-ยกเลิกการสมัคร', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackDawg153@gmail.com', phoneNumber: '0373861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '02-รอตรวจสอบเอกสาร', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'DST01', applicantId: '0000001', name: 'กันต์ชนก แก้วโมลา', course: 'DST', admitStatus: '01-ยังไม่ยื่นใบสมัคร', docStatus: '01-ยังไม่มีเอกสาร', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'kanchanok.kae@study.mu.edu', phoneNumber: '0675934787' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'DST01', applicantId: '0000003', name: 'กันต์ชนก แก้วโมรา', course: 'DST', admitStatus: '01-ยังไม่ยื่นใบสมัคร', docStatus: '01-ยังไม่มีเอกสาร', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'kanchanok.kaer@study.mu.edu', phoneNumber: '0675934797' },
  { round: 'ICT01', applicantId: '0000004', name: 'สมหญิง สมชาย', course: 'ICT', admitStatus: '08-ยกเลิกการสมัคร', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackDawg153@gmail.com', phoneNumber: '0373861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '02-รอตรวจสอบเอกสาร', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'DST01', applicantId: '0000001', name: 'กันต์ชนก แก้วโมลา', course: 'DST', admitStatus: '01-ยังไม่ยื่นใบสมัคร', docStatus: '01-ยังไม่มีเอกสาร', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'kanchanok.kae@study.mu.edu', phoneNumber: '0675934787' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'DST01', applicantId: '0000003', name: 'กันต์ชนก แก้วโมรา', course: 'DST', admitStatus: '01-ยังไม่ยื่นใบสมัคร', docStatus: '01-ยังไม่มีเอกสาร', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'kanchanok.kaer@study.mu.edu', phoneNumber: '0675934797' },
  { round: 'ICT01', applicantId: '0000004', name: 'สมหญิง สมชาย', course: 'ICT', admitStatus: '08-ยกเลิกการสมัคร', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackDawg153@gmail.com', phoneNumber: '0373861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '02-รอตรวจสอบเอกสาร', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' },
  { round: 'ICT01', applicantId: '0000002', name: 'สมใจ สมหญิง', course: 'ICT', admitStatus: '02-ยื่นใบสมัครแล้ว', docStatus: '03-เอกสารครบถ้วน', paymentStatus: '01-ยังไม่ได้ชำระเงิน', email: 'blackCat153@gmail.com', phoneNumber: '0573861396' }
]

const courseOptions = ["DST", "ICT"];
const roundOptions = ["DST01", "ICT01"];
const admitStatusOptions = ["01-ยังไม่ยื่นใบสมัคร", "02-ยื่นใบสมัครแล้ว", "03-รอพิจารณา", "04-ผ่านการพิจารณา", "05-ไม่ผ่านการพิจารณา", "06-รอสัมภาษณ์", "07-ผ่านการสัมภาษณ์", "08-ไม่ผ่านการสัมภาษณ์", "09-ยกเลิกการสมัคร"];
const docStatusOptions = ["01-ยังไม่มีเอกสาร", "02-รอตรวจสอบเอกสาร", "03-เอกสารครบถ้วน", "04-เอกสารไม่ครบถ้วน"];
const paymentStatusOptions = ["01-ยังไม่ได้ชำระเงิน", "02-รอตรวจสอบการชำระเงิน", "03-ชำระเงินเรียบร้อย", "04-ชำระเงินไม่สำเร็จ"];

const Page = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filters, setFilters] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  /* used for immediately filter
  const [filters, setFilters] = useState({
    course: "",
    round: "",
    admitStatus: "",
    docStatus: "",
    paymentStatus: "",
    indexNum: "",
    name: ""
  });
  */

  const handleSearch = () => {
    setFilters(filterValues);
  };

  const handleReset = () => {
    setFilterValues({});
    setFilters({});
  };
  /*
  const filteredApplicants = applicant.filter(app =>
    (filters.course === "" || app.course.includes(filters.course)) &&
    (filters.round === "" || app.round.includes(filters.round)) &&
    (filters.admitStatus === "" || app.admitStatus.includes(filters.admitStatus)) &&
    (filters.docStatus === "" || app.docStatus.includes(filters.docStatus)) &&
    (filters.paymentStatus === "" || app.paymentStatus.includes(filters.paymentStatus)) &&
    (filters.indexNum === "" || app.indexNum.includes(filters.indexNum)) &&
    (filters.name === "" || app.name.includes(filters.name))
  );
  */
  const filteredApplicants = applicant.filter(app =>
    (!filters.course || app.course === filters.course) &&
    (!filters.round || app.round === filters.round) &&
    (!filters.admitStatus || app.admitStatus === filters.admitStatus) &&
    (!filters.docStatus || app.docStatus === filters.docStatus) &&
    (!filters.paymentStatus || app.paymentStatus === filters.paymentStatus) &&
    (!filters.applicantId || app.applicantId.includes(filters.applicantId)) &&
    (!filters.name || app.name.includes(filters.name))
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Show 10 items per page

  // Calculate indexes
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplicants = filteredApplicants.slice(startIndex, endIndex);

  // Pagination Handlers
  const nextPage = () => {
    if (endIndex < filteredApplicants.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value)); // Update items per page
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div>
      <AdminNavbar
        isCollapsed={isCollapsed}
      />
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        userRole="admin"
      />
      <div className={`mt-[100px] ${isCollapsed ? "ml-[100px] p-4" : "ml-[325px] p-4"
        }`}>
        {/* Search and Filter Box */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg mb-8 font-bold text-[#565656]">ค้นหาผู้สมัคร</h2>
          <div className="border border-bottom mb-5"></div>
          <div className="flex justify-start gap-4">
            {/* Course */}
            <div>
              <label className="block text-sm font-bold text-[#565656] "><strong>หลักสูตร</strong></label>
              <select className="w-[155px] border border-gray-300 text-gray-300 p-2 rounded-md" value={filterValues.course || ""} onChange={(e) => setFilterValues({ ...filterValues, course: e.target.value })}>
                <option value="" className="text-gray-700">กรุณากรอกข้อมูล</option>
                {courseOptions.map(course => <option key={course} value={course}>{course}</option>)}
              </select>
            </div>
            {/* Round */}
            <div>
              <label className="block text-sm font-bold text-[#565656]"><strong>รอบรับสมัคร</strong></label>
              <select className="w-[255px] border border-gray-300 text-gray-300 p-2 rounded-md" value={filterValues.round || ""} onChange={(e) => setFilterValues({ ...filterValues, round: e.target.value })}>
                <option value="">กรุณากรอกข้อมูล</option>
                {roundOptions.map(round => <option key={round} value={round}>{round}</option>)}
              </select>
            </div>
            {/* Admit Status */}
            <div>
              <label className="block text-sm font-bold text-[#565656]"><strong>สถานะการสมัคร</strong></label>
              <select className="w-full border border-gray-300 text-gray-300 p-2 rounded-md" value={filterValues.admitStatus || ""} onChange={(e) => setFilterValues({ ...filterValues, admitStatus: e.target.value })}>
                <option value="">กรุณากรอกข้อมูล</option>
                {admitStatusOptions.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            {/* Document Status */}
            <div>
              <label className="block text-sm font-bold text-[#565656]"><strong>สถานะเอกสาร</strong></label>
              <select 
              
              className="`w-full border border-gray-300 text-gray-300 p-2 rounded-md`" value={filterValues.docStatus || ""} onChange={(e) => setFilterValues({ ...filterValues, docStatus: e.target.value })}>
                <option value="">กรุณากรอกข้อมูล</option>
                {docStatusOptions.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            {/* Payment Status */}
            <div>
              <label className="block text-sm font-bold text-[#565656]"><strong>สถานะการชำระเงิน</strong></label>
              <select className="w-full border border-gray-300 text-gray-300 p-2 rounded-md" value={filterValues.paymentStatus || ""} onChange={(e) => setFilterValues({ ...filterValues, paymentStatus: e.target.value })}>
                <option value="">กรุณากรอกข้อมูล</option>
                {paymentStatusOptions.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            {/* Search and Reset Buttons */}
            <div className="mt-5 flex justify-end space-x-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-[40px] h-[40px] flex items-center justify-center border border-[#565656] rounded-md"
              >
                <Image
                  src={
                    isExpanded
                      ? "/images/admin/searchBar/show_less_icon.svg"
                      : "/images/admin/searchBar/show_more_icon.svg"
                  }
                  alt={isExpanded ? "แสดงน้อยลง" : "แสดงเพิ่มเติม"}
                  width={37}
                  height={37}
                />
              </button>
              <button
                className="px-1.5 h-[40px] border border-gray-400 rounded-md text-[#565656] bg-white flex items-center gap-1"
                onClick={handleReset}
              >
                <Image src="/images/admin/searchBar/clear_icon.svg" alt="reset" width={16} height={16} className="w-4 h-4" />
                ล้างค่า
              </button>
              <button
                className="px-2 h-[40px] rounded-md bg-[#008A90] hover:bg-[#009198] text-white flex items-center gap-1"
                onClick={handleSearch}
              >
                <Image src="/images/admin/searchBar/search_icon.svg" alt="search" width={16} height={16} className="w-4 h-4" />
                ค้นหารายการ
              </button>
            </div>
          </div>
          <div className="flex justify-start gap-4 mt-4">

            {isExpanded && (
              <div className="flex justify-start gap-4 mt-4">
                {/* Applicant ID */}
                <div>
                  <label className="block text-sm font-bold text-[#565656]"><strong>เลขที่สมัคร</strong></label>
                  <input
                    type="text"
                    className="w-[150px] border border-gray-300 p-2 rounded-md"
                    placeholder="กรุณากรอกข้อมูล"
                    value={filterValues.applicantId || ""}
                    onChange={(e) => setFilterValues({ ...filterValues, applicantId: e.target.value })}
                  />
                </div>
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-[#565656]"><strong>ชื่อผู้สมัคร</strong></label>
                  <input
                    type="text"
                    className="w-[255px] border border-gray-300 p-2 rounded-md"
                    placeholder="กรุณากรอกข้อมูล"
                    value={filterValues.name || ""}
                    onChange={(e) => setFilterValues({ ...filterValues, name: e.target.value })}
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Display Filtered Results */}
        <div className="mt-6">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold mb-4">รายการใบสมัคร {filteredApplicants.length}</h2>
            <div>
              <button className="bg-[#008A90] text-white px-2 py-2 my-1 mx-1 rounded-md">
                <div className="flex flex-row gap-x-2">
                  <div>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_911_32737)">
                        <path d="M3.33366 6.66732C2.41283 6.66732 1.66699 7.41315 1.66699 8.33398V16.6673C1.66699 17.584 2.41699 18.334 3.33366 18.334H15.0003C15.9212 18.334 16.667 17.5882 16.667 16.6673H3.33366V6.66732ZM16.667 15.0007H6.66699C5.74616 15.0007 5.00033 14.2548 5.00033 13.334V5.00065C5.00033 4.07982 5.74616 3.33398 6.66699 3.33398H9.16699C10.0878 3.33398 10.8337 4.07982 10.8337 5.00065H16.667C17.5878 5.00065 18.3337 5.74648 18.3337 6.66732V13.334C18.3337 14.2548 17.5878 15.0007 16.667 15.0007Z" fill="white" />
                      </g>
                      <defs>
                        <clipPath id="clip0_911_32737">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div>ดาวน์โหลดเอกสาร</div>
                </div>
              </button>
              <button className="bg-[#00796B] text-white px-2 py-2 rounded-md">
                <div className="flex flex-row gap-x-2">
                  <div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.7787 10.1973V13.8522H2.22132V10.1973H0V14.9266C0 15.5196 0.496569 16.0005 1.11231 16.0005H14.8877C15.5029 16.0005 16 15.5201 16 14.9266V10.1973H13.7787Z" fill="white" />
                      <path d="M7.79678 9.83441L4.61654 6.11702C4.61654 6.11702 4.13266 5.6751 4.65737 5.6751C5.18207 5.6751 6.44943 5.6751 6.44943 5.6751C6.44943 5.6751 6.44943 5.37781 6.44943 4.91934C6.44943 3.61225 6.44943 1.23344 6.44943 0.26366C6.44943 0.26366 6.37825 0 6.78875 0C7.20256 0 9.01503 0 9.31132 0C9.60705 0 9.60043 0.222029 9.60043 0.222029C9.60043 1.16245 9.60043 3.62346 9.60043 4.88785C9.60043 5.29775 9.60043 5.56355 9.60043 5.56355C9.60043 5.56355 10.6167 5.56355 11.2546 5.56355C11.8913 5.56355 11.4118 6.02629 11.4118 6.02629C11.4118 6.02629 8.70606 9.50083 8.32867 9.86537C8.05721 10.1296 7.79678 9.83441 7.79678 9.83441Z" fill="white" />
                    </svg>
                  </div>
                  <div>Export to Excel</div>
                </div>
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="px-1 py-2">No</th>
                <th className="px-1 py-2">รอบ</th>
                <th className="px-2 py-2">เลขที่สมัคร</th>
                <th className="px-2 py-2">ชื่อ - นามสกุล ผู้สมัคร</th>
                <th className="px-2 py-2">หลักสูตร</th>
                <th className="px-2 py-2">สถานะการสมัคร</th>
                <th className="px-2 py-2">สถานะเอกสาร</th>
                <th className="px-2 py-2">สถานะการชำระเงิน</th>
                <th className="px-2 py-2">อีเมล</th>
                <th className="px-2 py-2">โทรศัพท์</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedApplicants.map((app, index) => (
                <tr key={index}
                  className={`
                  ${app.admitStatus === "09-ยกเลิกการสมัคร" ? "bg-red-200" : ""}
                `}>
                  <td className="text-center">{startIndex + index + 1}</td>
                  <td className="py-2">{app.round}</td>
                  <td className="text-center">{app.applicantId}</td>
                  <td className="py-2">{app.name}</td>
                  <td className="py-2">{app.course}</td>
                  <td>
                    <div className={`
          ${app.admitStatus === "02-ยื่นใบสมัครแล้ว" ? "h-[30px] pt-[2px] rounded-xl bg-green-200 text-green-600 font-semibold" : "py-2"}
          ${app.admitStatus === "03-รอพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-yellow-200 text-yellow-600 font-semibold" : "py-2"}
          ${app.admitStatus === "04-ผ่านการพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-green-200 text-green-600 font-semibold" : "py-2"}
          ${app.admitStatus === "05-ไม่ผ่านการพิจารณา" ? "h-[30px] pt-[2px] rounded-xl bg-red-200 text-red-600 font-semibold" : "py-2"}
          ${app.admitStatus === "06-รอสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-yellow-200 text-yellow-600 font-semibold" : "py-2"}
          ${app.admitStatus === "07-ผ่านการสอบสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-green-200 text-green-600 font-semibold" : "py-2"}
          ${app.admitStatus === "08-ไม่ผ่านการสอบสัมภาษณ์" ? "h-[30px] pt-[2px] rounded-xl bg-red-200 text-red-600 font-semibold" : "py-2"}
          ${app.admitStatus === "09-ยกเลิกการสมัคร" ? "h-[30px] pt-[2px] rounded-xl text-red-600 font-semibold" : "py-2"}
        `}>
                      {app.admitStatus}
                    </div>
                  </td>

                  {/* Document Status with Conditional Highlight */}
                  <td>
                    <div className={`
          ${app.docStatus === "02-รอตรวจสอบเอกสาร" ? "h-[30px] pt-[2px] rounded-xl bg-yellow-200 text-yellow-600 font-semibold" : "py-2"}
          ${app.docStatus === "03-เอกสารครบถ้วน" ? "h-[30px] pt-[2px] rounded-xl bg-green-200 text-green-600 font-semibold" : "py-2"}
          ${app.docStatus === "04-เอกสารไม่ครบถ้วน" ? "h-[30px] pt-[2px] rounded-xl bg-red-200 text-red-600 font-semibold" : "py-2"}
        `}>
                      {app.docStatus}
                    </div>
                  </td>
                  <td className="py-2">{app.paymentStatus}</td>
                  <td className="py-2">{app.email}</td>
                  <td className="py-2">{app.phoneNumber}</td>
                  <td className="py-2">
                    {app.admitStatus === "02-ยื่นใบสมัครแล้ว" && (
                      <button className="bg-white px-4 py-1 my-2 rounded-lg border border-[#008A90] text-[#008A90]">
                        <div className="flex flex-row gap-1">
                          <div className="pt-1">
                            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18.6438 16.6993L14.5879 12.6365C15.6817 11.3031 16.335 9.59495 16.335 7.73621C16.335 3.46403 12.8738 0 8.60502 0C4.33626 0 0.875 3.46403 0.875 7.73621C0.875 12.0084 4.33626 15.4724 8.60502 15.4724C10.4696 15.4724 12.1801 14.8112 13.5161 13.7092L17.572 17.7683C18.0455 18.2018 18.4896 17.9226 18.6438 17.7683C18.9521 17.4634 18.9521 17.0042 18.6438 16.6993ZM2.38356 7.73621C2.38356 4.29789 5.16945 1.50977 8.60502 1.50977C12.0406 1.50977 14.8301 4.29789 14.8301 7.73621C14.8301 11.1745 12.0442 13.9626 8.60869 13.9626C5.17312 13.9626 2.38356 11.1745 2.38356 7.73621Z" fill="#008A91" />
                            </svg>
                          </div>
                          <div>view</div>
                        </div>
                      </button>
                    )}
                    {app.admitStatus === "09-ยกเลิกการสมัคร" && (
                      <button className="bg-red px-1 py-1 my-2 rounded-lg border border-red-500 text-red-500 text-[12px] w-[120px]">
                        <div className="flex flex-row gap-1">
                          <div className="pt-1">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5.02655 0.00736992C2.26224 -0.00847055 0.0160495 2.21504 0.0094537 4.97341C0.00286904 7.73769 2.23391 9.99135 4.9923 10.0072C7.7566 10.023 10.0028 7.79951 10.0094 5.04114C10.0219 2.27687 7.78494 0.0232018 5.02655 0.00736992ZM4.95821 1.35397C5.20038 1.35433 5.40137 1.44322 5.56708 1.61475C5.73869 1.78039 5.82177 1.98724 5.82223 2.22941C5.82269 2.47158 5.74037 2.67228 5.56941 2.84333C5.40434 3.00847 5.19776 3.09086 4.9615 3.09052C4.71342 3.09015 4.51244 3.00717 4.34084 2.84154C4.17514 2.67591 4.08615 2.46905 4.08569 2.22688C4.08522 1.9788 4.17344 1.7781 4.34442 1.61297C4.50948 1.44192 4.71604 1.35362 4.95821 1.35397ZM3.55078 3.59052L5.84843 3.59387L5.85653 7.87616L6.5476 7.87717L6.54864 8.42648L3.55991 8.42213L3.55888 7.87281L4.24404 7.87381L4.23698 4.14083L3.55181 4.13984L3.55078 3.59052Z" fill="#D92D20" />
                            </svg>
                          </div>
                          <div><strong>เหตุผลการยกเลิก</strong></div>
                        </div>
                      </button>
                    )}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
        <div className="flex justify-between flex-row">

          <div className="items-center mb-4">
            <span className="mx-2">จำนวนรายการที่แสดง</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-400 rounded-xl w-[100px] p-1"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={filteredApplicants.length}>All</option>
            </select>
          </div>

          <div>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="border-2 border-solid border-gray-300 px-3 py-2 rounded-md mx-2"
            >
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.4 6.5L8 11.1L6.6 12.5L0.6 6.5L6.6 0.5L8 1.9L3.4 6.5Z" fill="#1D1B20" />
              </svg>

            </button>

            <span className="bg-[#008A90] px-3 py-[6px] rounded-md text-white">{currentPage}</span>

            <button
              onClick={nextPage}
              disabled={endIndex >= applicant.length}
              className="border-2 border-solid border-gray-300 px-3 py-2 rounded-md mx-2"
            >
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.13125 6.5L0.53125 1.9L1.93125 0.5L7.93125 6.5L1.93125 12.5L0.53125 11.1L5.13125 6.5Z" fill="#1D1B20" />
              </svg>

            </button>
          </div>

        </div>


      </div>
    </div>
  );
};

export default Page;