import React, { useEffect, useState } from 'react'
import { Star } from "lucide-react";
import { InterviewEvaEduInterface, InterviewEvaList } from '@components/types/interviewEva';
import WaitForReuslt from '@components/components/WaitForReuslt';
/**********************


หน้านี้ทำเป็น component ได้


**********************/
interface InputData {
    app_id: string;
    edu_id: string;
    path: string;
    interviewCom?: string;
}

interface InterviewEvaProps {
    props: InputData;
}

const InterviewEvaSummary: React.FC<InterviewEvaProps> = ({ props }) => {
    console.log("interviewCom", props.interviewCom)
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
    const [applicants, setApplicants] = useState<InterviewEvaList[]>([]);
    //const [intEduResult, setIntEduResult] = useState<InterviewEvaEduInterface[]>([]);
    const [applicant, setApplicant] = useState<InterviewEvaList[]>([]);
    const [loading, setLoading] = useState(true);

    if (props.interviewCom === 'N') { // as edu
        async function fetchData() {
            console.log("appIdId", props.app_id)
            try {
                const [res_apps] = await Promise.all([
                    fetch(`${API_BASE_URL}/education-department/get-applicant-interview-evas/${props.app_id}`)
                ])


                if (!res_apps.ok) {
                    throw new Error("Failed to fetch one or more resources");
                }

                const data_apps = await res_apps.json();

                setApplicants(data_apps.applicants || []);

            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        }
        useEffect(() => {
            fetchData();
        }, []);
    } else {
        async function fetchData() {
            try {
                const [res_app] = await Promise.all([
                    //fetch(`${API_BASE_URL}/education-department/get-applicant-interview-evas/${props.app_id}`),
                    fetch(`${API_BASE_URL}/education-department/get-applicant-interview-eva/${props.app_id}/${props.interviewCom}`)
                ])


                if (!res_app.ok) {
                    throw new Error("Failed to fetch one or more resources");
                }

                const data_app = await res_app.json();
                //const data_app = await res_app.json();

                setApplicant(data_app.applicants || []);
                //setApplicant(data_app.applicants || [])

            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        }
        useEffect(() => {
            fetchData();
        }, []);
    }
    console.log('one app ###', applicant)

    const AppWithoutEdu = applicants.filter(app => app.educationId === null);
    const AppWithEdu = applicants.filter(app => app.educationId !== null);
    console.log('interview sum app', applicants)
    console.log('app without edu', AppWithoutEdu)
    console.log('app with edu', AppWithEdu)

    // final interview result by edu
    const now = new Date();
    const evaDate = now.getFullYear() +
        '-' + String(now.getMonth() + 1).padStart(2, '0') +
        '-' + String(now.getDate()).padStart(2, '0') +
        ' ' + String(now.getHours()).padStart(2, '0') +
        ':' + String(now.getMinutes()).padStart(2, '0');

    //console.log('edu id #####', props.edu_id)
    const sendFinalIntEva = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/education-department/create-int-eva-final`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applicantId: idValue,
                    educationId: props.edu_id,
                    interviewResult: interviewResult,
                    comment: note,
                    evaDate: evaDate
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update data in the database');
            }

            alert('Data successfully updated in the database');
            window.location.reload();
        } catch (error) {
            console.error("Error sending data to backend:", error);
            alert('An error occurred while updating data');
        }
    };

    /////
    const submitInterviewEvaluation = async (scorestest, totalRemark, interviewComment, selectedValue, rating) => {
        const isAbsent = selectedValue === "ไม่มาสัมภาษณ์";

        const getScoreByCategory = (category) => {
            const score = scorestest.find(item => item.category.includes(category));
            return score ? Number(score.score) || 0 : 0;
        };

        const getRemarkByCategory = (category) => {
            const remark = scorestest.find(item => item.category.includes(category));
            return remark ? remark.comment || "-" : "-";
        };

        const body = {
            englishScore: isAbsent ? 0 : getScoreByCategory("อังกฤษ"),
            personalityScore: isAbsent ? 0 : getScoreByCategory("บุคลิกภาพ"),
            intensionScore: isAbsent ? 0 : getScoreByCategory("ตั้งใจ"),
            computerScore: isAbsent ? 0 : getScoreByCategory("IT"),
            totalScore: isAbsent
                ? 0
                : getScoreByCategory("อังกฤษ") +
                getScoreByCategory("บุคลิกภาพ") +
                getScoreByCategory("ตั้งใจ") +
                getScoreByCategory("IT"),
            englishRemark: isAbsent ? "-" : getRemarkByCategory("อังกฤษ"),
            personalityRemark: isAbsent ? "-" : getRemarkByCategory("บุคลิกภาพ"),
            intensionRemark: isAbsent ? "-" : getRemarkByCategory("ตั้งใจ"),
            computerRemark: isAbsent ? "-" : getRemarkByCategory("IT"),
            totalRemark: isAbsent ? "-" : totalRemark || "-",
            comment: isAbsent ? "-" : interviewComment || "-",
            ...(selectedValue && { interviewResult: selectedValue }),
            outstandingLevel: rating?.toString() || "0",
        };

        try {
            const response = await fetch(
                `${API_BASE_URL}/interview-committee/update-interview-Eva?app_id=${props.app_id}&com_id=${props.interviewCom}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            if (!response.ok) throw new Error("Failed to submit evaluation");


            window.location.reload();

        } catch (error) {
            console.error("Error submitting interview evaluation:", error);
            alert("การบันทึกข้อมูลล้มเหลว กรุณาลองใหม่");
        }
    };


    /////

    const scores = [
        {
            id: 1,
            category: "ความสามารถด้านภาษาอังกฤษ (English)",
            maxScore: 10
        },
        {
            id: 2,
            category: "บุคลิกภาพ (Personality)",
            maxScore: 10
        },
        {
            id: 3,
            category: "ความตั้งใจเรียน (Intention)",
            maxScore: 10
        },
        {
            id: 4,
            category: "ทักษะ IT/คอมพิวเตอร์ (IT/Computer Skill)",
            maxScore: 4
        }
    ];


    // for education department 
    const [showPopup, setShowPopup] = useState(false)
    const [idValue, setIdValue] = useState(""); // send to backend
    const [interviewResult, setInterviewResult] = useState(""); // send to backend
    const [note, setNote] = useState(""); // send to backend
    const name = `${AppWithoutEdu[0]?.firstnameEN} ${AppWithoutEdu[0]?.lastnameEN}`;
    const room = AppWithoutEdu[0]?.interviewRoom;
    const [nameValue, setNameValue] = useState(name);
    const [roomValue, setRoomValue] = useState(room);
    useEffect(() => {
        setNameValue(name);
        setRoomValue(room);
        setIdValue(AppWithoutEdu[0]?.applicantId);
    }, [name, room, idValue]);
    console.log("interviewResult", interviewResult)
    console.log("note", note)
    console.log("nameValue", nameValue)
    console.log("roomValue", roomValue)
    console.log("edu result", interviewResult)

    const [isEdit, setIsEdit] = useState(false)


    ///
    const [showTooltip, setShowTooltip] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [rating, setRating] = useState(0);
    const [interviewComment, setInterviewComment] = useState("");
    const [totalRemark, setTotalRemark] = useState("")
    useEffect(() => {
        if (applicant.length > 0) {
            setInterviewComment(applicant[0]?.comment || "");
            setTotalRemark(applicant[0]?.totalRemark || "");
            setRating(Number(applicant[0]?.outstandingLevel));
        }
    }, [applicant])



    const handleClick = (star: number) => {
        setRating((prev) => (prev === star ? 0 : star)); // Toggle rating off when clicking the same star
    };



    const [scorestest, setScores] = useState([
        { id: 1, category: "ความสามารถด้านภาษาอังกฤษ (English)", maxScore: 10, score: "0", comment: "" },
        { id: 2, category: "บุคลิกภาพ (Personality)", maxScore: 10, score: "0", comment: "" },
        { id: 3, category: "ความตั้งใจเรียน (Intention)", maxScore: 10, score: "0", comment: "" },
        { id: 4, category: "ทักษะ IT/คอมพิวเตอร์ (IT/Computer Skill)", maxScore: 4, score: "0", comment: "" },
    ]);

    useEffect(() => {
        if (applicant.length > 0) {
            setScores([
                { id: 1, category: "ความสามารถด้านภาษาอังกฤษ (English)", maxScore: 10, score: applicant[0]?.englishScore || "0", comment: applicant[0]?.englishRemark || "" },
                { id: 2, category: "บุคลิกภาพ (Personality)", maxScore: 10, score: applicant[0]?.personalityScore || "0", comment: applicant[0]?.personalityRemark || "" },
                { id: 3, category: "ความตั้งใจเรียน (Intention)", maxScore: 10, score: applicant[0]?.intensionScore || "0", comment: applicant[0]?.intensionRemark || "" },
                { id: 4, category: "ทักษะ IT/คอมพิวเตอร์ (IT/Computer Skill)", maxScore: 4, score: applicant[0]?.computerScore || "0", comment: applicant[0]?.computerRemark || "" },
            ]);
        }
        setSelectedValue(applicant[0]?.interviewResult || "")
    }, [applicant]);

    // console.log("send to backend 1", scorestest)
    // console.log("send to backend 2", interviewComment)
    // console.log("send to backend 3", rating)
    // console.log("send to backend 4", selectedValue)

    // console.log("props.path", props.path)
    // console.log("applicant[0]?.interviewResult", applicant[0]?.interviewResult === null)
    // console.log("isEdit", isEdit)

    const handleScoreChange = (index, value) => {
        const updatedScores = [...scorestest];
        updatedScores[index].score = value;
        setScores(updatedScores);
    };

    const handleCommentChange = (index, value) => {
        const updatedScores = [...scorestest];
        updatedScores[index].comment = value;
        setScores(updatedScores);
    };

    const totalScore = scorestest.reduce((sum, item) => sum + (parseFloat(item.score) || 0), 0);

    console.log('path #####', props.path)
    console.log('checker111', applicant[0]?.interviewResult !== null)
    console.log('checker222', applicant[0]?.totalScore != null)

    return (
        <div className='flex justify-center py-5 bg-[white]'>
            <div className='flex flex-col w-[1280px]'>

                {((props.path === "/admin/interview/candidates") && (applicant[0]?.interviewResult === null)) || (isEdit) ? (
                    <div className='bg-white shadow-lg rounded-lg w-full max-w-xl pl-[200px] lg:max-w-screen-xl p-3' key={1}>

                        {/* กรอกผล ---ครั้งแรก--- */}
                        {applicant.map((item) => (
                            <div>
                                <div className='text-2xl text-[#008A90] font-semibold mb-6 mb-[50px]'>
                                    ข้อมูลกรรมการสัมภาษณ์
                                </div>

                                <div className='flex flex-col mb-[50px]'>
                                    <div className='flex justify-start gap-x-40 font-bold'>
                                        <div className='text-[#565656] font-bold mr-[50px] mb-[25px]'>กรรมการสัมภาษณ์</div>
                                        <div className='text-[#565656] font-bold mb-[25px]'>วันที่สัมภาษณ์</div>
                                        <div className='text-[#565656] font-bold mb-[25px]'>เวลา</div>
                                    </div>

                                    <div className='flex justify-start gap-x-[95px]'>
                                        <div className='text-[#565656] mb-[25px]'>{item.prefix} {item.firstName} {item.lastName}</div>
                                        <div className='text-[#565656] mb-[25px]'>{item.interviewDate}</div>
                                        <div className='text-[#565656] ml-[75px] mb-[25px]'>{item.interviewTime} น.</div>
                                    </div>
                                </div>

                                <div className='flex flex-row mb-[50px]'>
                                    <div>
                                        <div className='text-2xl text-[#008A90] font-semibold mb-[25px]'>ผลการสัมภาษณ์</div>
                                        <div className='mr-[120px] relative w-[450px]'>
                                            <select
                                                className={`border border-gray-400 rounded-lg w-full p-2 pr-10 appearance-none 
                                                    ${selectedValue === "ผ่านการสัมภาษณ์" ? "text-[#166534]" : ""}
                                                    ${selectedValue === "ไม่ผ่านการสัมภาษณ์" ? "text-[#991B1B]" : ""}
                                                    ${selectedValue === "รอพิจารณาเพิ่มเติม" ? "text-[#DAA520]" : ""}
                                                `}
                                                onChange={(e) => setSelectedValue(e.target.value)}
                                                value={selectedValue}
                                            >
                                                <option value="" disabled>เลือกผลการสัมภาษณ์</option>
                                                <option value="ไม่มาสัมภาษณ์" className="text-black">ไม่มาสัมภาษณ์</option>
                                                <option value="ผ่านการสัมภาษณ์" className="text-[#166534]">ผ่านการสัมภาษณ์</option>
                                                <option value="ไม่ผ่านการสัมภาษณ์" className="text-[#991B1B]">ไม่ผ่านการสัมภาษณ์</option>
                                                <option value="รอพิจารณาเพิ่มเติม" className="text-[#DAA520]">รอพิจารณาเพิ่มเติม</option>
                                            </select>
                                            <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                                                ▼
                                            </div>
                                        </div>
                                    </div>

                                    {selectedValue === "ผ่านการสัมภาษณ์" && (
                                        <div className="flex flex-col ml-[50px]">
                                            <div className="text-2xl text-[#008A90] font-semibold mb-[25px]">จุดเด่นของผู้สมัคร (ถ้ามี)</div>
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
                                    <div className="text-2xl text-[#008A90] font-semibold mb-[25px]">ผลคะแนนสัมภาษณ์</div>
                                    {selectedValue !== "ไม่มาสัมภาษณ์" ? (
                                        <div className='flex flex-row gap-1 mb-4'>
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
                                        <div className='flex flex-row gap-1 mb-4'>
                                            <div className='border border-[4px] py-2 border-[#DAA520]'>
                                            </div>
                                            <div className="ml-2">
                                                <svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20.3258 15.5819L11.2982 0.447598C11.133 0.170596 10.8278 0 10.4973 0C10.167 0 9.86158 0.170596 9.69642 0.447598L0.623871 15.6571C0.45871 15.9341 0.45871 16.2752 0.623871 16.5522C0.789033 16.8293 1.09443 16.9999 1.42475 16.9999H19.57C19.5718 16.9999 19.5738 17.0001 19.5751 16.9999C20.0863 16.9999 20.5 16.5992 20.5 16.1046C20.5 15.9093 20.4352 15.729 20.3258 15.5819ZM3.02664 15.2095L10.4973 2.68559L17.968 15.2097L3.02664 15.2095ZM10.02 5.70928H10.9797C11.0584 5.70928 11.134 5.74 11.1893 5.79468C11.2443 5.84962 11.2739 5.92332 11.2719 5.99985L11.0791 11.8599C11.075 12.0138 10.9449 12.1361 10.7865 12.1361H10.2134C10.0547 12.1361 9.92467 12.0135 9.92091 11.8599L9.72803 5.99985C9.72598 5.92328 9.75579 5.84962 9.81076 5.79468C9.86573 5.74 9.9413 5.70928 10.02 5.70928ZM11.2597 12.914V13.9748C11.2597 14.1312 11.1289 14.2578 10.9671 14.2578H10.033C9.87123 14.2578 9.74051 14.1312 9.74051 13.9748V12.914C9.74051 12.7576 9.87123 12.6307 10.033 12.6307H10.9671C11.1289 12.6305 11.2597 12.7576 11.2597 12.914Z" fill="#DAA520" />
                                                </svg>
                                            </div>
                                            <div className='text-sm text-gray-300'>
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
                                                {scorestest.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td className="border border-gray-300 px-4 py-2 text-center">{item.id}</td>
                                                        <td className="border border-gray-200 px-4 py-[17px] flex items-center">
                                                            {item.category} {item.id === 4 &&
                                                                <div className="relative inline-block">
                                                                    <button
                                                                        onMouseEnter={() => setShowTooltip(true)}
                                                                        onMouseLeave={() => setShowTooltip(false)}
                                                                    >
                                                                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M10.0804 0.0176134C4.55191 0.003686 0.044976 4.46514 0.0137688 9.98192C-0.0174547 15.5105 4.42992 20.0035 9.94663 20.0175C15.4752 20.0314 19.9821 15.5699 20.0133 10.0531C20.0563 4.52454 15.5971 0.0315615 10.0804 0.0176134ZM9.93497 2.71126C10.4193 2.71041 10.8207 2.8869 11.151 3.2289C11.4931 3.55907 11.658 3.97224 11.6573 4.45658C11.6566 4.94092 11.4907 5.34285 11.1476 5.68604C10.8164 6.01738 10.4027 6.18349 9.9302 6.18432C9.43405 6.18519 9.03263 6.02051 8.6905 5.69035C8.36019 5.36016 8.18356 4.94701 8.18422 4.46267C8.1849 3.96652 8.36265 3.56456 8.70569 3.23319C9.03693 2.89003 9.45063 2.71211 9.93497 2.71126ZM7.10548 7.19339L11.7008 7.18533L11.689 15.7499L13.0712 15.7474L13.0696 16.8461L7.0922 16.8565L7.09371 15.7579L8.46403 15.7555L8.47429 8.28961L7.10397 8.29202L7.10548 7.19339Z" fill="#008A91" />
                                                                        </svg>
                                                                    </button>

                                                                    {showTooltip && (
                                                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max text-sm px-2 py-1 rounded-md shadow-lg bg-white text-black z-50">
                                                                            <div className="flex flex-row items-start">
                                                                                <div>
                                                                                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M10.0804 0.0176134C4.55191 0.003686 0.044976 4.46514 0.0137688 9.98192C-0.0174547 15.5105 4.42992 20.0035 9.94663 20.0175C15.4752 20.0314 19.9821 15.5699 20.0133 10.0531C20.0563 4.52454 15.5971 0.0315615 10.0804 0.0176134ZM9.93497 2.71126C10.4193 2.71041 10.8207 2.8869 11.151 3.2289C11.4931 3.55907 11.658 3.97224 11.6573 4.45658C11.6566 4.94092 11.4907 5.34285 11.1476 5.68604C10.8164 6.01738 10.4027 6.18349 9.9302 6.18432C9.43405 6.18519 9.03263 6.02051 8.6905 5.69035C8.36019 5.36016 8.18356 4.94701 8.18422 4.46267C8.1849 3.96652 8.36265 3.56456 8.70569 3.23319C9.03693 2.89003 9.45063 2.71211 9.93497 2.71126ZM7.10548 7.19339L11.7008 7.18533L11.689 15.7499L13.0712 15.7474L13.0696 16.8461L7.0922 16.8565L7.09371 15.7579L8.46403 15.7555L8.47429 8.28961L7.10397 8.29202L7.10548 7.19339Z" fill="#008A91" />
                                                                                    </svg>
                                                                                </div>
                                                                                <div className="ml-2">
                                                                                    <strong>เกณฑ์การให้คะแนน IT/Computer Skill</strong>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ml-5 mt-1">
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
                                                        {selectedValue !== "ไม่มาสัมภาษณ์" ? (
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
                                                        {selectedValue !== "ไม่มาสัมภาษณ์" ? (
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
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2 text-center font-bold" colSpan={2}>คะแนนรวม</td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center font-bold">34</td>
                                                    {selectedValue === 'ไม่มาสัมภาษณ์' ? (
                                                        <td className="border border-gray-300 bg-[#E5E7EB] px-4 py-2 text-center"></td>
                                                    ) : (
                                                        <td className="border border-gray-300 px-4 py-2 text-center font-bold">{totalScore}</td>
                                                    )}
                                                    {selectedValue === 'ไม่มาสัมภาษณ์' ? (
                                                        <td className="border border-gray-300 bg-[#E5E7EB] px-4 py-2"></td>
                                                    ) : (
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            <input
                                                                type="text"
                                                                className="border-white w-[300px]"
                                                                value={totalRemark}
                                                                onChange={(e) => setTotalRemark(e.target.value)}
                                                                placeholder="ระบุหมายเหตุเพิ่มเติม"
                                                            />
                                                        </td>
                                                    )}

                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                                {selectedValue !== "ไม่มาสัมภาษณ์" ? (
                                    <div className='mb-[50px]'>
                                        <div className="text-[#008A90] text-2xl font-semibold mb-[25px]">ความคิดเห็นเพิ่มเติม</div>
                                        <textarea
                                            placeholder="ระบุเหตุผลในการแก้ไข"
                                            value={interviewComment}
                                            onChange={(e) => setInterviewComment(e.target.value)}
                                            className="w-[1000px] h-[200px] border border-gray-300 rounded-md text-start align-top pl-2 pt-2"
                                        />
                                    </div>
                                ) : (
                                    <div className='mb-[50px] '>
                                        <div className="text-[#008A90] text-2xl font-semibold mb-[25px]">ความคิดเห็นเพิ่มเติม</div>
                                        <div className='flex justify-center text-gray-400 my-[100px]'>ไม่สามารถกรอกความคิดเห็นเพิ่มเติมได้</div>

                                    </div>
                                )}

                            </div>
                        ))}


                    </div>
                ) : (applicant[0]?.totalScore != null) && (applicant[0]?.interviewResult != null) ? (

                    <div className='bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3'>
                        {/* หลังจากกดบันทึกและส่งผลสัมภาษณ์ */}

                        <div className='flex ml-[1000px] mt-4 w-[200px] flex-col'>
                            <button
                                onClick={() => setIsEdit(true)}
                                className='flex flex-row bg-[#008A90] text-white px-2 py-1 space-x-2 rounded-lg'
                            >
                                <div>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_901_10556)">
                                            <g clipPath="url(#clip1_901_10556)">
                                                <path d="M11.3342 0.603516L9.82166 2.11602L13.8842 6.17851L15.3967 4.66602C16.1779 3.88477 16.1779 2.61914 15.3967 1.83789L14.1654 0.603516C13.3842 -0.177734 12.1185 -0.177734 11.3373 0.603516H11.3342ZM9.11541 2.82227L1.83103 10.1098C1.50603 10.4348 1.26853 10.8379 1.13728 11.2785L0.0310334 15.0379C-0.0470916 15.3035 0.0247834 15.5879 0.218533 15.7816C0.412283 15.9754 0.696658 16.0473 0.959158 15.9723L4.71853 14.866C5.15916 14.7348 5.56228 14.4973 5.88728 14.1723L13.1779 6.88477L9.11541 2.82227Z" fill="white" />
                                            </g>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_901_10556">
                                                <rect width="16" height="16" fill="white" />
                                            </clipPath>
                                            <clipPath id="clip1_901_10556">
                                                <path d="M0 0H16V16H0V0Z" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div>แก้ไขผลการสัมภาษณ์</div>
                            </button>
                        </div>
                        <div className='p-6 bg-white rounded-lg w-full max-w-5xl mx-auto'>
                            <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mb-[50px]">ข้อมูลกรรมการสัมภาษณ์</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                <div>
                                    <p className="text-[#565656] font-bold mb-[25px]">กรรมการสัมภาษณ์</p>
                                    <p className="text-[#565656] text-left pl-3 w-[300px]">{applicant[0]?.prefix} {applicant[0]?.firstName} {applicant[0]?.lastName}</p>
                                </div>

                                <div className='ml-[100px]'>
                                    <p className="text-[#565656] font-bold mb-[25px]">วันที่สัมภาษณ์</p>
                                    <p className="text-[#565656] text-left pl-3 w-[300px]">{applicant[0]?.interviewDate}</p>
                                </div>

                                <div className='ml-[125px]'>
                                    <p className="text-[#565656] font-bold mb-[25px]">เวลา</p>
                                    <p className="text-[#565656] text-left pl-3">{applicant[0]?.interviewTime}</p>
                                </div>
                            </div>
                            {applicant[0]?.interviewResult === "ไม่มาสัมภาษณ์" ? (
                                <div className='flex justify-center items-center text-gray-400 my-[200px] text-[20px]'>
                                    ไม่มีคะแนนสัมภาษณ์ของผู้สมัคร
                                </div>
                            ) : (
                                <div>
                                    <div className='flex justify-start'>
                                        <div>
                                            <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ผลการสัมภาษณ์</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                                <div className={`ml-[55px] w-[125px]
                                            ${applicant[0]?.interviewResult === "ผ่านการสัมภาษณ์" ? "text-[#166534]" : ""}
                                            ${applicant[0]?.interviewResult === "ไม่ผ่านการสัมภาษณ์" ? "text-[#D92D20]" : ""}
                                            ${applicant[0]?.interviewResult === "รอพิจารณาเพิ่มเติม" ? "text-[#DAA520]" : ""}
                                            `}>

                                                    {applicant[0]?.interviewResult}
                                                </div>
                                            </div>
                                        </div>

                                        {applicant[0]?.interviewResult === "ผ่านการสัมภาษณ์" && (
                                            <div>
                                                <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">จุดเด่นของผู้สมัคร</h2>
                                                <div className='flex justify-end mr-[230px]'>
                                                    {applicant.map((app, index) => (
                                                        <div key={index} className='flex flex-row'>
                                                            {[1, 2, 3].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`h-8 w-8 transition-colors duration-300 ${Number(app.outstandingLevel) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    </div>


                                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ผลคะแนนการสัมถาษณ์</h2>
                                    <div className="overflow-x-auto w-full">

                                        <table className='table-auto border-collapse border border-gray-500 rounded-lg'>
                                            <thead>
                                                <tr className="font-bold mb-[25px]">
                                                    <th className="border border-gray-300 text-center">ลำดับ</th>
                                                    <th className="border border-gray-300 w-[150px] text-center">หมวดหมู่</th>
                                                    <th className="border border-gray-300 w-[150px] text-center">คะแนนเต็ม</th>
                                                    <th className="border border-gray-300 w-[150px] text-center">คะแนนที่ได้</th>
                                                    <th className="border border-gray-300 w-[150px] text-center">หมายเหตุ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {scorestest.map((item, index) => (
                                                    <tr className="text-[#565656] text-left pl-6" key={index}>
                                                        <td className="border border-gray-300 py-2 text-center">{item.id}</td>
                                                        <td className="border border-gray-300 pl-2 w-[500px] py-2 text-left">{item.category}</td>
                                                        <td className="border border-gray-300 py-2 text-center">{item.maxScore}</td>
                                                        <td className="border border-gray-300 pl-2 w-[150px] py-2 text-center">{item.score}</td>
                                                        <td className="border border-gray-300 pl-2 w-[500px] py-2 text-left">{item.comment}</td>
                                                    </tr>
                                                ))}
                                                <tr className="text-[#565656] text-left pl-6">
                                                    <td className="border border-gray-300 px-4 py-2 text-center font-bold" colSpan={2}>คะแนนรวม</td>
                                                    <td className="border border-gray-300 py-2 text-center">34</td>
                                                    <td className="border border-gray-300 pl-2 w-[150px] py-2 text-center">{applicant[0]?.totalScore}</td>
                                                    <td className="border border-gray-300 pl-2 w-[500px] py-2 text-left">{applicant[0]?.totalRemark}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>

                                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ความคิดเห็นเพิ่มเติม</h2>
                                    <div className="flex flex-row space-x-4 text-[#565656] text-left">
                                        {applicant[0]?.comment}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                ) : (props.path === "/admin/interview/tracking") && (
                    <div className='bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-3'>
                        {/* ของ edu เข้ามาดู */}
                        <div className='flex justify-end mr-[150px]'>
                            <button
                                onClick={() => setShowPopup(true)}
                                className='flex flex-row border border-[#DAA520] rounded-lg text-[#DAA520] px-2 py-1'
                            >
                                <div>
                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5 16.6662L18 16.6662M14.25 2.9162C14.5815 2.58468 15.0312 2.39844 15.5 2.39844C15.7321 2.39844 15.962 2.44416 16.1765 2.533C16.391 2.62184 16.5858 2.75205 16.75 2.9162C16.9142 3.08036 17.0444 3.27523 17.1332 3.48971C17.222 3.70418 17.2678 3.93406 17.2678 4.1662C17.2678 4.39835 17.222 4.62822 17.1332 4.8427C17.0444 5.05717 16.9142 5.25205 16.75 5.4162L6.33333 15.8329L3 16.6662L3.83333 13.3329L14.25 2.9162Z" stroke="#DAA520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div>แก้ไขผลการสัมภาษณ์</div>

                            </button>
                            {showPopup && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-[555px]">
                                        <div className='flex flex-row justify-between'>
                                            <h2 className="text-xl font-bold mb-4">แก้ไขผลการสัมภาษณ์จากที่ประชุม</h2>
                                            <button
                                                className='mb-4'
                                                onClick={() => setShowPopup(false)}
                                            >
                                                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12.3828 2.88281C12.8711 2.39453 12.8711 1.60156 12.3828 1.11328C11.8945 0.625 11.1016 0.625 10.6133 1.11328L6.5 5.23047L2.38281 1.11719C1.89453 0.628906 1.10156 0.628906 0.613281 1.11719C0.125 1.60547 0.125 2.39844 0.613281 2.88672L4.73047 7L0.617188 11.1172C0.128906 11.6055 0.128906 12.3984 0.617188 12.8867C1.10547 13.375 1.89844 13.375 2.38672 12.8867L6.5 8.76953L10.6172 12.8828C11.1055 13.3711 11.8984 13.3711 12.3867 12.8828C12.875 12.3945 12.875 11.6016 12.3867 11.1133L8.26953 7L12.3828 2.88281Z" fill="#6B7280" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className='flex flex-row space-x-4'>
                                            <div>
                                                <p>เลขที่สมัคร</p>
                                                <input
                                                    type="text"
                                                    value={idValue}
                                                    onChange={(e) => setIdValue(e.target.value)}
                                                    disabled={idValue !== null}
                                                    className='w-[250px] rounded-md'
                                                />
                                            </div>
                                            <div>
                                                <p>ชื่อ-นามสกุล</p>
                                                <input
                                                    type="text"
                                                    value={nameValue}
                                                    onChange={(e) => setNameValue(e.target.value)}
                                                    disabled={nameValue !== null}
                                                    className='w-[250px] rounded-md'
                                                />
                                            </div>
                                        </div>
                                        <div className='mt-8'>
                                            <p>ห้องสัมภาษณ์</p>
                                            <input
                                                type="text"
                                                value={roomValue}
                                                onChange={(e) => setRoomValue(e.target.value)}
                                                disabled={roomValue !== null}
                                                className='w-[250px] rounded-md'
                                            />
                                        </div>
                                        <div className='mt-8'>
                                            <p>ผลการสัมภาษณ์</p>
                                            <div className='flex flex-row'>
                                                <div className="flex items-center space-x-6">
                                                    <div className='space-x-2'>
                                                        <input
                                                            type="radio"
                                                            name="interview_result"
                                                            value="pass"
                                                            checked={interviewResult === "pass"}
                                                            onChange={(e) => setInterviewResult(e.target.value)}
                                                            className="form-radio scale-150"
                                                        />
                                                        <span className="text-gray-700">ผ่านการสัมภาษณ์</span>
                                                    </div>
                                                    <div className='space-x-2'>
                                                        <input
                                                            type="radio"
                                                            name="interview_result"
                                                            value="fail"
                                                            checked={interviewResult === "fail"}
                                                            onChange={(e) => setInterviewResult(e.target.value)}
                                                            className="form-radio scale-150"
                                                        />
                                                        <span className="text-gray-700">ไม่ผ่านการสัมภาษณ์</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mt-8'>
                                            <p>หมายเหตุ</p>
                                            <textarea
                                                placeholder="ระบุเหตุผลในการแก้ไข"
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                className="w-full h-[100px] border border-gray-300 rounded-md text-start align-top pl-2 pt-2"
                                            />

                                        </div>
                                        <div className='flex flex-row mt-4 justify-center'>
                                            <button
                                                className='border border-gray-500 rounded-md px-8 py-2'
                                                onClick={() => setShowPopup(false)}
                                            >
                                                ยกเลิก
                                            </button>
                                            <button
                                                onClick={() => sendFinalIntEva()}
                                                className='flex flex-row space-x-1 ml-[25px] border bg-[#008A90] rounded-md px-8 py-2 text-white'
                                            >
                                                <div>
                                                    <svg width="21" height="25" viewBox="0 0 21 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M14.3686 21.7412L14.3686 13.7412L6.0353 13.7412L6.0353 21.7412M6.0353 3.74121L6.0353 8.74121L12.702 8.74121M16.0353 21.7412L4.36863 21.7412C3.9266 21.7412 3.50268 21.5305 3.19012 21.1554C2.87756 20.7804 2.70197 20.2716 2.70197 19.7412L2.70197 5.74121C2.70197 5.21078 2.87756 4.70207 3.19012 4.327C3.50268 3.95192 3.9266 3.74121 4.36863 3.74121L13.5353 3.74121L17.702 8.74121L17.702 19.7412C17.702 20.2716 17.5264 20.7804 17.2138 21.1554C16.9012 21.5305 16.4773 21.7412 16.0353 21.7412Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div>บันทึก</div>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                        {AppWithEdu.length > 0 && (
                            <div className='flex justify-end text-[#166534] mr-[150px] mt-8'>
                                แก้ไขผลสัมภาษณ์ล่าสุด: <div className='font-bold mx-1'>{AppWithEdu[0]?.educationName}</div> {AppWithEdu[0]?.evaDate}
                            </div>
                        )}

                        <div className='p-6 bg-white rounded-lg w-full max-w-5xl mx-auto'>
                            <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mb-[50px]">ข้อมูลกรรมการสัมภาษณ์</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                <div>
                                    <p className="text-[#565656] font-bold mb-[25px]">กรรมการสัมภาษณ์</p>
                                    {AppWithoutEdu.map((app, index) => (
                                        <p key={index} className="text-[#565656] text-left pl-3">อ. {app.firstName}</p>
                                    ))}

                                </div>

                                <div className='ml-[100px]'>
                                    <p className="text-[#565656] font-bold mb-[25px]">วันที่สัมภาษณ์</p>
                                    <p className="text-[#565656] text-left pl-3">{AppWithoutEdu[0]?.interviewDate}</p>
                                </div>

                                <div className='ml-[125px]'>
                                    <p className="text-[#565656] font-bold mb-[25px]">เวลา</p>
                                    <p className="text-[#565656] text-left pl-3">{AppWithoutEdu[0]?.interviewTime}</p>
                                </div>
                            </div>
                            {AppWithoutEdu[0]?.interviewResult === "ไม่มาสัมภาษณ์" ? (
                                <div className='flex justify-center items-center text-gray-400 my-[200px] text-[20px]'>
                                    ไม่มีคะแนนสัมภาษณ์ของผู้สมัคร
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ผลการสัมภาษณ์</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                                        <div>
                                            <p className="text-[#565656] font-bold mb-[25px]">กรรมการสัมภาษณ์</p>
                                            {AppWithoutEdu.map((app, index) => (
                                                <p key={index} className="text-[#565656] text-left mb-[20px]">อ. {app.firstName}</p>
                                            ))}
                                        </div>

                                        <div className='ml-[100px]'>
                                            <p className="text-[#565656] font-bold mb-[25px]">ผลการสัมภาษณ์</p>
                                            {AppWithoutEdu.map((app, index) => (
                                                <div key={index}>
                                                    {app.interviewResult === "รอพิจารณาเพิ่มเติม" ? (
                                                        <div className={`flex flex-row text-[#DAA520] text-left mb-[20px] space-x-2 w-[200px]`}>
                                                            <div className='mt-1'>
                                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <g clip-path="url(#clip0_2477_973)">
                                                                        <path d="M8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0ZM7.25 3.75V8C7.25 8.25 7.375 8.48438 7.58437 8.625L10.5844 10.625C10.9281 10.8562 11.3938 10.7625 11.625 10.4156C11.8562 10.0687 11.7625 9.60625 11.4156 9.375L8.75 7.6V3.75C8.75 3.33437 8.41562 3 8 3C7.58437 3 7.25 3.33437 7.25 3.75Z" fill="#DAA520" />
                                                                    </g>
                                                                    <defs>
                                                                        <clipPath id="clip0_2477_973">
                                                                            <path d="M0 0H16V16H0V0Z" fill="white" />
                                                                        </clipPath>
                                                                    </defs>
                                                                </svg>
                                                            </div>
                                                            <div>{app.interviewResult}</div>

                                                        </div>
                                                    ) : app.interviewResult === null ? (
                                                        <div className={`flex flex-row text-[#0D47A1] text-left mb-[20px] space-x-2 w-[200px]`}>
                                                            <div>
                                                                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M15.58 2.54946C15.8207 2.49652 16 2.29483 16 2.05354V0.509944C16 0.22837 15.7559 0 15.4549 0H0.545102C0.244115 0 0 0.22837 0 0.509944V2.05363C0 2.29492 0.179338 2.4966 0.420001 2.54955C0.584621 5.29594 2.10927 7.81285 4.57022 9.35526L5.59901 10L4.57022 10.6447C2.10918 12.1871 0.584531 14.7041 0.420001 17.4505C0.179338 17.5034 0 17.7051 0 17.9464V19.4901C0 19.7716 0.244115 20 0.545102 20H15.4549C15.7559 20 16 19.7716 16 19.4901V17.9464C16 17.7051 15.8207 17.5034 15.58 17.4505C15.4154 14.7041 13.8907 12.1872 11.4297 10.6447L10.4009 10L11.4297 9.35526C13.8907 7.81285 15.4154 5.29585 15.58 2.54946ZM1.0902 1.01989H14.9098V1.54369H1.0902V1.01989ZM14.9098 18.98H1.0902V18.4562H14.9098V18.98ZM9.11819 9.57632C8.9671 9.671 8.87643 9.82985 8.87643 10C8.87643 10.1702 8.9671 10.329 9.11819 10.4237L10.823 11.4921C12.977 12.842 14.3198 15.0366 14.4873 17.4364H1.51275C1.68018 15.0367 3.02295 12.8421 5.17701 11.4921L6.88181 10.4237C7.0329 10.329 7.12357 10.1702 7.12357 10C7.12357 9.82985 7.0329 9.671 6.88181 9.57632L5.17701 8.5079C3.02295 7.15791 1.68018 4.96328 1.51275 2.56357H14.4873C14.3198 4.96337 12.977 7.15791 10.823 8.5079L9.11819 9.57632Z" fill="#0D47A1" />
                                                                    <path d="M9.42151 7.02539H6.57835C6.35241 7.02539 6.14981 7.15585 6.06914 7.35328C5.98846 7.5508 6.04643 7.77441 6.21486 7.91533L7.6364 9.1052C7.73987 9.1918 7.86988 9.23506 7.9998 9.23506C8.12971 9.23506 8.25981 9.1918 8.3632 9.1052L9.78473 7.91533C9.95317 7.77433 10.0111 7.55072 9.93046 7.35328C9.85005 7.15585 9.64746 7.02539 9.42151 7.02539Z" fill="#0D47A1" />
                                                                    <path d="M7.97759 11.9473L6.59503 12.7781C5.38617 13.5357 4.66064 14.8073 4.66064 16.1685H11.6117C11.6117 14.8073 10.8862 13.5357 9.6773 12.7781L8.29474 11.9473C8.19717 11.8926 8.07525 11.8926 7.97759 11.9473Z" fill="#0D47A1" />
                                                                </svg>

                                                            </div>
                                                            <div>รอผลการประเมิน</div>
                                                        </div>
                                                    ) : (
                                                        <div className={`text-[#565656] text-left mb-[20px] flex flex-row w-[325px] space-x-[50px]
                                    ${app.interviewResult === "ผ่านการสัมภาษณ์" ? "text-green-700" : ""}
                                    ${app.interviewResult === "ไม่ผ่านการสัมภาษณ์" ? "text-[#D92D20]" : ""}
                                `}>
                                                            <div>
                                                                {app.interviewResult}
                                                            </div>

                                                            {app.interviewResult === "ผ่านการสัมภาษณ์" && (
                                                                <div className='flex flex-row mt-[-5px]'>
                                                                    {[1, 2, 3].map((star) => (
                                                                        <Star
                                                                            key={star}
                                                                            className={`h-8 w-8 transition-colors duration-300 ${Number(app.outstandingLevel) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}

                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ผลคะแนนการสัมถาษณ์</h2>
                                    <div className="overflow-x-auto w-[1100px] w-max-none">

                                        <table className='table-auto border-collapse border border-gray-500 rounded-lg'>
                                            <thead>
                                                <tr className="font-bold mb-[25px]">
                                                    <th className="border border-gray-300 text-center">ลำดับ</th>
                                                    <th className="border border-gray-300 w-[150px] text-center">หมวดหมู่</th>
                                                    <th className="border border-gray-300 w-[150px] text-center">คะแนนเต็ม</th>
                                                    {AppWithoutEdu.map((item, index) => (
                                                        <th key={index} className="border border-gray-300 w-[150px] text-center">อ. {item.firstName}</th>
                                                    ))}
                                                    <th className="border border-gray-300 w-[150px] text-center">คะแนนเฉลี่ย</th>
                                                    {AppWithoutEdu.map((item, index) => (
                                                        <th key={index} className="border border-gray-300 w-[100px] text-center">หมายเหตุ อ. {item.firstName}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {scores.map((item, index) => (
                                                    <tr className="text-[#565656] text-left pl-6" key={index}>
                                                        <td className="border border-gray-300 py-2 text-center">{item.id}</td>
                                                        <td className="border border-gray-300 pl-2 w-[500px] py-2 text-left">{item.category}</td>
                                                        <td className="border border-gray-300 w-[150px] text-center">{item.maxScore}</td>
                                                        {AppWithoutEdu.map((applicant, ind) => (
                                                            <td key={ind} className="border border-gray-300 py-2 text-center">
                                                                {index === 0 && (applicant.englishScore !== null ? applicant.englishScore : <WaitForReuslt />)}
                                                                {index === 1 && (applicant.personalityScore !== null ? applicant.personalityScore : <WaitForReuslt />)}
                                                                {index === 2 && (applicant.intensionScore !== null ? applicant.intensionScore : <WaitForReuslt />)}
                                                                {index === 3 && (applicant.computerScore !== null ? applicant.computerScore : <WaitForReuslt />)}
                                                            </td>
                                                        ))}
                                                        <td className={`border border-gray-300 py-2 text-center ${AppWithoutEdu.length === 1 ? 'bg-gray-200' : ''}`}>
                                                            {AppWithoutEdu.length > 1
                                                                ? (
                                                                    AppWithoutEdu.reduce((sum, applicant) => {
                                                                        if (index === 0) return sum + (applicant.englishScore || 0);
                                                                        if (index === 1) return sum + (applicant.personalityScore || 0);
                                                                        if (index === 2) return sum + (applicant.intensionScore || 0);
                                                                        if (index === 3) return sum + (applicant.computerScore || 0);
                                                                        return sum;
                                                                    }, 0) / AppWithoutEdu.length
                                                                ).toFixed(2)
                                                                : '-'}
                                                        </td>
                                                        {AppWithoutEdu.map((applicant, ind) => (
                                                            <td key={ind} className="border border-gray-300 pl-2 w-[500px] py-2 text-left">
                                                                {index === 0 && (applicant.englishRemark !== null ? applicant.englishRemark : "-")}
                                                                {index === 1 && (applicant.personalityRemark !== null ? applicant.personalityRemark : "-")}
                                                                {index === 2 && (applicant.intensionRemark !== null ? applicant.intensionRemark : "-")}
                                                                {index === 3 && (applicant.computerRemark !== null ? applicant.computerRemark : "-")}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                                <tr className="text-[#565656] text-left pl-6">
                                                    <td className="border border-gray-300 px-4 py-2 text-center font-bold" colSpan={2}>คะแนนรวม</td>
                                                    <td className="border border-gray-300 py-2 text-center">34</td>
                                                    {AppWithoutEdu.map((app, index) => (
                                                        <td key={index} className="border border-gray-300 py-2 text-center">{app.totalScore || <WaitForReuslt />}</td>
                                                    ))}
                                                    <td className={`border border-gray-300 py-2 text-center ${AppWithoutEdu.length === 1 ? 'bg-gray-200' : ''}`}>
                                                        {AppWithoutEdu.length > 1
                                                            ? (AppWithoutEdu.reduce((sum, app) => sum + (app.totalScore || 0), 0) / AppWithoutEdu.length).toFixed(2)
                                                            : '-'}
                                                    </td>
                                                    {AppWithoutEdu.map((applicant, ind) => (
                                                        <td key={ind} className="border border-gray-300 pl-2 w-[500px] py-2 text-left">
                                                            {applicant.totalRemark || "-"}
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>

                                    <h2 className="text-2xl text-[#008A90] font-semibold mb-6 mt-[75px]">ความคิดเห็นเพิ่มเติม</h2>
                                    {AppWithoutEdu.map((app, index) => (
                                        <div key={index} className="flex flex-row space-x-4 text-[#565656] text-left">
                                            <div>
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M16.5 11.5C16.5 11.942 16.3244 12.366 16.0118 12.6785C15.6993 12.9911 15.2754 13.1667 14.8333 13.1667H4.83333L1.5 16.5V3.16667C1.5 2.72464 1.67559 2.30072 1.98816 1.98816C2.30072 1.67559 2.72464 1.5 3.16667 1.5H14.8333C15.2754 1.5 15.6993 1.67559 16.0118 1.98816C16.3244 2.30072 16.5 2.72464 16.5 3.16667V11.5Z" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className='font-bold'>อ. {app.firstName}:</div>
                                            <div>"{app.comment || "-"}"</div>
                                        </div>
                                    ))}
                                    {AppWithEdu.length > 0 && (
                                        <div className="flex flex-row space-x-4 text-[#565656] text-left mt-4">
                                            <div>
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M16.5 11.5C16.5 11.942 16.3244 12.366 16.0118 12.6785C15.6993 12.9911 15.2754 13.1667 14.8333 13.1667H4.83333L1.5 16.5V3.16667C1.5 2.72464 1.67559 2.30072 1.98816 1.98816C2.30072 1.67559 2.72464 1.5 3.16667 1.5H14.8333C15.2754 1.5 15.6993 1.67559 16.0118 1.98816C16.3244 2.30072 16.5 2.72464 16.5 3.16667V11.5Z" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className='font-bold'>{AppWithEdu[0]?.educationName}:</div>
                                            <div>"{AppWithEdu[0]?.comment}"</div>
                                        </div>
                                    )}

                                </div>
                            )}

                        </div>
                    </div>
                )}

                {((props.path === "/admin/interview/candidates") && (applicant[0]?.interviewResult === null)) || (isEdit) ? (
                    <div className='flex justify-center space-x-4 mt-5'>
                        <button
                            onClick={() => {
                                submitInterviewEvaluation(scorestest, totalRemark, interviewComment, null, rating);
                            }}
                            className='border border-[#008A90] text-[#008A90] rounded-md px-6 py-2 flex flex-row space-x-1'
                        >
                            <div>
                                <svg width="21" height="25" viewBox="0 0 21 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.7448 21.2407L14.7448 13.2407L6.41146 13.2407L6.41146 21.2407M6.41146 3.24072L6.41146 8.24072L13.0781 8.24072M16.4115 21.2407L4.74479 21.2407C4.30276 21.2407 3.87884 21.03 3.56628 20.6549C3.25372 20.2799 3.07813 19.7712 3.07813 19.2407L3.07813 5.24072C3.07813 4.71029 3.25372 4.20158 3.56628 3.82651C3.87884 3.45144 4.30276 3.24072 4.74479 3.24072L13.9115 3.24072L18.0781 8.24072L18.0781 19.2407C18.0781 19.7712 17.9025 20.2799 17.59 20.6549C17.2774 21.03 16.8535 21.2407 16.4115 21.2407Z" stroke="#008A91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>บันทึก</div>
                        </button>

                        <button
                            onClick={() => submitInterviewEvaluation(scorestest, totalRemark, interviewComment, selectedValue, rating)}
                            className='bg-[#008A90] text-white px-5 py-2 rounded-md'
                        >
                            บันทึกและส่งผลสัมภาษณ์
                        </button>
                    </div>
                ) : (
                    <div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default InterviewEvaSummary;