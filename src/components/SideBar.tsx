'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const menuItemsBeforePayment = [
    { href: '/', icon: 'dashboard_icon.svg', label: 'Dashboard' },
    { href: '/camp', icon: 'manage_applicant_icon.svg', label: 'จัดการใบสมัคร' }
];

const menuItemsAfterPayment = [
    { href: '/upload', icon: 'manage_payment_icon.svg', label: 'จัดการการชำระเงิน', disabled: true },
    { href: '/camp', icon: 'report_icon.svg', label: 'รายงาน', disabled: true },
    { href: '/admin/users/permission', icon: 'permission_icon.svg', label: 'จัดการบทบาทผู้ใช้งาน' },
    { href: '/admin/admissions/rounds', icon: 'applicant_round_icon.svg', label: 'กำหนดรอบรับสมัคร' },
    { href: '/register', icon: 'manage_exam.svg', label: 'จัดการสอบ (ยังไม่เปิดใช้งาน)', disabled: true }
];

const subMenus = [
    {
        label: 'จัดการการคัดกรองเบื้องต้น',
        icon: 'preliminary_icon.svg',
        subLinks: [
            { href: '/option4/sub1', label: 'จัดกลุ่มผู้สมัครเพื่อคัดกรองเบื้องต้น' },
            { href: '/option4/sub2', label: 'ติดตามผลการคัดกรองเบื้องต้น' },
            { href: '/option4/sub3', label: 'รายชื่อผู้สมัครสำหรับพิจารณา' },
            { href: '/option4/sub4', label: 'สรุปผลการคัดกรองเบื้องต้น' }
        ]
    },
    {
        label: 'จัดการการสัมภาษณ์',
        icon: 'interview_icon.svg',
        subLinks: [
            { href: '/option5/sub1', label: 'กำหนดรายละเอียดการสัมภาษณ์' },
            { href: '/option5/sub2', label: 'จัดกลุ่มผู้สมัครเพื่อสัมภาษณ์' },
            { href: '/option5/sub3', label: 'ติดตามผลการสัมภาษณ์' },
            { href: '/option5/sub4', label: 'รายชื่อผู้สมัครเข้ารับการสัมภาษณ์' },
            { href: '/option5/sub5', label: 'สรุปผลการสัมภาษณ์' }
        ]
    }
];

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {

    const [isMobile, setIsMobile] = useState(false);
    // ตรวจสอบขนาดหน้าจอ ถ้าเล็กให้ล็อก Sidebar เป็น collapsed
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // ใช้ 768px เป็นจุดตัด
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isMobile) {
            setIsCollapsed(true); // บังคับ Sidebar ให้ย่อเมื่อจอเล็ก
        }
    }, [isMobile]);

    const [openMenu, setOpenMenu] = useState(null);

    const handleMouseEnter = (menu) => {
        clearTimeout(window.menuTimeout);
        window.menuTimeout = setTimeout(() => setOpenMenu(menu), 200);
    };

    const handleMouseLeave = () => {
        clearTimeout(window.menuTimeout);
        window.menuTimeout = setTimeout(() => setOpenMenu(null), 300);
    };
    const pathname = usePathname();

    return (
        <div className={`fixed left-0 top-0 h-screen bg-[#008A90] text-white p-4  ${isCollapsed ? 'w-[80px]' : 'w-[300px]'}`}>
            {/* ปุ่ม Toggle (แยกออกมาให้อยู่ด้านบนเมื่อ Sidebar ย่อ) */}
            {isCollapsed && (
                <button onClick={() => setIsCollapsed(false)} className="p-2 mb-4 self-center">
                    <img src="/images/admin/Sidebar/Hamburger_icon.svg" alt="Expand Sidebar" width={22} height={22} />
                </button>
            )}

            {/* ส่วนของโลโก้ (รวมปุ่ม Toggle ถ้า Sidebar ไม่ย่อ) */}
            <div className={`flex items-center mb-4 ${isCollapsed ? "justify-start" : "justify-between"}`}>
                <div className='flex items-center gap-4'>
                    <img src="/ict.png" alt="ict-logo" className="w-10" />
                    {!isCollapsed && <img src="/images/admin/Sidebar/admin_logo.svg" alt="Dashboard Icon" width={130} height={40} />}
                </div>

                {/* ปุ่ม Toggle อยู่ด้านขวาเมื่อ Sidebar ไม่ถูกย่อ */}
                {!isCollapsed && (
                    <button onClick={() => setIsCollapsed(true)} className="p-2">
                        <img src="/images/admin/Sidebar/isCollapsed_close.svg" alt="Collapse Sidebar" width={28} height={28} />
                    </button>
                )}

            </div>

            <nav className="flex flex-col gap-3 relative">
                {/* เมนูหลัก (ก่อน "จัดการการชำระเงิน") */}

                {menuItemsBeforePayment.map(({ href, icon, label, disabled }) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/");

                    return (
                        <Link key={label} href={disabled ? '#' : href}
                            className={`flex items-center gap-x-3 p-1.5 rounded-lg  
                            ${isActive ? 'font-bold underline bg-[#00767A]' : 'hover:bg-[#00A2A8] transition'}  
                            ${disabled ? 'text-[#565656] cursor-not-allowed' : ''}`}>
                            <img src={`/images/admin/Sidebar/${icon}`} alt={label} width={25} height={25} title={label} />
                            {!isCollapsed && <span>{label}</span>}
                        </Link>
                    );
                })}

                {/* เมนู "จัดการการชำระเงิน" */}
                {menuItemsAfterPayment.slice(0, 1).map(({ href, icon, label, disabled }) => (
                    <Link
                        key={label}
                        href={disabled ? '#' : href}
                        className={`flex items-center gap-x-3 p-1.5 rounded-lg ${disabled ? 'text-[#565656] cursor-not-allowed' : 'hover:bg-[#00A2A8] transition'}`}
                    >
                        <img src={`/images/admin/Sidebar/${icon}`} alt={label} width={25} height={25} title={label} />
                        {!isCollapsed && <span>{label}</span>}
                    </Link>
                ))}

                {/* เมนูย่อย (จัดการการคัดกรอง + จัดการการสัมภาษณ์) */}
                {subMenus.map(({ label, icon, subLinks }) => (
                    <div key={label} className="relative" onMouseEnter={() => handleMouseEnter(label)} onMouseLeave={handleMouseLeave}>
                        <div className="relative z-50">
                            {/* ปุ่มหลัก */}
                            <button
                                onClick={() => isCollapsed ? setOpenMenu(openMenu === label ? null : label) : null}
                                className={`flex justify-between w-full p-1.5 rounded-lg 
                    ${openMenu === label ? 'font-bold underline' : 'hover:bg-[#00A2A8] transition'}`}
                            >
                                <div className="flex items-center gap-x-3">
                                    <img src={`/images/admin/Sidebar/${icon}`} alt={label} width={25} height={25} title={label} />
                                    {!isCollapsed && <span>{label}</span>}
                                </div>
                                {!isCollapsed && (
                                    <img src="/images/admin/Sidebar/navigation_icon.svg" alt="Arrow" width={25} height={16} />
                                )}
                            </button>

                            {/* เมนูย่อย (Sidebar ปกติ) */}
                            {openMenu === label && !isCollapsed && (
                                <div className="absolute left-full top-0 ml-3 min-w-max bg-[#008A90] text-white shadow-lg rounded p-2
                    z-100 overflow-visible">
                                    {subLinks.map(({ href, label }) => (
                                        <Link key={label} href={href} className="block px-4 py-2 hover:bg-[#00A2A8] rounded">
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Dropdown เมนู (Sidebar ย่อ) */}
                            {isCollapsed && openMenu === label && (
                                <div className="absolute left-full top-0 ml-3 min-w-max bg-[#008A90] text-white shadow-lg rounded p-2
                    z-100 overflow-visible">
                                    {subLinks.map(({ href, label }) => (
                                        <Link key={label} href={href} className="block px-4 py-2 hover:bg-[#00A2A8] rounded">
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {menuItemsAfterPayment.map(({ href, icon, label, disabled }) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/");

                    return (
                        <Link key={label} href={disabled ? '#' : href}
                            className={`flex items-center gap-x-3 p-1.5 rounded-lg  
                            ${isActive ? 'font-bold underline bg-[#00767A]' : 'hover:bg-[#00A2A8] transition'}  
                            ${disabled ? 'text-[#565656] cursor-not-allowed' : ''}`}>
                            <img src={`/images/admin/Sidebar/${icon}`} alt={label} width={25} height={25} title={label} />
                            {!isCollapsed && <span>{label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
