import React from 'react'

const ViewInfoAdmin = ({ course, round, year, applicantNumber, fullName, admissionStatus, docStatus, paymentStatus }) => {
    return (
        <div>
            <div className='flex flex-row space-x-1 text-lg'>
                <div className='font-bold'>{course} {round} ปีการศึกษา {year}</div>
                <div>เลขที่สมัคร {applicantNumber} {fullName}</div>
            </div>

            <div className='flex flex-row text-[13px] ml-[10px] mt-4 space-x-5'>
                <div className='flex flex-row'>
                    สถานะการสมัคร:
                    <div className={`ml-[10px] h-[25px] pt-[3px] mt-[-2px] rounded-lg
          ${admissionStatus === "02 - ยื่นใบสมัครแล้ว" && "bg-green-200 text-green-800"}
          ${admissionStatus === "03 - รอพิจารณา" && "bg-yellow-100 text-yellow-500"}
          ${admissionStatus === "04 - ผ่านการพิจารณา" && "bg-green-200 text-green-800"}
          ${admissionStatus === "05 - ไม่ผ่านการพิจารณา" && "bg-red-200 text-red-600"}
          ${admissionStatus === "06 - รอสัมภาษณ์" && "bg-yellow-100 text-yellow-500"}
          ${admissionStatus === "07 - ผ่านการสอบสัมภาษณ์" && "bg-green-200 text-green-800"}
          ${admissionStatus === "08 - ไม่ผ่านการสอบสัมภาษณ์" && "bg-red-200 text-red-600"}
          ${admissionStatus === "09 - ยกเลิกการสมัคร" && "text-red-600"}
        `}>
                        {admissionStatus}
                    </div>
                </div>

                <div className='flex flex-row'>
                    สถานะการเอกสาร:
                    <div className={`ml-[10px] h-[25px] pt-[3px] mt-[-2px] rounded-lg
          ${docStatus === "02 - รอตรวจสอบเอกสาร" && "bg-yellow-100 text-yellow-500"}
          ${docStatus === "03 - เอกสารครบถ้วน" && "bg-green-200 text-green-800"}
          ${docStatus === "04 - เอกสารไม่ครบถ้วน" && "bg-red-200 text-red-600"}
        `}>
                        {docStatus}
                    </div>
                </div>

                <div className='flex flex-row'>
                    สถานะการชำระเงิน:
                    <div className={`ml-[10px]`}>
                        {paymentStatus}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewInfoAdmin