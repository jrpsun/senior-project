//ตัวอย่างการใช้งาน Sidebar:
//<Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} userRole="ประชาสัมพันธ์ (PR)" />
//<Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} userRole="กรรมการหลักสูตร" />
//<Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} userRole="กรรมการสัมภาษณ์" />

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Extend the Window interface to include menuTimeout
declare global {
    interface Window {
        menuTimeout: ReturnType<typeof setTimeout>;
    }
}

const menuItemsBeforePayment = [
    { href: '/', icon: 'dashboard_icon.svg', label: 'Dashboard', disabled: false },
    { href: '/admin/applicant', icon: 'manage_applicant_icon.svg', label: 'จัดการใบสมัคร', disabled: false }
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
            { href: '/admin/screening/group', label: 'จัดกลุ่มผู้สมัครเพื่อคัดกรองเบื้องต้น' },
            { href: '/admin/screening/tracking', label: 'ติดตามผลการคัดกรองเบื้องต้น' },
            { href: '/admin/screening/candidates', label: 'รายชื่อผู้สมัครสำหรับพิจารณา' },
            { href: '/admin/screening/summary', label: 'สรุปผลการคัดกรองเบื้องต้น' }
        ]
    },
    {
        label: 'จัดการการสัมภาษณ์',
        icon: 'interview_icon.svg',
        subLinks: [
            { href: '/admin/interview/schedule', label: 'กำหนดรายละเอียดการสัมภาษณ์' },
            { href: '/admin/interview/grouping', label: 'จัดกลุ่มผู้สมัครเพื่อสัมภาษณ์' },
            { href: '/admin/interview/tracking', label: 'ติดตามผลการสัมภาษณ์' },
            { href: '/admin/interview/candidates', label: 'รายชื่อผู้สมัครเข้ารับการสัมภาษณ์' },
            { href: '/admin/interview/summary', label: 'สรุปผลการสัมภาษณ์' }
        ]
    }
];

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    userRoles: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, userRoles }) => {
    const pathname = usePathname();
    const isPreliminaryPage = pathname.startsWith("/admin/screening");
    const isInterviewPage = pathname.startsWith("/admin/interview");
    const isNotAdmin = !userRoles.includes('education_department');
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    // เมื่อ user คลิกเปิดมือ = ไม่ auto collapse แล้ว
    const handleManualExpand = () => {
        setIsCollapsed(!isCollapsed);
    };
    const handleMouseEnter = (menu: string | null, disabled = false) => {
        if (disabled) return;
        clearTimeout(window.menuTimeout);
        window.menuTimeout = setTimeout(() => setOpenMenu(menu), 200);
    };

    const handleMouseLeave = () => {
        clearTimeout(window.menuTimeout);
        window.menuTimeout = setTimeout(() => setOpenMenu(null), 300);
    };
    // ตรวจสอบขนาดหน้าจอ ถ้าเล็กให้ล็อก Sidebar เป็น collapsed
    useEffect(() => {
        const handleResize = () => {
            const isNowMobile = window.innerWidth < 1650;
            setIsCollapsed(isNowMobile); // ให้ย่อตลอดเวลาเมื่อจอแคบ
        };
    
        handleResize(); // ตรวจสอบทันที
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setIsCollapsed]);
    
    return (
        <div className={`fixed left-0 top-0 h-screen bg-[#008A90] text-white p-4  ${isCollapsed ? 'w-[80px]' : 'w-[300px]'}`}>
            {/* ปุ่ม Toggle (แยกออกมาให้อยู่ด้านบนเมื่อ Sidebar ย่อ) */}
            {isCollapsed && (
                <button onClick={handleManualExpand} className="p-2 mb-4 self-center">
                    <Image src="/images/admin/Sidebar/Hamburger_icon.svg" alt="Expand Sidebar" width={22} height={22} />
                </button>
            )}

            {/* ส่วนของโลโก้ (รวมปุ่ม Toggle ถ้า Sidebar ไม่ย่อ) */}
            <div className={`flex items-center mb-4 ${isCollapsed ? "justify-start" : "justify-between"}`}>
                <div className='flex items-center gap-4'>
                    <Image src="/images/admin/Sidebar/logo_ict_admin.svg" alt="ict-logo" width={22} height={48} className="w-10" />
                    {!isCollapsed && <Image src="/images/admin/Sidebar/admin_logo.svg" alt="Dashboard Icon" width={130} height={40} />}
                </div>

                {/* ปุ่ม Toggle อยู่ด้านขวาเมื่อ Sidebar ไม่ถูกย่อ */}
                {!isCollapsed && (
                    <button onClick={handleManualExpand} className="p-2">
                        <Image src="/images/admin/Sidebar/isCollapsed_close.svg" alt="Collapse Sidebar" width={28} height={28} />
                    </button>
                )}
            </div>

            <nav className="flex flex-col gap-3 relative">
                {/* เมนูหลัก (ก่อน "จัดการการชำระเงิน") */}

                {menuItemsBeforePayment.map(({ href, icon, label }) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/");

                    // Disable ถ้าไม่ใช่ admin (เช่น กรรมการทุกคน)
                    const isDisabled = (!userRoles.includes('public_relations') && label !== 'จัดการใบสมัคร') || 
                        (userRoles.includes('course_committee')) || 
                        (userRoles.includes('interview'));

                    return (
                        <Link key={label} href={isDisabled ? '#' : href}
                            className={`flex items-center gap-x-3 p-1.5 rounded-lg  
                                ${isActive ? 'font-bold underline bg-[#00767A]' : 'hover:bg-[#00A2A8] transition'}  
                                ${isDisabled ? 'text-[#565656] cursor-not-allowed' : ''}`}>
                            <Image
                                src={`/images/admin/Sidebar/${icon}`}
                                alt={label}
                                width={25}
                                height={25}
                                title={label}
                                className={isDisabled ? 'grayscale opacity-60' : ''}
                            />
                            {!isCollapsed && <span>{label}</span>}
                        </Link>
                    );
                })}

                {/* เมนูย่อย (จัดการการคัดกรอง + จัดการการสัมภาษณ์) */}
                {subMenus.map(({ label, icon, subLinks }) => {
                    // กรอง subLinks ตาม role
                    const filteredSubLinks = subLinks.filter((link) => {
                        if (userRoles.includes('course_committee')) {
                            return link.label === 'รายชื่อผู้สมัครสำหรับพิจารณา';
                        }
                        if (userRoles.includes('interview')) {
                            return link.label === 'รายชื่อผู้สมัครเข้ารับการสัมภาษณ์';
                        }
                        return true; // admin เห็นหมด
                    });

                    const isScreeningMenu = label === 'จัดการการคัดกรองเบื้องต้น';
                    const isInterviewMenu = label === 'จัดการการสัมภาษณ์';

                    // เงื่อนไขแยกตามสิทธิ์
                    const isMenuAccessible =
                        (userRoles.includes('education_department')) || // admin ได้หมด
                        (userRoles.includes('course_committee') && isScreeningMenu) ||
                        (userRoles.includes('interview') && isInterviewMenu);

                    // ถ้าเป็นกรรมการ และเมนูหลักไม่ใช่ของตัวเอง → ให้ disable
                    const isDisabled = (!isMenuAccessible) || (userRoles.includes('public_relations'));
                    // ด้านบนก่อน return JSX ของเมนูย่อย
                    return (
                        <div
                            key={label}
                            className="relative"
                            onMouseEnter={() => handleMouseEnter(label, isDisabled)}
                            onMouseLeave={handleMouseLeave}
                        >

                            <div className="relative z-50">
                                {/* ปุ่มหลัก */}
                                <button
                                    onClick={() => {
                                        if (!isDisabled) {
                                            setOpenMenu(openMenu === label ? null : label);
                                        }
                                    }}
                                    className={`flex justify-between w-full p-1.5 rounded-lg
                                             ${(openMenu === label ||
                                            (isScreeningMenu && isPreliminaryPage) ||
                                            (isInterviewMenu && isInterviewPage))
                                            ? 'font-bold underline bg-[#00767A]'
                                            : 'hover:bg-[#00A2A8] transition'}
                                                ${isDisabled ? 'text-[#565656] cursor-not-allowed' : ''}
                                            `}
                                    >
                                    <div className="flex items-center gap-x-3">
                                        <Image
                                            src={`/images/admin/Sidebar/${icon}`}
                                            alt={label}
                                            width={25}
                                            height={25}
                                            title={label}
                                            className={isDisabled ? 'grayscale opacity-60' : ''}
                                        />
                                        {!isCollapsed && <span>{label}</span>}
                                    </div>
                                    {!isCollapsed && (
                                        <Image src="/images/admin/Sidebar/navigation_icon.svg" alt="Arrow" width={25} height={16} />
                                    )}
                                </button>

                                {/* เมนูย่อย */}
                                {openMenu === label && !isCollapsed && (
                                    <div className="absolute left-full top-0 ml-3 min-w-max bg-[#008A90] text-white shadow-lg rounded p-2 z-100 overflow-visible">
                                        {subLinks.map(({ href, label: subLabel }) => {
                                            const isSubActive = pathname === href || pathname.startsWith(href + "/");
                                            const isRestrictedForAdmin =
                                                userRoles.includes('education_department') &&
                                                (subLabel === 'รายชื่อผู้สมัครสำหรับพิจารณา' || subLabel === 'รายชื่อผู้สมัครเข้ารับการสัมภาษณ์');

                                            const isAllowed =
                                                (userRoles.includes('education_department') && !isRestrictedForAdmin) ||
                                                (userRoles.includes('course_committee') && subLabel === 'รายชื่อผู้สมัครสำหรับพิจารณา') ||
                                                (userRoles.includes('interview') && subLabel === 'รายชื่อผู้สมัครเข้ารับการสัมภาษณ์');

                                            return (
                                                <Link
                                                    key={subLabel}
                                                    href={isAllowed ? href : '#'}
                                                    className={`block px-4 py-2 rounded transition
                                                        ${isSubActive ? 'font-bold underline' : ''}
                                                        ${isAllowed ? 'hover:bg-[#00A2A8]' : 'text-[#A5A5A5] cursor-not-allowed'}
                                                    `}
                                                    onClick={(e) => {
                                                        if (!isAllowed) e.preventDefault(); // ป้องกันการเข้าเมนู
                                                    }}
                                                >
                                                    {subLabel}
                                                </Link>
                                            );
                                        })}

                                    </div>
                                )}

                                {/* Dropdown เมนู (Sidebar ย่อ) */}
                                {isCollapsed && openMenu === label && (
                                    <div className="absolute left-full top-0 ml-3 min-w-max bg-[#008A90] text-white shadow-lg rounded p-2 z-100 overflow-visible">
                                        {filteredSubLinks.map(({ href, label }) => (
                                            <Link key={label} href={href} className="block px-4 py-2 hover:bg-[#00A2A8] rounded">
                                                {label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {menuItemsAfterPayment.map(({ href, icon, label }) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/");

                    // รายชื่อเมนูที่ต้อง disable ถ้าไม่ใช่ admin
                    const alwaysDisabled = label === 'จัดการการชำระเงิน' || label === 'จัดการสอบ (ยังไม่เปิดใช้งาน)';
                    const isDisabled = isNotAdmin || alwaysDisabled || label === 'รายงาน';

                    return (
                        <Link key={label} href={isDisabled ? '#' : href}
                            className={`flex items-center gap-x-3 p-1.5 rounded-lg  
                                ${isActive ? 'font-bold underline bg-[#00767A]' : 'hover:bg-[#00A2A8] transition'}  
                                ${isDisabled ? 'text-[#565656] cursor-not-allowed' : ''}`}>
                            <Image
                                src={`/images/admin/Sidebar/${icon}`}
                                alt={label}
                                width={25}
                                height={25}
                                title={label}
                                className={isDisabled ? 'grayscale opacity-60' : ''}
                            />
                            {!isCollapsed && <span>{label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
