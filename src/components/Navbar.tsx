import React from 'react'
import Image from "next/image";

const Navbar = () => {
  return (
    <div>
    <div className='flex flex-row justify-between p-[22px_26px] items-center'>
        <div className='flex'>
            <Image src="/logo_ict.png" alt="" width={200} height={30}/>
        </div>
        <div className='flex flex-row gap-4'>
            <div>
                <svg
                    width="36"
                    height="34"
                    viewBox="0 0 36 34"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current text-black"
                    >
                    <path
                        d="M17.7627 0C9.47836 0 2.7627 6.71567 2.7627 15C2.7627 23.2843 9.47836 30 17.7627 30C26.047 30 32.7627 23.2843 32.7627 15C32.7627 6.71567 26.047 0 17.7627 0ZM17.7627 7.33567C20.729 7.33567 23.1427 9.74933 23.1427 12.7157C23.1427 15.6823 20.729 18.0957 17.7627 18.0957C14.796 18.0957 12.3827 15.6823 12.3827 12.7157C12.3827 9.74933 14.796 7.33567 17.7627 7.33567ZM17.7627 27.9477C14.051 27.9477 10.7217 26.3193 8.4437 23.74C9.5027 21.8233 11.1584 20.248 13.127 19.293C13.7967 18.9683 14.5784 18.9737 15.272 19.3067C16.053 19.682 16.891 19.872 17.763 19.872C18.6347 19.872 19.473 19.6817 20.254 19.3067C20.9484 18.9733 21.73 18.9683 22.399 19.293C24.3677 20.2477 26.023 21.8233 27.082 23.74C24.8037 26.319 21.4744 27.9477 17.7627 27.9477Z"
                    />
                </svg>
            </div>
            <div>Jirapat Suwanlamai</div>
            <div>
                <select name="" id="" className=''>
                    <option value=""></option>
                    <option value="">
                        แก้ไขข้อมูล
                    </option>
                    <option value="">
                        ติดตามสถานะการสมัคร
                    </option>
                    <option value="">
                        ชำระค่าสมัคร
                    </option>
                    <option value="">
                        เปลี่ยนรหัสผ่าน
                    </option>
                    <option value="">
                        ออกจากระบบ
                    </option>
                </select>
            </div>
            <div>
                <Image src="/icon_lang.png" alt="" width={25} height={25}/>
            </div>
            <div>
                <select name="" id="">
                    <option value="">TH</option>
                    <option value="">ENG</option>
                </select>
            </div>
        </div>
    </div>
    <div className='bg-[#D1D5DB] p-[1px]'></div>
    </div>
  )
}

export default Navbar