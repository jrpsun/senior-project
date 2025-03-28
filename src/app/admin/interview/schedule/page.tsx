/* InterviewSchedulePage.tsx */
"use client";
import React, { useState, useRef, useEffect } from "react";
import SideBar from "../../../../components/SideBar";
import AdminNavbar from "../../../../components/adminNavbar";
import SearchField from "../../../../components/form/searchField";
import PopupInterview from "@components/components/common/admin/interviewSchedule/popupInterview";
import PopupAddRoom from "@components/components/common/admin/interviewSchedule/PopupAddRoom";
import PopupInterviewMenu from "@components/components/common/admin/interviewSchedule/PopupInterviewMenu";
import PopupEditInterviewRoom from "@components/components/common/admin/interviewSchedule/PopupEditInterviewRoom";
import PopupDeleteConfirm from "@components/components/common/admin/interviewSchedule/PopupDeleteConfirm";
import AlertAdmin from "@components/components/common/admin/alertAdmin";
import Image from "next/image";

const InterviewSchedulePage = () => {
  interface InterviewRound {
    course: string;
    round: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
  }

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

  const [roomDetails, setRoomDetails] = useState<RoomDetail[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
  const [isRoomMenuOpen, setIsRoomMenuOpen] = useState(false);
  const [roomMenuPosition, setRoomMenuPosition] = useState({ top: 0, left: 0 });
  const [showEditRoomPopup, setShowEditRoomPopup] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomDetail | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<RoomDetail | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const roomMenuRef = useRef<HTMLDivElement | null>(null);


  const [lastInterviewDetail, setLastInterviewDetail] = useState({
    course: "",
    round: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: 0,
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
      const courseMatch = !filters.course || item.course === filters.course;
      const roundMatch = !filters.round || item.round === filters.round;
      const dateMatch = !filters.date || item.date === filters.date;
      const interviewerMatch = !filters.interviewer || item.interviewers.includes(filters.interviewer);
      return courseMatch && roundMatch && dateMatch && interviewerMatch;
    });
  };

  const handleSearch = () => {
    setFilters(searchValues);
  };

  const handleReset = () => {
    setSearchValues({
      course: "",
      round: "",
      date: "",
      interviewer: "",
    });
  };

  const [interviewDetail, setInterviewDetail] = useState({
    course: "",
    round: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: 20,
  });
  const getRoundFromCourse = (course: string) => {
    if (course === "ITDS/B") return "1/68 - MU – Portfolio (TCAS 1)";
    if (course === "ITCS/B") return "1/68 - ICT Portfolio";
    return "";
  };

  const handleSave = () => {
    const course = interviewDetail.course;
    const newRound = {
      course,
      round: getRoundFromCourse(course),

      date: interviewDetail.date,
      startTime: interviewDetail.startTime,
      endTime: interviewDetail.endTime,
      duration: interviewDetail.duration,
    };

    if (isEdit && editIndex !== null) {
      // แก้ไขรายการเดิมใน interviewRounds
      const updatedRounds = [...interviewRounds];
      updatedRounds[editIndex] = newRound;
      setInterviewRounds(updatedRounds);

      // แก้ไขรายการที่เกี่ยวข้องใน roomDetails
      const updatedRoomDetails = roomDetails.map((room) => {
        if (room.interviewRoundIndex === editIndex) {
          return {
            ...room,
            date: interviewDetail.date,
            time: `${interviewDetail.startTime} - ${interviewDetail.endTime}`,
            course: interviewDetail.course,
            round: interviewDetail.round,
            duration: interviewDetail.duration,
          };
        }
        return room;
      });

      setRoomDetails(updatedRoomDetails);
    } else {
      // เพิ่มใหม่
      setInterviewRounds((prev) => [...prev, newRound]);
    }

    setLastInterviewDetail({ ...interviewDetail, duration: Number(interviewDetail.duration) });

    // reset
    setInterviewDetail({ course: "", round: "", date: "", startTime: "", endTime: "", duration: 20 });
    setIsEdit(false);
    setEditIndex(null);
    setShowForm(false);
    setAlertMessage(isEdit ? "แก้ไขข้อมูลรอบสัมภาษณ์สำเร็จ" : "เพิ่มข้อมูลรอบสัมภาษณ์สำเร็จ");
    setShowAlert(true);

  };

  const courseOptions = [
    { label: "ITDS/B", value: "ITDS/B" },
    { label: "ITCS/B", value: "ITCS/B" },
  ];

  const roundOptions = [
    { label: "1/68 - MU – Portfolio (TCAS 1)", value: "1/68 - MU – Portfolio (TCAS 1)" },
    { label: "1/68 - ICT Portfolio", value: "1/68 - ICT Portfolio" },
  ];

  const allInterviewers = ["อ. พิสุทธิ์ธร", "อ. อารดา", "อ. จินต์พิชชา", "อ. คธากร"];

  const interviewerOptions = allInterviewers.map((name) => ({
    label: name,
    value: name,
  }));

  const handleEdit = (item: InterviewRound, index: number) => {
    setInterviewDetail(item);
    setLastInterviewDetail(item);
    setEditIndex(index);
    setIsEdit(true);
    setShowForm(true);
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
  const handleSaveRoomDetail = (data: RoomDetail) => {
    const roundIndex = editIndex !== null ? editIndex : interviewRounds.length - 1;

    const updatedRoom = {
      ...data,
      interviewRoundIndex: roundIndex,
    };
    setRoomDetails((prev) => [...prev, updatedRoom]);
    setAlertMessage("เพิ่มห้องสัมภาษณ์สำเร็จ");
    setShowAlert(true);

  };
  const handleOpenRoomMenu = (event: React.MouseEvent, room: RoomDetail) => {
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

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="relative z-[50]">
        <AdminNavbar isCollapsed={isCollapsed} />
      </div>
      <div className="flex flex-row flex-1 relative">
        <div className="relative z-[50]">
          <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
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
                  placeholder="เลือกหลักสูตร"
                  value={searchValues.course}
                  type="dropdown"
                  options={courseOptions}
                  onChange={(selectedOption) =>
                    setSearchValues({ ...searchValues, course: typeof selectedOption === "string" ? "" : selectedOption?.value || "" })
                  }
                />
              </div>

              <div className="flex-1 min-w-[350px] max-w-[350px] z-10">
                <SearchField
                  label="รอบรับสมัคร"
                  placeholder="เลือกรอบรับสมัคร"
                  value={searchValues.round}
                  type="dropdown"
                  options={roundOptions}
                  isDisabled={!searchValues.course}
                  onChange={(selectedOption) =>
                    setSearchValues({
                      ...searchValues,
                      round: typeof selectedOption === "string" ? "" : selectedOption?.value || ""
                    })
                  }
                />

              </div>

              <div className="flex-1 min-w-[200px] max-w-[300px] z-10">
                <div>
                  <label className="block font-bold text-[#565656] mb-1">วันที่สัมภาษณ์</label>
                  <input
                    type="date"
                    value={searchValues.date}
                    onChange={(e) => setSearchValues({ ...searchValues, date: e.target.value })}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${searchValues.date ? "text-[#565656]" : "text-gray-400"
                      }`}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-[200px] max-w-[300px]">
                <SearchField
                  label="ผู้สัมภาษณ์"
                  placeholder="เลือกผู้สัมภาษณ์"
                  type="dropdown"
                  value={searchValues.interviewer}
                  options={interviewerOptions}
                  onChange={(selectedOption) =>
                    setSearchValues({ ...searchValues, interviewer: typeof selectedOption === "string" ? "" : selectedOption?.value || "" })
                  }
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
                  </tr>
                </thead>
                <tbody className="text-[#565656]">
                  {interviewRounds.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="text-center text-gray-400 py-6 text-xl">
                          ยังไม่มีข้อมูลรอบสัมภาษณ์
                        </div>
                      </td>
                    </tr>
                  ) : (
                    interviewRounds.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 w-[60px] text-center whitespace-nowrap">{index + 1}</td>
                        <td className="p-2 w-[80px] whitespace-nowrap">{item.course}</td>
                        <td className="p-2 w-[250px] whitespace-nowrap">{item.round}</td>
                        <td className="p-2 w-[130px] whitespace-nowrap">{formatThaiDate(item.date)}</td>
                        <td className="p-2 w-[100px] whitespace-nowrap">{item.startTime}</td>
                        <td className="p-2 w-[100px] whitespace-nowrap">{item.endTime}</td>
                        <td className="p-2 w-[200px] whitespace-nowrap  ">{item.duration} นาที</td>
                        <td className="p-2 w-[300px]">
                          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                            <button
                              className="text-[#DAA520] border border-[#DAA520] rounded-[8px] px-5 py-1 flex items-center gap-2 whitespace-nowrap"
                              onClick={() => handleEdit(item, index)}
                            >
                              <Image src="/images/admin/interview/edit_icon.svg" alt="edit" width={25} height={25} />
                              แก้ไข
                            </button>
                            <button
                              className="bg-[#008A90] hover:bg-[#009198] text-white rounded-[8px] px-3 py-1 flex items-center gap-2 whitespace-nowrap"
                              onClick={() => setShowRoomPopup(true)}
                            >
                              <Image src="/images/admin/interview/plus_icon.svg" alt="add" width={16} height={16} />
                              เพิ่มห้องสัมภาษณ์
                            </button>
                          </div>
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
                  {getFilteredRoomDetails().length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center text-gray-400 py-10 text-xl">
                        ยังไม่มีข้อมูลการสัมภาษณ์
                      </td>
                    </tr>
                  ) : (
                    getFilteredRoomDetails().map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 text-center whitespace-nowrap">{index + 1}</td>
                        <td className="p-2 whitespace-nowrap">{formatThaiDate(item.date)}</td>
                        <td className="p-2 whitespace-nowrap">{item.time}</td>
                        <td className="p-2 whitespace-nowrap">{item.course}</td>
                        <td className="p-2 whitespace-nowrap">{item.round}</td>
                        <td className="p-2 whitespace-nowrap">
                          {item.mode === "on-site" ? "ออนไซต์ (On-site)" : "ออนไลน์ (Online)"}
                        </td>
                        <td className="p-2 whitespace-nowrap">{item.room}</td>
                        <td className="p-2 whitespace-nowrap">{item.duration} นาที</td>
                        <td className="p-2 whitespace-nowrap">{item.interviewers}</td>
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
              courseOptions={courseOptions}
              roundOptions={
                interviewDetail.course
                  ? [{ label: getRoundFromCourse(interviewDetail.course), value: getRoundFromCourse(interviewDetail.course) }]
                  : []
              }
              isRoundDisabled={!interviewDetail.course}

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
          roomData={editingRoom}
          onSave={(updatedRoom) => {
            // อัปเดต roomDetails
            setRoomDetails(prev =>
              prev.map(r =>
                r === editingRoom
                  ? { ...r, ...updatedRoom, mode: updatedRoom.mode as "on-site" | "online" }
                  : r
              )
            );
            setShowEditRoomPopup(false);
            setAlertMessage("แก้ไขข้อมูลห้องสัมภาษณ์สำเร็จ");
            setShowAlert(true);

          }}
          onCancel={() => setShowEditRoomPopup(false)}
        />
      )}
      {showDeleteConfirm && roomToDelete && (
        <PopupDeleteConfirm
          onCancel={() => {
            setShowDeleteConfirm(false);
            setRoomToDelete(null);
          }}
          onConfirm={() => {
            setRoomDetails(prev => prev.filter(r => r !== roomToDelete));
            setShowDeleteConfirm(false);
            setRoomToDelete(null);
            setAlertMessage("ลบข้อมูลการสัมภาษณ์สำเร็จ");
            setShowAlert(true);

          }}
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
