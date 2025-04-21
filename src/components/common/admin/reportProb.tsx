import React, { useEffect, useRef, useState } from 'react'

interface ReportProbProps {
    problem: string;
    isVisible: boolean;
    setReport: any;
    reportColumn: string;
}

const ReportProb: React.FC<ReportProbProps> = ({ problem, isVisible, setReport, reportColumn }) => {
    const [isReportBoxVisible, setIsReportBoxVisible] = useState(false);
    const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
    const [otherIssue, setOtherIssue] = useState('');
    const [isOtherChecked, setIsOtherChecked] = useState(false);

    const messageRef = useRef<HTMLDivElement>(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
                setIsReportBoxVisible(false);
            }
        };

        if (isReportBoxVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isReportBoxVisible]);

    const handleIssueChange = (issue: string) => {
        if (selectedIssues.includes(issue)) {
            setSelectedIssues(selectedIssues.filter((item) => item !== issue));
        } else {
            setSelectedIssues([...selectedIssues, issue]);
        }
    };

    const handleOtherChange = () => {
        setIsOtherChecked(!isOtherChecked);
        if (!isOtherChecked) {
            setOtherIssue('');
        }
        setOtherIssue("");
    };

    const handleSave = () => {
        console.log("problem", problem)
        console.log("selectedIssues", selectedIssues);
        console.log("otherIssue", otherIssue)
        console.log("reportColumn", reportColumn)
        if (selectedIssues.length === 0 && otherIssue.trim() === "") {
            setReport(prev => ({
                ...prev,
                [reportColumn]: ""
            }))
        }
        else {
            setReport(prev => ({
                ...prev,
                [reportColumn]: `${problem} -> ${selectedIssues.join(", ")}${otherIssue ? ", " + otherIssue : ""}`
            }))
        }
        setIsReportBoxVisible(false)
    }


    return (
        <div className="relative inline-block" ref={messageRef}>
            {isVisible && (
                <button
                    className='border border-[#E65100] border-[1.5px] rounded-lg text-[#E65100]'
                    onClick={() => setIsReportBoxVisible(!isReportBoxVisible)}
                >
                    <div className='flex flex-row space-x-1 mx-[15px] my-[-1px]'>
                        <div className='mt-1'>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.25 7.5C10.3219 7.5 12 5.82188 12 3.75C12 3.39141 11.9484 3.04453 11.8547 2.71406C11.782 2.46094 11.4703 2.40469 11.2852 2.58984L9.48516 4.38984C9.41484 4.46016 9.31875 4.5 9.22031 4.5H7.875C7.66875 4.5 7.5 4.33125 7.5 4.125V2.77969C7.5 2.68125 7.53984 2.58516 7.61016 2.51484L9.41016 0.714844C9.59531 0.529687 9.53672 0.217969 9.28594 0.145312C8.95547 0.0515625 8.60859 0 8.25 0C6.17812 0 4.5 1.67812 4.5 3.75C4.5 4.19766 4.57969 4.62891 4.72266 5.02734L0.466406 9.28359C0.16875 9.58125 0 9.98672 0 10.4086C0 11.2875 0.7125 12 1.59141 12C2.01328 12 2.41875 11.8313 2.71641 11.5336L6.97266 7.27734C7.37109 7.42266 7.80234 7.5 8.25 7.5ZM1.875 9.5625C2.02418 9.5625 2.16726 9.62176 2.27275 9.72725C2.37824 9.83274 2.4375 9.97582 2.4375 10.125C2.4375 10.2742 2.37824 10.4173 2.27275 10.5227C2.16726 10.6282 2.02418 10.6875 1.875 10.6875C1.72582 10.6875 1.58274 10.6282 1.47725 10.5227C1.37176 10.4173 1.3125 10.2742 1.3125 10.125C1.3125 9.97582 1.37176 9.83274 1.47725 9.72725C1.58274 9.62176 1.72582 9.5625 1.875 9.5625Z" fill="#E65100" />
                            </svg>

                        </div>

                        <div>
                            แจ้งปัญหา
                        </div>
                    </div>
                </button>
            )}
            {isReportBoxVisible && (
                <div className="absolute left-full ml-2 top-0 bg-white border border-gray-300 rounded-md shadow-md p-4 w-[650px] z-50">
                    <p className="text-black">เลือกปัญหา (เลือกได้มากกว่า 1 รายการ)</p>

                    {/* Checkboxes */}
                    <div className="mt-2 space-y-2 text-sm text-gray-600">
                        <div className='flex flex-row space-x-2'>
                            {['ข้อมูลผิด', 'ลายเซ็นไม่ครบถ้วน', 'อัปโหลดไฟล์ไม่ถูกต้อง', 'เอกสารไม่ชัดเจน / ถ่ายภาพไม่ครบ'].map((issue) => (
                                <label key={issue} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-[#008A90]"
                                        checked={selectedIssues.includes(issue)}
                                        onChange={() => handleIssueChange(issue)}
                                    />
                                    <span>{issue}</span>
                                </label>
                            ))}
                        </div>
                        {/* Other issue */}
                        <div className='flex flex-row space-x-2'>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-[#008A90]"
                                    checked={isOtherChecked}
                                    onChange={handleOtherChange}
                                />
                                <span>อื่น ๆ (กรุณาระบุ)</span>
                            </label>

                            {isOtherChecked && (
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded-xl p-1 w-[250px] text-sm mt-1"
                                    placeholder="ระบุรายละเอียด"
                                    value={otherIssue}
                                    onChange={(e) => setOtherIssue(e.target.value)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center space-x-2 mt-2">
                        <button
                            className="px-[40px] py-1 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100"
                            onClick={() => setIsReportBoxVisible(false)}
                        >
                            ยกเลิก
                        </button>
                        <button 
                            className="flex flex-row px-[30px] py-1 space-x-1 bg-[#008A90] text-white rounded-md hover:bg-teal-700"
                            onClick={() => handleSave()}    
                        >
                            <div>
                                <svg width="21" height="25" viewBox="0 0 21 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.3688 21.2402L14.3688 13.2402L6.03548 13.2402L6.03548 21.2402M6.03548 3.24023L6.03548 8.24023L12.7021 8.24023M16.0355 21.2402L4.36882 21.2402C3.92679 21.2402 3.50286 21.0295 3.1903 20.6544C2.87774 20.2794 2.70215 19.7707 2.70215 19.2402L2.70215 5.24023C2.70215 4.7098 2.87774 4.20109 3.1903 3.82602C3.50286 3.45095 3.92679 3.24023 4.36882 3.24023L13.5355 3.24023L17.7021 8.24023L17.7021 19.2402C17.7021 19.7707 17.5266 20.2794 17.214 20.6544C16.9014 21.0295 16.4775 21.2402 16.0355 21.2402Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                            </div>
                            <div>บันทึก</div>

                        </button>
                    </div>
                </div>
            )}


        </div>
    )
}

export default ReportProb