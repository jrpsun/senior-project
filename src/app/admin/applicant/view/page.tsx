'use client';
import React, { useEffect, useState } from 'react'
import Sidebar from "@components/components/SideBar";
import { useLanguage } from '@components/hooks/LanguageContext';
import { generalInfoTexts } from '@components/translation/generalInfo';
import { summaryTexts } from '@components/translation/summary';
import PersonalInfoSummary from '@components/components/ApplicantInformation/summary/Info/generalInfo/PersonalInfoSummary';
import ContactSummary from '@components/components/ApplicantInformation/summary/Info/generalInfo/ContactSummary';
import EmergencyContactSummary from '@components/components/ApplicantInformation/summary/Info/generalInfo/EmergancyContactSummary';
import SubscriptionSummary from '@components/components/ApplicantInformation/summary/Info/generalInfo/SubscriptionSummary';
import EducationLevelSummary from '@components/components/ApplicantInformation/summary/Info/educationInfo/EducationLevelSummary';
import AwardSummary from '@components/components/ApplicantInformation/summary/Info/awardInfo/awardSummary';
import TalentSummary from '@components/components/ApplicantInformation/summary/Info/awardInfo/talentSummary';
import TrainingSummary from '@components/components/ApplicantInformation/summary/Info/trainingSummary';
import AdditionalDocumentsSummary from '@components/components/ApplicantInformation/summary/Info/additionalSummary';
import ViewInfoAdmin from '@components/components/common/admin/viewInfoAdmin';
import { ApplicantGeneralInformationResponse, GeneralInfoInterface, ContactInfoInterface, EmergencyContactInterface } from '@components/types/generalInfoType';

const awardsData = [
    {
        competitionName: "ACM-ICPC Thailand National Contest",
        competitionYear: "2024",
        competitionLevel: "ระดับประเทศ",
        awardsReceived: "รางวัลรองชนะเลิศอันดับ 1",
        projectWorks: "Algorithm Optimization for Data Analysis",
        document: "/documents/ACM-ICPC_Certificate.pdf",
        documentSize: "840 KB",
    },
    {
        competitionName: "Hackathon Asia",
        competitionYear: "2023",
        competitionLevel: "ระดับนานาชาติ",
        awardsReceived: "รางวัลชนะเลิศ",
        projectWorks: "AI-Driven Data Visualization Tools",
        document: "/documents/Hackaton_Asia_Certificate.pdf",
        documentSize: "840 KB",
    },
    {
        competitionName: "Web Design Challenge",
        competitionYear: "2023",
        competitionLevel: "ระดับภูมิภาค",
        awardsReceived: "รางวัลรองชนะเลิศอันดับ 2",
        projectWorks: "Web Application for Community Engagement",
        document: "/documents/Web_Design_Certificate.pdf",
        documentSize: "840 KB",
    },
];
const talentData = [
    {
        talentType: "ความสามารถด้านกีฬา",
        talentYear: "2023",
        talentActivity: "การแข่งขันฟุตบอลระดับจังหวัดนครปฐม",
        talentAward: "รางวัลรองชนะเลิศอันดับ 1",
        talentURL: "https://drive.google.com/file/d/xyz123",
        document: "/documents/Football_Competition_Cert.pdf",
        documentSize: "840 KB",
    },
    {
        talentType: "ความสามารถด้านผู้นำและจิตอาสา",
        talentYear: "2023",
        talentActivity: 'โครงการจิตอาสา "สร้างชุมชนสีเขียว"',
        talentAward: "-",
        talentURL: "-",
        document: "/documents/GreenLeader_Certificate.pdf",
        documentSize: "840 KB",
    },
];
const trainingsData = [
    {
        programName: "Data Science Bootcamp",
        institution: "Udemy",
        trainingYear: "2024",
        trainingMode: "ออนไลน์(Online)",
        country: "-",
        document: "/documents/DataScience_Bootcamp_Certificate.pdf",
        documentSize: "846 KB",
    },
    {
        programName: "Cybersecurity Fundamentals",
        institution: "จุฬาลงกรณ์มหาวิทยาลัย",
        trainingYear: "2023",
        trainingMode: "สถานที่จริง (On-Site)",
        country: "ไทย",
        document: "/documents/Cybersecurity_Certificate.pdf",
        documentSize: "920 KB",
    },
    {
        programName: "AI & Machine Learning Workshop",
        institution: "มหาวิทยาลัยเกษตรศาสตร์",
        trainingYear: "2022",
        trainingMode: "สถานที่จริง (On-Site)",
        country: "ไทย",
        document: "/documents/AI_ML_Workshop_Certificate.pdf",
        documentSize: "780 KB",
    },
];
const additionalDocumentsData = {
    statementOfPurpose: {
        name: "Statement_of_Purpose_Test_Raboobsamak.pdf",
        size: "1.1 MB",
        url: "/documents/Statement_of_Purpose_Test.pdf",
    },
    portfolio: {
        name: "Portfolio_Test_Raboobsamak.pdf",
        size: "3.8 MB",
        url: "/documents/Portfolio_Test.pdf",
    },
    videoLink: "https://drive.google.com/file/d/1aBeFgHiJkLmNoPqRStUvWxYz/view?usp=sharing",
};


const viewApplicantInfo = () => {
    const { language } = useLanguage();
    const texts = generalInfoTexts[language] || generalInfoTexts["ENG"];
    const titletexts = summaryTexts[language] || summaryTexts["ENG"];
    const [isVisible, setIsVisible] = useState(false)


    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    const tabs = [
        { id: "general", label: "ข้อมูลทั่วไป" },
        { id: "education", label: "ข้อมูลการศึกษา" },
        { id: "awards", label: "รางวัลและผลงาน" },
        { id: "training", label: "การฝึกอบรม" },
        { id: "documents", label: "เอกสารเพิ่มเติม" },
    ];

    const [data, setData] = useState<ApplicantGeneralInformationResponse | null>(null);

    const fetchGeneralInfoData = async () => {
        try {
            const res = await fetch(`${process.env.API_BASE_URL}/applicant/general/0000001`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!res.ok) throw new Error("Failed to fetch data");

            const result = await res.json();
            console.log("result:", result)
            setData(result)
        } catch (error) {
            console.error("Error fetching general information:", error);
        }
    }

    useEffect(() => {
        fetchGeneralInfoData()
    }, []);

    return (
        <div>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={`mb-5 ${isCollapsed ? "ml-[100px] p-4" : "ml-[325px] p-4"}`}>
                <ViewInfoAdmin
                    course="ITCS/B"
                    round="รอบ 1 ICT - Portfolio"
                    year="2568"
                    applicantNumber="0000005"
                    fullName="กันต์ชนก แก้วโมลา"
                    admissionStatus="02 - ยื่นใบสมัครแล้ว"
                    docStatus="02 - รอตรวจสอบเอกสาร"
                    paymentStatus="02 - รอตรวจการชำระเงิน"
                />
                <div className='mt-[-70px] ml-[950px] text-[13px]'>
                    <button
                        className={`${isVisible === true ? "bg-[#F57C00] text-white px-2 py-1 my-1 mx-1 rounded-md" : "bg-[#008A90] text-white px-2 py-1 my-1 mx-1 rounded-md"}`}
                        onClick={isVisible === true ? () => setIsVisible(false) : () => setIsVisible(true)}
                    >
                        <div className="flex flex-row gap-x-2">
                            <div>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_815_2413)">
                                        <path d="M9.99967 12.5006C11.3804 12.5006 12.4997 11.3814 12.4997 10.0007C12.4997 8.61994 11.3804 7.50065 9.99967 7.50065C8.61896 7.50065 7.49967 8.61994 7.49967 10.0007C7.49967 11.3814 8.61896 12.5006 9.99967 12.5006Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M16.1663 12.5006C16.0554 12.752 16.0223 13.0308 16.0713 13.3011C16.1204 13.5715 16.2492 13.8209 16.4413 14.0173L16.4913 14.0673C16.6463 14.2221 16.7692 14.4059 16.8531 14.6082C16.937 14.8106 16.9802 15.0275 16.9802 15.2465C16.9802 15.4655 16.937 15.6824 16.8531 15.8847C16.7692 16.087 16.6463 16.2709 16.4913 16.4256C16.3366 16.5806 16.1527 16.7035 15.9504 16.7874C15.7481 16.8713 15.5312 16.9145 15.3122 16.9145C15.0931 16.9145 14.8763 16.8713 14.6739 16.7874C14.4716 16.7035 14.2878 16.5806 14.133 16.4256L14.083 16.3756C13.8866 16.1835 13.6372 16.0547 13.3668 16.0056C13.0965 15.9566 12.8177 15.9897 12.5663 16.1006C12.3199 16.2063 12.1097 16.3817 11.9616 16.6053C11.8135 16.8288 11.7341 17.0908 11.733 17.359V17.5006C11.733 17.9427 11.5574 18.3666 11.2449 18.6792C10.9323 18.9917 10.5084 19.1673 10.0663 19.1673C9.62431 19.1673 9.20039 18.9917 8.88783 18.6792C8.57527 18.3666 8.39967 17.9427 8.39967 17.5006V17.4256C8.39322 17.1498 8.30394 16.8823 8.14343 16.6579C7.98293 16.4335 7.75862 16.2626 7.49967 16.1673C7.24833 16.0564 6.96951 16.0233 6.69918 16.0723C6.42885 16.1213 6.17941 16.2502 5.98301 16.4423L5.93301 16.4923C5.77822 16.6473 5.5944 16.7702 5.39207 16.8541C5.18974 16.938 4.97287 16.9811 4.75384 16.9811C4.53481 16.9811 4.31794 16.938 4.11561 16.8541C3.91328 16.7702 3.72946 16.6473 3.57467 16.4923C3.41971 16.3375 3.29678 16.1537 3.21291 15.9514C3.12903 15.7491 3.08586 15.5322 3.08586 15.3131C3.08586 15.0941 3.12903 14.8772 3.21291 14.6749C3.29678 14.4726 3.41971 14.2888 3.57467 14.134L3.62467 14.084C3.81679 13.8876 3.94566 13.6381 3.99468 13.3678C4.04369 13.0975 4.0106 12.8187 3.89967 12.5673C3.79404 12.3208 3.61864 12.1106 3.39506 11.9626C3.17149 11.8145 2.9095 11.7351 2.64134 11.734H2.49967C2.05765 11.734 1.63372 11.5584 1.32116 11.2458C1.0086 10.9333 0.833008 10.5093 0.833008 10.0673C0.833008 9.62529 1.0086 9.20137 1.32116 8.88881C1.63372 8.57625 2.05765 8.40065 2.49967 8.40065H2.57467C2.8505 8.3942 3.11801 8.30492 3.34242 8.14441C3.56684 7.9839 3.73777 7.7596 3.83301 7.50065C3.94394 7.2493 3.97703 6.97049 3.92801 6.70016C3.879 6.42983 3.75012 6.18038 3.55801 5.98398L3.50801 5.93398C3.35305 5.7792 3.23012 5.59538 3.14624 5.39305C3.06237 5.19072 3.0192 4.97384 3.0192 4.75482C3.0192 4.53579 3.06237 4.31891 3.14624 4.11658C3.23012 3.91425 3.35305 3.73044 3.50801 3.57565C3.6628 3.42069 3.84661 3.29776 4.04894 3.21388C4.25127 3.13001 4.46815 3.08684 4.68717 3.08684C4.9062 3.08684 5.12308 3.13001 5.32541 3.21388C5.52774 3.29776 5.71155 3.42069 5.86634 3.57565L5.91634 3.62565C6.11274 3.81776 6.36219 3.94664 6.63252 3.99565C6.90285 4.04467 7.18166 4.01158 7.43301 3.90065H7.49967C7.74615 3.79501 7.95635 3.61961 8.10442 3.39604C8.25248 3.17246 8.33194 2.91047 8.33301 2.64232V2.50065C8.33301 2.05862 8.5086 1.6347 8.82116 1.32214C9.13372 1.00958 9.55765 0.833984 9.99967 0.833984C10.4417 0.833984 10.8656 1.00958 11.1782 1.32214C11.4907 1.6347 11.6663 2.05862 11.6663 2.50065V2.57565C11.6674 2.84381 11.7469 3.1058 11.8949 3.32937C12.043 3.55295 12.2532 3.72835 12.4997 3.83398C12.751 3.94491 13.0298 3.978 13.3002 3.92899C13.5705 3.87997 13.8199 3.7511 14.0163 3.55898L14.0663 3.50898C14.2211 3.35402 14.4049 3.23109 14.6073 3.14722C14.8096 3.06334 15.0265 3.02017 15.2455 3.02017C15.4645 3.02017 15.6814 3.06334 15.8837 3.14722C16.0861 3.23109 16.2699 3.35402 16.4247 3.50898C16.5796 3.66377 16.7026 3.84759 16.7864 4.04992C16.8703 4.25225 16.9135 4.46912 16.9135 4.68815C16.9135 4.90718 16.8703 5.12405 16.7864 5.32638C16.7026 5.52871 16.5796 5.71253 16.4247 5.86732L16.3747 5.91732C16.1826 6.11372 16.0537 6.36316 16.0047 6.63349C15.9557 6.90382 15.9887 7.18264 16.0997 7.43398V7.50065C16.2053 7.74712 16.3807 7.95733 16.6043 8.10539C16.8279 8.25346 17.0899 8.33291 17.358 8.33398H17.4997C17.9417 8.33398 18.3656 8.50958 18.6782 8.82214C18.9907 9.1347 19.1663 9.55862 19.1663 10.0007C19.1663 10.4427 18.9907 10.8666 18.6782 11.1792C18.3656 11.4917 17.9417 11.6673 17.4997 11.6673H17.4247C17.1565 11.6684 16.8945 11.7478 16.671 11.8959C16.4474 12.044 16.272 12.2542 16.1663 12.5006Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_815_2413">
                                            <rect width="20" height="20" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>

                            </div>
                            <div>อัพเดตสถานะการเอกสาร</div>
                        </div>
                    </button>
                    <button className="bg-[#008A90] text-white px-2 py-1 rounded-md">
                        <div className="flex flex-row gap-x-2">
                            <div className='mt-[5px]'>
                                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.714 3.70837C15.6157 3.56506 15.4532 3.47935 15.2794 3.47935H12.991V1.86694C12.991 1.57593 12.7551 1.34006 12.4641 1.34006H5.41926L4.99636 0.476691C4.90784 0.296148 4.72431 0.181641 4.52322 0.181641H0.526875C0.235864 0.181641 0 0.417505 0 0.708516V11.2906C0 11.3031 0.00281 11.3147 0.00368812 11.327C0.00474187 11.3416 0.00579563 11.3558 0.00807875 11.3702C0.0122937 11.3979 0.0191431 11.4245 0.0273975 11.4506C0.03091 11.4613 0.0331931 11.4722 0.0374081 11.4828C0.051985 11.5198 0.0697231 11.5551 0.0918519 11.5874C0.0920275 11.5878 0.0922031 11.5883 0.0923788 11.5887C0.0939594 11.5909 0.0962425 11.5927 0.0978231 11.595C0.118547 11.6241 0.142432 11.6508 0.168424 11.6751C0.177557 11.6837 0.187568 11.691 0.197227 11.6988C0.218126 11.7156 0.239904 11.7309 0.263262 11.7444C0.274677 11.7511 0.285917 11.7574 0.297684 11.7632C0.322799 11.7753 0.348967 11.785 0.376013 11.7931C0.386902 11.7964 0.397088 11.8005 0.408328 11.8031C0.446614 11.8119 0.485954 11.8177 0.526875 11.8177H12.4641C12.6817 11.8177 12.8772 11.6837 12.9555 11.4806L15.7708 4.19625C15.8335 4.03415 15.8122 3.85168 15.714 3.70837ZM4.19463 1.23557L4.61753 2.09894C4.70605 2.27948 4.88958 2.39399 5.09067 2.39399H11.9372V3.47953H3.34214C3.12437 3.47953 2.92907 3.61335 2.85074 3.81638L1.05375 8.46587V1.23539L4.19463 1.23557Z" fill="white" />
                                </svg>

                            </div>
                            <div>ดาวน์โหลดเอกสารผู้สมัคร</div>
                        </div>
                    </button>
                </div>
            </div>
            <div className={`${isCollapsed ? "ml-[150px] p-4" : "ml-[375px] p-4"}`}>
                <div className="flex space-x-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-2 text-gray-600 hover:text-[#008A90] ${activeTab === tab.id
                                ? "text-teal-700 font-semibold border-b-2 border-teal-600"
                                : ""
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className={`${isCollapsed ? "ml-[100px] mr-[25px] border border-bottom mt-[-17px]" : "ml-[325px] mr-[25px] border border-bottom mt-[-17px]"}`}></div>
            <div className={`${isCollapsed ? "ml-[150px] p-4" : "ml-[325px] p-4"}`}>
                <div className="mt-[5px]">
                    {
                        activeTab === "general" &&
                        <div>
                            <PersonalInfoSummary
                                props={data?.general_info as GeneralInfoInterface}
                                isVisible={isVisible} 
                                setIsVisible={setIsVisible}
                            />

                            <ContactSummary
                                props={data?.contact_info as ContactInfoInterface}
                                isVisible={isVisible} 
                                setIsVisible={setIsVisible}
                            />

                            <EmergencyContactSummary
                                props={data?.emergency_contact as EmergencyContactInterface}
                                isVisible={isVisible} 
                                setIsVisible={setIsVisible}
                            />

                            <SubscriptionSummary
                                onlineSources={["Facebook", "Website ICT Mahidol", "Line Official"]}
                                offlineSources={["MU Open House", "Dek-D TCAS"]}
                            />
                        </div>
                    }

                    {
                        activeTab === "education" &&
                        <div>
                            <EducationLevelSummary
                                currentStatus="Studying"
                                transcriptFile="/path/to/Transcript_Test_Raboobsamak.pdf"
                                transcriptSize="676 KB"
                                degree="Mathayom6"
                                country="ไทย"
                                province="กรุงเทพมหานคร"
                                school="ทวีธาภิเษก"
                                major="Science-Math"
                                gpa="3.33"
                                isVisible={isVisible} 
                                setIsVisible={setIsVisible}
                            />
                        </div>
                    }

                    {
                        activeTab === "awards" &&
                        <div>
                            <AwardSummary 
                            awards={awardsData} 
                            isVisible={isVisible} 
                            setIsVisible={setIsVisible}
                            />
                            <TalentSummary 
                            talents={talentData} 
                            isVisible={isVisible} 
                            setIsVisible={setIsVisible}
                            />
                        </div>
                    }

                    {
                        activeTab === "training" &&
                        <div>
                            <TrainingSummary 
                            trainings={trainingsData} 
                            isVisible={isVisible} 
                            setIsVisible={setIsVisible}
                            />
                        </div>
                    }

                    {
                        activeTab === "documents" &&
                        <div>
                            <AdditionalDocumentsSummary 
                            documents={additionalDocumentsData} 
                            isVisible={isVisible} 
                            setIsVisible={setIsVisible}
                            />
                        </div>
                    }
                </div>
            </div>

        </div>
    );
}

export default viewApplicantInfo