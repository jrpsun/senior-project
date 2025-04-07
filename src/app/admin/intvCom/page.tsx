'use client';
import { useState } from "react";
import React from 'react'
import { Star } from "lucide-react";
import Sidebar from "@components/components/SideBar";
import CustomSelect from "@components/components/form/CustomSelect";

const FillingScore = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [rating, setRating] = useState(0);

    const handleClick = (star: number) => {
        setRating((prev) => (prev === star ? 0 : star)); // Toggle rating off when clicking the same star
    };

    const [scores, setScores] = useState([
        { id: 1, category: "ความสามารถด้านภาษาอังกฤษ (English)", maxScore: 10, score: "", comment: "" },
        { id: 2, category: "บุคลิกภาพ (Personality)", maxScore: 10, score: "", comment: "" },
        { id: 3, category: "ความตั้งใจเรียน (Intention)", maxScore: 10, score: "", comment: "" },
        { id: 4, category: "ทักษะ IT/คอมพิวเตอร์ (IT/Computer Skill)", maxScore: 4, score: "", comment: "" },
    ]);

    const handleScoreChange = (index, value) => {
        const updatedScores = [...scores];
        updatedScores[index].score = value;
        setScores(updatedScores);
    };

    const handleCommentChange = (index, value) => {
        const updatedScores = [...scores];
        updatedScores[index].comment = value;
        setScores(updatedScores);
    };

    const totalScore = scores.reduce((sum, item) => sum + (parseFloat(item.score) || 0), 0);


    return (
        <div>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={`${isCollapsed ? "ml-[100px] p-4" : "ml-[375px] p-4"}`}>
                <div className="mr-[50px] mt-[50px] p-4 border rounded-md shadow-md">
                    <div className={`${isCollapsed ? 'ml-[275px] mt-[25px]' : 'ml-[150px] mt-[25px]'}`}>
                        <div className='font-bold mb-[50px] text-[#008A90]'>
                            ข้อมูลกรรมการสัมภาษณ์
                        </div>

                        <div className='flex flex-col mb-[50px]'>
                            <div className='flex justify-start gap-x-40 font-bold'>
                                <div>กรรมการสัมภาษณ์</div>
                                <div>วันที่สัมภาษณ์</div>
                                <div>เวลา</div>
                            </div>

                            <div className='flex justify-start gap-x-[95px]'>
                                <div>อาจารย์ ดร.วรพงษ์ พัฒนเกียรติ</div>
                                <div>15 เมษายน 2568</div>
                                <div className='ml-4'>09.20 - 09.40 น.</div>
                            </div>
                        </div>

                        <div className='flex flex-row mb-[50px]'>
                            <div>
                                <div className='mr-[400px] font-bold text-[#008A90]'>ผลการสัมภาษณ์</div>
                                <div className='mr-[120px]'>
                                    <select
                                        className={`border border-gray-400 rounded-lg w-full p-2 appearance-none 
                                            ${selectedValue === "passed" ? "text-green-500" : "text-black"}`}
                                        onChange={(e) => setSelectedValue(e.target.value)}
                                        value={selectedValue}
                                    >
                                        <option value="" disabled selected>เลือกผลการสัมภาษณ์</option>
                                        <option value="absent" className="text-black">ไม่มาสัมภาษณ์</option>
                                        <option value="passed" className="text-green-500">ผ่านการสำภาษณ์</option>
                                        <option value="failed" className="text-red-500">ไม่ผ่านการสำภาษณ์</option>
                                        <option value="pending" className="text-yellow-500">รอพิจารณาเพิ่มเติม</option>
                                    </select>
                                    <div className={`${isCollapsed ? "absolute top-[325px] right-[900px] transform -translate-y-1/2 pointer-events-none" : "absolute top-[325px] right-[750px] transform -translate-y-1/2 pointer-events-none"}`}>
                                        ▼
                                    </div>
                                </div>
                            </div>
                            {selectedValue === "passed" && (
                                <div className="flex flex-col">
                                    <div className="font-bold text-[#008A90]">จุดเด่นของผู้สมัคร (ถ้ามี)</div>
                                    <div className="flex space-x-2">
                                        {[1, 2, 3].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-8 w-8 cursor-pointer transition-colors duration-300 ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                                                    }`}
                                                onClick={() => handleClick(star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className='mb-[50px]'>
                            <div className="font-bold text-[#008A90]">ผลคะแนนสัมภาษณ์</div>
                            {selectedValue !== "absent" ? (
                                <div className='flex flex-row gap-1'>
                                    <div>
                                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.0804 0.0176134C4.55191 0.003686 0.044976 4.46514 0.0137688 9.98192C-0.0174547 15.5105 4.42992 20.0035 9.94663 20.0175C15.4752 20.0314 19.9821 15.5699 20.0133 10.0531C20.0563 4.52454 15.5971 0.0315615 10.0804 0.0176134ZM9.93497 2.71126C10.4193 2.71041 10.8207 2.8869 11.151 3.2289C11.4931 3.55907 11.658 3.97224 11.6573 4.45658C11.6566 4.94092 11.4907 5.34285 11.1476 5.68604C10.8164 6.01738 10.4027 6.18349 9.9302 6.18432C9.43405 6.18519 9.03263 6.02051 8.6905 5.69035C8.36019 5.36016 8.18356 4.94701 8.18422 4.46267C8.1849 3.96652 8.36265 3.56456 8.70569 3.23319C9.03693 2.89003 9.45063 2.71211 9.93497 2.71126ZM7.10548 7.19339L11.7008 7.18533L11.689 15.7499L13.0712 15.7474L13.0696 16.8461L7.0922 16.8565L7.09371 15.7579L8.46403 15.7555L8.47429 8.28961L7.10397 8.29202L7.10548 7.19339Z" fill="#008A91" />
                                        </svg>

                                    </div>
                                    <div className='mb-4 text-sm text-gray-300'>
                                        กรุณากรอกคะแนนอย่างรอบคอบ คะแนนของท่านจะถูกรวมกับคะแนนของกรรมการท่านอื่น และระบบจะคำนวณคะแนนรวมให้โดยอัตโนมัติ
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-row gap-1 mt-3'>
                                    <div className={`${isCollapsed ? "absolute top-[440px] right-[1270px] transform -translate-y-1/2 pointer-events-none border bg-[#DAA520] w-[7px] h-[25px]" : "absolute top-[440px] right-[1120px] transform -translate-y-1/2 pointer-events-none border bg-[#DAA520] w-[7px] h-[25px]"}`}></div>
                                    <div className="ml-5">
                                        <svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.3258 15.5819L11.2982 0.447598C11.133 0.170596 10.8278 0 10.4973 0C10.167 0 9.86158 0.170596 9.69642 0.447598L0.623871 15.6571C0.45871 15.9341 0.45871 16.2752 0.623871 16.5522C0.789033 16.8293 1.09443 16.9999 1.42475 16.9999H19.57C19.5718 16.9999 19.5738 17.0001 19.5751 16.9999C20.0863 16.9999 20.5 16.5992 20.5 16.1046C20.5 15.9093 20.4352 15.729 20.3258 15.5819ZM3.02664 15.2095L10.4973 2.68559L17.968 15.2097L3.02664 15.2095ZM10.02 5.70928H10.9797C11.0584 5.70928 11.134 5.74 11.1893 5.79468C11.2443 5.84962 11.2739 5.92332 11.2719 5.99985L11.0791 11.8599C11.075 12.0138 10.9449 12.1361 10.7865 12.1361H10.2134C10.0547 12.1361 9.92467 12.0135 9.92091 11.8599L9.72803 5.99985C9.72598 5.92328 9.75579 5.84962 9.81076 5.79468C9.86573 5.74 9.9413 5.70928 10.02 5.70928ZM11.2597 12.914V13.9748C11.2597 14.1312 11.1289 14.2578 10.9671 14.2578H10.033C9.87123 14.2578 9.74051 14.1312 9.74051 13.9748V12.914C9.74051 12.7576 9.87123 12.6307 10.033 12.6307H10.9671C11.1289 12.6305 11.2597 12.7576 11.2597 12.914Z" fill="#DAA520" />
                                        </svg>

                                    </div>
                                    <div className='mb-4 text-sm text-gray-300'>
                                        ผู้สมัครไม่มาสัมภาษณ์ ช่องให้คะแนนถูกปิดใช้งาน
                                    </div>
                                </div>
                            )}


                            <div className="">
                                <table className="border-collapse border border-gray-300 text-sm">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="border border-gray-300 px-4 py-2 text-center">ลำดับ</th>
                                            <th className="border border-gray-300 px-4 py-2 text-center">หมวดหมู่</th>
                                            <th className="border border-gray-300 px-4 py-2 text-center">คะแนนเต็ม</th>
                                            <th className="border border-gray-300 px-4 py-2 text-center">คะแนนที่ได้</th>
                                            <th className="border border-gray-300 px-4 py-2 text-center">หมายเหตุ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scores.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{item.id}</td>
                                                <td className="border border-gray-300 px-4 py-[13px] flex items-center gap-1">
                                                    {item.category} {item.id === 4 &&
                                                        <div>
                                                            <button
                                                                onMouseEnter={() => setShowTooltip(true)}
                                                                onMouseLeave={() => setShowTooltip(false)}
                                                            >
                                                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10.0804 0.0176134C4.55191 0.003686 0.044976 4.46514 0.0137688 9.98192C-0.0174547 15.5105 4.42992 20.0035 9.94663 20.0175C15.4752 20.0314 19.9821 15.5699 20.0133 10.0531C20.0563 4.52454 15.5971 0.0315615 10.0804 0.0176134ZM9.93497 2.71126C10.4193 2.71041 10.8207 2.8869 11.151 3.2289C11.4931 3.55907 11.658 3.97224 11.6573 4.45658C11.6566 4.94092 11.4907 5.34285 11.1476 5.68604C10.8164 6.01738 10.4027 6.18349 9.9302 6.18432C9.43405 6.18519 9.03263 6.02051 8.6905 5.69035C8.36019 5.36016 8.18356 4.94701 8.18422 4.46267C8.1849 3.96652 8.36265 3.56456 8.70569 3.23319C9.03693 2.89003 9.45063 2.71211 9.93497 2.71126ZM7.10548 7.19339L11.7008 7.18533L11.689 15.7499L13.0712 15.7474L13.0696 16.8461L7.0922 16.8565L7.09371 15.7579L8.46403 15.7555L8.47429 8.28961L7.10397 8.29202L7.10548 7.19339Z" fill="#008A91" />
                                                                </svg>
                                                            </button>
                                                            {showTooltip && (
                                                                <div className={`${isCollapsed ? "absolute bottom-[150px] left-[940px] -translate-x-1/2 text-sm px-2 py-1 rounded-md shadow-lg bg-white text-black" : "absolute bottom-[150px] left-[1090px] -translate-x-1/2 text-sm px-2 py-1 rounded-md shadow-lg bg-white text-black"}`}>
                                                                    <div className="flex flex-row">
                                                                        <div>
                                                                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M10.0804 0.0176134C4.55191 0.003686 0.044976 4.46514 0.0137688 9.98192C-0.0174547 15.5105 4.42992 20.0035 9.94663 20.0175C15.4752 20.0314 19.9821 15.5699 20.0133 10.0531C20.0563 4.52454 15.5971 0.0315615 10.0804 0.0176134ZM9.93497 2.71126C10.4193 2.71041 10.8207 2.8869 11.151 3.2289C11.4931 3.55907 11.658 3.97224 11.6573 4.45658C11.6566 4.94092 11.4907 5.34285 11.1476 5.68604C10.8164 6.01738 10.4027 6.18349 9.9302 6.18432C9.43405 6.18519 9.03263 6.02051 8.6905 5.69035C8.36019 5.36016 8.18356 4.94701 8.18422 4.46267C8.1849 3.96652 8.36265 3.56456 8.70569 3.23319C9.03693 2.89003 9.45063 2.71211 9.93497 2.71126ZM7.10548 7.19339L11.7008 7.18533L11.689 15.7499L13.0712 15.7474L13.0696 16.8461L7.0922 16.8565L7.09371 15.7579L8.46403 15.7555L8.47429 8.28961L7.10397 8.29202L7.10548 7.19339Z" fill="#008A91" />
                                                                            </svg>
                                                                        </div>
                                                                        <div className="ml-[2px]"><strong>เกณฑ์การให้คะแนน IT/Computer Skill</strong></div>
                                                                    </div>
                                                                    <div className="ml-5">
                                                                        0 - ไม่มีทักษะเกี่ยวกับ IT/คอมพิวเตอร์<br />
                                                                        1 - เคยเข้าร่วมกิจกรรมที่เกี่ยวข้องกับ IT (เช่น Workshop)<br />
                                                                        2 - มีทักษะเบื้องต้น เช่น ใช้ซอฟต์แวร์เฉพาะทางได้<br />
                                                                        3 - เรียนรู้การเขียนโปรแกรม มีเกียรติบัตร (Certificate)<br />
                                                                        4 - มีโครงงานด้านการเขียนโปรแกรม
                                                                    </div>

                                                                </div>
                                                            )}
                                                        </div>
                                                    }
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{item.maxScore}</td>
                                                {selectedValue !== "absent" ? (
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input
                                                            type="number"
                                                            className="border-white w-[105px]"
                                                            value={item.score}
                                                            onChange={(e) => handleScoreChange(index, e.target.value)}
                                                            placeholder="กรอกคะแนน"
                                                            min="0"
                                                            max={item.maxScore}
                                                        />
                                                    </td>
                                                ) : (
                                                    <td className="border border-gray-300 bg-[#E5E7EB] px-[75px] py-2"></td>
                                                )}
                                                {selectedValue !== "absent" ? (
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input
                                                            type="text"
                                                            className="border-white w-[300px]"
                                                            value={item.comment}
                                                            onChange={(e) => handleCommentChange(index, e.target.value)}
                                                            placeholder="ระบุหมายเหตุเพิ่มเติม"
                                                        />
                                                    </td>
                                                ) : (
                                                    <td className="border border-gray-300 bg-[#E5E7EB] px-[150px] py-2"></td>
                                                )}

                                            </tr>
                                        ))}
                                        <tr className="font-bold">
                                            <td className="border border-gray-300 px-4 py-2 text-center" colSpan={2}>คะแนนรวม</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">34</td>
                                            {selectedValue === 'absent' ? (
                                                <td className="border border-gray-300 bg-[#E5E7EB] px-4 py-2 text-center"></td>
                                            ) : (
                                                <td className="border border-gray-300 px-4 py-2 text-center">{totalScore}</td>
                                            )}
                                            {selectedValue === 'absent' ? (
                                                <td className="border border-gray-300 bg-[#E5E7EB] px-4 py-2"></td>
                                            ) : (
                                                <td className="border border-gray-300 px-4 py-2"></td>
                                            )}

                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <div className='font-bold mb-[50px] text-[#008A90]'>
                            <div className="mb-4">ความคิดเห็นเพิ่มเติม</div>
                            <textarea
                                className="w-[850px] max-w-none h-[200px] border border-gray-300 rounded-lg p-1 text-gray-700 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="ระบุหมายเหตุ"
                                rows={5}
                            />
                        </div>
                    </div>
                </div>

                <div className={`flex flex-row ${isCollapsed ? "ml-[600px] gap-2 mt-4" : "ml-[450px] gap-2 mt-4"
                    }`}>
                    <div>
                        <button className="text-[#008A90] border border-[#008A90] rounded-md px-5 py-2 my-1 mx-1">
                            <div className="flex flex-row gap-x-2">
                                <div>
                                    <svg width="21" height="25" viewBox="0 0 21 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.7448 21.2412L14.7448 13.2412L6.41146 13.2412L6.41146 21.2412M6.41146 3.24121L6.41146 8.24121L13.0781 8.24121M16.4115 21.2412L4.74479 21.2412C4.30276 21.2412 3.87884 21.0305 3.56628 20.6554C3.25372 20.2804 3.07813 19.7716 3.07813 19.2412L3.07813 5.24121C3.07813 4.71078 3.25372 4.20207 3.56628 3.827C3.87884 3.45192 4.30276 3.24121 4.74479 3.24121L13.9115 3.24121L18.0781 8.24121L18.0781 19.2412C18.0781 19.7716 17.9025 20.2804 17.59 20.6554C17.2774 21.0305 16.8535 21.2412 16.4115 21.2412Z" stroke="#008A91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                </div>
                                <div>บันทึก</div>
                            </div>
                        </button>
                    </div>
                    <div className="py-1">
                        <button className="bg-[#008A90] text-white rounded-md px-7 py-[9px]">
                            <div>บันทึกและส่งผลสัมภาษณ์</div>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default FillingScore