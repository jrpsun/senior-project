import React, { useEffect, useState } from 'react'

import { PreEvaDataInterface, PreEvainterface } from '@components/types/preEva';
/**********************


หน้านี้ทำเป็น component ได้


**********************/

interface PreEvaProps {
    props: PreEvainterface;
}

const PreliminaryEvaSummary: React.FC<PreEvaProps> = ({ props }) => {

    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
    //const [applicants, setApplicants] = useState<CourseComScreeningInterface[]>([]);
    const [preEva, setPreEva] = useState<PreEvaDataInterface[]>([]);
    const [loading, setLoading] = useState(true);
    //console.log("xxxxxxxxxx", props.path)

    async function fetchData() {
        try {
            const [res_preEva] = await Promise.all([
                fetch(`${API_BASE_URL}/course-committee/get-preEva/${props.applicantId}/${props.programRegisteredId}`)
                //fetch(`${API_BASE_URL}/course-committee/all-applicant-courseC/${props.courseComId}`)
            ]);

            if (!res_preEva.ok) {
                throw new Error("Failed to fetch one or more resources");
            }
            const preEvaData = await res_preEva.json();
            //console.log('preEvaData', preEvaData)
            //const appData = await res_app.json();

            setPreEva(preEvaData || []);
            //setApplicants(appData.applicants || []);

        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    //console.log('applicants', applicants)
    console.log('preEva', preEva)

    function getThaiDate(): string {
        const date = new Date();

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = (date.getFullYear() + 543).toString();

        return `${day}/${month}/${year}`;
    }
    //
    const handleSubmit = async () => {
        try {
            const today = getThaiDate();
            const response = await fetch("http://localhost:8000/course-committee/update-pre-Eva", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    app_id: props.applicantId,
                    programRegistered: props.programRegisteredId,
                    com_id: props.courseComId,
                    preEvaResult: result,
                    comment: note,
                    preEvaDate: new Date().toISOString().split('T')[0],
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Something went wrong");
            }

            const data = await response.json();
            console.log("Update success:", data);
            window.location.reload();
        } catch (error) {
            console.error("Error updating preliminary evaluation:", error);
        }
    };


    const preEvaResult = [
        { value: 'ไม่ผ่านการคัดกรอง', label: 'ไม่ผ่านการคัดกรอง' },
        { value: 'ผ่านการคัดกรอง', label: 'ผ่านการคัดกรอง' },
    ]
    //og('props1', props.applicantId)
    //console.log('props2', props.courseComId)
    const [result, setResult] = useState("");
    const [note, setNote] = useState("");

    console.log('Result', result)
    console.log('note', note)
    const [isEdit, setIsEdit] = useState(false)
    const handleEdit = () => {
        setIsEdit(true)
        setResult(preEva.preliminaryEva)
        setNote(preEva.preliminaryComment)
    }
    // debugging
    //console.log('isEdit', isEdit)
    const checkForEdit = preEva.preliminaryEva//applicants.find(applicant => applicant.applicantId === props.applicantId)?.preliminaryEva
    //console.log('checkForEdit', checkForEdit)
    //console.log("path", props.path)

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
        <div className='flex justify-center py-5 bg-[white]'>
            <div className='flex flex-col w-[1280px]'>
                <div className='bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3'>
                    {["/admin/screening/tracking", "/admin/interview/candidates", "/admin/interview/tracking"].includes(props.path || "") && checkForEdit !== "null" ? (
                        <div className='p-6 bg-white rounded-lg w-full max-w-5xl mx-auto'>

                            <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mb-[50px]">ข้อมูลกรรมการหลักสูตร 1</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                <div>
                                    <p className="text-[#565656] font-bold mb-[25px]">กรรมการหลักสูตร</p>
                                    <p className="text-[#565656] text-left pl-6">{preEva.comPrefix} {preEva.firstName} {preEva.lastName}</p>
                                </div>

                                <div className='ml-[125px]'>
                                    <p className="text-[#565656] font-bold mb-[25px]">วันที่ประเมิน</p>
                                    <p className="text-[#565656] text-left pl-6">{toThaiDate(preEva?.preEvaDate || "")}</p>
                                </div>
                            </div>

                            <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ผลการคัดกรองเบื้องต้น</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                <div className={`text-center
                                                ${checkForEdit === "ผ่านการคัดกรอง" ? "border w-[150px] rounded-lg bg-[#E2F5E2] text-[#166534]" : ""}
                                                ${checkForEdit === "ไม่ผ่านการคัดกรอง" ? "border w-[150px] rounded-lg bg-[#FEE2E2] text-[#991B1B]" : ""}
                                            `}>
                                    {checkForEdit}
                                </div>
                            </div>

                            <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ความคิดเห็นเพิ่มเติม</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                <div>
                                    <p className="text-[#565656] text-left pl-6">{preEva.preliminaryComment}</p>
                                </div>
                            </div>
                        </div>
                    ) : props.path === '/admin/screening/candidates' && checkForEdit !== null ? (
                        <div>
                            <div className='p-6 bg-white rounded-lg w-full max-w-5xl mx-auto'>
                                <div className='flex justify-end mb-4 mr-8'>
                                    <button
                                        className={`flex flex-row bg-[#008A90] text-white border rounded-lg px-4 py-2 flex items-center
                                            ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        onClick={() => handleEdit()}
                                    >
                                        <div>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_2399_297)">
                                                    <g clipPath="url(#clip1_2399_297)">
                                                        <path d="M11.3342 0.603516L9.82166 2.11602L13.8842 6.17851L15.3967 4.66602C16.1779 3.88477 16.1779 2.61914 15.3967 1.83789L14.1654 0.603516C13.3842 -0.177734 12.1185 -0.177734 11.3373 0.603516H11.3342ZM9.11541 2.82227L1.83103 10.1098C1.50603 10.4348 1.26853 10.8379 1.13728 11.2785L0.0310334 15.0379C-0.0470916 15.3035 0.0247834 15.5879 0.218533 15.7816C0.412283 15.9754 0.696658 16.0473 0.959158 15.9723L4.71853 14.866C5.15916 14.7348 5.56228 14.4973 5.88728 14.1723L13.1779 6.88477L9.11541 2.82227Z" fill="white" />
                                                    </g>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_2399_297">
                                                        <rect width="16" height="16" fill="white" />
                                                    </clipPath>
                                                    <clipPath id="clip1_2399_297">
                                                        <path d="M0 0H16V16H0V0Z" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                        <div>แก้ไขผลการประเมิน</div>
                                    </button>
                                </div>

                                <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mb-[50px]">ข้อมูลกรรมการหลักสูตร 2</h2>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                    <div>
                                        <p className="text-[#565656] font-bold mb-[25px]">กรรมการหลักสูตร</p>
                                        <p className="text-[#565656] text-left pl-6">{preEva?.comPrefix} {preEva?.firstName} {preEva?.lastName}</p>
                                    </div>

                                    <div className='ml-[125px]'>
                                        <p className="text-[#565656] font-bold mb-[25px]">วันที่ประเมิน</p>
                                        <p className="text-[#565656] text-left pl-6">{toThaiDate(preEva?.preEvaDate || "")}</p>
                                    </div>
                                </div>
                                {isEdit === false ? (
                                    <div>
                                        <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ผลการคัดกรองเบื้องต้น</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                            <div className={`text-center
                                                        ${checkForEdit === "ผ่านการคัดกรอง" ? "border w-[150px] rounded-lg bg-[#E2F5E2] text-[#166534]" : ""}
                                                        ${checkForEdit === "ไม่ผ่านการคัดกรอง" ? "border w-[150px] rounded-lg bg-[#FEE2E2] text-[#991B1B]" : ""}
                                                    `}>
                                                {checkForEdit}
                                            </div>
                                        </div>

                                        <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ความคิดเห็นเพิ่มเติม</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                            <div>
                                                <p className="text-[#565656] text-left pl-6">{preEva.preliminaryComment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ผลการคัดกรองเบื้องต้น</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                            <div className="relative w-full">
                                                <select
                                                    onChange={(e) => setResult(e.target.value)}
                                                    value={result}
                                                    className="appearance-none border border-gray-300 text-gray-500 rounded-md px-2 py-2 w-[1000px] pr-10"
                                                >
                                                    <option value="" disabled>เลือกผลการคัดกรอง</option>
                                                    {preEvaResult.map((group) => (
                                                        <option key={group.value} value={group.value}>
                                                            {group.label}
                                                        </option>
                                                    ))}
                                                </select>

                                                <div className="pointer-events-none absolute right-[-750px] top-1/2 transform -translate-y-1/2">
                                                    ▼
                                                </div>
                                            </div>
                                        </div>

                                        <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ความคิดเห็นเพิ่มเติม</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                            <div>
                                                <textarea
                                                    placeholder="ระบุเหตุผลในการแก้ไข"
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                    className="w-[1000px] h-[200px] border border-gray-300 rounded-md text-start align-top pl-2 pt-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    ) : (
                        <div className='p-6 bg-white rounded-lg w-full max-w-5xl mx-auto'>
                            {/* ครั้งแรกที่ course com เข้ามา */}
                            <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mb-[50px]">ข้อมูลกรรมการหลักสูตร 3</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                <div>
                                    <p className="text-[#565656] font-bold mb-[25px]">กรรมการหลักสูตร</p>
                                    <p className="text-[#565656] text-left pl-6">{preEva?.comPrefix} {preEva?.firstName} {preEva?.lastName}</p>
                                </div>
                            </div>

                            <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ผลการคัดกรองเบื้องต้น</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                <div className="relative w-full">
                                    <select
                                        onChange={(e) => setResult(e.target.value)}
                                        value={result}
                                        className="appearance-none border border-gray-300 text-gray-500 rounded-md px-2 py-2 w-[1000px] pr-10"
                                    >
                                        <option value="" disabled>เลือกผลการคัดกรอง</option>
                                        {preEvaResult.map((group) => (
                                            <option key={group.value} value={group.value}>
                                                {group.label}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="pointer-events-none absolute right-[-750px] top-1/2 transform -translate-y-1/2">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ความคิดเห็นเพิ่มเติม</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                <div>
                                    <textarea
                                        placeholder="ระบุเหตุผลในการแก้ไข"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-[1000px] h-[200px] border border-gray-300 rounded-md text-start align-top pl-2 pt-2"
                                    />
                                </div>
                            </div>
                        </div>
                    )}



                </div>
                {(props.path !== '/admin/screening/tracking') && (props.path !== '/admin/interview/candidates') && result && (
                    <div className='flex mt-4 justify-center'>
                        <button
                            className={`flex flex-row space-x-1 ml-[25px] border bg-[#008A90] rounded-md px-8 py-2 text-white 
                        `}
                            onClick={handleSubmit}
                        >
                            <div>
                                <svg width="21" height="25" viewBox="0 0 21 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.3686 21.7412L14.3686 13.7412L6.0353 13.7412L6.0353 21.7412M6.0353 3.74121L6.0353 8.74121L12.702 8.74121M16.0353 21.7412L4.36863 21.7412C3.9266 21.7412 3.50268 21.5305 3.19012 21.1554C2.87756 20.7804 2.70197 20.2716 2.70197 19.7412L2.70197 5.74121C2.70197 5.21078 2.87756 4.70207 3.19012 4.327C3.50268 3.95192 3.9266 3.74121 4.36863 3.74121L13.5353 3.74121L17.702 8.74121L17.702 19.7412C17.702 20.2716 17.5264 20.7804 17.2138 21.1554C16.9012 21.5305 16.4773 21.7412 16.0353 21.7412Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>บันทึก</div>
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default PreliminaryEvaSummary