import React from 'react'

const GeneralInformation = () => {
  return(
    <div className='flex flex-col gap-[27px] w-full'>
      <div className='flex rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.05)] flex-col'>
          <div className='flex text-[24px] leading-[36px] text-[#008A90]'>ข้อมูลส่วนตัว</div>
          <div className='flex flex-row gap-1 text-red'>
            <div className='flex text-[20px]'>รูปภาพ</div>
            <div className='flex text-red-500'>*</div>
          </div>
      </div>
      <div>sec2</div>
    </div>
  )
}

export default GeneralInformation