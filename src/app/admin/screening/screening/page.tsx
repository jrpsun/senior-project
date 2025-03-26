"use client";
import React, { useState } from "react";
import SideBar from "../../../../components/SideBar";
import AdminNavbar from "../../../../components/adminNavbar";
import AlertAdmin from "../../../../components/common/admin/alertAdmin";
import CustomSelect from "../../../../components/form/CustomSelect";
import FormField from "../../../../components/form/FormField";
import Image from "next/image";
import ApplicantHeader from "../../../../components/applicantHeader";


const ScreeningResultPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [screeningResult, setScreeningResult] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [applicationStatus, setApplicationStatus] = useState({
    label: "สถานะการสมัคร",
    value: "03 - รอพิจารณา",
    color: "bg-[#FFF4E2] text-[#DAA520]",
  });

  const handleSubmitScreening = () => {
    if (!screeningResult) {
      setAlertMessage("กรุณาเลือกผลการคัดกรองก่อนบันทึก");
      return;
    }

    const screeningData = {
      result: screeningResult,
      comment: comment,
      applicantId: "0000005",
    };

    console.log("ส่งข้อมูลคัดกรอง: ", screeningData);

    if (screeningResult === "ผ่านการคัดกรอง") {
      setApplicationStatus({
        label: "สถานะการสมัคร",
        value: "04 - ผ่านการพิจารณา",
        color: "bg-[#E2F5E2] text-[#166534]",
      });
    } else if (screeningResult === "ไม่ผ่านการคัดกรอง") {
      setApplicationStatus({
        label: "สถานะการสมัคร",
        value: "05 - ไม่ผ่านการพิจารณา",
        color: "bg-[#FEE2E2] text-[#D92D20]",
      });
    }

    setAlertMessage("บันทึกผลการคัดกรองเรียบร้อยแล้ว");
    setIsSubmitted(true);
    setHasSubmittedOnce(true);
    setSubmittedAt(new Date());
  };


  const handleBackClick = () => {
    // ถ้ายังไม่เคยกดบันทึกเลย → show popup
    if (!hasSubmittedOnce) {
      setShowConfirmModal(true);
      return;
    }

    // ถ้ากำลังอยู่ในโหมดแก้ไขหลังจากเคยบันทึกแล้ว → อนุญาตให้กลับได้เลย
    if (!isSubmitted && hasSubmittedOnce) {
      window.location.href = "/camp";
      return;
    }

    // กรณีอื่น เช่น อยู่ในโหมดดู → ก็กลับได้เลยเช่นกัน
    window.location.href = "/camp";
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " น.";
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {alertMessage && (
        <AlertAdmin message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}

      <AdminNavbar
        isCollapsed={isCollapsed}
        backToPage={{ href: "/camp", label: "กลับสู่หน้ารายการ" }}
      />

      <div className="flex flex-row flex-1 min-h-screen overflow-hidden">
        <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <main className={`w-full transition-all p-6 mt-[64px] ${isCollapsed ? "ml-[80px]" : "ml-[300px]"}`}>
          <ApplicantHeader
            title="ITCS/B รอบ 1 ICT – Portfolio ปีการศึกษา 2568"
            applicantId="0000005"
            applicantName="อนันต์ โชติกุล"
            activeTab="ผลการคัดกรองเบื้องต้น"
            statuses={[
              applicationStatus,
              {
                label: "สถานะเอกสาร",
                value: "03 - เอกสารครบถ้วน",
                color: "bg-[#E2F5E2] text-[#166534]",
              },
              {
                label: "สถานะชำระเงิน",
                value: "03 - ชำระเงินเรียบร้อย",
                color: "bg-[#E2F5E2] text-[#166534]",
              },
            ]}
          />

          {isSubmitted ? (
            <>
              {/* กล่องข้อมูล */}
              <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg border">
                <div className="w-full flex justify-end mb-4">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="flex items-center gap-2 text-sm text-white bg-[#008A90] px-4 py-2 rounded-[10px] hover:bg-[#007178]"
                  >
                    <Image
                      src="/images/admin/preliminaryResult/edit_icon.svg"
                      alt="Edit"
                      width={16}
                      height={16}
                    />
                    แก้ไขผลการประเมิน
                  </button>
                </div>
                <div className="max-w-5xl mx-auto bg-white p-8">
                  <h2 className="text-[#008A90] text-[22px] font-bold mb-6">ข้อมูลกรรมการหลักสูตร</h2>
                  <div className="flex flex-col md:flex-row gap-20 mb-8">
                    <div>
                      <p className="text-[#565656] font-bold text-xl mb-4">กรรมการหลักสูตร</p>
                      <p className="text-[#565656] mb-8">อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์</p>
                    </div>
                    <div>
                      <p className="text-[#565656] font-bold text-xl mb-4">วันที่ประเมิน</p>
                      <p className="text-[#565656] mb-8">{submittedAt ? formatDateTime(submittedAt) : "-"}</p>

                    </div>
                  </div>

                  <h2 className="text-[#008A90] text-[22px] font-bold mb-6">ผลการคัดกรองเบื้องต้น</h2>
                  <p
                    className={`mb-8 font-medium px-4 py-1 inline-block rounded-full 
    ${screeningResult === "ผ่านการคัดกรอง"
                        ? "bg-[#E2F5E2] text-[#166534]"
                        : "bg-[#FEE2E2] text-[#D92D20]"
                      }`}
                  >
                    {screeningResult}
                  </p>

                  <h2 className="text-[#008A90] text-[22px] font-bold mb-6">ความคิดเห็นเพิ่มเติม</h2>
                  <p className="text-[#565656] whitespace-pre-wrap mb-8">{comment || "-"}</p>
                </div>
              </div>
            </>
          ) : (
            //โหมดแก้ไข
            <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg border">
              {hasSubmittedOnce && (
                <div className="w-full flex justify-end mb-4">
                  <div className="flex items-center gap-6 text-sm text-white bg-[#B9B9B9] px-4 py-2 rounded-[10px] min-w-[160px] pointer-events-none cursor-not-allowed">
                    <Image
                      src="/images/admin/preliminaryResult/edit_icon.svg"
                      alt="Editing"
                      width={16}
                      height={16}
                    />
                    กำลังแก้ไข
                  </div>

                </div>
              )}

              <div className="max-w-5xl mx-auto bg-white p-8">
                <h2 className="text-[#008A90] text-[22px] font-bold mb-6">ข้อมูลกรรมการหลักสูตร</h2>
                <p className="text-[#565656] mb-4 text-[18px] font-bold">กรรมการหลักสูตร</p>
                <p className="text-[#565656] mb-8">อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์</p>

                <h2 className="text-[#008A90] text-[22px] font-bold mb-6">ผลการคัดกรองเบื้องต้น</h2>
                <div className="mb-6">
                  <CustomSelect
                    label=""
                    options={[
                      { value: "ผ่านการคัดกรอง", label: "ผ่านการคัดกรอง" },
                      { value: "ไม่ผ่านการคัดกรอง", label: "ไม่ผ่านการคัดกรอง" },
                    ]}
                    value={screeningResult}
                    onChange={(option) => setScreeningResult(option?.value || "")}
                    placeholder="เลือกผลการคัดกรอง"
                    error={!screeningResult && alertMessage ? "กรุณาเลือกผลการคัดกรองก่อนบันทึก" : undefined}
                    required={false}
                    boldLabel
                  />
                </div>

                <h2 className="text-[#008A90] text-[22px] font-bold mb-6">ความคิดเห็น</h2>
                <div className="mb-8">
                  <FormField
                    label=""
                    value={comment}
                    onChange={setComment}
                    type="textarea"
                    placeholder="กรอกความคิดเห็นเพิ่มเติม"
                    boldLabel
                    height="h-[150px]"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button
              onClick={handleBackClick}
              className="px-6 py-3 border border-[#B3B3B3] text-[#565656] rounded-md min-w-[120px]"
            >
              ย้อนกลับ
            </button>

            {!isSubmitted && (
              <button
                onClick={handleSubmitScreening}
                disabled={!screeningResult}
                className={`ml-4 px-6 py-3 rounded-md flex items-center gap-2 min-w-[120px] 
                ${!screeningResult
                    ? "bg-[#B3B3B3] text-white cursor-not-allowed"
                    : "bg-[#008A90] text-white hover:bg-[#007178]"
                  }`}
              >
                <Image src="/images/admin/save_icon.svg" alt="Save" width={18} height={18} />
                บันทึก
              </button>

            )}
          </div>
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[600px] max-w-full">
                <div className="flex items-start gap-4 mb-6">
                  <Image
                    src="/images/warning-icon.svg"
                    alt="Warning Icon"
                    width={35}
                    height={35}
                  />
                  <div>
                    <p className="text-[#565656] font-bold text-xl mb-2">คุณยังไม่ได้เลือกผลการคัดกรอง</p>
                    <p className="text-[#565656] text-sm">ต้องการออกจากหน้านี้โดยไม่บันทึกหรือไม่?</p>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="w-[90px] py-2.5 border border-[#B3B3B3] text-[#565656] rounded-md"
                  >
                    ยกเลิก
                  </button>

                  <button
                    onClick={() => (window.location.href = "/camp")}
                    className="w-[90px] py-2.5 rounded-md bg-[#008A90] text-white hover:bg-[#007178]"
                  >
                    ตกลง
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ScreeningResultPage;