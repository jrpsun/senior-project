"use client";
import React, { useState, useEffect } from "react";
import SideBar from "../../../../components/SideBar";
import AdminNavbar from "../../../../components/adminNavbar";
import SearchField from "../../../../components/form/searchField";
import PopupAdmissionRound from "../../../../components/common/admin/popupAdmissionRound";
import Image from "next/image";
import { format, parse } from "date-fns";
import { th } from "date-fns/locale";
import AlertAdmin from "../../../../components/common/admin/alertAdmin";
import { Span } from "next/dist/trace";
import { getDecodedToken } from "@components/lib/auth";
import Modal from "@components/components/common/popup-login";


const AdmissionRoundsPage = () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
  const [admissionRound, setAdmissionRound] = useState<AdmissionRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [id, setId] = useState('');

  useEffect(() => {
    const decoded = getDecodedToken();
    if (!decoded) {
      setShowModal(true);
      return;
    }
    setRoles(decoded.roles);
    setId(decoded.id);
  }, []);


  async function fetchData() {
    try {
      const [res_ad] = await Promise.all([
        fetch(`${API_BASE_URL}/admission/`)
      ]);

      if (!res_ad.ok) {
        throw new Error("Failed to fetch one or more resources");
      }

      const data_ad = await res_ad.json();

      setAdmissionRound(data_ad || []);

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  console.log("ad", admissionRound)


  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedRound, setSelectedRound] = useState<{ value: string; label: string } | null>(null);
  const [selectedYear, setSelectedYear] = useState<{ value: string; label: string } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<{ value: string; label: string } | null>(null);
  const [isAddRoundOpen, setIsAddRoundOpen] = useState(false);
  const [isEditRoundOpen, setIsEditRoundOpen] = useState(false);
  const [isDeleteRoundOpen, setIsDeleteRoundOpen] = useState(false);
  const [selectedEditRound, setSelectedEditRound] = useState<{
    id: number;
    course: { value: string; label: string } | null;
    roundName: string;
    academicYear: { value: string; label: string } | null;
    startDate: string;
    endDate: string;
  } | null>(null);
  const [selectedDeleteRound, setSelectedDeleteRound] = useState<AdmissionRound | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);


  interface FormatDateToDisplay {
    (dateString: string): string;
  }

  const formatDateToDisplay: FormatDateToDisplay = (dateString) => {
    if (!dateString) return "";

    const date = parse(dateString, "yyyy-MM-dd", new Date());
    const year = date.getFullYear();

    return format(date, `dd LLL ${year.toString().slice(-2)}`, { locale: th });
  };

  const courseMapping = {
    "หลักสูตร DST (ไทย)": "หลักสูตร DST (ไทย)",
    "หลักสูตร ICT (นานาชาติ)": "หลักสูตร ICT (นานาชาติ)"
  };
  const courseMappingReverse = {
    "หลักสูตร DST (ไทย)": "หลักสูตร DST (ไทย)",
    "หลักสูตร ICT (นานาชาติ)": "หลักสูตร ICT (นานาชาติ)"
  };
  interface DetermineAdmissionStatus {
    (startDate: string, endDate: string): string;
  }

  const determineAdmissionStatus: DetermineAdmissionStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) {
      return "กำลังจะเปิดรับสมัคร"; // ยังไม่ถึงวันเปิดรับสมัคร
    } else if (today >= start && today <= end) {
      return "เปิดรับสมัคร"; // อยู่ในช่วงเปิดรับสมัคร
    } else {
      return "ปิดรับสมัคร"; // เลยกำหนดวันปิดรับสมัครแล้ว
    }
  };

  interface NewRound {
    course: { value: string; label: string } | null;
    roundName: string;
    academicYear: { value: string; label: string } | null;
    startDate: string;
    endDate: string;
  }

  interface AdmissionRound {
    id: string;
    course: string;
    round: string;
    year: string;
    start: string;
    end: string;
  }

  const handleSaveAddRound = async (newRound: NewRound) => {
    const body = {
      admissionId: `${Math.random().toString(36).substring(2, 11)}`,
      program: newRound.course?.value,
      roundName: newRound.roundName,
      academicYear: newRound.academicYear?.value,
      startDate: newRound.startDate,
      endDate: newRound.endDate,
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/admission/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error('Failed to create admission round.');
      else {
        setAlertMessage("เพิ่มรอบรับสมัครสำเร็จ!");
        window.location.reload();
      }


    } catch (error) {
      console.error('Error saving admission round details:', error);
      alert("สร้างข้อมูลล้มเหลว กรุณาลองใหม่");
    }

  };
  const [admissionRounds, setAdmissionRounds] = useState([
    {
      id: 1,
      course: "หลักสูตร DST (ไทย)",
      round: "รอบ 1 MU – Portfolio (TCAS 1) ",
      year: "2568",
      period: "01 ม.ค. 25 – 31 มี.ค. 25",
      status: "เปิดรับสมัคร",
    },
    {
      id: 2,
      course: "หลักสูตร ICT (นานาชาติ)",
      round: "รอบ 1 ICT – Portfolio ",
      year: "2568",
      period: "20 พ.ย. 24 – 30 ธ.ค. 24",
      status: "ปิดรับสมัคร",
    },
  ]);
  const currentYear = new Date().getFullYear() + 543;
  const yearOptions = React.useMemo(() => {
    return [{ value: "ทั้งหมด", label: "แสดงทุกปี" }, ...Array.from({ length: 5 }, (_, i) => {
      const year = currentYear - 2 + i;
      return { value: String(year), label: String(year) };
    })];
  }, [currentYear]);

  const [filteredAdmissionRounds, setFilteredAdmissionRounds] = useState(admissionRound);
  console.log("filteredAdmissionRounds", filteredAdmissionRounds)

  const thaiMonths = {
    "ม.ค.": "Jan", "ก.พ.": "Feb", "มี.ค.": "Mar", "เม.ย.": "Apr",
    "พ.ค.": "May", "มิ.ย.": "Jun", "ก.ค.": "Jul", "ส.ค.": "Aug",
    "ก.ย.": "Sep", "ต.ค.": "Oct", "พ.ย.": "Nov", "ธ.ค.": "Dec"
  };

  interface ConvertThaiDateToEnglish {
    (thaiDate: string): string | null;
  }

  const convertThaiDateToEnglish: ConvertThaiDateToEnglish = (thaiDate) => {
    const parts = thaiDate.split(" ");
    if (parts.length !== 3) return null;
    const day = parts[0];
    const month = thaiMonths[parts[1] as keyof typeof thaiMonths] || null;
    const year = "20" + parts[2]; // เปลี่ยน 25 → 2025
    return month ? `${day} ${month} ${year}` : null;
  };


  useEffect(() => {
    setFilteredAdmissionRounds(admissionRound);
  }, [admissionRound]);

  const handleEdit = (round: AdmissionRound) => {
    // if (!round.period) return;

    // // แปลง period เป็น yyyy-MM-dd
    // const periodParts = round.period.split("–").map(date => date.trim());
    // const startDate = convertThaiDateToEnglish(periodParts[0]);
    // const endDate = convertThaiDateToEnglish(periodParts[1]);
    setSelectedRoundId(round.admissionId)
    setSelectedEditRound({
      id: round.admissionId,
      course: round.program ? { value: round.program, label: round.program } : null,
      roundName: round.roundName,//.replace(/ ปีการศึกษา \d{4}/, "").trim(),
      academicYear: round.academicYear ? { value: round.academicYear, label: round.academicYear } : null,
      startDate: round.startDate, //? format(parse(startDate, "dd MMM yyyy", new Date()), "yyyy-MM-dd") : "",
      endDate: round.endDate //? format(parse(endDate, "dd MMM yyyy", new Date()), "yyyy-MM-dd") : "",
    });

    setIsEditRoundOpen(true);
  };
  console.log("selected round", selectedEditRound)

  const [selectedRoundId, setSelectedRoundId] = useState("")
  console.log("selected round id", selectedRoundId)
  const handleSaveEditRound = async (updatedRound: NewRound) => {
    const body = {
      program: updatedRound.course?.value,
      roundName: updatedRound.roundName,
      academicYear: updatedRound.academicYear?.value,
      startDate: updatedRound.startDate,
      endDate: updatedRound.endDate,
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/admission/${selectedRoundId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error('Failed to update admission round.');
      else {
        setAlertMessage("แก้ไขรอบรับสมัครสำเร็จ!");
        window.location.reload();
      }


    } catch (error) {
      console.error('Error saving admission round details:', error);
      alert("แก้ไขข้อมูลล้มเหลว กรุณาลองใหม่");
    }
  };

  const handleDelete = (round: AdmissionRound) => {
    setSelectedRoundId(round.admissionId)
    setSelectedDeleteRound(round); // กำหนดค่ารอบที่ต้องการลบ
    setIsDeleteRoundOpen(true); // เปิด Popup ยืนยันการลบ
  };

  const handleDeleteRound = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admission/${selectedRoundId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete admission round.');
      else {
        setAlertMessage("ลบรอบรับสมัครสำเร็จ!");
        window.location.reload();
      }


    } catch (error) {
      console.error('Error deleting admission round details:', error);
      alert("ลบข้อมูลล้มเหลว กรุณาลองใหม่");
    }
  };

  // ตัวเลือกสำหรับ Dropdown
  const roundOptions = admissionRound.map((round) => ({
    value: round.round,
    label: round.round,
  }));

  const statusOptions = React.useMemo(() => [
    { value: "ทั้งหมด", label: "แสดงทั้งหมด" },
    { value: "เปิดรับสมัคร", label: "เปิดรับสมัคร" },
    { value: "กำลังจะเปิดรับสมัคร", label: "กำลังจะเปิดรับสมัคร" },
    { value: "ปิดรับสมัคร", label: "ปิดรับสมัคร" },
  ], []);

  // ทำให้ค่าที่เลือกแสดงใน dropdown
  useEffect(() => {
    if (selectedRound && typeof selectedRound === "string") {
      setSelectedRound(roundOptions.find(option => option.value === selectedRound) || null);
    }
    if (selectedYear && typeof selectedYear === "string") {
      setSelectedYear(yearOptions.find(option => option.value === selectedYear) || null);
    }
    if (selectedStatus && typeof selectedStatus === "string") {
      setSelectedStatus(statusOptions.find(option => option.value === selectedStatus) || null);
    }
  }, [selectedRound, selectedYear, selectedStatus, roundOptions, statusOptions, yearOptions]);

  // const handleSearch = () => {
  //   const filteredRounds = admissionRound.filter((round) => {
  //     const roundMatch = selectedRound ? round.round.includes(selectedRound.value) : true;
  //     const yearMatch = selectedYear ? round.year === selectedYear.value || selectedYear.value === "ทั้งหมด" : true;
  //     //const statusMatch = selectedStatus ? round.status === selectedStatus.value || selectedStatus.value === "ทั้งหมด" : true;

  //     return roundMatch && yearMatch //&& statusMatch;
  //   });

  //   setFilteredAdmissionRounds(filteredRounds);
  // };

  const currentDate = new Date().toISOString().split('T')[0]; // ปี เดือน วัน ปัจจุบัน
  console.log("current date", currentDate)

  ///handle search

  const handleSearch = () => {
    setFilters(filterValues);
  };

  interface FilterState {
    round?: string,
    year?: string,
    available?: string
  }

  const [filters, setFilters] = useState<FilterState>();

  const [filterValues, setFilterValues] = useState<FilterState>();

  const filteredApplicants = admissionRound.filter(ad =>
    (!filters?.round || ad.roundName?.includes(filters.round)) &&
    (!filters?.year || ad.academicYear === filters.year)
    //(!filters?.available || ad.available?.includes(filters.available)) 
  );

  // handle change eng date to thai date
  function toThaiDate(dateStr: string): string {
    const monthsThaiShort = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ]
  
    const [year, month, day] = dateStr.split("-").map(Number);
    const thaiYear = year + 543;
    const thaiMonth = monthsThaiShort[month - 1];
  
    return `${day} ${thaiMonth} ${thaiYear}`;
  }

  
  return (
    <div className="flex flex-col h-screen bg-white">
      {showModal && <Modal role="admin" />}
      {alertMessage && <AlertAdmin message={alertMessage} onClose={() => setAlertMessage(null)} />}
      <AdminNavbar isCollapsed={isCollapsed} />
      <div className="flex flex-row flex-1">
        {/* Sidebar */}
        <div className="relative z-50">
          <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} userRoles={roles} />
        </div>
        <div className={`flex flex-col w-full p-6 mt-[64px] transition-all bg-white ${isCollapsed ? "ml-[80px]" : "ml-[300px]"}`}>

          {/* ส่วนค้นหารอบรับสมัคร */}
          <div className="relative max-w-[1600px] w-full mx-auto p-5 rounded-lg shadow-md mt-6 mb-6 px-4 md:px-8 z-10 ">
            <h1 className="text-2xl font-bold text-[#565656] mb-5">ค้นหารอบรับสมัคร</h1>
            <hr className="mb-4 border-gray-300" />

            <div className="flex flex-wrap items-end gap-4 mt-5 relative z-10 overflow-visible">
              <div className="flex-1 min-w-[300px] max-w-[750px] relative z-10">
                <SearchField
                  label=""
                  value={filterValues?.round || ""}
                  onChange={(value) => {
                    if (typeof value === "object" && value !== null && "value" in value) {
                      setFilterValues({ ...filterValues, round: value.value });
                    } else {
                      setFilterValues({ ...filterValues, round: value ?? undefined });
                    }
                  }}
                  placeholder="ค้นหารอบรับสมัครหรือปี"
                  customWidth="100%"
                />
              </div>

              <div className="w-full max-w-[200px] relative z-10">
                <SearchField
                  label=""
                  type="dropdown"
                  value={filterValues?.year || ""}
                  onChange={(option) => {
                    if (typeof option === "object" && option !== null && "value" in option) {
                      setFilterValues({ ...filterValues, year: option.value });
                    } else {
                      setFilterValues({ ...filterValues, year: "" });
                    }
                  }}
                  options={yearOptions}
                  placeholder="เลือกปีการศึกษา"
                />
              </div>

              <div className="w-full max-w-[250px] relative z-10">
                <SearchField
                  label=""
                  value={selectedStatus?.value || null}
                  onChange={(selectedOption) => {
                    if (selectedOption && typeof selectedOption !== "string") {
                      setSelectedStatus(selectedOption);
                    } else {
                      setSelectedStatus(null);
                    }
                  }}
                  placeholder="แสดงทั้งหมด"
                  type="dropdown"
                  options={statusOptions}
                />
              </div>

              {/* ปุ่มค้นหา */}
              <button
                onClick={handleSearch}
                className="bg-[#008A90] hover:bg-[#009198] text-white px-4 py-2 rounded flex items-center gap-2 min-w-[150px] relative z-20"
              >
                <Image src="/images/admin/search_icon_button.svg" alt="Search" width={18} height={18} />
                ค้นหารายการ
              </button>
            </div>
          </div>

          {/* ตารางแสดงรอบรับสมัคร */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 px-6">
            <h2 className="text-lg font-bold text-[#565656] whitespace-nowrap">
              รอบรับสมัคร <span className="text-[#6B7280] font-bold">{filteredApplicants.length}</span>
            </h2>

            {/* ปุ่มรอบรับสมัคร */}
            <div className="mt-2 md:mt-0 md:self-end">
              <button
                className="bg-[#008A90] hover:bg-[#009198] text-white px-4 py-1.5 flex items-center gap-2 md:mr-20 rounded-lg"
                onClick={() => setIsAddRoundOpen(true)} // เปิด popup
              >
                <span className="text-2xl text-white">+</span> เพิ่มรอบรับสมัคร
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full min-w-[1200px] border-collapse">
              <thead className="bg-[#F3F5F6] text-[#565656]">
                <tr>
                  <th className="px-6 py-3 whitespace-nowrap text-left">No</th>
                  <th className="px-6 py-3 whitespace-nowrap text-left">หลักสูตร</th>
                  <th className="px-6 py-3 whitespace-nowrap text-left">รอบรับสมัคร</th>
                  <th className="px-6 py-3 whitespace-nowrap text-left">ระยะเวลาการรับสมัคร</th>
                  <th className="px-6 py-3 whitespace-nowrap text-center w-[180px] pr-10">สถานะ</th>
                  <th className="px-6 py-3 whitespace-nowrap">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((round, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-[#565656]">{index + 1}</td>
                    <td className="px-6 py-3 text-[#565656]">{round.program}</td>
                    <td className="px-6 py-3 text-[#565656]">
                      {/*round.round.includes("ปีการศึกษา") ? round.round : `${round.round} ปีการศึกษา ${round.year || "ไม่ระบุ"}`*/}
                      {round.roundName}
                    </td>
                    <td className="px-6 py-3 text-[#565656]">{toThaiDate(round.startDate)} - {toThaiDate(round.endDate)}</td>
                    <td className="px-6 py-3 text-[#565656] text-center w-[240px]">
                      {(currentDate >= round.startDate) && (currentDate <= round.endDate) ? (
                        <span className="px-6 py-0.5 rounded-[10px] text-[#13522B] bg-[#E2F5E2]">
                          เปิดรับสมัคร
                        </span>
                      ) : currentDate < round.startDate ? (
                        <span className="px-6 py-0.5 rounded-[10px] text-[#DAA520] bg-[#FFF4E2]">
                          กำลังจะเปิดรับสมัคร
                        </span>
                      ) : (
                        <span className="px-6 py-0.5 rounded-[10px] text-red-500 bg-red-100">
                          ปิดรับสมัคร
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-center flex justify-center gap-1">
                      {/* ปุ่มแก้ไข */}
                      <button onClick={() => handleEdit(round)} className="p-2 rounded-lg hover:bg-gray-200 transition">
                        <Image src="/images/admin/addRound/edit_icon.svg" alt="Edit" width={15} height={16} />
                      </button>
                      {/* ปุ่มลบ */}
                      <button onClick={() => handleDelete(round)} className="p-2 rounded-lg hover:bg-gray-200 transition">
                        <Image src="/images/admin/addRound/delete_icon.svg" alt="Delete" width={15} height={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isAddRoundOpen && (
            <PopupAdmissionRound
              isOpen={isAddRoundOpen}
              onClose={() => setIsAddRoundOpen(false)}
              onSave={handleSaveAddRound}
              courseMapping={courseMapping}
              courseMappingReverse={courseMappingReverse}
            />
          )}
          {isEditRoundOpen && selectedEditRound && (
            <PopupAdmissionRound
              isOpen={isEditRoundOpen}
              onClose={() => setIsEditRoundOpen(false)}
              onSave={handleSaveEditRound}
              initialData={{
                ...selectedEditRound,
                course: selectedEditRound.course,
                academicYear: selectedEditRound.academicYear,
              }}
              courseMapping={courseMapping}
              courseMappingReverse={courseMappingReverse}
            />
          )}
          {isDeleteRoundOpen && selectedDeleteRound && (
            <PopupAdmissionRound
              isOpen={isDeleteRoundOpen}
              onClose={() => setIsDeleteRoundOpen(false)}
              onDelete={handleDeleteRound}
              isDeleteMode={true}
              onSave={() => { }} // Provide a dummy function or appropriate logic
              courseMapping={courseMapping}
              courseMappingReverse={courseMappingReverse}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionRoundsPage;
