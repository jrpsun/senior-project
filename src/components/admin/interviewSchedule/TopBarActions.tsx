import React, { useEffect, useState } from "react";
import Image from "next/image";
import { InterviewRoomDetails } from "@components/types/interviewRooms";

interface TopBarActionsProps {
  isGroupingMode: boolean;
  isGrouped: boolean;
  isAllGrouped: boolean;
  selectedRooms: InterviewRoomDetails[];
  setSelectedRooms: (rooms: InterviewRoomDetails[]) => void;
  selectedRoomId: InterviewRoomDetails[];
  setSelectedRoomId: (roomId: InterviewRoomDetails[]) => void;
  roomOptions: { label: string; value: string }[];
  handleEnterGroupingMode: () => void;
  handleSaveGrouping: () => void;
  canSaveGrouping: boolean;
  handleExportExcel: () => void;
  setIsGroupingMode: (value: boolean) => void;
  showRoomDropdown: boolean;
  setShowRoomDropdown: (value: boolean) => void;
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
}

const TopBarActions: React.FC<TopBarActionsProps> = ({
  isGroupingMode,
  isGrouped,
  isAllGrouped,
  selectedRooms,
  setSelectedRooms,
  selectedRoomId,
  setSelectedRoomId,
  roomOptions,
  handleEnterGroupingMode,
  handleSaveGrouping,
  canSaveGrouping,
  handleExportExcel,
  setIsGroupingMode,
  showRoomDropdown,
  setShowRoomDropdown,
  isEdit,
  setIsEdit
}) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
  const [rooms, setRooms] = useState<InterviewRoomDetails[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const res = await fetch(`${API_BASE_URL}/education-department/get-all-interview-rooms`)

      if (!res.ok) {
        throw new Error("Failed to fetch one or more resources");
      }

      const data = await res.json();

      setRooms(data.room || []);

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  console.log("all rooms", rooms)

  console.log('selected room(s)', selectedRooms)

  return (
    <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
      <div className="flex flex-wrap gap-2 items-center">
        {isGroupingMode && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {selectedRooms.map((room, index) => (
              <div
                key={room.interviewRoomId}
                className="flex items-center bg-gray-100 text-[#565656] rounded-xl px-3 py-0.5"
              >
                {room.interviewRoom}
                <button
                  className="ml-2 text-[#565656] hover:text-gray-700 text-3xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRooms(selectedRooms.filter((r, i) => i !== index));
                    //setSelectedRoomId(selectedRoomId.filter((_, i) => i !== index));
                  }}
                >
                  ×
                </button>
              </div>
            ))}

            <div className="w-[250px] relative">
              <div
                className="w-full min-h-[44px] border border-gray-300 rounded-[8px] px-3 py-0.5 pr-10 flex items-center cursor-pointer"
                onClick={() => setShowRoomDropdown(!showRoomDropdown)}
              >
                <span className={`${selectedRooms.length === 0 ? "text-[#C4C4C4]" : "text-[#565656]"}`}>
                  {selectedRooms.length === 0
                    ? "เลือกห้องสัมภาษณ์"
                    : `เพิ่มห้องสัมภาษณ์ (${selectedRooms.length})`}
                </span>

                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {selectedRooms.length > 0 && showRoomDropdown ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRooms([]);
                        //setSelectedRoomId([]);
                      }}
                    >
                      <Image src="/images/clear_icon.svg" alt="Clear" width={18} height={18} />
                    </button>
                  ) : (
                    <Image src="/images/dropdown_button.svg" alt="Dropdown" width={16} height={16} />
                  )}
                </div>
              </div>

              {showRoomDropdown && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-[200px] overflow-y-auto shadow-md">
                  {rooms
                    .filter((room) => !selectedRooms.some((selected) => selected.interviewRoomId === room.interviewRoomId))
                    .map((room) => (
                      <div
                        key={room.interviewRoomId}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#565656]"
                        onClick={() => {
                          setSelectedRooms([...selectedRooms, room]);
                          //setSelectedRoomId([...selectedRoomId, room.interviewRoomId]);
                        }}
                      >
                        {room.interviewRoom}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isGroupingMode ? (
        <>
          <button
            className="min-w-[160px] border border-[#008A90] text-[#008A90] bg-white px-3 py-2 rounded-md flex items-center gap-2"
            onClick={handleEnterGroupingMode}
          >
            <Image
              src="/images/admin/preliminaryResult/grouping_icon_after.svg"
              alt="จัดกลุ่มอัตโนมัติ"
              width={20}
              height={20}
            />
            <div>จัดกลุ่มอัตโนมัติ 2</div>
          </button>

          <button
            className={`min-w-[160px] px-3 py-2 rounded-[10px] flex items-center gap-2 ${canSaveGrouping ? "bg-[#008A90] hover:bg-[#009198] text-white" : "bg-[#C4C4C4] text-white cursor-not-allowed"}`}
            disabled={!canSaveGrouping}
            onClick={handleSaveGrouping}
          >
            <Image
              src="/images/admin/preliminaryResult/save_icon.svg"
              alt="บันทึกการจัดกลุ่ม"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <div>บันทึกการจัดกลุ่ม</div>
          </button>
        </>
      ) : isAllGrouped ? (
        <>
          <button
            className="min-w-[160px] border border-[#F59E0B] text-[#F59E0B] bg-white  px-3 py-2 rounded-[10px] flex items-center gap-2"
            onClick={() => setIsEdit(!isEdit)}
          >
            <Image
              src="/images/admin/interview/edit_icon.svg"
              alt="แก้ไขการจัดกลุ่ม"
              width={20}
              height={20}
            />
            <div>แก้ไขการจัดกลุ่ม</div>
          </button>

          <button
            className="min-w-[160px] bg-[#00796B] hover:bg-[#028273] text-white px-3 py-2 rounded-md flex items-center gap-2 "
            onClick={handleExportExcel}
          >
            <Image
              src="/images/admin/searchBar/download_icon.svg"
              alt="Download Excel"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <div>Export to Excel</div>
          </button>
        </>
      ) : (
        <>
          <button
            className="min-w-[160px] bg-[#008A90] hover:bg-[#009198] text-white px-3 py-2 rounded-md flex items-center gap-2"
            onClick={() => setIsGroupingMode(!isEdit)}
          >
            <Image
              src="/images/admin/preliminaryResult/grouping_icon_before.svg"
              alt="จัดกลุ่มอัตโนมัติ"
              width={20}
              height={20}
            />
            <div>จัดกลุ่มอัตโนมัติ 1</div>
          </button>

          <button
            className="min-w-[160px] bg-[#C4C4C4] text-white px-3 py-2 rounded-md flex items-center gap-2 cursor-not-allowed"
            disabled
            title="โปรดจัดกลุ่มผู้สมัครก่อน"
          >
            <Image
              src="/images/admin/searchBar/download_icon.svg"
              alt="Download Excel"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <div>Export to Excel</div>
          </button>
        </>
      )}
    </div>
  );
};

export default TopBarActions;
