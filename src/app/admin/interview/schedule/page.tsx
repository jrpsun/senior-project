/* InterviewSchedulePage.tsx */
"use client";
import React, { useState, useRef, useEffect } from "react";
import SideBar from "../../../../components/SideBar";
import AdminNavbar from "../../../../components/adminNavbar";
import SearchField from "../../../../components/form/searchField";
import PopupInterview from "@components/components/common/admin/interview/interviewSchedule/popupInterview";
import PopupAddRoom from "@components/components/common/admin/interview/interviewSchedule/PopupAddRoom";
import PopupInterviewMenu from "@components/components/common/admin/interview/interviewSchedule/PopupInterviewMenu";
import PopupEditInterviewRoom from "@components/components/common/admin/interview/interviewSchedule/PopupEditInterviewRoom";
import PopupDeleteConfirm from "@components/components/common/admin/interview/interviewSchedule/PopupDeleteConfirm";
import AlertAdmin from "@components/components/common/admin/alertAdmin";
import Image from "next/image";
import { InterviewRound } from "@components/types/interviewRound";
import { InterviewCom } from "@components/types/interviewCom";
import { InterviewCommitteeMember, InterviewRoundDetailResponse } from "@components/types/roomDetails";
import { RoomCommittee } from "@components/types/roomCommittee";
import { getDecodedToken } from "@components/lib/auth";
import Modal from "@components/components/common/popup-login";

const InterviewSchedulePage = () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
  const [committees, setCommittees] = useState<InterviewCom[]>([]);
  const [interviewRound, setInterviewRound] = useState<InterviewRound[]>([]);
  const [roomDetails, setRoomDetails] = useState<InterviewRoundDetailResponse[][]>([]);
  const [roomCom, setRoomCom] = useState<RoomCommittee[]>([]);
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
      const [res_com, res_round, res_room_details, res_room_com] = await Promise.all([
        fetch(`${API_BASE_URL}/interview-committee/get-all-interviewC`),
        fetch(`${API_BASE_URL}/education-department/get-interview-round`),
        fetch(`${API_BASE_URL}/education-department/get-interview-room-details`),
        fetch(`${API_BASE_URL}/education-department/get-all-interview-room-committee`)
      ]);

      if (!res_com.ok || !res_round.ok || !res_room_details.ok || !res_room_com.ok) {
        throw new Error("Failed to fetch one or more resources");
      }

      const data_com = await res_com.json();
      const data_round = await res_round.json();
      const data_room_details = await res_room_details.json()
      const data_room_com = await res_room_com.json()

      setCommittees(data_com || []);
      setInterviewRound(data_round.interviewRound || []);
      setRoomDetails(data_room_details.details || []);
      setRoomCom(data_room_com || []);


    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  console.log("committees", committees)
  console.log("round #####", interviewRound)
  console.log('rooms details #####', roomDetails)
  console.log('room com', roomCom)


  const availableCommittees = committees.filter(com =>
    !roomCom.some(room => room.interviewComId === com.interviewComId)
  ).map(com => ({
    interviewComId: com.interviewComId || "",
    prefix: com.prefix || "",
    firstName: com.firstName || "",
    lastName: com.lastName || ""
  }));
  console.log('available com', availableCommittees)


  const allCommittees = committees.map((com) => ({
    interviewComId: com.interviewComId || "",
    prefix: com.prefix || "",
    firstName: com.firstName || "",
    lastName: com.lastName || ""
  }))

  const [interviewRounds, setInterviewRounds] = useState<InterviewRound[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showRoomPopup, setShowRoomPopup] = useState(false);
  interface RoomDetail {
    date: string;
    time: string;
    course: string;
    round: string;
    mode: "on-site" | "online";
    room: string;
    duration: number;
    interviewers: string;
    interviewRoundIndex?: number;
  }


  const [selectedRoom, setSelectedRoom] = useState<InterviewRoundDetailResponse | null>(null);
  const [isRoomMenuOpen, setIsRoomMenuOpen] = useState(false);
  const [roomMenuPosition, setRoomMenuPosition] = useState({ top: 0, left: 0 });
  const [showEditRoomPopup, setShowEditRoomPopup] = useState(false);
  const [editingRoom, setEditingRoom] = useState<InterviewRoundDetailResponse | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<RoomDetail | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentRoundId, setCurrentRoundId] = useState("");
  console.log('current round id', currentRoundId)

  const roomMenuRef = useRef<HTMLDivElement | null>(null);


  const [lastInterviewDetail, setLastInterviewDetail] = useState({
    admissionProgram: "",
    admissionRoundName: "",
    duration: "20",
    endTime: "",
    interviewDate: "",
    interviewRoundId: "",
    startTime: ""
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchValues, setSearchValues] = useState({
    course: "",
    round: "",
    date: "",
    interviewer: "",
  });

  const [filters, setFilters] = useState({
    course: "",
    round: "",
    date: "",
    interviewer: "",
  });

  const getFilteredRoomDetails = () => {
    return roomDetails.filter((item) => {
      const courseMatch = !filters.course || item.admissionProgram === filters.admissionProgram;
      const roundMatch = !filters.round || item.admissionRoundName === filters.admissionRoundName;
      const dateMatch = !filters.date || item.interviewDate === filters.interviewDate;
      //const interviewerMatch = !filters.interviewer || item.interviewers.includes(filters.interviewer);
      return courseMatch && roundMatch && dateMatch; //&& interviewerMatch;
    });
  };

  // const handleSearch = () => {
  //   setFilters(searchValues);
  // };

  const handleReset = () => {
    setFilter({
      program: "",
      round: "",
      date: "",
      com: "",
    });
    setFilterValues({
      program: "",
      round: "",
      date: "",
      com: "",
    });
  };

  const [interviewDetail, setInterviewDetail] = useState({
    admissionProgram: "",
    admissionRoundName: "",
    duration: "20",
    endTime: "",
    interviewDate: "",
    interviewRoundId: "",
    startTime: ""
  });


  const getRoundFromCourse = (course: string) => {
    if (course === "ITDS/B") return "1/68 - MU – Portfolio (TCAS 1)";
    if (course === "ITCS/B") return "1/68 - ICT Portfolio";
    return "";
  };

  console.log("current interviewDetail", interviewDetail)
  const handleSave = async () => {
    const body = {
      admissionProgram: interviewDetail.admissionProgram,
      admissionRoundName: interviewDetail.admissionRoundName,
      interviewDate: interviewDetail.interviewDate,
      startTime: interviewDetail.startTime,
      endTime: interviewDetail.endTime,
      duration: interviewDetail.duration,
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/interview-committee/update-interview-round?round_id=${interviewDetail.interviewRoundId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error('Failed to update interview round.');

      window.location.reload();

    } catch (error) {
      console.error('Error saving interview details:', error);
      alert("การบันทึกข้อมูลล้มเหลว กรุณาลองใหม่");
    }
  };

  const handleCreate = async () => {
    const body = {
      admissionProgram: interviewDetail.admissionProgram,
      admissionRoundName: interviewDetail.admissionRoundName,
      interviewDate: interviewDetail.interviewDate,
      startTime: interviewDetail.startTime,
      endTime: interviewDetail.endTime,
      duration: interviewDetail.duration.toString(),
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/interview-committee/create-interview-round`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error('Failed to create interview round.');

      window.location.reload();

    } catch (error) {
      console.error('Error saving interview details:', error);
      alert("สร้างข้อมูลล้มเหลว กรุณาลองใหม่");
    }
  };


  const handleEditRoomDetails = async (updatedData: {
    interviewRoundId?: string;
    interviewDate?: string;
    interviewStartTime?: string;
    interviewEndTime?: string;
    admissionProgram?: string;
    admissionRoundName?: string;
    interviewRoomId?: string;
    interviewRoom?: string;
    interviewType?: string;
    interviewComs: InterviewCommitteeMember[];
  }) => {
    if (!updatedData.interviewRoomId) {
      alert("ไม่พบข้อมูลห้องสัมภาษณ์");
      return;
    }

    const comIdList = updatedData.interviewComs.map((com) => com.interviewComId);
    const headers = {
      "Content-Type": "application/json",
    };

    console.log("update data", updatedData);

    try {
      const responseRoom = await fetch(
        `${API_BASE_URL}/education-department/update-interview-room-detail`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            interviewRoomId: updatedData.interviewRoomId,
            interviewRoundId: updatedData.interviewRoundId,
            interviewRoom: updatedData.interviewRoom,
            interviewType: updatedData.interviewType,
          }),
        }
      );

      if (!responseRoom.ok) {
        throw new Error("ไม่สามารถอัปเดตรายละเอียดห้องได้");
      }

      const responseDeleteCom = await fetch(
        `${API_BASE_URL}/education-department/delete-interview-room-committee?interview_room_id=${updatedData.interviewRoomId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!responseDeleteCom.ok) {
        throw new Error("ไม่สามารถลบกรรมการเก่าได้");
      }

      const responseAddCom = await fetch(
        `${API_BASE_URL}/education-department/create-interview-room-committee`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            interviewRoomId: updatedData.interviewRoomId,
            interviewComId: comIdList,
          }),
        }
      );

      if (!responseAddCom.ok) {
        throw new Error("ไม่สามารถเพิ่มกรรมการใหม่ได้");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleDeleteRoomDetails = async () => {
    console.log("room to delete", roomToDelete);

    try {
      // First delete: delete-interview-room-committee
      const deleteCommitteeRes = await fetch(
        `${API_BASE_URL}/education-department/delete-interview-room-committee?interview_room_id=${roomToDelete.interviewRoomId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!deleteCommitteeRes.ok) {
        const errorData = await deleteCommitteeRes.json();
        throw new Error(errorData.detail || "Failed to delete interview room committee");
      }

      // Second delete: delete-interview-room-detail
      const deleteDetailRes = await fetch(
        `${API_BASE_URL}/education-department/delete-interview-room-detail?round_id=${roomToDelete.interviewRoundId}&room_id=${roomToDelete.interviewRoomId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!deleteDetailRes.ok) {
        const errorData = await deleteDetailRes.json();
        throw new Error(errorData.detail || "Failed to delete interview room detail");
      }

      console.log("Room deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting interview room:", error);
    }
  };



  const courseOptions = [
    { label: "ITDS/B", value: "ITDS/B" },
    { label: "ITCS/B", value: "ITCS/B" },
  ];

  const roundOptions = [
    { label: "1/68 - MU - Portfolio (TCAS 1)", value: "1/68 - MU - Portfolio (TCAS 1)" },
    { label: "1/68 - ICT Portfolio", value: "1/68 - ICT Portfolio" },
  ];

  const interviewerOptions = committees.map((com) => ({
    label: `อ. ${com.firstName}`,
    value: com.interviewComId,
  }));

  const handleEdit = (item: InterviewRound, index: number) => {
    console.log("item", item)
    setIsEdit(true);
    setShowForm(true);
    setInterviewDetail(item);
    setLastInterviewDetail(item);
    setEditIndex(index);

  };

  const formatThaiDate = (dateStr: string) => {
    if (!dateStr) return "";
    const monthsThai = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];

    const [year, month, day] = dateStr.split("-");
    const thaiYear = parseInt(year) + 543;
    const monthName = monthsThai[parseInt(month) - 1];
    return `${parseInt(day)} ${monthName} ${thaiYear}`;
  };

  const handleSaveRoomDetail = async (updatedData: {
    mode: string;
    room: string;
    interviewers: string[];
  }) => {
    console.log('updated', updatedData)
    const body = {
      interviewRoundId: currentRoundId,
      interviewRoom: updatedData.room,
      interviewType: updatedData.mode,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/education-department/create-interview-room-detail`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create interview room detail.');
      }

      const data = await response.json();

      const interviewRoomId = data?.interviewRoomId;
      if (!interviewRoomId) {
        throw new Error('Missing interviewRoomId in response.');
      }
      const interviewerArray = updatedData.interviewers.split(',').map((id) => id.trim());

      const response_com = await fetch(
        `${API_BASE_URL}/education-department/create-interview-room-committee`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            interviewRoomId: `${interviewRoomId}`,
            interviewComId: interviewerArray,
          }),
        }
      );

      if (!response_com.ok) {
        throw new Error('Failed to assign interviewers to the room.');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error saving interview room details:', error);
      alert("สร้างข้อมูลล้มเหลว กรุณาลองใหม่");
    }
  };

  const handleOpenRoomMenu = (event: React.MouseEvent, room: InterviewRoundDetailResponse) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const menuHeight = 120; // ความสูงของ popup menu
    const top = rect.bottom + window.scrollY + 8;
    const viewportHeight = window.innerHeight;

    const topPosition =
      top + menuHeight > viewportHeight + window.scrollY
        ? rect.top + window.scrollY - menuHeight - 8
        : top;

    setRoomMenuPosition({ top: topPosition, left: rect.left + window.scrollX - 180 });
    setSelectedRoom(room);
    setIsRoomMenuOpen(true);
  };
  const handleCloseRoomMenu = () => {
    setIsRoomMenuOpen(false);
  };
  const handleEditInterviewRoom = (room: RoomDetail) => {
    setEditingRoom(room);
    setShowEditRoomPopup(true);
    setIsRoomMenuOpen(false); // ปิดเมนู 3 จุด
  };
  const handleDeleteInterviewRoom = (room: RoomDetail) => {
    setRoomToDelete(room);
    setShowDeleteConfirm(true);
    setIsRoomMenuOpen(false); // ปิดเมนู 3 จุด
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roomMenuRef.current && !roomMenuRef.current.contains(event.target as Node)) {
        handleCloseRoomMenu();
      }
    };

    if (isRoomMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isRoomMenuOpen]);


  /// handle filter 
  const handleSearch = () => {
    setFilter(filterValues);
  };

  interface FilterState {
    program?: string,
    round?: string,
    date?: string,
    com?: string,
  }

  const [filter, setFilter] = useState<FilterState>();

  const [filterValues, setFilterValues] = useState<FilterState>();

  const FilterInterviewRound = interviewRound.filter(round =>
    (!filter?.program || round.admissionProgram?.includes(filter.program)) &&
    (!filter?.round || round.admissionRoundName?.includes(filter.round)) &&
    (!filter?.date || round.interviewDate?.includes(filter.date))
  );

  const FilteredRoomDetails = roomDetails.filter(room =>
    (!filter?.program || room.admissionProgram?.includes(filter.program)) &&
    (!filter?.round || room.admissionRoundName?.includes(filter.round)) &&
    (!filter?.date || room.interviewDate?.includes(filter.date)) &&
    (!filter?.com || room.interviewComs.some(com => com.interviewComId === filter.com))
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
      <div className="relative z-[50]">
        <AdminNavbar isCollapsed={isCollapsed} />
      </div>
      <div className="flex flex-row flex-1 relative">
        <div className="relative z-50">
          <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} userRoles={roles} />
        </div>
        <div
          className={`flex flex-col w-full p-6 mt-[64px] transition-all bg-white ${isCollapsed ? "ml-[80px]" : "ml-[300px]"
            }`}
        >
          <div className="relative max-w-[1600px] w-full mx-auto p-5 rounded-lg shadow-md mt-4 px-4 md:px-8 z-20 ">
            <h1 className="text-2xl font-semibold text-[#565656] mb-3">ค้นหาข้อมูลการสัมภาษณ์</h1>
            <hr className="mb-4 border-gray-300" />
            <div className="flex flex-wrap items-end gap-4 mt-5">
              <div className="flex-1 min-w-[200px] max-w-[200px] ">
                <SearchField
                  label="หลักสูตร"
                  type="dropdown"
                  value={filterValues?.program || ""}
                  onChange={(option) => {
                    if (typeof option === "object" && option !== null && "value" in option) {
                      setFilterValues({ ...filterValues, program: option.value });
                    } else {
                      setFilterValues({ ...filterValues, program: "" });
                    }
                  }}
                  options={courseOptions}
                  placeholder="เลือกหลักสูตร"
                />
              </div>

              <div className="flex-1 min-w-[350px] max-w-[350px] z-10">
                <SearchField
                  label="รอบรับสมัคร"
                  type="dropdown"
                  value={filterValues?.round || ""}
                  onChange={(option) => {
                    if (typeof option === "object" && option !== null && "value" in option) {
                      setFilterValues({ ...filterValues, round: option.value });
                    } else {
                      setFilterValues({ ...filterValues, round: "" });
                    }
                  }}
                  options={roundOptions}
                  placeholder="เลือกรอบรับสมัคร"
                />

              </div>

              <div className="flex-1 min-w-[200px] max-w-[300px] z-10">
                <div>
                  <label className="block font-bold text-[#565656] mb-1">วันที่สัมภาษณ์</label>
                  <input
                    type="date"
                    value={filterValues?.date}
                    onChange={(e) => setFilterValues({ ...filterValues, date: e.target.value })}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${filterValues?.date ? "text-[#565656]" : "text-gray-400"
                      }`}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-[200px] max-w-[300px]">
                <SearchField
                  label="ผู้สัมภาษณ์"
                  type="dropdown"
                  value={filterValues?.com || ""}
                  onChange={(option) => {
                    if (typeof option === "object" && option !== null && "value" in option) {
                      setFilterValues({ ...filterValues, com: option.value });
                    } else {
                      setFilterValues({ ...filterValues, com: "" });
                    }
                  }}
                  options={interviewerOptions}
                  placeholder="เลือกผู้สัมภาษณ์"
                />
              </div>

              <div className="flex items-end min-w-[150px] gap-2">
                <button
                  className="px-1.5 h-[40px] border border-gray-400 rounded-md text-[#565656] bg-white flex items-center gap-1"
                  onClick={handleReset}
                >
                  <Image src="/images/admin/searchBar/clear_icon.svg" alt="reset" width={16} height={16} className="w-4 h-4" />
                  ล้างค่า
                </button>
                <button
                  onClick={handleSearch}
                  className="bg-[#008A90] hover:bg-[#009198] text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Image src="/images/admin/search_icon_button.svg" alt="Search" width={18} height={18} />
                  ค้นหารายการ
                </button>
              </div>
            </div>
          </div>

          <div className="relative max-w-[1600px] w-full mx-auto px-4 md:px-8 z-10 mt-6">
            <div className="flex justify-end pr-10">
              <button
                className="bg-[#008A90] hover:bg-[#009198] text-white px-2.5 py-2 rounded-[8px] flex items-center gap-2"
                onClick={() => setShowForm(true)}
              >
                <Image src="/images/admin/interview/plus_icon.svg" alt="Add" width={16} height={16} />
                เพิ่มกำหนดการสัมภาษณ์
              </button>
            </div>
          </div>
          <div className="bg-white p-5">
            <h2 className="text-xl font-semibold text-[#565656] mb-4">รอบสัมภาษณ์</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-[#F3F5F6] text-[#565656] text-left">
                  <tr className="h-12">
                    <th className="p-2 w-[60px] whitespace-nowrap text-center">No</th>
                    <th className="p-2 w-[80px] whitespace-nowrap">หลักสูตร</th>
                    <th className="p-2 w-[250px] whitespace-nowrap text-center">รอบรับสมัคร</th>
                    <th className="p-2 w-[130px] whitespace-nowrap">วันที่สัมภาษณ์</th>
                    <th className="p-2 w-[100px] whitespace-nowrap">เวลาเริ่มต้น</th>
                    <th className="p-2 w-[100px] whitespace-nowrap">เวลาสิ้นสุด</th>
                    <th className="p-2 w-[200px] whitespace-nowrap">ระยะเวลาสัมภาษณ์ (ต่อคน)</th>
                    <th className="p-2 w-[300px]"></th>
                    <th className="p-2 w-[150px]"></th>
                  </tr>
                </thead>
                <tbody className="text-[#565656]">
                  {FilterInterviewRound.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="text-center text-gray-400 py-6 text-xl">
                          ยังไม่มีข้อมูลรอบสัมภาษณ์
                        </div>
                      </td>
                    </tr>
                  ) : (
                    FilterInterviewRound.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 w-[60px] text-center whitespace-nowrap">{index + 1}</td>
                        <td className="p-2 w-[80px] whitespace-nowrap">{item.admissionProgram}</td>
                        <td className="p-2 w-[250px] whitespace-nowrap">{item.admissionRoundName}</td>
                        <td className="p-2 w-[130px] whitespace-nowrap">{toThaiDate(item.interviewDate)}</td>
                        <td className="p-2 w-[100px] whitespace-nowrap">{item.startTime}</td>
                        <td className="p-2 w-[100px] whitespace-nowrap">{item.endTime}</td>
                        <td className="p-2 w-[200px] whitespace-nowrap  ">{item.duration} นาที</td>
                        <td className="p-2 w-[300px]">
                          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                            <button
                              className="text-[#F59E0B] border border-[#FCD34D] hover:bg-[#FFF7E6] rounded-[8px] px-5 py-1 flex items-center gap-2 whitespace-nowrap"
                              onClick={() => handleEdit(item, index)}
                            >
                              <Image src="/images/admin/interview/edit_icon.svg" alt="edit" width={25} height={25} />
                              แก้ไข
                            </button>
                            <button
                              className="bg-[#008A90] hover:bg-[#009198] text-white rounded-[8px] px-3 py-1 flex items-center gap-2 whitespace-nowrap"
                              onClick={() => (
                                setShowRoomPopup(true),
                                setCurrentRoundId(`${item.interviewRoundId}`)
                              )}
                            >
                              <Image src="/images/admin/interview/plus_icon.svg" alt="add" width={16} height={16} />
                              เพิ่มห้องสัมภาษณ์
                            </button>
                          </div>
                        </td>
                        <td className="font-bold p-2">
                            จำนวนห้อง: {item.interviewRoomNumber}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="relative max-w-[1600px] w-full mx-auto p-5  px-4 md:px-8 z-10 "></div>
          <div className="bg-white p-5 ">
            <h1 className="text-xl font-semibold text-[#565656] mb-3">รายละเอียดการสัมภาษณ์</h1>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-[#F3F5F6] text-[#565656] text-left">
                  <tr className="h-12">
                    <th className="p-2 whitespace-nowrap w-[80px] text-center">No</th>
                    <th className="p-2 whitespace-nowrap w-[120px]">วันที่สัมภาษณ์</th>
                    <th className="p-2 whitespace-nowrap w-[150px]">เวลา</th>
                    <th className="p-2 whitespace-nowrap w-[100px]">หลักสูตร</th>
                    <th className="p-2 whitespace-nowrap w-[300px]">รอบรับสมัคร</th>
                    <th className="p-2 whitespace-nowrap w-[200px]">รูปแบบการสัมภาษณ์</th>
                    <th className="p-2 whitespace-nowrap w-[200px]">สถานที่สัมภาษณ์</th>
                    <th className="p-2 whitespace-nowrap w-[200px]">ระยะเวลา (ต่อคน)</th>
                    <th className="p-2 whitespace-nowrap w-[300px]">ผู้สัมภาษณ์</th>
                    <th className="p-2 whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody className="text-[#565656]">
                  {FilteredRoomDetails.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center text-gray-400 py-10 text-xl">
                        ยังไม่มีข้อมูลการสัมภาษณ์
                      </td>
                    </tr>
                  ) : (
                    FilteredRoomDetails.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 text-center whitespace-nowrap">{index + 1}</td>
                        <td className="p-2 whitespace-nowrap">{formatThaiDate(item.interviewDate)}</td>
                        <td className="p-2 whitespace-nowrap">{item.interviewStartTime} - {item.interviewEndTime}</td>
                        <td className="p-2 whitespace-nowrap">{item.admissionProgram}</td>
                        <td className="p-2 whitespace-nowrap">{item.admissionRoundName}</td>
                        <td className="p-2 whitespace-nowrap">
                          {item.interviewType === "On-site" ? "ออนไซต์ (On-site)" : "ออนไลน์ (Online)"}
                        </td>
                        <td className="p-2 whitespace-nowrap">{item.interviewRoom}</td>
                        <td className="p-2 whitespace-nowrap">20 นาที</td>
                        <td className="p-2 whitespace-nowrap flex flex-row space-x-1">
                          {item.interviewComs.map((com, index) => (
                            <div key={index}>อ. {com.firstName} |</div>
                          ))}
                        </td>
                        <td className="text-center">
                          <button
                            onClick={(event) => handleOpenRoomMenu(event, item)}
                            style={{ minWidth: "45px", minHeight: "45px" }}
                            className="hover:text-gray-700"
                          >
                            <Image src="/images/admin/permission/select_menu_icon.svg" alt="Menu" width={3.5} height={10} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full shadow-lg relative">
            <PopupInterview
              interviewDetail={interviewDetail}
              setInterviewDetail={setInterviewDetail}
              handleSave={() => {
                handleSave();
                setShowForm(false);
                setIsEdit(false); // reset โหมดหลังจากบันทึก
              }}
              handleCreate={() => {
                handleCreate();
                setShowForm(false);
              }}
              courseOptions={courseOptions}
              roundOptions={
                interviewDetail.admissionRoundName
                  ? [{ label: getRoundFromCourse(interviewDetail.admissionProgram), value: getRoundFromCourse(interviewDetail.admissionProgram) }]
                  : []
              }
              isRoundDisabled={!interviewDetail.admissionProgram}

              onCancel={() => {
                setInterviewDetail({ course: "", round: "", date: "", startTime: "", endTime: "", duration: 20 });
                setShowForm(false);
                setIsEdit(false); // reset โหมดเมื่อยกเลิก
              }}
              isEdit={isEdit}
            />
          </div>
        </div>
      )}
      {showRoomPopup && (
        <PopupAddRoom
          allInterviewers={allCommittees}
          onCancel={() => setShowRoomPopup(false)}
          onSaveRoom={handleSaveRoomDetail}
          interviewDetail={
            isEdit && editIndex !== null
              ? interviewRounds[editIndex]
              : lastInterviewDetail
          }

        />
      )}
      {isRoomMenuOpen && (
        <PopupInterviewMenu
          ref={roomMenuRef}
          position={roomMenuPosition}
          onEdit={() => selectedRoom && handleEditInterviewRoom(selectedRoom)}
          onDelete={() => selectedRoom && handleDeleteInterviewRoom(selectedRoom)}
          onClose={handleCloseRoomMenu}
        />
      )}
      {showEditRoomPopup && editingRoom && (
        <PopupEditInterviewRoom
          allInterviewers={allCommittees}
          roomData={editingRoom}
          onSave={(updatedRoom) => handleEditRoomDetails(updatedRoom)}
          onCancel={() => setShowEditRoomPopup(false)}
        />
      )}
      {showDeleteConfirm && roomToDelete && (
        <PopupDeleteConfirm
          onCancel={() => {
            setShowDeleteConfirm(false);
            setRoomToDelete(null);
          }}
          onConfirm={() => handleDeleteRoomDetails()}
        />
      )}
      {showAlert && (
        <AlertAdmin
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default InterviewSchedulePage;
