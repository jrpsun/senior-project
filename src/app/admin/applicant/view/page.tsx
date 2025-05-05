'use client';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/compat/router';
import Sidebar from "@components/components/SideBar";
// import { useLanguage } from '@components/hooks/LanguageContext';
// import { generalInfoTexts } from '@components/translation/generalInfo';
// import { summaryTexts } from '@components/translation/summary';
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
import { ApplicantGeneralInformationResponse, GeneralInfoInterface, ContactInfoInterface, EmergencyContactInterface, ApplicantRegistrationsInfoResponse } from '@components/types/generalInfoType';
import PreliminaryEvaSummary from '@components/components/ApplicantInformation/summary/Info/preEvaSummary';
import AdminNavbar from '@components/components/adminNavbar';
import { Inter } from 'next/font/google';
import InterviewEvaSummary from '@components/components/ApplicantInformation/summary/Info/interviewEvaSummary';
import { ApplicantEducationResponse, ApplicantProblem, EducantionApplicantView, EducationBackground, EducationEngExam, EducationMathExam } from '@components/types/educationInfoType';
import EnglishTestScoreSummary from '@components/components/ApplicantInformation/summary/Info/educationInfo/EnglishTestScoreSummary';
import MathTestScoreSummary from '@components/components/ApplicantInformation/summary/Info/educationInfo/MathTestScoreSummary';
import GeneralInformation from '@components/components/ApplicantInformation/GeneralInformation';
import EducationInformation from '@components/components/ApplicantInformation/EducationInformation';
import Award from '@components/components/ApplicantInformation/Award';
import Training from '@components/components/ApplicantInformation/Training';
import AdditionalDocuments from '@components/components/ApplicantInformation/AdditionalDocuments';
import { useLanguage } from '@components/hooks/LanguageContext';
import { generalInfoTexts } from '@components/translation/generalInfo';
import { summaryTexts } from '@components/translation/summary';
import { TokenAdminPayload } from '@components/types/token';
import { jwtDecode } from 'jwt-decode';
import Modal from '@components/components/common/popup-login';
import { authFetch, getDecodedToken } from '@components/lib/auth';
import { AwardResponse } from '@components/types/AwardType';
import { TalentResponse } from '@components/types/TalentTypes';
import { TrainingResponse } from '@components/types/TrainType';
import { AdditionalDoc } from '@components/types/additionalDoc';
import { useSearchParams } from 'next/navigation';



const viewApplicantInfo = () => {
    const [isVisible, setIsVisible] = useState(false)
    const searchParams = useSearchParams();

    // const QapplicantId = searchParams.get('QapplicantId') ?? 'N';
    // const QapplicantFullname = searchParams.get('QapplicantFullname') ?? 'N';
    // const QroundName = searchParams.get('QroundName') ?? 'N';
    // const Qprogram = searchParams.get('Qprogram') ?? 'N';
    // const QcourseComFullname = searchParams.get('QcourseComFullname') ?? 'N';
    // const QadmissionStatus = searchParams.get('QadmissionStatus') ?? 'N';
    // const QdocStatus = searchParams.get('QdocStatus') ?? 'N';
    // const QpaymentStatus = searchParams.get('QpaymentStatus') ?? 'N';
    // const QpreEvaDate = searchParams.get('QpreEvaDate') ?? 'N';
    // const QpreEva = searchParams.get('QpreEva') ?? 'N';
    // const Qcomment = searchParams.get('Qcomment') ?? '-';
    // const Qpath = searchParams.get('Qpath') ?? 'N';
    // const QcourseComId = searchParams.get('QcourseComId') ?? 'N';
    // const QinterviewComId = searchParams.get('QinterviewComId') ?? 'N';


    const { language } = useLanguage();
    // const texts = generalInfoTexts[language] || generalInfoTexts["ENG"];
    // const titletexts = summaryTexts[language] || summaryTexts["ENG"];
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const appId = searchParams.get('id')
    const admId = searchParams.get('admId')
    // debugging
    console.log("adm id",admId)


    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [problem, setProblem] = useState<ApplicantProblem | null>(null);

    const tabs = [
        { id: "general", label: "ข้อมูลทั่วไป" },
        { id: "education", label: "ข้อมูลการศึกษา" },
        { id: "awards", label: "รางวัลและผลงาน" },
        { id: "training", label: "การฝึกอบรม" },
        { id: "documents", label: "เอกสารเพิ่มเติม" },
        { id: "preliminary", label: "ผลการคัดกรองเบื้องต้น" },
        { id: "interview", label: "ผลการสัมภาษณ์" }
    ];
    const [appInfo, setAppInfo] = useState<EducantionApplicantView | null>(null);
    const [generalData, setGeneralData] = useState<ApplicantGeneralInformationResponse | null>(null);
    const [eduData, setEduData] = useState<ApplicantEducationResponse | null>(null);
    const [awardsData, setAwardsData] = useState<AwardResponse[]>([]);
    const [talentsData, setTalentsData] = useState<TalentResponse[]>([]);
    const [trainData, setTrainData] = useState<TrainingResponse[]>([]);
    const [addDoc, setAddDoc] = useState<AdditionalDoc | null>(null);
    const [regisData, setRegisData] = useState<ApplicantRegistrationsInfoResponse | null>(null);

    const PreEvaPathAllow = [
        "/admin/screening/tracking",
        "/admin/interview/tracking",
        "/admin/screening/candidates",
        "/admin/interview/candidates"
    ]
    const InterviewEvaPathAllow = [
        "/admin/interview/tracking",
        "/admin/interview/candidates"
    ]

    const [data, setData] = useState<ApplicantGeneralInformationResponse | null>(null);
    const [report, setReport] = useState({
        idCardDoc: "",
        idCardNumber: "",
        idCardExp: "",
        passportDoc: "",
        passportNumber: "",
        passportExp: "",
        houseRegisDoc: "",
        phoneApplicant: "",
        phoneEmer: "",
        transcipt: "",
        schoolName: "",
        GPAX: "",
        awards: "",
        talents: "",
        training: "",
        sop: "",
        portfolio: "",
        video: "",
        resume: "",
        addDoc: ""
    })

    const [showModal, setShowModal] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);
    const [adminId, setAdminId] = useState('');
    const [Qpath, setQpath] = useState('');
    const [name, setName] = useState('');

    const fetchGeneralData = async () => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/general/${appId}/${admId}`, {
            method: 'GET',
        });

        if (!response.ok) throw new Error("Failed to fetch general data");
        const result = await response.json();
        const parsedData = {
            ...result,
            general_info: {
                ...result.general_info,
                birthDate: formatDate(result?.general_info?.birthDate),
                idCardExpDate: formatDate(result?.general_info?.idCardExpDate),
                passportExpDate: formatDate(result?.general_info?.passportExpDate),
            },
            admission_channel: {
                onlineChannel: JSON.parse(result?.admission_channel?.onlineChannel || "[]"),
                offlineChannel: JSON.parse(result?.admission_channel?.offlineChannel || "[]"),
            },
        };
        setGeneralData(parsedData);
    }

    const fetchEducationData = async () => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/education/${appId}/${admId}`, {
            method: 'GET',
        });
        if (!response.ok) throw new Error("Failed to fetch education data");
        const result = await response.json();
            const parsedData = {
            background: {
                ...result.background,
                graduateDate: formatDate(result?.background?.graduateDate),
            },
            eng_exam: {
                ...result.eng_exam,
                enExamDate: formatDate(result?.eng_exam?.enExamDate),
            },
            math_exam: {
                ...result.math_exam,
                mathExamDate: formatDate(result?.math_exam?.mathExamDate),
            }
        };
        setEduData(parsedData)
    }

    const fetchAward = async () => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/reward/${appId}/${admId}`, {
            method: 'GET',
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json()
        setAwardsData(data)
    }

    const fetchTalent = async() => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/talent/${appId}/${admId}`, {
            method: 'GET',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json()
        setTalentsData(data)
    }

    const fetchTrining = async() => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/training/${appId}/${admId}`, {
          method: 'GET',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
        const data = await response.json()
        setTrainData(data)
    }

    const fetchDocuments = async() => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/document/${appId}/${admId}`, {
          method: 'GET',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
        const data = await response.json()
        setAddDoc(data)
    }

    const fetchApplicantStatus = async() => {
        try {
            const res = await authFetch(`${process.env.API_BASE_URL}/education-department/applicant-edu/${appId}/${admId}`, {
                method: 'GET',
              });
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
              const data = await res.json()
              console.log("applicant status", data)
              setAppInfo(data)
        } catch (error) {

        }
    }

    const fetchApplicantProblem = async () => {
        try {
            const res = await fetch(`${process.env.API_BASE_URL}/education-department/get-applicant-problem/${appId}/${admId}`);
            if (!res.ok) return;
            const data = await res.json();
            console.log("problem", data);
            console.log(">", data.details, "<","<");
            console.log("length:", data.details.length);
            // เช็กก่อนว่าเป็น "เอกสารครบถ้วน" หรือไม่
            if (data.details === "เอกสารครบถ้วน") {
                setReport({
                    idCardDoc: "",
                    idCardNumber: "",
                    idCardExp: "",
                    passportDoc: "",
                    passportNumber: "",
                    passportExp: "",
                    houseRegisDoc: "",
                    phoneApplicant: "",
                    phoneEmer: "",
                    transcipt: "",
                    schoolName: "",
                    GPAX: "",
                    awards: "",
                    talents: "",
                    training: "",
                    sop: "",
                    portfolio: "",
                    video: "",
                    resume: "",
                    addDoc: ""
                });
            } else {
                // ถ้าเป็น string -> parse ก่อน
                const parsed = typeof data.details === "string"
                    ? JSON.parse(data.details)
                    : data.details;
    
                setReport(prev => ({
                    ...prev,
                    ...parsed
                }));
            }
            setProblem(data)
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const fetchRegistrationData = async() => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/registrations/${appId}`, {
          method: 'GET',
        });
        if (!response.ok) throw new Error("Failed to fetch registrations data");
        const result = await response.json();
        setRegisData(result)
    }
    

    const formatDate = (dateStr?: string) =>
        dateStr ? new Date(dateStr).toISOString().split("T")[0] : "";

    useEffect(() => {
        fetchApplicantStatus();
        fetchRegistrationData();
        fetchGeneralData();
        fetchEducationData();
        fetchAward();
        fetchTalent();
        fetchTrining();
        fetchDocuments();
        fetchApplicantProblem();
    }, []);
    
    const [QinterviewComId, setQinterviewComId] = useState('N');
    const [eduId, setEduId] = useState('');
    const [ccId, setccId] = useState('');

    useEffect(() => {
        if (appInfo) {
            const decoded = getDecodedToken();
            if (!decoded) {
                setShowModal(true);
                return;
            }
            setRoles(decoded.roles);
            setAdminId(decoded.id);
            setName(decoded.sub);
            if (decoded.roles.includes('course_committee')) {
                setQpath('/admin/screening/candidates');
                setccId(decoded.id)
            } else if (decoded.roles.includes("interview")) {
                setQpath('/admin/interview/candidates');
                setQinterviewComId(decoded?.id);
            } else if (decoded.roles.includes('public_relations')) {
                setQpath('/admin/applicant');
            } else {
                setEduId(decoded.id);
                if (appInfo?.admissionStatus === "03 - รอพิจารณา" ||
                    appInfo?.admissionStatus === "04 - ผ่านการพิจารณา" ||
                    appInfo?.admissionStatus === "05 - ไม่ผ่านการพิจารณา" ){
                    setQpath('/admin/screening/tracking')
                } else if (appInfo?.interviewStatus !== null) {
                    setQpath('/admin/interview/tracking');
                } else {
                    setQpath('/admin/applicant');
                }
            }
        }
    }, [appInfo]);

    const handleDocumentComplete = async () => {
        try {
            const response = await fetch(`${process.env.API_BASE_URL}/education-department/update-applicant-status/${appId}/${adminId}/${admId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: "เอกสารครบถ้วน"
            });

            console.log("success")

        } catch (error) {
            console.error('Error submitting report:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
        setIsDropdownOpen(false);
        window.location.reload();
      };
    
    const handleDocumentIncomplete = () => {
        setIsVisible(!isVisible);
        setIsDropdownOpen(false);
    };

    const handleSubmit = async () => {
        console.log("submit")
        try {
            const allEmpty = Object.values(report).every(value => value === "");
            const dataToSend = allEmpty ? "เอกสารครบถ้วน" : JSON.stringify(report);
            const response = await fetch(`${process.env.API_BASE_URL}/education-department/update-applicant-status/${appId}/${adminId}/${admId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: dataToSend
            });
            window.location.reload();
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
        setIsVisible(false);
    }

    const [isEdit, setIsEdit] = useState(false);

    const handlePRUpdated = () => {
        console.log("PR Click");
        setIsEdit(true)
    }

    const [editedGeneralData, setEditedGeneralData] = useState({})
    const [editedEducationData, setEditedEducationData] = useState({})
    const [editedAwardData, setEditedAwardData] = useState([{}])
    const [editedTalentData, setEditedTalentData] = useState([{}])
    const [editedTrainData, setEditedTrainData] = useState([{}])
    const [editedDocData, setEditedDocData] = useState({})

    const handleGeneralInfoUpdate = (key: string, updatedData: any) => {
        setEditedGeneralData(prev => ({ ...prev, [key]: updatedData }));
    };

    const handleEducationUpdate = (key: string, updatedData: any) => {
        setEditedEducationData(prev => ({ ...prev, [key]: updatedData }))
    }

    const handleCancle = () => {
        setEditedGeneralData({})
        setEditedEducationData({})
        setEditedAwardData([{}])
        setEditedTalentData([{}])
        setEditedTrainData([{}])
        setEditedDocData({})
        setIsEdit(false)
    }

    const updatedApplicantInfo = async() => {
        if (activeTab === 'general') {
            updatedGeneralInfo();
        } else if (activeTab === 'education') {
            updatedEducationInfo();
        } else if (activeTab === 'awards') {
        if (editedAwardData.length > 0 && Object.keys(editedAwardData[0]).length > 0) {
            updatedAward();
        } 
        if (editedTalentData.length > 0 && Object.keys(editedTalentData[0]).length > 0) {
            upDatedTalent();
        }
        } else if (activeTab === 'training') {
            if (editedTrainData.length > 0 && Object.keys(editedTrainData[0]).length > 0) {
                updatedTraining();
            }
        } else if (activeTab === 'documents') {
            updatedDocument();
        }
        setIsEdit(false)
        window.location.reload();
    }

    const updatedGeneralInfo = async() => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/general/${appId}/${admId}`, {
          method: 'PUT',
          body: JSON.stringify(editedGeneralData.generalInfo),
        });
      }
    
    const updatedEducationInfo = async() => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/education/${appId}/${admId}`, {
            method: 'PUT',
            body: JSON.stringify(editedEducationData.education),
        });
    }
    
    const updatedAward = async() => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/reward`, {
            method: 'PUT',
            body: JSON.stringify(editedAwardData),
        });
    }

    const upDatedTalent = async() => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/talent`, {
            method: 'PUT',
            body: JSON.stringify(editedTalentData),
        });
    }

    const updatedTraining = async() => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/training`, {
            method: 'PUT',
            body: JSON.stringify(editedTrainData),
        });
    }

    const updatedDocument = async() => {
        const response = await authFetch(`${process.env.API_BASE_URL}/applicant/document/${appId}/${admId}`, {
            method: 'PUT',
            body: JSON.stringify(editedDocData),
        });
    }

    //debugging
    console.log("appinfo",appInfo)

    return (
        <div>
            {showModal && <Modal role="admin"/>}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} userRoles={roles}/>
            <div className={`mb-5 mt-8 ${isCollapsed ? "ml-[100px] p-4" : "ml-[325px] p-4"}`}>
                <div className='mb-[75px]'>
                    <AdminNavbar
                        isCollapsed={isCollapsed}
                        backToPage={{ href: Qpath, label: "กลับไปยังหน้ารายการใบสมัคร" }}
                    />
                </div>
                <ViewInfoAdmin
                    course={appInfo?.program || ""}
                    round={appInfo?.roundName || ""}
                    year={appInfo?.academicYear || ""}
                    applicantNumber={appInfo?.applicantId || ""}
                    fullName={appInfo?.firstnameEN + " " + appInfo?.lastnameEN || ""}
                    admissionStatus={appInfo?.admissionStatus || ""}
                    docStatus={appInfo?.docStatus || ""}
                    paymentStatus={appInfo?.paymentStatus || ""}
                />
                {problem && ["01 - ยังไม่ยื่นใบสมัคร", "02 - ยื่นใบสมัครแล้ว", "03 - รอพิจารณา"].includes(appInfo?.admissionStatus || "") ? (
                    problem.details?.trim() === "เอกสารครบถ้วน" && Object.values(report).every(value => value === "") ? (
                        // ครบ
                        <div className='flex flex-cols gap-2 text-[16px] mt-2 text-[#13522B]'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_856_5278)">
                                    <path opacity="0.01" d="M0 0H24V24H0V0Z" fill="#202425"/>
                                    <path d="M22.3996 11.9996C22.3996 17.7436 17.7436 22.3996 11.9996 22.3996C6.25561 22.3996 1.59961 17.7436 1.59961 11.9996C1.59961 6.25561 6.25561 1.59961 11.9996 1.59961C17.7436 1.59961 22.3996 6.25561 22.3996 11.9996Z" fill="white"/>
                                    <path d="M11.9998 2.3998C6.6982 2.3998 2.3998 6.6982 2.3998 11.9998C2.3998 17.3014 6.6982 21.5998 11.9998 21.5998C17.3014 21.5998 21.5998 17.3014 21.5998 11.9998C21.5998 6.6982 17.3014 2.3998 11.9998 2.3998ZM0.799805 11.9998C0.799805 5.8142 5.8142 0.799805 11.9998 0.799805C18.1854 0.799805 23.1998 5.8142 23.1998 11.9998C23.1998 18.1854 18.1854 23.1998 11.9998 23.1998C5.8142 23.1998 0.799805 18.1854 0.799805 11.9998Z" fill="#166534"/>
                                    <path d="M18.4476 7.95215C18.6723 8.17715 18.7985 8.48215 18.7985 8.80015C18.7985 9.11816 18.6723 9.42315 18.4476 9.64815L11.2476 16.8482C11.0226 17.0729 10.7176 17.1991 10.3996 17.1991C10.0816 17.1991 9.77656 17.0729 9.55156 16.8482L5.55156 12.8482C5.33959 12.6207 5.22419 12.3198 5.22968 12.0089C5.23516 11.698 5.3611 11.4014 5.58096 11.1816C5.80082 10.9617 6.09744 10.8358 6.40832 10.8303C6.7192 10.8248 7.02008 10.9402 7.24756 11.1522L10.3996 14.3026L16.7516 7.95055C16.9766 7.72583 17.2816 7.59961 17.5996 7.59961C17.9176 7.59961 18.2226 7.72583 18.4476 7.95055V7.95215Z" fill="#166534"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_856_5278">
                                <rect width="24" height="24" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <div>[{problem.updateDate}]</div>
                            <div>education name</div>
                            <div>อัพเดตสถานะเอกสารเป็น "เอกสารครบถ้วน"</div>
                        </div>
                    ) : (
                        // เอกสารไม่ครบ
                        <div className='flex flex-cols gap-2 text-[16px] mt-2 text-[#D92D20]'>
                           <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.791 19.2482L12.9578 0.552915C12.7596 0.210736 12.3933 0 11.9968 0C11.6004 0 11.2339 0.210736 11.0357 0.552915L0.148646 19.3411C-0.0495485 19.6832 -0.0495485 20.1047 0.148646 20.4469C0.34684 20.7891 0.713313 20.9999 1.1097 20.9999H22.884C22.8861 20.9999 22.8886 21.0002 22.8902 20.9999C23.5036 20.9999 24 20.5049 24 19.894C24 19.6527 23.9223 19.4299 23.791 19.2482ZM3.03197 18.7881L11.9968 3.31749L20.9615 18.7885L3.03197 18.7881ZM11.424 7.05264H12.5757C12.6701 7.05264 12.7608 7.09059 12.8272 7.15814C12.8931 7.226 12.9287 7.31704 12.9263 7.41158L12.6949 14.6505C12.6899 14.8405 12.5339 14.9917 12.3437 14.9917H11.6561C11.4657 14.9917 11.3096 14.8402 11.3051 14.6505L11.0736 7.41158C11.0712 7.31699 11.107 7.226 11.1729 7.15814C11.2389 7.09059 11.3296 7.05264 11.424 7.05264ZM12.9117 15.9526V17.263C12.9117 17.4561 12.7546 17.6126 12.5605 17.6126H11.4396C11.2455 17.6126 11.0886 17.4561 11.0886 17.263V15.9526C11.0886 15.7594 11.2455 15.6027 11.4396 15.6027H12.5605C12.7546 15.6024 12.9117 15.7594 12.9117 15.9526Z" fill="#F57C00"/>
                            </svg>
                            <div>[{problem.updateDate}]</div>
                            <div>education name</div>
                            <div>อัพเดตสถานะเอกสารเป็น "เอกสารไม่ครบถ้วน"</div>
                            <div></div>
                        </div>
                    )
                ) : (
                    // ยังไม่มี problem แต่ผู้ใช้กรอกข้อมูลแล้ว
                    Object.values(report).some(value => value !== "") ? (
                        <div className='flex flex-cols gap-2 text-[16px] mt-2 text-[#E65100]'>
                            <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.791 19.2482L12.9578 0.552915C12.7596 0.210736 12.3933 0 11.9968 0C11.6004 0 11.2339 0.210736 11.0357 0.552915L0.148646 19.3411C-0.0495485 19.6832 -0.0495485 20.1047 0.148646 20.4469C0.34684 20.7891 0.713313 20.9999 1.1097 20.9999H22.884C22.8861 20.9999 22.8886 21.0002 22.8902 20.9999C23.5036 20.9999 24 20.5049 24 19.894C24 19.6527 23.9223 19.4299 23.791 19.2482ZM3.03197 18.7881L11.9968 3.31749L20.9615 18.7885L3.03197 18.7881ZM11.424 7.05264H12.5757C12.6701 7.05264 12.7608 7.09059 12.8272 7.15814C12.8931 7.226 12.9287 7.31704 12.9263 7.41158L12.6949 14.6505C12.6899 14.8405 12.5339 14.9917 12.3437 14.9917H11.6561C11.4657 14.9917 11.3096 14.8402 11.3051 14.6505L11.0736 7.41158C11.0712 7.31699 11.107 7.226 11.1729 7.15814C11.2389 7.09059 11.3296 7.05264 11.424 7.05264ZM12.9117 15.9526V17.263C12.9117 17.4561 12.7546 17.6126 12.5605 17.6126H11.4396C11.2455 17.6126 11.0886 17.4561 11.0886 17.263V15.9526C11.0886 15.7594 11.2455 15.6027 11.4396 15.6027H12.5605C12.7546 15.6024 12.9117 15.7594 12.9117 15.9526Z" fill="#F57C00"/>
                            </svg>
                            <div>ระบบได้บันทึกรายการปัญหาเอกสารของผู้สมัคร กรุณาตรวจสอบรายละเอียดด้านล่าง</div>
                        </div>
                    ) : (
                        <div></div>
                    )
                )}
                {Object.entries(report).map(([key, value]) =>
                    value !== "" ? (
                        <div key={key} className="text-[16px] ml-2 text-[#565656]">
                            - {value}
                        </div>
                    ) : null
                )}

                { (roles as string[]).includes('education_department') && 
                ["01 - ยังไม่ยื่นใบสมัคร", "02 - ยื่นใบสมัครแล้ว", "03 - รอพิจารณา"].includes(appInfo?.admissionStatus || "") && (
                    <div className='mt-[-70px] ml-[950px] text-[13px]'>
                        <div className="relative inline-block">
                            <button
                                className={`${
                                isVisible === true 
                                    ? "bg-[#F57C00] text-white px-2 py-1 my-1 mx-1 rounded-md" 
                                    : "bg-[#008A90] text-white px-2 py-1 my-1 mx-1 rounded-md"
                                }`}
                                onClick={isVisible ? handleSubmit : () => setIsDropdownOpen(!isDropdownOpen)}
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
                                <div>
                                    {isVisible ? "บันทึกปัญหาเอกสาร" : "อัพเดตสถานะการเอกสาร"}
                                </div>
                                </div>
                            </button>

                            {isDropdownOpen && !isVisible && (
                                <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <button 
                                    onClick={handleDocumentComplete}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded w-full text-left text-sm text-[#13522B]"
                                >
                                    <span>เอกสารครบถ้วน</span>
                                </button>
                                <button 
                                    onClick={handleDocumentIncomplete}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded w-full text-left text-sm text-[#D92D20]"
                                >
                                    <span>เอกสารไม่ครบถ้วน</span>
                                </button>
                                </div>
                            )}
                            </div>
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
                )} 
                {(roles as string[]).includes('public_relations') && (
                    <div className='mt-[-70px] ml-[950px] text-[13px]'>
                        <div className="relative inline-block">
                            <button
                                className={"bg-[#008A90] text-white px-2 py-1 my-1 mx-1 rounded-md"}
                                onClick={handlePRUpdated}
                            >
                                <div className="flex flex-row gap-x-2">
                                <div>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_703_3013)">
                                            <g clipPath="url(#clip1_703_3013)">
                                                <path d="M11.3342 0.603516L9.82166 2.11602L13.8842 6.17851L15.3967 4.66602C16.1779 3.88477 16.1779 2.61914 15.3967 1.83789L14.1654 0.603516C13.3842 -0.177734 12.1185 -0.177734 11.3373 0.603516H11.3342ZM9.11541 2.82227L1.83103 10.1098C1.50603 10.4348 1.26853 10.8379 1.13728 11.2785L0.0310334 15.0379C-0.0470916 15.3035 0.0247834 15.5879 0.218533 15.7816C0.412283 15.9754 0.696658 16.0473 0.959158 15.9723L4.71853 14.866C5.15916 14.7348 5.56228 14.4973 5.88728 14.1723L13.1779 6.88477L9.11541 2.82227Z" fill="white"/>
                                            </g>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_703_3013">
                                                <rect width="16" height="16" fill="white"/>
                                            </clipPath>
                                            <clipPath id="clip1_703_3013">
                                                <path d="M0 0H16V16H0V0Z" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div>
                                    แก้ไขข้อมูลผู้สมัคร
                                </div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className={`${isCollapsed ? "ml-[150px] p-4" : "ml-[375px] p-4"}`}>
                <div className="flex space-x-6">
                    {tabs
                        .filter(tab => (tab.id !== 'interview' && tab.id !== 'preliminary') || 
                                       (tab.id === 'preliminary' && PreEvaPathAllow.includes(Qpath)) || 
                                       (tab.id === 'interview' && InterviewEvaPathAllow.includes(Qpath)))
                        .map((tab) => (
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
                        (isEdit === false ? (
                            <div>
                                <PersonalInfoSummary
                                    props={generalData?.general_info as GeneralInfoInterface}
                                    isVisible={isVisible} 
                                    setIsVisible={setIsVisible}
                                    setReport={setReport}
                                    regisData={regisData}
                                />

                                <ContactSummary
                                    props={generalData?.contact_info as ContactInfoInterface}
                                    isVisible={isVisible} 
                                    setIsVisible={setIsVisible}
                                    setReport={setReport}
                                    email={regisData?.applicantEmail}
                                />

                                <EmergencyContactSummary
                                    props={generalData?.emergency_contact as EmergencyContactInterface}
                                    isVisible={isVisible} 
                                    setIsVisible={setIsVisible}
                                    setReport={setReport}
                                />

                                <SubscriptionSummary
                                    onlineSources={generalData?.admission_channel.onlineChannel || [""]}
                                    offlineSources={generalData?.admission_channel.offlineChannel || [""]}
                                />
                            </div>
                        ): (
                            <GeneralInformation 
                                key="general" 
                                onUpdate={handleGeneralInfoUpdate} 
                                appId={appId} 
                                admId={admId} 
                                name={regisData?.firstnameEN + " " + regisData?.lastnameEN || ""}
                            />
                        ))
                    }

                    {
                        activeTab === "education" &&
                        (isEdit === false ? (
                            <div>
                                <EducationLevelSummary
                                    props={eduData?.background as EducationBackground}
                                    isVisible={isVisible}
                                    setIsVisible={setIsVisible}
                                    setReport={setReport}
                                />

                                {/* แสดงผลคะแนนสอบภาษาอังกฤษ  */}
                                <EnglishTestScoreSummary
                                    props={eduData?.eng_exam as EducationEngExam}
                                    isVisible={isVisible}
                                    setIsVisible={setIsVisible}
                                />
                                
                                {/* แสดงผลคะแนนสอบคณิตศาสตร์ */}
                                <MathTestScoreSummary
                                    props={eduData?.math_exam as EducationMathExam}
                                    isVisible={isVisible}
                                    setIsVisible={setIsVisible}
                                />
                            </div>
                        ): (
                            <EducationInformation 
                                key="education" 
                                onUpdate={handleEducationUpdate} 
                                appId={appId} 
                                admId={admId} 
                                name={regisData?.firstnameEN + " " + regisData?.lastnameEN || ""}
                            />
                        ))
                    }

                    {
                        activeTab === "awards" &&
                        (isEdit === false ? (
                            <div>
                                <AwardSummary 
                                    awards={awardsData}
                                    isVisible={isVisible}
                                    setIsVisible={setIsVisible}
                                    setReport={setReport}
                                />
                                <TalentSummary
                                    talents={talentsData}
                                    isVisible={isVisible}
                                    setIsVisible={setIsVisible}
                                    setReport={setReport}
                                />
                            </div>
                        ): (
                            <Award 
                                key="award" 
                                setAward={setEditedAwardData} 
                                setTalent={setEditedTalentData} 
                                appId={appId} 
                                admId={admId}
                            />
                        ))
                    }

                    {
                        activeTab === "training" &&
                        (isEdit === false ? (
                            <div>
                                <TrainingSummary
                                    trainings={trainData}
                                    isVisible={isVisible}
                                    setIsVisible={setIsVisible}
                                    setReport={setReport}
                                />
                            </div>
                        ):(
                            <Training 
                                key="training" 
                                setTrain={setEditedTrainData} 
                                appId={appId} 
                                admId={admId}
                            />
                        ))
                    }

                    {
                        activeTab === "documents" &&
                        (isEdit === false ? (
                             <div>
                                <AdditionalDocumentsSummary 
                                    documents={addDoc} 
                                    isVisible={isVisible} 
                                    setIsVisible={setIsVisible}
                                    setReport={setReport}
                                />
                            </div>
                        ):(
                            <AdditionalDocuments 
                                key="documents" 
                                setDoc={setEditedDocData} 
                                appId={appId} 
                                admId={admId} 
                                name={regisData?.firstnameEN + " " + regisData?.lastnameEN || ""}
                            />
                        ))
                    }

                    {
                        activeTab === "preliminary" &&
                        <div>
                            <PreliminaryEvaSummary
                                props={{
                                    applicantId: appId || "",
                                    courseComId: ccId || "Y",
                                    committeeName: name || "",
                                    programRegisteredId: admId || "",
                                    // preEvaDate: QpreEvaDate,
                                    // preEvaResult: QpreEva,
                                    // comment: Qcomment,
                                    path: Qpath,
                                }}
                            />
                        </div>
                    }

                    {
                        activeTab === "interview" &&
                        <div>
                            <InterviewEvaSummary
                                props={{
                                    app_id: appId || "",
                                    adm_id: admId || "",
                                    edu_id: eduId || "",
                                    path: Qpath,
                                    interviewCom: QinterviewComId
                                }}
                            />
                        </div>
                    }

                </div>
                {isEdit === true && 
                    <div className="flex justify-center mt-6 mb-6 gap-x-6">
                        <button 
                            className='text-[16px] rounded-lg border border-[#B9B9B9] py-3 px-6 hover:bg-[#E5E7EB]'
                            onClick={handleCancle}
                            >ยกเลิก
                        </button>
                        <button
                            className='bg-[#008A90] hover:bg-[#00767B] text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out'
                            onClick={updatedApplicantInfo}
                            >บันทึก
                        </button>
                    </div> 
                }
                
            </div>
        </div>
    );
}

export default viewApplicantInfo